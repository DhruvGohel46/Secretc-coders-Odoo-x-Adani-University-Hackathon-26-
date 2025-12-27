const express = require('express');

const { prisma } = require('../db');
const { requireUser } = require('../utils/http');
const { requireRoles } = require('../utils/authz');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const user = requireUser(req);
    requireRoles(user, ['ADMIN', 'MANAGER']);

    const users = await prisma.user.findMany({ orderBy: { id: 'asc' } });
    res.json(
      users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        avatarUrl: u.avatarUrl,
        role: u.role,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt
      }))
    );
  } catch (err) {
    next(err);
  }
});

module.exports = router;
