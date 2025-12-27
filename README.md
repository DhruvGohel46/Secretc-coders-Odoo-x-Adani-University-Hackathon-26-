# 🛠️ Maintenance Management System

(Odoo-Inspired Asset & Maintenance Module)

<img width="959" height="1016" alt="Screenshot 2025-12-27 110917" src="https://github.com/user-attachments/assets/e1603d21-96f0-4024-82d3-fddf1df82a58" /><img width="956" height="1017" alt="Screenshot 2025-12-27 111720" src="https://github.com/user-attachments/assets/11bdf6e3-2aac-4175-9cd6-238d8624191d" />
<img width="1919" height="1018" alt="Screenshot 2025-12-27 110733" src="https://github.com/user-attachments/assets/d54fd2c1-d91f-45da-a18f-538b12eed722" /><img width="1919" height="1016" alt="image" src="https://github.com/user-attachments/assets/2acf71f5-cca3-40a0-a295-7a1830aa4bc3" />
<img width="1919" height="1016" alt="image" src="https://github.com/user-attachments/assets/e845d3ee-554a-4494-8e05-bde197be948b" /><img width="1919" height="956" alt="image" src="https://github.com/user-attachments/assets/1b8c4901-e644-4ea8-89fa-f656946d5e49" />
<img width="1919" height="1014" alt="image" src="https://github.com/user-attachments/assets/67d319f1-2967-4949-80b7-355afdc873ca" />

📌 Overview

This project is a full-stack Maintenance Management System designed to help organizations track equipment, manage maintenance teams, and handle maintenance requests (both corrective and preventive).
The system connects Equipment → Maintenance Teams → Technicians → Requests in a seamless workflow, inspired by Odoo-style enterprise modules.

🎯 Key Objectives

Centralized asset (equipment) tracking

Structured maintenance team & technician assignment

Corrective (breakdown) and preventive (scheduled) maintenance workflows

Calendar-based preventive maintenance planning

Kanban-style request lifecycle management

Role-based access control (Admin / Manager / Technician)

🧱 Tech Stack
Backend

Node.js + Express

PostgreSQL

Prisma ORM

JWT Authentication

Cron Jobs (Overdue Detection)

Frontend

React.js

Axios

React Router

Calendar & Drag-Drop UI

Kanban Board

Tools

Postman – API testing

Prisma Studio – Database visualization

pgAdmin / psql – DB inspection

👥 User Roles
Role	Permissions
ADMIN	Full access, user creation, master data
MANAGER	Team & maintenance planning
TECHNICIAN	Assigned requests execution
🧩 Core Modules
1️⃣ Equipment Management

Track assets by department or employee

Assign maintenance team & default technician

Archive / Scrap equipment

View maintenance history per equipment

Key Fields

Name, Serial Number

Category

Location

Purchase & Warranty Info

Usability status

2️⃣ Maintenance Teams

Create specialized teams (Mechanical, Electrical, IT)

Assign technicians to teams

Validate technician-team relationship

3️⃣ Maintenance Requests
Types

Corrective → Unplanned breakdown repairs

Preventive → Scheduled routine checkups

Lifecycle
NEW → IN_PROGRESS → REPAIRED → (optional) SCRAP

Features

Auto-assign team & technician from equipment

Duration tracking

Overdue detection

Calendar scheduling

🔄 Business Flows
🔧 Corrective Maintenance (Breakdown)

Any user creates request

Equipment auto-fills team & technician

Status starts as NEW

Technician assigns & moves to IN_PROGRESS

Work completed → REPAIRED

Duration recorded

📅 Preventive Maintenance (Routine)

Manager creates preventive request

Scheduled date assigned

Appears in calendar view

Overdue automatically flagged

📊 User Experience Features

Kanban Board (Drag & Drop)

Calendar View for preventive maintenance

Smart Buttons on Equipment (Maintenance count)

Overdue visual indicators

Equipment scrap logic

🔗 API Endpoints Summary

Total Endpoints: 26

Auth & Users

POST /auth/register

POST /auth/login

GET /auth/me

GET /users

Health

GET /health

Departments

POST /departments

Teams

POST /teams

GET /teams

POST /teams/:id/members

GET /teams/:id/validate/:userId

Equipment

POST /equipment

GET /equipment

GET /equipment/:id

PATCH /equipment/:id

PATCH /equipment/:id/archive

GET /equipment/:id/maintenance-count

GET /equipment/:id/requests

Maintenance Requests

POST /requests

GET /requests

PATCH /requests/:id/assign

PATCH /requests/:id/status

PATCH /requests/:id/schedule

🧪 API Testing

Postman collection used to validate all flows

JWT-based authentication

Prisma Studio used for DB inspection

🗄️ Database Visualization
npm run prisma:studio

🚀 Running the Project
Backend
cd backend
npm install
npm run dev

Frontend
cd frontend
npm install
npm start

🏁 Achievements

Fully functional enterprise-grade maintenance module

End-to-end lifecycle implemented

Real-time scheduling & overdue logic

Clean separation of responsibilities

Production-ready REST API design

🧠 Future Enhancements

Role-based dashboard analytics

Email / WhatsApp notifications

SLA tracking

Mobile-first technician app

👨‍💻 Team

Built with ❤️ for Odoo × Adani University Hackathon
Focused on real-world industrial maintenance problems
