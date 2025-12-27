async function runOverdueCheck(prisma) {
  const now = new Date();

  await prisma.maintenanceRequest.updateMany({
    where: {
      type: 'PREVENTIVE',
      scheduledDate: { not: null, lt: now },
      status: { in: ['NEW', 'IN_PROGRESS'] }
    },
    data: { isOverdue: true }
  });

  await prisma.maintenanceRequest.updateMany({
    where: {
      OR: [
        { type: { not: 'PREVENTIVE' } },
        { scheduledDate: null },
        { scheduledDate: { gte: now } },
        { status: { in: ['REPAIRED', 'SCRAP'] } }
      ],
      isOverdue: true
    },
    data: { isOverdue: false }
  });
}

module.exports = { runOverdueCheck };
