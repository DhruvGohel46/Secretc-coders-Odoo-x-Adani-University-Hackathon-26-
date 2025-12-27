const express = require('express');
const createError = require('http-errors');
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
        name: z.string().min(1)
      }),
      req.body
    );

    const team = await prisma.maintenanceTeam.create({ data: body });
    res.status(201).json(team);
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    requireUser(req);

    const teams = await prisma.maintenanceTeam.findMany({
      include: {
        members: { include: { user: true } }
      },
      orderBy: { id: 'asc' }
    });

    res.json(
      teams.map((t) => ({
        id: t.id,
        name: t.name,
        members: t.members.map((m) => m.user)
      }))
    );
  } catch (err) {
    next(err);
  }
});

router.post('/:teamId/members', async (req, res, next) => {
  try {
    const user = requireUser(req);
    requireRoles(user, ['ADMIN', 'MANAGER']);

    const teamId = Number(req.params.teamId);
    if (!Number.isInteger(teamId)) throw createError(400, 'Invalid teamId');

    const body = parseOr400(
      z.object({
        userId: z.number().int().positive()
      }),
      req.body
    );

    await prisma.teamMember.upsert({
      where: { teamId_userId: { teamId, userId: body.userId } },
      update: {},
      create: { teamId, userId: body.userId }
    });

    const members = await prisma.teamMember.findMany({
      where: { teamId },
      include: { user: true },
      orderBy: { createdAt: 'asc' }
    });

    res.json({ teamId, members: members.map((m) => m.user) });
  } catch (err) {
    next(err);
  }
});

router.delete('/:teamId/members/:userId', async (req, res, next) => {
  try {
    const user = requireUser(req);
    requireRoles(user, ['ADMIN', 'MANAGER']);

    const teamId = Number(req.params.teamId);
    const userId = Number(req.params.userId);

    if (!Number.isInteger(teamId)) throw createError(400, 'Invalid teamId');
    if (!Number.isInteger(userId)) throw createError(400, 'Invalid userId');

    await prisma.teamMember.delete({ where: { teamId_userId: { teamId, userId } } }).catch(() => null);

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

router.get('/:teamId/validate/:userId', async (req, res, next) => {
  try {
    requireUser(req);

    const teamId = Number(req.params.teamId);
    const userId = Number(req.params.userId);

    if (!Number.isInteger(teamId)) throw createError(400, 'Invalid teamId');
    if (!Number.isInteger(userId)) throw createError(400, 'Invalid userId');

    const membership = await prisma.teamMember.findUnique({
      where: { teamId_userId: { teamId, userId } }
    });

    res.json({ allowed: Boolean(membership) });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
