# 🛠️ Maintenance Management System

(Odoo-Inspired Asset & Maintenance Module)

<img width="959" height="1016" alt="Screenshot 2025-12-27 110917" src="https://github.com/user-attachments/assets/e1603d21-96f0-4024-82d3-fddf1df82a58" /><img width="956" height="1017" alt="Screenshot 2025-12-27 111720" src="https://github.com/user-attachments/assets/11bdf6e3-2aac-4175-9cd6-238d8624191d" />
<img width="1919" height="1018" alt="Screenshot 2025-12-27 110733" src="https://github.com/user-attachments/assets/d54fd2c1-d91f-45da-a18f-538b12eed722" /><img width="1919" height="1016" alt="image" src="https://github.com/user-attachments/assets/2acf71f5-cca3-40a0-a295-7a1830aa4bc3" />
<img width="1919" height="1016" alt="image" src="https://github.com/user-attachments/assets/e845d3ee-554a-4494-8e05-bde197be948b" /><img width="1919" height="956" alt="image" src="https://github.com/user-attachments/assets/1b8c4901-e644-4ea8-89fa-f656946d5e49" />
<img width="1919" height="1014" alt="image" src="https://github.com/user-attachments/assets/67d319f1-2967-4949-80b7-355afdc873ca" />

# 📘 **Maintenance Management System**

## 📌 Project Overview

This project is a **full-stack Maintenance Management System** designed to manage equipment, technicians, and maintenance workflows inside an organization.

It supports **role-based access**, allowing Admins, Technicians, and Users to interact with the system according to their responsibilities.

---

## 👥 Team Members

| Name                | Responsibility            |
| ------------------- | ------------------------- |
| **Ahad Dangarwala**  | Backend Development & Database    |
| **varun Kushwaha** | Backend Development       |
| **Dhruv Gohil**     | Frontend Development      |
| **Vishmayraj Zala** | Authentication            |

---

## 🛠️ Tech Stack

### Backend

* **Node.js**
* **Express.js**
* **PostgreSQL**
* **Prisma ORM**
* **JWT Authentication**
* **bcrypt**

### Frontend

* **React.js**
* **Axios**
* **Tailwind CSS**

---

## 🧠 System Architecture

```
Client (React)
     |
     v
API Layer (Express)
     |
     v
Database (PostgreSQL via Prisma)
```

---

## 🔐 Authentication & Authorization

* Secure login using **JWT**
* Passwords hashed using **bcrypt**
* Role-based access control:

  * ADMIN
  * TECHNICIAN
  * USER

---

## 🧩 Core Modules

### 1️⃣ User Management

* Register / Login
* Role-based access
* Secure authentication

---

### 2️⃣ Team Management

* Admin can create teams
* Assign technicians to teams
* Each technician belongs to only one team

---

### 3️⃣ Equipment Management

* Admin can add/edit/delete equipment
* Each equipment belongs to a specific team
* Equipment status tracking

---

### 4️⃣ Maintenance Management

* Users raise maintenance requests
* Admin assigns maintenance to teams
* Technicians view and update assigned work
* Status lifecycle:

  ```
  OPEN → SCHEDULED → IN_PROGRESS → COMPLETED
  ```

---

### 5️⃣ Dashboard System

* Admin dashboard:

  * Total equipment
  * Active maintenance
  * Team workload
* Technician dashboard:

  * Assigned tasks
  * Status updates

---

## 🗂 Database Schema Overview

### User

* id
* name
* email
* password
* role (ADMIN / TECHNICIAN / USER)
* teamId

### Team

* id
* name

### Equipment

* id
* name
* serialNumber
* location
* teamId
* status

### Maintenance

* id
* equipmentId
* reportedBy
* assignedTeam
* status
* scheduledDate
* completedAt

---

## 🔒 Security Features

* Encrypted passwords
* JWT-based authentication
* Role-based route protection
* Secure environment variables

---


# 📘 **API ENDPOINTS – CATEGORIZED STRUCTURE**

---

## 🔐 **1. Authentication & User Management**

| Method | Endpoint         | Description                |
| ------ | ---------------- | -------------------------- |
| POST   | `/auth/register` | Register new user          |
| POST   | `/auth/login`    | Login user                 |
| GET    | `/auth/me`       | Get logged-in user details |

---

## 🏢 **2. Department Management**

| Method | Endpoint       | Description             |
| ------ | -------------- | ----------------------- |
| POST   | `/departments` | Create a new department |

---

## 👥 **3. Team Management**

| Method | Endpoint                      | Description                     |
| ------ | ----------------------------- | ------------------------------- |
| POST   | `/teams`                      | Create a new team               |
| GET    | `/teams`                      | Get all teams                   |
| POST   | `/teams/:id/members`          | Assign technician to team       |
| GET    | `/teams/:id/validate/:userId` | Check if user belongs to a team |

---

## 🧰 **4. Equipment Management**

| Method | Endpoint                  | Description                           |
| ------ | ------------------------- | ------------------------------------- |
| POST   | `/equipment`              | Add new equipment                     |
| GET    | `/equipment`              | Get all equipment                     |
| GET    | `/equipment/:id`          | Get single equipment                  |
| PATCH  | `/equipment/:id`          | Update equipment                      |
| PATCH  | `/equipment/:id/archive`  | Archive equipment                     |
| GET    | `/equipment/:id/requests` | Get maintenance requests of equipment |

---

## 🛠️ **5. Maintenance Requests**

| Method | Endpoint                 | Description                  |
| ------ | ------------------------ | ---------------------------- |
| POST   | `/requests`              | Create maintenance request   |
| GET    | `/requests`              | Get all maintenance requests |
| PATCH  | `/requests/:id/assign`   | Assign technician            |
| PATCH  | `/requests/:id/status`   | Update maintenance status    |
| PATCH  | `/requests/:id/schedule` | Schedule maintenance         |

---

## 🩺 **6. System / Health**

| Method | Endpoint  | Description      |
| ------ | --------- | ---------------- |
| GET    | `/health` | API health check |


---

## 🚀 How to Run the Project

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm start
```

---

## 🎯 Final Note

This project follows **industry-level backend architecture**, clean folder structure, and scalable design.
It is suitable for real-world enterprise deployment with future extensibility such as notifications, SLA tracking, and analytics.


## 👨‍💻 Team

Built with ❤️ for Odoo × Adani University Hackathon
Focused on real-world industrial maintenance problems

---
