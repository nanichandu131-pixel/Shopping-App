import { authService } from '../services/auth.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const sendAuth = (res, result, status = 200) =>
  res.status(status).json({
    user: result.user,
    accessToken: result.accessToken,
    refreshToken: result.refreshToken
  });

export const authController = {
  register: asyncHandler(async (req, res) => {
    const result = await authService.register(req.body);
    sendAuth(res, result, 201);
  }),
  login: asyncHandler(async (req, res) => {
    const result = await authService.login({
      ...req.body,
      userAgent: req.get('user-agent'),
      ip: req.ip
    });
    sendAuth(res, result);
  }),
  refresh: asyncHandler(async (req, res) => {
    const result = await authService.refresh(req.body.refreshToken);
    sendAuth(res, result);
  }),
  logout: asyncHandler(async (req, res) => {
    await authService.logout(req.user.id, req.body.refreshToken);
    res.status(204).send();
  }),
  me: asyncHandler(async (req, res) => {
    res.json({ user: req.user });
  }),
  verifyEmail: asyncHandler(async (req, res) => {
    const user = await authService.verifyEmail(req.body.token);
    res.json({ user });
  }),
  forgotPassword: asyncHandler(async (req, res) => {
    await authService.forgotPassword(req.body.email);
    res.json({ message: 'If an account exists, a password reset email has been sent.' });
  }),
  resetPassword: asyncHandler(async (req, res) => {
    await authService.resetPassword(req.body.token, req.body.password);
    res.json({ message: 'Password reset successfully.' });
  })
};
