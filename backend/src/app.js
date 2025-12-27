const express = require('express');
const cors = require('cors');
const createError = require('http-errors');

const { authMiddleware } = require('./middleware/auth');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const teamsRouter = require('./routes/teams');
const departmentsRouter = require('./routes/departments');
const employeesRouter = require('./routes/employees');
const equipmentRouter = require('./routes/equipment');
const requestsRouter = require('./routes/requests');

function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: '1mb' }));

  app.get('/health', (req, res) => {
    res.json({ ok: true });
  });

  app.use(authMiddleware);

  app.use('/auth', authRouter);
  app.use('/users', usersRouter);
  app.use('/teams', teamsRouter);
  app.use('/departments', departmentsRouter);
  app.use('/employees', employeesRouter);
  app.use('/equipment', equipmentRouter);
  app.use('/requests', requestsRouter);

  app.use((req, res, next) => {
    next(createError(404, 'Not found'));
  });

  app.use((err, req, res, next) => {
    const status = err.status || 500;
    res.status(status).json({ error: err.message || 'Internal Server Error' });
  });

  return app;
}

module.exports = { createApp };
