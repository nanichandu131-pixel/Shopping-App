import nodemailer from 'nodemailer';
import { env } from './env.js';
import { logger } from './logger.js';

const hasSmtp = Boolean(env.smtp.host && env.smtp.user && env.smtp.pass);

export const mailer = hasSmtp
  ? nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: env.smtp.port === 465,
      auth: {
        user: env.smtp.user,
        pass: env.smtp.pass
      }
    })
  : null;

export const sendMail = async ({ to, subject, html, text }) => {
  if (!mailer) {
    logger.warn('Email skipped because SMTP is not configured', { to, subject });
    return { skipped: true };
  }

  return mailer.sendMail({
    from: env.smtp.from,
    to,
    subject,
    html,
    text
  });
};
