# AIRLINES-INDIGO — Codex Portfolio Reference

## Purpose

This document gives Codex the authoritative project context needed to represent **AIRLINES-INDIGO** inside the engineering portfolio.

- Repository: `adityacoderr/AIRLINES-INDIGO`
- Project: **Flight Status and Notification System**
- Live deployment: `https://airlines-indigo.vercel.app`
- Type: Full-stack, real-time flight-status and notification system.

---

## 1. Project Identity

AIRLINES-INDIGO is a full-stack application that simulates an airline flight-status notification system.

Passengers can:

- View flights
- View flight details
- Subscribe to flight updates
- Receive real-time flight-status updates
- Receive real-time notifications
- View notification history

An admin can:

- Use an admin dashboard
- Change flight status
- Trigger On Time, Delayed, Cancelled, Boarding, and Departed states
- Update gate information
- Trigger notifications to passengers subscribed to the affected flight

The strongest engineering story is the event flow:

```text
Admin changes flight status
          ↓
Backend validates request
          ↓
Flight state persisted in MongoDB
          ↓
Socket.IO broadcasts flight update
          ↓
Backend finds subscribed passengers
          ↓
Notification records created
          ↓
Per-user Socket.IO notifications emitted
          ↓
Passenger UI updates in real time
```

---

## 2. Portfolio Position

AIRLINES-INDIGO is a **separate project** in the overall engineering portfolio.

```text
Projects
├── Yukti
│   └── Storage Engine / FSM / UPE / BIL / ...
├── AIRLINES-INDIGO
│   └── Flight Status & Notification System
└── Future Projects
```

Do not place AIRLINES-INDIGO under Yukti.

---

## 3. Engineering Pillars

### System Design

Relevant:

- Multi-service architecture
- Client/server separation
- REST API
- Real-time event delivery
- Subscription-based notification routing
- Persistent notification history
- Dockerized service architecture

### Low-Level Design

Relevant:

- Express routes
- Controllers
- Services
- Mongoose models
- Middleware
- Socket.IO rooms
- Frontend routing
- API client layer
- Frontend socket integration
- Separation of responsibilities

### Mathematics

This is **not primarily a mathematics project**. Do not force mathematics into the presentation.

### Implementation

Strongly relevant:

- React
- Express
- MongoDB
- Socket.IO
- Docker
- Docker Compose
- REST APIs
- Frontend/backend integration

---

## 4. Technology Stack

### Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Axios
- Socket.IO Client
- React Hot Toast

### Backend

- Node.js
- Express.js
- Socket.IO
- Mongoose
- CORS
- Morgan
- dotenv
- express-validator
- bcryptjs
- jsonwebtoken

### Database

- MongoDB
- Mongoose

### Infrastructure

- **Docker**
- **Docker Compose**

Docker must be explicitly visible in the portfolio. It is an infrastructure/deployment concern, not merely a keyword in the tech stack.

### Deployment

The repository has a Vercel deployment:

`https://airlines-indigo.vercel.app`

Do not claim the Docker Compose stack itself is running on Vercel.

---

## 5. High-Level Architecture

Docker Compose defines three primary services:

```text
                         Docker Compose
                              │
             ┌────────────────┼────────────────┐
             │                │                │
             ▼                ▼                ▼
        Frontend          Backend           MongoDB
        React/Vite        Node/Express       Mongo
          :5173              :5000
             │                │
             │      REST      │
             └───────────────►│
                              │
                              │ Socket.IO
                              ▼
                         Connected Clients
```

The Compose configuration defines:

- `mongodb`
- `backend`
- `frontend`

Backend depends on MongoDB.

Frontend depends on backend.

Backend exposes port `5000`.

Frontend exposes port `5173`.

MongoDB uses a named Docker volume.

---

## 6. Docker / Containerization

Docker is a meaningful part of this project's engineering story.

The repository contains `docker-compose.yml` with:

```text
mongodb
backend
frontend
```

Conceptually:

```text
docker-compose.yml
│
├── mongodb
│   ├── mongo:8
│   └── persistent volume
│
├── backend
│   ├── build: ./backend
│   ├── port: 5000
│   └── depends_on: mongodb
│
└── frontend
    ├── build: ./frontend
    ├── port: 5173
    └── depends_on: backend
```

Documented startup:

```bash
docker compose up --build
```

The portfolio should explain Docker as a way to package the multi-service application into a reproducible local environment.

Do not exaggerate this into Kubernetes, cloud orchestration, or a production container platform.

---

## 7. Docker Persistence

MongoDB uses:

```text
mongo_data:/data/db
```

This separates database data from the MongoDB container lifecycle.

The repository also contains demo MongoDB backup data.

The README documents:

```bash
docker cp mongo-backup flight-mongodb:/backup
docker exec -it flight-mongodb mongorestore /backup
```

Present this as demo-data restoration, not as a production backup architecture.

---

## 8. Backend Architecture

The backend follows a layered structure:

```text
HTTP Request
     ↓
Express Routes
     ↓
Controllers
     ↓
Services
     ↓
Mongoose Models
     ↓
MongoDB
```

Real-time communication exists alongside HTTP:

```text
Express
   │
   ├── REST API
   │
   └── Socket.IO
```

The application:

- Enables CORS
- Parses JSON
- Uses Morgan logging
- Mounts `/api` routes
- Uses centralized error handling

---

## 9. Backend Startup

The backend:

1. Loads environment variables
2. Connects to MongoDB
3. Creates an HTTP server
4. Attaches Socket.IO
5. Initializes Socket.IO handlers
6. Starts listening

Default port:

```text
5000
```

Socket.IO CORS origin is configured using:

```text
CLIENT_URL
```

---

## 10. API Structure

Base path:

```text
/api
```

Main route groups:

```text
/api/flights
/api/subscriptions
/api/notifications
```

Health endpoint:

```text
/api/health
```

---

## 11. Flight API

```text
GET  /api/flights
GET  /api/flights/:id
POST /api/flights/:id/status
```

`GET /api/flights` returns flights.

`GET /api/flights/:id` returns one flight and validates the MongoDB ObjectId.

`POST /api/flights/:id/status` changes:

- Status
- Reason
- Gate

This endpoint is the primary event trigger.

---

## 12. Flight Status Mutation Flow

```text
Request
  ↓
Validate flight ID
  ↓
Find existing flight
  ↓
Check for meaningful change
  ↓
Update flight in database
  ↓
Broadcast flightUpdated
  ↓
Find subscribers
  ↓
Create notification for each subscriber
  ↓
Emit notification to each user's Socket.IO room
  ↓
Return updated flight + notification count
```

This should be a major case-study section.

---

## 13. Real-Time Architecture

Socket.IO is one of the project's primary technical features.

The backend creates a Socket.IO server on the HTTP server.

The frontend uses Socket.IO Client.

```text
                    Socket.IO Server
                          │
             ┌────────────┼────────────┐
             │            │            │
             ▼            ▼            ▼
          Client A     Client B     Client C
```

When a client sends:

```text
join(userId)
```

the server places the socket into:

```text
user:<userId>
```

Example:

```text
user:12345
```

This enables targeted passenger notifications.

---

## 14. Real-Time Events

The backend broadcasts:

```text
flightUpdated
```

for dashboard/flight-state updates.

For individual subscribers it emits:

```text
notification
```

to the user's Socket.IO room.

Do not invent additional event types.

---

## 15. Subscription System

Endpoints:

```text
POST   /api/subscriptions
GET    /api/subscriptions/:userId
DELETE /api/subscriptions/:flightId
```

The service supports:

```text
subscribe
getSubscriptions
removeSubscription
getFlightSubscribers
```

`getFlightSubscribers(flightId)` determines which users should receive updates for a flight.

---

## 16. Subscription Data Model

```text
userId
flightId
createdAt
updatedAt
```

`flightId` references Flight.

A unique compound index exists on:

```text
(userId, flightId)
```

This prevents duplicate subscriptions for the same user/flight.

This is a useful database-design detail to highlight.

---

## 17. Notification System

Notifications are persisted in MongoDB and also pushed through Socket.IO.

```text
Flight Event
    │
    ├──────────────► Socket.IO ───────► Live UI
    │
    └──────────────► MongoDB ──────────► Notification History
```

This provides both real-time delivery and historical access.

---

## 18. Notification API

```text
GET   /api/notifications/:userId
PATCH /api/notifications/:id/read
```

Users can retrieve notification history and mark notifications as read.

---

## 19. Notification Data Model

```text
userId
flightId
type
title
message
isRead
createdAt
updatedAt
```

Current notification types include:

```text
ON_TIME
DELAYED
CANCELLED
BOARDING
DEPARTED
GATE_CHANGED
```

Do not claim every type is triggered by every code path unless verified.

---

## 20. Flight Data Model

```text
flightNumber
origin
destination
departureTime
arrivalTime
status
gate
delayReason
createdAt
updatedAt
```

Flight status is constrained to:

```text
On Time
Delayed
Cancelled
Boarding
Departed
```

`flightNumber` is unique.

---

## 21. Frontend Architecture

React Router currently provides routes for:

```text
/
 /dashboard
 /flights/:id
 /notifications
 /login
 /admin
 *
```

The root redirects to:

```text
/dashboard
```

Main pages include:

- Dashboard
- Flight Details
- Notifications
- Login
- Admin Dashboard

---

## 22. Frontend Communication

Two communication mechanisms are used:

### REST

Axios handles HTTP requests.

### Socket.IO

Socket.IO Client handles real-time updates.

```text
React UI
   │
   ├── Axios ───────────────► Express REST API
   │
   └── Socket.IO Client ────► Socket.IO Server
```

This dual communication model is an important system-design detail.

---

## 23. Passenger Flow

```text
Open Dashboard
      ↓
View Flights
      ↓
Open Flight Details
      ↓
Subscribe to Flight
      ↓
Socket joins user room
      ↓
Admin changes flight status
      ↓
Backend persists event
      ↓
Notification generated
      ↓
Socket.IO pushes notification
      ↓
Passenger receives update
      ↓
Notification remains available in history
```

This is the strongest end-to-end demo flow.

---

## 24. Admin Flow

```text
Admin Dashboard
      ↓
Select Flight
      ↓
Change Status / Gate / Reason
      ↓
POST /api/flights/:id/status
      ↓
Backend updates MongoDB
      ↓
Broadcast flightUpdated
      ↓
Resolve subscribers
      ↓
Persist notifications
      ↓
Emit targeted notifications
```

The admin is effectively an event producer; passengers are event consumers.

---

## 25. Core Architectural Insight

The strongest technical concept is:

> **Persistent state change + event propagation + subscriber-specific notification delivery.**

The system combines:

```text
State
+
REST
+
Persistence
+
Push/Event Delivery
+
Subscription Routing
+
Notification History
```

Present this rather than reducing the project to "React + Node + MongoDB."

---

## 26. Real Engineering Trade-Offs

### REST + Socket.IO

REST handles resource retrieval and request/response operations.

Socket.IO handles low-latency server-to-client updates.

### Persisted Notifications + Real-Time Delivery

Notifications are both stored and pushed:

```text
Real-time experience
+
Historical access
```

### User-Specific Socket Rooms

Using:

```text
user:<userId>
```

allows targeted delivery instead of broadcasting every notification to every client.

### Database-Level Subscription Integrity

The compound unique index on `(userId, flightId)` prevents duplicate subscriptions at the database level.

---

## 27. Project Classification

Recommended portfolio metadata:

```text
Type:
Full-Stack / Real-Time System

Primary Pillars:
Implementation
System Design
Low-Level Design

Topics:
Real-Time Systems
REST APIs
WebSockets
Event-Driven Communication
Database Design
Containerization
Docker
Docker Compose
```

Do not classify this as a distributed database or consensus system.

It is a multi-service application with real-time communication.

---

## 28. Suggested Project Description

A technically accurate short description:

> A containerized full-stack flight-status and notification system that combines REST APIs, MongoDB persistence, and Socket.IO real-time delivery to propagate flight-status changes to subscribed passengers.

---

## 29. Stronger Technical Story

The project can be framed around:

> **How do you propagate a persistent flight-state change to exactly the users who care about it, while retaining notification history?**

Then:

```text
Flight State
     ↓
Persistence
     ↓
Subscriber Lookup
     ↓
Notification Creation
     ↓
Targeted Socket.IO Delivery
     ↓
Client State Update
```

---

## 30. Recommended Case Study Sections

```text
01 — Problem
02 — Architecture
03 — Data Model
04 — REST API
05 — Real-Time Layer
06 — Subscription Routing
07 — Notification Pipeline
08 — Docker Architecture
09 — Frontend Integration
10 — Trade-offs
11 — Demo
12 — Source Code
```

Only populate sections backed by actual repository content.

---

## 31. What Codex Must Not Invent

Do not invent:

- Throughput numbers
- Latency numbers
- Concurrent-user counts
- Uptime
- Production scale
- Load-test results
- Kubernetes
- Redis
- Kafka
- RabbitMQ
- Additional microservices
- Cloud infrastructure not present in the repository
- Enterprise security guarantees
- Automated tests if absent
- CI/CD pipelines if absent
- Production monitoring if absent

If something is not in the repository, do not imply it exists.

---

## 32. Known Repository Structure

Conceptually:

```text
AIRLINES-INDIGO
│
├── frontend/
│   ├── React/Vite application
│   └── Tailwind-based UI
│
├── backend/
│   ├── Express application
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── models/
│   ├── middleware/
│   ├── config/
│   └── seed/
│
├── docker-compose.yml
├── mongo-backup/
└── README.md
```

The actual repository remains the source of truth for exact file structure.

---

## 33. Backend Layering

```text
backend/src
│
├── config
│   ├── db
│   └── socket
│
├── controllers
├── middleware
├── models
├── routes
├── services
└── seed
```

This separation should be highlighted under Low-Level Design.

---

## 34. Backend Responsibilities

### Routes

Define API endpoints.

### Controllers

Handle HTTP-level orchestration and responses.

### Services

Handle reusable business/data operations.

### Models

Define MongoDB/Mongoose data structures.

### Config

Contains database and Socket.IO initialization.

### Middleware

Handles shared backend concerns such as errors.

### Seed

Provides demo flight data.

---

## 35. Data Relationships

```text
Flight
  │
  ├───────────────┐
  │               │
  ▼               ▼
Subscription   Notification
  │               │
  │               │
  └── userId ─────┘
```

`Subscription.flightId` references Flight.

`Notification.flightId` references Flight.

Both contain a `userId`.

---

## 36. Important Data Integrity Detail

The Subscription collection has a unique compound index:

```text
userId + flightId
```

This prevents duplicate subscriptions for the same user/flight pair.

---

## 37. Real-Time Delivery Detail

On connection, the frontend can emit:

```text
socket.emit("join", userId)
```

The backend places the socket into:

```text
user:<userId>
```

When a subscribed flight changes:

```text
io.to(`user:${subscriber.userId}`)
  .emit("notification", ...)
```

The notification is targeted to the appropriate user.

---

## 38. Dashboard Broadcast

Flight status changes are broadcast with:

```text
flightUpdated
```

This is different from the user-specific:

```text
notification
```

Conceptually:

```text
flightUpdated
    ↓
dashboard / flight viewers

notification
    ↓
specific subscribed users
```

---

## 39. Error Handling

The Express app registers centralized error handling after the API routes.

Controllers forward errors using:

```text
next(error)
```

This is a legitimate backend architecture detail.

Do not claim production-grade observability or monitoring.

---

## 40. Demo / Deployment

Documented local Docker startup:

```bash
docker compose up --build
```

Local endpoints:

```text
Frontend: http://localhost:5173
Admin:    http://localhost:5173/admin
Backend:  http://localhost:5000
```

Live deployment:

```text
https://airlines-indigo.vercel.app
```

Label the live URL as a demo/live deployment.

---

## 41. Portfolio Presentation Rule

Do not present this as merely:

> React + Node + MongoDB project.

Prefer:

> **A real-time event propagation system for flight-state changes, combining persistent state, subscriber routing, targeted Socket.IO delivery, notification history, and containerized deployment.**

The technology stack supports the engineering story; it is not the story itself.

---

## 42. Final Mental Model

Codex should understand AIRLINES-INDIGO as:

> A full-stack, containerized, real-time flight-status notification system where flight state is persisted in MongoDB, exposed through REST APIs, and propagated through Socket.IO to dashboard clients and user-specific subscriber rooms.

Primary flow:

```text
                    ADMIN
                      │
                      ▼
              Flight Status Change
                      │
                      ▼
                Express API
                      │
                      ▼
               Flight Service
                      │
                      ▼
                  MongoDB
                      │
          ┌───────────┴───────────┐
          │                       │
          ▼                       ▼
   flightUpdated           Find Subscribers
          │                       │
          ▼                       ▼
    Dashboard Clients     Create Notifications
                                  │
                                  ▼
                         User Socket Rooms
                                  │
                                  ▼
                         Passenger Clients
```

Infrastructure:

```text
             Docker Compose
                   │
       ┌───────────┼───────────┐
       ▼           ▼           ▼
   Frontend      Backend     MongoDB
```

Portfolio hierarchy:

```text
Portfolio
└── Projects
    └── AIRLINES-INDIGO
        ├── Architecture
        ├── REST API
        ├── Real-Time Layer
        ├── Subscription System
        ├── Notification Pipeline
        ├── Database Design
        ├── Docker / Docker Compose
        ├── Frontend
        └── Implementation
```

Yukti remains a separate project.

---

## 43. Source-of-Truth Rule

For portfolio implementation:

1. Use the actual repository as the primary implementation source.
2. Use this document as the project-context layer.
3. If repository code contradicts this document, trust current repository code for implementation facts and flag the discrepancy.
4. Never invent missing functionality.
5. Do not convert architectural interpretation into a claim that the system implements something it does not.
6. Keep technical claims proportional to the actual project.

The goal is to make the portfolio show **real engineering decisions and implementation**, not inflated project marketing.
