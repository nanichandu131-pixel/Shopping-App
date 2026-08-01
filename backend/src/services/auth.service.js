import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { sendMail } from '../config/mailer.js';
import { User } from '../models/index.js';
import { AppError } from '../utils/AppError.js';
import { createOpaqueToken, hashToken, signAccessToken, signRefreshToken } from '../utils/tokens.js';

const refreshExpiryDate = () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

class AuthService {
  async register({ name, email, password }) {
    const existing = await User.findOne({ email });
    if (existing) throw new AppError('Email is already registered', 409);

    const verificationToken = createOpaqueToken();
    const user = await User.create({
      name,
      email,
      password,
      emailVerificationToken: hashToken(verificationToken),
      emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });

    await sendMail({
      to: user.email,
      subject: 'Verify your SmartPrice Compare email',
      text: `Verify your email: ${env.clientUrl}/verify-email?token=${verificationToken}`,
      html: `<p>Verify your email by opening <a href="${env.clientUrl}/verify-email?token=${verificationToken}">this secure link</a>.</p>`
    });

    return this.issueTokens(user);
  }

  async login({ email, password, userAgent, ip }) {
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Invalid email or password', 401);
    }
    if (user.status !== 'active') throw new AppError('Account is not active', 403);

    user.lastLoginAt = new Date();
    const tokens = await this.issueTokens(user, userAgent, ip);
    await user.save();
    return tokens;
  }

  async issueTokens(user, userAgent, ip) {
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user, user.tokenVersion);
    user.refreshSessions.push({
      tokenHash: hashToken(refreshToken),
      userAgent,
      ip,
      expiresAt: refreshExpiryDate()
    });
    await user.save();
    return { user, accessToken, refreshToken };
  }

  async refresh(refreshToken) {
    const payload = jwt.verify(refreshToken, env.jwtRefreshSecret);
    const user = await User.findById(payload.sub);
    if (!user || payload.tokenVersion !== user.tokenVersion) throw new AppError('Invalid refresh token', 401);
    const session = user.refreshSessions.find(
      (item) => item.tokenHash === hashToken(refreshToken) && !item.revokedAt
    );
    if (!session || session.expiresAt < new Date()) throw new AppError('Refresh session expired', 401);
    return this.issueTokens(user);
  }

  async logout(userId, refreshToken) {
    const user = await User.findById(userId);
    if (!user) return;
    const tokenHash = hashToken(refreshToken || '');
    user.refreshSessions.forEach((session) => {
      if (!refreshToken || session.tokenHash === tokenHash) session.revokedAt = new Date();
    });
    await user.save();
  }

  async verifyEmail(token) {
    const user = await User.findOne({
      emailVerificationToken: hashToken(token),
      emailVerificationExpires: { $gt: new Date() }
    }).select('+emailVerificationToken +emailVerificationExpires');
    if (!user) throw new AppError('Invalid or expired verification token', 400);

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();
    return user;
  }

  async forgotPassword(email) {
    const user = await User.findOne({ email }).select('+passwordResetToken +passwordResetExpires');
    if (!user) return { accepted: true };

    const token = createOpaqueToken();
    user.passwordResetToken = hashToken(token);
    user.passwordResetExpires = new Date(Date.now() + 30 * 60 * 1000);
    await user.save();

    await sendMail({
      to: user.email,
      subject: 'Reset your SmartPrice Compare password',
      text: `Reset your password: ${env.clientUrl}/reset-password?token=${token}`,
      html: `<p>Reset your password by opening <a href="${env.clientUrl}/reset-password?token=${token}">this secure link</a>.</p>`
    });
    return { accepted: true };
  }

  async resetPassword(token, password) {
    const hashed = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      passwordResetToken: hashed,
      passwordResetExpires: { $gt: new Date() }
    }).select('+passwordResetToken +passwordResetExpires');

    if (!user) throw new AppError('Invalid or expired reset token', 400);
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.tokenVersion += 1;
    user.refreshSessions = [];
    await user.save();
    return { reset: true };
  }
}

export const authService = new AuthService();
