# Faculty Award Certificate Verification System

A digital system that replaces the paper-based **Faculty of Applied Science Award application form**. In-charge staff upload student certificate/achievement details, the system issues each certificate a unique **Certificate ID**, and students verify and claim their certificates onto their profile using that ID.

> IT3162 – Group Project · Group 18 · Department of Physical Science, Faculty of Applied Science, University of Vavuniya
> Supervisor: Mrs. S. Sobana

---

## Table of Contents

- [Overview](#overview)
- [Award Categories](#award-categories)
- [Core Workflow](#core-workflow)
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

The Faculty of Applied Science currently tracks student certificates and award-worthy achievements through a **paper application form**, filled in by students and countersigned by mentors, the Dean's office, and the Selection Committee. This process is slow, hard to search, and easy to lose track of.

This project digitalizes that process. Instead of the student initiating the paperwork, an **admin/in-charge person uploads the certificate or achievement details** on the student's behalf and the system generates a unique **Certificate ID**. The student then enters that ID to raise a verification request, which goes to the relevant in-charge person for approval. Once approved, the certificate appears as a verified entry on the student's profile — mirroring the categories on the official Faculty Award form.

## Award Categories

The system is built around the same 6 categories used in the Faculty Award application form's extracurricular activities section:

1. **Leadership** — Office bearer of a recognized national body or university/faculty organization
2. **Community Service & Good Citizenship** — Volunteering, disaster relief, exceptional civic contribution
3. **Sports Achievements** — World University Games, National Games, international/inter-university/inter-faculty events
4. **Creativity & Exceptional Ability (Aesthetic/Technical)** — Competitions, graduating performances, public/media performances
5. **Conferences, Seminars & Publications** — Peer-reviewed publications, conference presentations, authored books/chapters
6. **Other Activities** — Any other certified university-career activity not covered above

## Core Workflow

```
Admin / In-charge person uploads certificate + student details
        │
        ▼
System generates a unique Certificate ID
        │
        ▼
Student enters Certificate ID → requests verification
        │
        ▼
Request routed to the relevant in-charge person (by category)
        │
        ▼
In-charge person checks certificate/details
        │
   ┌────┴────┐
   ▼         ▼
Approve    Reject (+ reason)
   │         │
   ▼         ▼
Certificate shown   Student rechecks ID /
on student profile  contacts admin
```

## User Roles

| Role | Access |
|---|---|
| **Admin / In-charge (uploader)** | Upload certificate/achievement records, generate Certificate IDs, manage category assignment |
| **In-charge Person (Verifier)** | Review certificates routed to their category, approve/reject with reason |
| **Student** | Enter a Certificate ID to request verification, view their verified profile |
| **University Admin** | Manage users, roles, categories, and system configuration |

*(Roles to be confirmed with supervisor as the design is finalized — e.g. whether "Admin" and "In-charge/Verifier" are the same person or separate roles per category.)*

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Backend | Node.js + Express.js |
| Database | MongoDB (Mongoose ODM) |
| Authentication | JWT |
| Certificate ID Generation | UUID / custom ID generator (backend) |
| Version Control | Git + GitHub |

*(Stack carried over from the original proposal — confirm with supervisor if unchanged for the revised scope.)*

## Project Structure

```
Faculty-Award-Certificate-Verification-System/
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
│   │   ├── utils/           # Certificate ID generator, helpers
│   │   └── app.js
│   └── package.json
├── docs/                    # Proposal, presentation, faculty award form reference
└── README.md
```

## Data Model

Core entities (see `server/src/models/`):

- **User** — `userId, name, email, password, role, faculty`
- **StudentProfile** — `studentId, userId, faculty, degree, profileInfo`
- **Certificate** — `certificateId (unique, system-generated), studentIdentifier, category, title, description, issueDate, uploadedByAdminId, proofDocument, status (unclaimed / pending / verified / rejected), claimedByStudentId, verifierId, verificationDate, rejectionReason`
- **Verification** — `verificationId, certificateId, verifierId, action, reason, timestamp`

## Getting Started

### Prerequisites
- Node.js
- MongoDB (local or Atlas)
## API Overview

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/auth/login` | Login, returns JWT | Public |
| POST | `/api/certificates` | Upload a certificate/achievement, generates Certificate ID | Admin / In-charge |
| GET | `/api/certificates` | List all certificates (filter by category/status) | Admin / In-charge |
| POST | `/api/certificates/:certificateId/claim` | Student submits Certificate ID to request verification | Student |
| GET | `/api/verifications/pending` | List verification requests pending review | Verifier |
| PATCH | `/api/verifications/:id/approve` | Approve a certificate verification request | Verifier |
| PATCH | `/api/verifications/:id/reject` | Reject a request (reason required) | Verifier |
| GET | `/api/students/:id/profile` | Get student profile with verified certificates | Student, Admin |

*(Full route list to be finalized as the backend is implemented.)*

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
