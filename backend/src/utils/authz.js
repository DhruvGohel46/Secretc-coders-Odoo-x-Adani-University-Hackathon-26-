const createError = require('http-errors');

function requireRoles(user, roles) {
  if (!user) throw createError(401, 'Unauthorized');
  if (!roles.includes(user.role)) throw createError(403, 'Forbidden');
}

function isPrivileged(user) {
  return Boolean(user && (user.role === 'ADMIN' || user.role === 'MANAGER'));
}

module.exports = { requireRoles, isPrivileged };
