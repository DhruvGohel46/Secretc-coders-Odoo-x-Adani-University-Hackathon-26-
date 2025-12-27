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

    const body = parseOr400(
      z.object({
        name: z.string().min(1),
        email: z.string().email().optional(),
        userId: z.number().int().positive().optional()
      }),
      req.body
    );

    const employee = await prisma.employee.create({ data: body });
    res.status(201).json(employee);
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    requireUser(req);

    const employees = await prisma.employee.findMany({
      include: { user: true },
      orderBy: { id: 'asc' }
    });

    res.json(employees);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
