const { prisma } = require('../db');
const { verifyAccessToken } = require('../utils/auth');

async function authMiddleware(req, res, next) {
  const authHeader = req.header('authorization');
  const rawUserId = req.header('x-user-id');

  let userId = null;
  if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
    const token = authHeader.slice('bearer '.length).trim();
    if (token) {
      try {
        const payload = verifyAccessToken(token);
        const subject = payload && payload.sub;
        const parsed = Number(subject);
        if (Number.isInteger(parsed) && parsed > 0) {
          userId = parsed;
        }
      } catch (err) {
        if (err && err.status === 500) {
          return next(err);
        }
        req.user = null;
        return next();
      }
    }
  }

  if (!userId && rawUserId) {
    const parsed = Number(rawUserId);
    if (Number.isInteger(parsed) && parsed > 0) {
      userId = parsed;
    }
  }

  if (!userId) {
    req.user = null;
    return next();
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    req.user = user || null;
    return next();
  } catch (err) {
    return next(err);
  }
}

module.exports = { authMiddleware };
