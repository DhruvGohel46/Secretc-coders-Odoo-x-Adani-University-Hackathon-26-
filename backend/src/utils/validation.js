const createError = require('http-errors');

function parseOr400(schema, data) {
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    throw createError(400, parsed.error.issues.map((i) => i.message).join('; '));
  }
  return parsed.data;
}

module.exports = { parseOr400 };
