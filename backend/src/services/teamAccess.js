const { prisma } = require('../db');

async function assertUserInTeam({ userId, teamId }) {
  const membership = await prisma.teamMember.findUnique({
    where: { teamId_userId: { teamId, userId } }
  });

  if (!membership) {
    const err = new Error('User is not a member of this team');
    err.status = 403;
    throw err;
  }
}

module.exports = { assertUserInTeam };
