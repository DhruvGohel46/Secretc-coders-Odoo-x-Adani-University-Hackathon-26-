const jwt = require('jsonwebtoken');
const createError = require('http-errors');

function signAccessToken(user) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw createError(500, 'JWT_SECRET is not configured');
  }

  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign(
    {
      role: user.role
    },
    secret,
    {
      subject: String(user.id),
      expiresIn
    }
  );
}

function verifyAccessToken(token) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw createError(500, 'JWT_SECRET is not configured');
  }

  return jwt.verify(token, secret);
}

module.exports = { signAccessToken, verifyAccessToken };
