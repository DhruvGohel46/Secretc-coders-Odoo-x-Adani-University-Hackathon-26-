const express = require('express');
const createError = require('http-errors');
const bcrypt = require('bcryptjs');
const { z } = require('zod');

const { prisma } = require('../db');
const { parseOr400 } = require('../utils/validation');
const { signAccessToken } = require('../utils/auth');
const { requireUser } = require('../utils/http');
const { requireRoles } = require('../utils/authz');

const router = express.Router();

router.post('/register', async (req, res, next) => {
  try {
    const body = parseOr400(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        password: z.string().min(6),
        role: z.enum(['ADMIN', 'MANAGER', 'TECHNICIAN', 'USER']).optional()
      }),
      req.body
    );

    const usersCount = await prisma.user.count();

    let roleToSet = usersCount === 0 ? 'ADMIN' : 'USER';
    if (body.role) {
      if (usersCount === 0) {
        roleToSet = body.role;
      } else {
        const requester = req.user;
        if (!requester) throw createError(403, 'Only ADMIN can set role');
        requireRoles(requester, ['ADMIN']);
        roleToSet = body.role;
      }
    }

    const passwordHash = await bcrypt.hash(body.password, 10);

    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        passwordHash,
        role: roleToSet
      }
    });

    const token = signAccessToken(user);

    res.status(201).json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, avatarUrl: user.avatarUrl }
    });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const body = parseOr400(
      z.object({
        email: z.string().email(),
        password: z.string().min(1)
      }),
      req.body
    );

    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (!user) throw createError(401, 'Invalid email or password');

    const ok = await bcrypt.compare(body.password, user.passwordHash);
    if (!ok) throw createError(401, 'Invalid email or password');

    const token = signAccessToken(user);

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, avatarUrl: user.avatarUrl }
    });
  } catch (err) {
    next(err);
  }
});

router.get('/me', async (req, res, next) => {
  try {
    const user = requireUser(req);
    res.json({ id: user.id, name: user.name, email: user.email, role: user.role, avatarUrl: user.avatarUrl });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
