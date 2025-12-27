require('dotenv').config();

const { createApp } = require('./app');
const { prisma } = require('./db');
const { runOverdueCheck } = require('./jobs/overdueJob');

const port = Number(process.env.PORT || 4000);

const app = createApp();

app.listen(port, () => {
  process.stdout.write(`Server listening on port ${port}\n`);
});

const intervalMs = Number(process.env.OVERDUE_JOB_INTERVAL_MS || 60000);
if (Number.isFinite(intervalMs) && intervalMs > 0) {
  runOverdueCheck(prisma).catch(() => null);
  setInterval(() => {
    runOverdueCheck(prisma).catch(() => null);
  }, intervalMs);
}

async function shutdown() {
  try {
    await prisma.$disconnect();
  } finally {
    process.exit(0);
  }
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
