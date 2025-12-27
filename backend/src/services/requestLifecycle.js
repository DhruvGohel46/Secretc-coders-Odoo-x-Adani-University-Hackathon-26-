const createError = require('http-errors');

const allowedTransitions = {
  NEW: ['IN_PROGRESS'],
  IN_PROGRESS: ['REPAIRED', 'SCRAP'],
  REPAIRED: [],
  SCRAP: []
};

function assertValidTransition(from, to) {
  const allowed = allowedTransitions[from] || [];
  if (!allowed.includes(to)) {
    throw createError(400, `Invalid status transition: ${from} -> ${to}`);
  }
}

module.exports = { assertValidTransition };
