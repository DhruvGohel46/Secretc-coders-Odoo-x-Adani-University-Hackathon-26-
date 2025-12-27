const express = require('express');
const { z } = require('zod');

const { prisma } = require('../db');
const { requireUser } = require('../utils/http');
const { requireRoles } = require('../utils/authz');
const { parseOr400 } = require('../utils/validation');

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const user = requireUser(req);
    requireRoles(user, ['ADMIN', 'MANAGER']);

    const body = parseOr400(z.object({ name: z.string().min(1) }), req.body);

    const department = await prisma.department.create({ data: body });
    res.status(201).json(department);
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    requireUser(req);

    const departments = await prisma.department.findMany({ orderBy: { id: 'asc' } });
    res.json(departments);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
