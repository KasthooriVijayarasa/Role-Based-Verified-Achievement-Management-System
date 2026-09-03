# Role-Based Verified Achievement Management System
### (Student Passport)

A centralized digital profile where university students record academic and extracurricular achievements — skills, projects, certifications, competitions, club activities, sports, and volunteering — and have them **verified by authorized university personnel** before they count as trustworthy record.

> IT3162 – Group Project · Group 18 · Department of Physical Science, Faculty of Applied Science, University of Vavuniya
> Supervisor: Mrs. S. Sobana

---

## Table of Contents

- [Overview](#overview)
- [Core Workflow](#core-workflow)
- [Key Features](#key-features)
- [User Roles](#user-roles)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Data Model](#data-model)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Overview](#api-overview)
- [Team](#team)
- [License](#license)

---

## Overview

A student's academic transcript only reflects grades and credits — it says nothing about the skills, projects, certifications, competitions, club involvement, sports achievements, and volunteering a student builds up over their university life. Those records currently live scattered across departments, clubs, offices, and personal certificates.

**Student Passport** brings all of this into a single digital profile per student. Students submit achievements with supporting proof; each submission is routed automatically to the correct authorized verifier (Club/Society Coordinator, Sports Officer, or Faculty Coordinator/Lecturer) based on its category. Once approved, the achievement becomes a **verified record** in the student's Passport, which can be shared read-only via a QR code or link.

## Core Workflow

```
Student submits achievement + proof
        │
        ▼
System identifies category → routes to correct verifier
        │
        ▼
Verifier reviews proof
        │
   ┌────┴────┐
   ▼         ▼
Approve    Reject (+ reason)
   │         │
   ▼         ▼
Verified   Student edits & resubmits
   │
   ▼
Student Passport updated
   │
   ▼
Shared via QR code / link (read-only)
```

## Key Features

- **Student Profile** — one centralized profile per student.
- **Achievement Submission** — category, title, description, date, supporting proof.
- **Document / Proof Management** — upload and store certificates/evidence per achievement.
- **Role-Based Verification** — submissions auto-routed to the correct authorized verifier by category.
- **Approval / Rejection Workflow** — verifiers approve or reject with a mandatory reason on rejection; students can resubmit.
- **Verification History** — full audit trail of who verified what, and when.
- **Verified Student Passport** — structured, read-only view of all verified achievements.
- **QR Code / Shareable Link** — external viewers (e.g. employers) get read-only access.
- **Faculty Award Tracking** *(coordinator-only)* — coordinators maintain a separate record of certificate/award winners mapped to the Faculty of Applied Science Dean's/Vice-Chancellor's Award categories, to support end-of-year nominations.

## User Roles

| Role | Access |
|---|---|
| **Student** | Manage profile, submit achievements, upload proof, track status, resubmit, view & share Passport |
| **Club/Society Coordinator** | Review & approve/reject club/society achievements |
| **Sports Officer** | Review & approve/reject sports achievements |
| **Faculty Coordinator / Lecturer** | Review & approve/reject academic/faculty achievements; maintain Faculty Award winner records |
| **University Admin** | Manage users, roles, faculties, verifier assignments, system settings |
| **External Viewer** | Read-only access to a shared Passport via QR/link (no login) |

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Backend | Node.js + Express.js |
| Database | MongoDB (Mongoose ODM) |
| Authentication | JWT |
| API Testing | Postman |
| UI/UX Design | Figma |
| QR Generation | `qrcode` (npm) |
| Version Control | Git + GitHub |

## Project Structure

```
Role-Based-Verified-Achievement-Management-System/
├── client/                  # React + Vite frontend
│   ├── src/
│   └── ...
├── server/                  # Node.js + Express backend
│   ├── src/
│   │   ├── config/          # DB connection, env config
│   │   ├── models/          # Mongoose schemas
│   │   ├── controllers/     # Route logic
│   │   ├── routes/          # Express routers
│   │   ├── middleware/      # Auth, role guards, error handling
│   │   ├── utils/           # QR generation, helpers
│   │   └── app.js
│   └── package.json
├── docs/                    # Proposal, presentation, diagrams
└── README.md
```

## Data Model

Core entities (see `server/src/models/`):

- **User** — `userId, name, email, password, role, faculty`
- **StudentProfile** — `studentId, userId, faculty, degree, profileInfo`
- **Achievement** — `achievementId, studentId, category, title, description, date, proofDocument, status, verifierId, rejectionReason`
- **Verification** — `verificationId, achievementId, verifierId, action, reason, timestamp`
- **CertificateWinner** *(coordinator-managed, feeds Faculty Award nominations)* — `winnerId, studentId, achievementId, awardCategory, eventName, positionOrPrize, year, involvementRole, description, proofDocument, verifiedByCoordinatorId, verificationDate`

## Getting Started

### Prerequisites
- Node.js ≥ 18
- MongoDB (local or Atlas)

### Backend setup

```bash
cd server
npm install
cp .env.example .env   # fill in your values, see below
npm run dev
```

### Frontend setup

```bash
cd client
npm install
npm run dev
```

## Environment Variables

Create a `.env` file inside `server/`:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/student-passport
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

## API Overview

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/auth/login` | Login, returns JWT | Public |
| GET | `/api/students/:id/profile` | Get student profile | Student, Admin |
| POST | `/api/achievements` | Submit a new achievement | Student |
| GET | `/api/achievements/pending` | List submissions pending review | Verifier |
| PATCH | `/api/achievements/:id/approve` | Approve an achievement | Verifier |
| PATCH | `/api/achievements/:id/reject` | Reject an achievement (reason required) | Verifier |
| GET | `/api/passport/:studentId` | Get verified Passport (public read-only) | Public (via link/QR) |
| GET | `/api/passport/:studentId/qrcode` | Generate QR code for Passport | Student |
| GET | `/api/coordinators/certificate-winners` | List certificate/award winners | Coordinator |
| POST | `/api/coordinators/certificate-winners` | Add a winner record | Coordinator |

*(Full route list documented as the backend is implemented.)*

## Team

**Group 18** — BSc in Information Technology, Faculty of Applied Science, University of Vavuniya

| Reg. No | Name |
|---|---|
| 2022/ICT/15 | S.P. Sudusinghe |
| 2022/ICT/45 | R.P. Pamudi Malhari Rajapaksha |
| 2022/ICT/74 | K.W.A. Gihan Adithya Dayarathna |
| 2022/ICT/79 | M.F.F. Arza |
| 2022/ICT/113 | J. Rumana Zeerin |
| 2022/ICT/130 | Vijayarasa Kasthoori |

**Supervisor:** Mrs. S. Sobana, Lecturer (Probationary), Department of Physical Science

## License

This project is submitted as coursework for IT3162 – Group Project, University of Vavuniya. All rights reserved by the authors unless otherwise stated.
