const createError = require('http-errors');

function requireUser(req) {
  if (!req.user) {
    throw createError(401, 'Unauthorized');
  }
  return req.user;
}

module.exports = { requireUser };
