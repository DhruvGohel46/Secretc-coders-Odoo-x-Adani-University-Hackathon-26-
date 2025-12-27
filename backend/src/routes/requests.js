const express = require('express');
const createError = require('http-errors');
const { z } = require('zod');

const { prisma } = require('../db');
const { requireUser } = require('../utils/http');
const { isPrivileged } = require('../utils/authz');
const { parseOr400 } = require('../utils/validation');
const { assertUserInTeam } = require('../services/teamAccess');
const { assertValidTransition } = require('../services/requestLifecycle');

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const user = requireUser(req);

    const body = parseOr400(
      z.object({
        type: z.enum(['CORRECTIVE', 'PREVENTIVE']),
        subject: z.string().min(1),
        equipmentId: z.number().int().positive(),
        scheduledDate: z.coerce.date().optional()
      }),
      req.body
    );

    const equipment = await prisma.equipment.findUnique({
      where: { id: body.equipmentId },
      include: { maintenanceTeam: true }
    });

    if (!equipment) throw createError(404, 'Equipment not found');
    if (!equipment.isUsable) throw createError(400, 'Equipment is not usable');
    if (equipment.isArchived) throw createError(400, 'Equipment is archived');
    if (!equipment.maintenanceTeamId) throw createError(400, 'Equipment has no Maintenance Team assigned');

    const request = await prisma.maintenanceRequest.create({
      data: {
        type: body.type,
        subject: body.subject,
        equipmentId: equipment.id,
        teamId: equipment.maintenanceTeamId,
        technicianId: equipment.defaultTechnicianId || null,
        equipmentCategory: equipment.category || null,
        scheduledDate: body.type === 'PREVENTIVE' ? body.scheduledDate || null : null,
        createdByUserId: user.id
      },
      include: {
        equipment: true,
        team: true,
        technician: true
      }
    });

    res.status(201).json(request);
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    requireUser(req);

    const where = {};

    if (req.query.type) where.type = String(req.query.type);
    if (req.query.status) where.status = String(req.query.status);
    if (req.query.teamId) where.teamId = Number(req.query.teamId);
    if (req.query.equipmentId) where.equipmentId = Number(req.query.equipmentId);
    if (req.query.technicianId) where.technicianId = Number(req.query.technicianId);

    if (req.query.overdue === '1') where.isOverdue = true;

    if (req.query.calendar === '1') {
      where.type = 'PREVENTIVE';
      where.scheduledDate = { not: null };
    }

    const requests = await prisma.maintenanceRequest.findMany({
      where,
      include: {
        equipment: true,
        team: true,
        technician: true
      },
      orderBy: [{ updatedAt: 'desc' }, { id: 'desc' }]
    });

    res.json(requests);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id/assign', async (req, res, next) => {
  try {
    const user = requireUser(req);

    const id = Number(req.params.id);
    if (!Number.isInteger(id)) throw createError(400, 'Invalid id');

    const body = parseOr400(
      z.object({
        technicianId: z.number().int().positive().optional()
      }),
      req.body
    );

    const request = await prisma.maintenanceRequest.findUnique({
      where: { id },
      include: { team: true }
    });

    if (!request) throw createError(404, 'Request not found');

    const techId = body.technicianId ?? user.id;
    if (!isPrivileged(user)) {
      await assertUserInTeam({ userId: techId, teamId: request.teamId });
    }

    const updated = await prisma.maintenanceRequest.update({
      where: { id },
      data: { technicianId: techId },
      include: {
        equipment: true,
        team: true,
        technician: true
      }
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id/status', async (req, res, next) => {
  try {
    const user = requireUser(req);

    const id = Number(req.params.id);
    if (!Number.isInteger(id)) throw createError(400, 'Invalid id');

    const body = parseOr400(
      z.object({
        status: z.enum(['NEW', 'IN_PROGRESS', 'REPAIRED', 'SCRAP']),
        durationHours: z.number().positive().optional()
      }),
      req.body
    );

    const request = await prisma.maintenanceRequest.findUnique({
      where: { id },
      include: { equipment: true }
    });

    if (!request) throw createError(404, 'Request not found');

    if (!isPrivileged(user)) {
      const actingUserId = request.technicianId ?? user.id;
      await assertUserInTeam({ userId: actingUserId, teamId: request.teamId });
    }

    assertValidTransition(request.status, body.status);

    if (body.status === 'IN_PROGRESS' && !request.technicianId) {
      throw createError(400, 'Assign a technician before moving to IN_PROGRESS');
    }

    if (body.status !== 'REPAIRED' && body.durationHours != null) {
      throw createError(400, 'durationHours is allowed only when status is REPAIRED');
    }

    if (body.status === 'REPAIRED' && body.durationHours == null) {
      throw createError(400, 'durationHours is required when status is REPAIRED');
    }

    const updated = await prisma.$transaction(async (tx) => {
      const reqUpdated = await tx.maintenanceRequest.update({
        where: { id },
        data: {
          status: body.status,
          durationHours: body.status === 'REPAIRED' ? body.durationHours : request.durationHours
        },
        include: {
          equipment: true,
          team: true,
          technician: true
        }
      });

      if (body.status === 'SCRAP') {
        await tx.equipment.update({
          where: { id: request.equipmentId },
          data: { isUsable: false }
        });
      }

      return reqUpdated;
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id/schedule', async (req, res, next) => {
  try {
    const user = requireUser(req);

    const id = Number(req.params.id);
    if (!Number.isInteger(id)) throw createError(400, 'Invalid id');

    const body = parseOr400(
      z.object({
        scheduledDate: z.coerce.date()
      }),
      req.body
    );

    const request = await prisma.maintenanceRequest.findUnique({
      where: { id }
    });

    if (!request) throw createError(404, 'Request not found');
    if (request.type !== 'PREVENTIVE') throw createError(400, 'Only PREVENTIVE requests can be scheduled');

    if (!isPrivileged(user)) {
      const actingUserId = request.technicianId ?? user.id;
      await assertUserInTeam({ userId: actingUserId, teamId: request.teamId });
    }

    const updated = await prisma.maintenanceRequest.update({
      where: { id },
      data: { scheduledDate: body.scheduledDate },
      include: {
        equipment: true,
        team: true,
        technician: true
      }
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
