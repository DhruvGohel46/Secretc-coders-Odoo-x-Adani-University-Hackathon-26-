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
        name: z.string().min(1),
        serialNumber: z.string().min(1).optional(),
        category: z.string().min(1).optional(),
        purchaseDate: z.coerce.date().optional(),
        warrantyInfo: z.string().min(1).optional(),
        warrantyExpiresAt: z.coerce.date().optional(),
        location: z.string().min(1).optional(),
        departmentId: z.number().int().positive().optional(),
        employeeId: z.number().int().positive().optional(),
        maintenanceTeamId: z.number().int().positive().optional(),
        defaultTechnicianId: z.number().int().positive().optional()
      }),
      req.body
    );

    const equipment = await prisma.equipment.create({
      data: body,
      include: {
        maintenanceTeam: true,
        defaultTechnician: true,
        department: true,
        employee: true
      }
    });
    res.status(201).json(equipment);
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    requireUser(req);

    const where = {};

    if (req.query.departmentId) where.departmentId = Number(req.query.departmentId);
    if (req.query.employeeId) where.employeeId = Number(req.query.employeeId);
    if (req.query.teamId) where.maintenanceTeamId = Number(req.query.teamId);
    if (req.query.archived === '1') where.isArchived = true;
    if (req.query.archived === '0') where.isArchived = false;

    const equipment = await prisma.equipment.findMany({
      where,
      include: {
        maintenanceTeam: true,
        defaultTechnician: true,
        department: true,
        employee: true
      },
      orderBy: { id: 'asc' }
    });

    res.json(equipment);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    requireUser(req);

    const id = Number(req.params.id);
    if (!Number.isInteger(id)) throw createError(400, 'Invalid id');

    const equipment = await prisma.equipment.findUnique({
      where: { id },
      include: {
        maintenanceTeam: true,
        defaultTechnician: true,
        department: true,
        employee: true
      }
    });

    if (!equipment) throw createError(404, 'Equipment not found');
    res.json(equipment);
  } catch (err) {
    next(err);
  }
});

router.get('/:id/requests', async (req, res, next) => {
  try {
    requireUser(req);

    const id = Number(req.params.id);
    if (!Number.isInteger(id)) throw createError(400, 'Invalid id');

    const statuses = req.query.status ? String(req.query.status).split(',') : null;

    const where = { equipmentId: id };
    if (statuses) where.status = { in: statuses };

    const requests = await prisma.maintenanceRequest.findMany({
      where,
      include: {
        equipment: true,
        team: true,
        technician: true
      },
      orderBy: { id: 'desc' }
    });

    res.json(requests);
  } catch (err) {
    next(err);
  }
});

router.get('/:id/maintenance-count', async (req, res, next) => {
  try {
    requireUser(req);

    const id = Number(req.params.id);
    if (!Number.isInteger(id)) throw createError(400, 'Invalid id');

    const openCount = await prisma.maintenanceRequest.count({
      where: {
        equipmentId: id,
        status: { in: ['NEW', 'IN_PROGRESS'] }
      }
    });

    res.json({ equipmentId: id, openCount });
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const user = requireUser(req);
    requireRoles(user, ['ADMIN', 'MANAGER']);

    const id = Number(req.params.id);
    if (!Number.isInteger(id)) throw createError(400, 'Invalid id');

    const body = parseOr400(
      z
        .object({
          name: z.string().min(1).optional(),
          serialNumber: z.string().min(1).optional(),
          category: z.string().min(1).optional(),
          purchaseDate: z.coerce.date().optional(),
          warrantyInfo: z.string().min(1).optional(),
          warrantyExpiresAt: z.coerce.date().optional(),
          location: z.string().min(1).optional(),
          departmentId: z.number().int().positive().nullable().optional(),
          employeeId: z.number().int().positive().nullable().optional(),
          maintenanceTeamId: z.number().int().positive().nullable().optional(),
          defaultTechnicianId: z.number().int().positive().nullable().optional(),
          isUsable: z.boolean().optional()
        })
        .strict(),
      req.body
    );

    const updated = await prisma.equipment.update({
      where: { id },
      data: body,
      include: {
        maintenanceTeam: true,
        defaultTechnician: true,
        department: true,
        employee: true
      }
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id/archive', async (req, res, next) => {
  try {
    const user = requireUser(req);
    requireRoles(user, ['ADMIN', 'MANAGER']);

    const id = Number(req.params.id);
    if (!Number.isInteger(id)) throw createError(400, 'Invalid id');

    const body = parseOr400(
      z.object({
        archived: z.boolean()
      }),
      req.body
    );

    const updated = await prisma.equipment.update({
      where: { id },
      data: {
        isArchived: body.archived,
        archivedAt: body.archived ? new Date() : null
      },
      include: {
        maintenanceTeam: true,
        defaultTechnician: true,
        department: true,
        employee: true
      }
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
