# Maintenance Backend

## Run

- Create `.env` (already included for local dev)
```bash
PORT=4000
DATABASE_URL="postgresql://Username:Password@localhost:5432/maintenance_db?schema=public"
JWT_SECRET="Random-HexCode"
JWT_EXPIRES_IN="7d"
OVERDUE_JOB_INTERVAL_MS=60000
```

- Ensure PostgreSQL is running and you have created a DB (example: `maintenance_db`).
- Install deps:

```bash
npm install
```

- Generate Prisma client:

```bash
npm run prisma:generate
```

- Sync schema to DB:

```bash
npm run prisma:migrate
```

- Start API:

```bash
npm run dev
```

Server: `http://localhost:4000`

### How to confirm the backend is running

- When you start the server you should see:

`Server listening on port 4000`

- Then open:

`GET http://localhost:4000/health`

You should get: `{ "ok": true }`

## Auth

Use JWT Bearer tokens.

- Register: `POST /auth/register`
- Login: `POST /auth/login`
- Current user: `GET /auth/me`

Send header:

- `Authorization: Bearer <token>`

Dev fallback (still supported):

- `x-user-id: <number>`

Most endpoints require authentication.

## Core endpoints

### Users
- `GET /users`

### Teams
- `POST /teams`
- `GET /teams`
- `POST /teams/:teamId/members`
- `DELETE /teams/:teamId/members/:userId`
- `GET /teams/:teamId/validate/:userId`

### Departments
- `POST /departments`
- `GET /departments`

### Employees
- `POST /employees`
- `GET /employees`

### Equipment
- `POST /equipment`
- `PATCH /equipment/:id`
- `PATCH /equipment/:id/archive`
- `GET /equipment?departmentId=1&employeeId=1&teamId=1&archived=0`
- `GET /equipment/:id`
- `GET /equipment/:id/requests`
- `GET /equipment/:id/maintenance-count`

### Requests
- `POST /requests` (auto-fills `teamId` + `equipmentCategory` from equipment)
- `GET /requests` (filters: `type`, `status`, `teamId`, `equipmentId`, `technicianId`)
- `GET /requests?overdue=1`
- `GET /requests?calendar=1` (only preventive with scheduledDate)
- `PATCH /requests/:id/assign` (team member only)
- `PATCH /requests/:id/status` (lifecycle + duration rules + scrap logic)
- `PATCH /requests/:id/schedule`

## Business rules implemented

- Team auto-filled from Equipment on request creation
- Only team members can assign/work on requests
- Status transitions enforced: `NEW -> IN_PROGRESS -> (REPAIRED | SCRAP)`
- `durationHours` allowed only when moving to `REPAIRED` (required then)
- When moved to `SCRAP`, equipment `isUsable` becomes `false`
- Overdue detection runs on an interval and sets `isOverdue` for preventive requests with `scheduledDate < now` and status `NEW/IN_PROGRESS`
