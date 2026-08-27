# GCB — Portfolio Project Reference for OpenCode

## Purpose of this document

This document is the source of truth for integrating **GCB (Gully Cricket Board)** into the existing personal portfolio.

OpenCode should first understand what the project actually is, how the frontend and backend work together, and why the project is technically interesting. Only then should it add/update the portfolio project entry.

Do **not** reduce GCB to "a cricket scoring website". It is a full-stack, real-time cricket match management and scoring system with a stateful ball-by-ball scoring engine.

---

# 1. Project Identity

**Project name:** GCB / Gully Cricket Board

**Primary purpose:**

GCB is a web application for creating, managing, scoring, and following live cricket matches. It is designed around the real operational flow of a cricket match:

```text
Create Match
    ↓
Configure Teams / Squads / Format / Overs
    ↓
Toss
    ↓
Start Innings
    ↓
Ball-by-Ball Scoring
    ↓
Live Score Updates
    ↓
Innings Transition
    ↓
Target / Result Calculation
    ↓
Match Completion
    ↓
Scorecard / Match Result / Summary
```

The important engineering aspect is that the application models cricket as an evolving state machine rather than treating a score as a single number.

---

# 2. Repositories

GCB is split into two repositories.

## Frontend

Repository:

`adityacoderr/GCB-Frontend`

GitHub:

`https://github.com/adityacoderr/GCB-Frontend`

Deployment:

`https://gcb-frontend-henna.vercel.app`

Frontend language:

**JavaScript**

The repository is a React/Vite application.

## Backend

Repository:

`adityacoderr/GCB-Backend`

The backend provides the API, persistence, match/scoring logic, authentication/security-related operations, and real-time Socket.IO communication consumed by the frontend.

---

# 3. High-Level Architecture

```text
                    ┌───────────────────────────┐
                    │       GCB Frontend        │
                    │                           │
                    │ React 19                 │
                    │ Vite                     │
                    │ React Router             │
                    │ Zustand                  │
                    │ Socket.IO Client         │
                    └─────────────┬─────────────┘
                                  │
                    REST API      │      Socket.IO
                                  │
                                  ▼
                    ┌───────────────────────────┐
                    │       GCB Backend         │
                    │                           │
                    │ Node.js                   │
                    │ Express                  │
                    │ Mongoose                 │
                    │ MongoDB                  │
                    │ Socket.IO Server         │
                    │ Cricket scoring logic    │
                    └─────────────┬─────────────┘
                                  │
                                  ▼
                    ┌───────────────────────────┐
                    │         MongoDB           │
                    │                           │
                    │ Matches                   │
                    │ Squads / Players          │
                    │ Innings                   │
                    │ Ball logs                 │
                    │ Results                   │
                    │ Match metadata            │
                    └───────────────────────────┘
```

There are therefore two different communication mechanisms:

### REST

Used for operations such as:

- creating matches
- retrieving match information
- updating match state
- submitting scoring actions
- administrative operations
- fetching scorecard information

### Socket.IO

Used for real-time match updates.

A viewer does not need to continuously refresh the page to see the score change. Match clients can join a match-specific real-time room and receive updates when the match state changes.

---

# 4. Frontend Technology

The frontend `package.json` confirms:

- React `19.2.0`
- React DOM `19.2.0`
- React Router DOM `7.12.0`
- Socket.IO Client `4.8.3`
- Zustand `5.0.10`
- Vite `7.2.4`
- ESLint `9.39.1`

The frontend is an ES-module JavaScript application.

Primary scripts:

```text
npm run dev
npm run build
npm run lint
npm run preview
```

---

# 5. Frontend Structure

The frontend is organized into pages and reusable match/scoring components.

Relevant structure:

```text
src/
├── App.jsx
├── config.js
├── socket.js
├── main.jsx
│
├── components/
│   ├── BallControls.jsx
│   ├── BatterCard.jsx
│   ├── FullScorecard.jsx
│   ├── MatchResult.jsx
│   ├── NewBatsmanModal.jsx
│   ├── OverEntry.jsx
│   ├── OverHistory.jsx
│   ├── PinModal.jsx
│   ├── ScoreHeader.jsx
│   ├── SelectBowlerModal.jsx
│   └── SelectNextBatterModal.jsx
│
├── pages/
│   ├── AdminDeleteMatches.jsx
│   ├── LiveMatches.jsx
│   ├── MatchCreate.jsx
│   └── MatchView.jsx
│
└── store/
    └── matchStore.js
```

This structure is important for understanding the product.

The application is not one giant page. It separates:

- match discovery
- match creation
- match viewing
- scoring controls
- score display
- player selection
- innings/over information
- administrative functionality
- client-side match state

---

# 6. Frontend Routes

`src/App.jsx` defines the primary application routes.

```text
/ 
    → LiveMatches

/sim
    → MatchCreate

/admin/delete
    → AdminDeleteMatches

/match/:id
    → MatchView
```

Meaning:

### `/`

Public/live match discovery.

Users can see currently available matches.

### `/sim`

Match setup/admin interface.

This is where match configuration is performed.

### `/admin/delete`

Administrative match deletion interface.

### `/match/:id`

The primary match experience.

This page connects the user to the actual match state, scoring interface, live updates, scorecard, and result flow.

---

# 7. Match Creation Flow

`MatchCreate.jsx` demonstrates that match creation is not just a title/form.

The setup interface supports:

### Match format

Current UI options include:

```text
ODI
TEST
```

### Overs

The creator can configure the overs limit.

The UI includes quick selections such as:

```text
5 overs
8 overs
25 overs
```

and also supports custom numeric input.

### Teams

Two teams are configured.

The frontend prevents:

- missing team names
- identical team names

### Scheduling

A match can optionally be scheduled using a datetime input.

### Toss

The creator can:

- set toss now
- set toss later

If toss is configured immediately:

- toss winner is selected
- decision is selected

Possible decisions:

```text
BAT
BOWL
```

### Squads

Players can be entered for both teams.

The frontend supports:

- newline-separated players
- comma-separated players
- duplicate-player detection
- minimum squad size validation
- equal squad size validation

### Scorer security

A scorer PIN is required when creating the match.

The frontend sends the match configuration to:

```text
POST /api/match/create
```

After successful creation, it redirects to:

```text
/match/:id
```

---

# 8. Scoring Interface

The scoring interface is the core of the application.

Important frontend components include:

```text
BallControls.jsx
OverEntry.jsx
OverHistory.jsx
ScoreHeader.jsx
BatterCard.jsx
SelectBowlerModal.jsx
SelectNextBatterModal.jsx
NewBatsmanModal.jsx
FullScorecard.jsx
MatchResult.jsx
```

These components correspond to actual cricket operations.

The UI therefore represents a scorer's workflow rather than merely displaying static match data.

---

# 9. Ball-by-Ball Scoring

GCB records individual deliveries rather than only maintaining a final score.

A scoring action can affect several pieces of state simultaneously.

Conceptually:

```text
Ball
 ├── batter
 ├── bowler
 ├── runs
 ├── extras
 ├── wicket
 ├── dismissal information
 ├── legal-ball state
 ├── over state
 ├── striker/non-striker
 └── innings state
```

This matters because cricket scoring has rules where one delivery can:

- add runs
- change the striker
- add an extra
- count as a legal ball
- avoid counting as a legal ball
- produce a wicket
- trigger a free hit
- end an over
- end an innings
- potentially end a match

The application therefore needs consistent state transitions.

---

# 10. Cricket Rules Represented by the System

The backend models cricket-specific state such as:

- innings
- overs
- balls
- legal balls
- runs
- extras
- wickets
- striker
- non-striker
- bowler
- free hit
- target
- declaration
- follow-on
- innings completion
- match completion

The scoring system distinguishes legal deliveries from events such as wides/no-balls where appropriate.

This is one of the technically important aspects of the project.

---

# 11. Innings and Match State

A match is not just:

```text
teamA_score
teamB_score
```

The system tracks innings state.

A conceptual state transition is:

```text
MATCH CREATED
      ↓
SETUP
      ↓
INNINGS 1
      ↓
INNINGS 1 COMPLETE
      ↓
INNINGS 2
      ↓
TARGET REACHED / OVERS EXHAUSTED / ALL OUT
      ↓
MATCH COMPLETE
```

Depending on the format and configured rules, the backend handles additional states such as:

- targets
- declarations
- follow-on
- innings transitions
- result determination

---

# 12. Data Model

The backend uses MongoDB through Mongoose.

The match data model contains substantially more information than a simple score record.

Conceptually the persisted match contains:

```text
Match
├── match metadata
├── teams
├── format
├── overs limit
├── scheduled time
├── toss
├── squads
│   ├── players
│   └── roles
├── innings
│   ├── batting team
│   ├── bowling team
│   ├── score
│   ├── wickets
│   ├── overs
│   ├── target
│   ├── balls
│   └── player statistics
├── ball logs
├── match status
├── result
└── generated summary
```

The exact implementation should always be read from the current backend repository before changing portfolio text.

---

# 13. Real-Time Architecture

Socket.IO is one of the key engineering features of GCB.

The frontend has:

```text
src/socket.js
```

and uses:

```text
socket.io-client
```

The backend has a Socket.IO server.

The conceptual flow is:

```text
Scorer
   │
   │ scoring action
   ▼
Backend scoring logic
   │
   ├── update database
   │
   └── emit match update
            │
            ▼
       Match room
        /       \
       /         \
Viewer A       Viewer B
       \         /
        live score
```

This allows multiple users to observe the same match without repeatedly polling the server.

---

# 14. Match Rooms

Real-time communication is organized around match-specific rooms.

A useful conceptual model is:

```text
match:<matchId>
```

Clients associated with a match receive events relevant to that match.

This avoids broadcasting every match update to every connected client.

The architecture therefore has a natural isolation boundary:

```text
Match A updates
    → Match A room

Match B updates
    → Match B room
```

That is an important point to mention when explaining the project's real-time architecture.

---

# 15. Client State Management

The frontend uses Zustand.

Relevant file:

```text
src/store/matchStore.js
```

Zustand provides client-side state handling for match information.

This is useful because the match screen has several related UI components that need access to shared match state.

Instead of forcing every component to independently fetch and maintain the same data, a centralized client-side state layer can coordinate the match UI.

---

# 16. Match View

`MatchView.jsx` is the primary match page.

It brings together the match experience.

Conceptually:

```text
MatchView
│
├── Match metadata
├── Score header
├── Current batters
├── Current bowler
├── Ball controls
├── Over information
├── Over history
├── Player-selection flows
├── Full scorecard
├── Live updates
└── Match result
```

This is where the product's frontend and backend architecture become visible to the user.

---

# 17. Full Scorecard

`FullScorecard.jsx` represents the detailed statistical view of a match.

The scorecard exists separately from the immediate scoring controls.

This distinction is useful:

```text
Scoring UI
    = optimized for the person entering the match

Scorecard
    = optimized for understanding the match
```

This separation should be reflected in the portfolio description.

---

# 18. Over History

`OverHistory.jsx` and `OverEntry.jsx` provide over-level match context.

Instead of only showing:

```text
75/3
```

the system can expose how the match reached that state through delivery/over information.

This makes the application closer to a real scoring system than a generic CRUD application.

---

# 19. Player Management During Match

The frontend contains dedicated flows for:

```text
SelectBowlerModal.jsx
SelectNextBatterModal.jsx
NewBatsmanModal.jsx
```

This reflects the dynamic nature of cricket.

A wicket changes the active batter.

An over changes the bowler.

The UI therefore has to coordinate player state with the backend's current innings state.

---

# 20. Match Results

`MatchResult.jsx` handles the completed-match state.

The backend is responsible for determining match state/result based on recorded match data.

The frontend then presents that state to the user.

This separation is important:

```text
Backend
    → determines authoritative match state

Frontend
    → renders that state
```

Do not describe the frontend as independently calculating authoritative match results unless the current source code explicitly proves that.

---

# 21. AI Match Summary

The backend also supports generated match summaries.

The important architecture point is:

```text
Recorded match data
       ↓
Backend summary generation
       ↓
Stored/generated match summary
       ↓
Frontend presentation
```

The AI summary is therefore derived from the actual match state/data rather than being the core scoring mechanism.

When describing this feature in the portfolio, emphasize that AI is an additional layer on top of structured match data.

Do not claim a specific AI provider/model unless the current backend code explicitly identifies it.

---

# 22. Security / Scorer Access

The match creation UI requires a scorer PIN.

There is also a dedicated:

```text
PinModal.jsx
```

The project therefore has a distinction between ordinary public match viewing and scorer/admin actions.

Do not describe this as a complete authentication/authorization system unless the backend implementation supports that claim.

Use wording such as:

> PIN-based scorer access for match operations.

rather than:

> Full user authentication and role-based authorization.

---

# 23. Admin Operations

The frontend contains:

```text
AdminDeleteMatches.jsx
```

This provides an administrative match-management operation.

The existence of this interface should be reflected only as an admin capability, not exaggerated into a full admin platform.

---

# 24. Backend Responsibilities

The backend is responsible for the authoritative application state.

Its major responsibilities are:

```text
HTTP API
    ↓
Request validation
    ↓
Match operations
    ↓
Cricket scoring/state transitions
    ↓
MongoDB persistence
    ↓
Real-time event emission
```

Important backend technologies:

- Node.js
- Express
- MongoDB
- Mongoose
- Socket.IO
- bcrypt
- CORS
- dotenv

The backend uses JavaScript ES modules.

---

# 25. Backend Architecture

The backend follows a conventional separation around:

```text
controllers/
routes/
models/
middleware/
sockets/
configuration
server
```

The portfolio should present this as a structured backend rather than saying the application is simply "Node.js + MongoDB".

The interesting part is the combination of:

```text
REST API
+
Persistent match model
+
Cricket state machine
+
Real-time event delivery
```

---

# 26. Why GCB Is Technically Interesting

The portfolio should focus on engineering complexity, not just the domain.

The strongest technical points are:

### 1. Stateful domain modeling

Cricket has many dependent state variables.

Changing one event can affect:

- score
- wickets
- legal balls
- over
- striker
- non-striker
- bowler
- innings
- target
- result

GCB models these relationships.

### 2. Real-time synchronization

Multiple clients can observe a live match.

Socket.IO connects the authoritative backend state to connected viewers/scorers.

### 3. Persistent ball-level data

The system stores the underlying match events rather than only storing the final score.

### 4. Domain-specific validation

Match setup and scoring contain cricket-specific constraints.

### 5. Frontend state coordination

The scorer interface is composed of many components that need a consistent current match state.

### 6. Full-stack integration

The frontend and backend are separate applications but form one product.

### 7. AI on top of structured data

The summary feature demonstrates how structured application data can feed an additional AI layer.

---

# 27. What GCB Should NOT Be Described As

Avoid weak or misleading descriptions such as:

> "A cricket website."

Too generic.

Avoid:

> "A social media platform for cricket."

Not supported.

Avoid:

> "A complete cricket platform like ESPN."

Overclaiming.

Avoid:

> "A secure authentication platform."

The scorer PIN is not equivalent to a complete identity/authentication system.

Avoid claiming:

- millions of users
- production-scale traffic
- enterprise scalability
- microservices
- Kubernetes
- Redis
- Kafka
- PostgreSQL
- OAuth
- JWT
- role-based access control

unless those technologies/features are actually present in the current repositories.

Do not invent metrics.

Do not invent performance numbers.

Do not invent user counts.

---

# 28. Portfolio Positioning

The project should be positioned as a **full-stack real-time application**.

A strong conceptual description is:

> GCB is a full-stack real-time cricket scoring and match management platform that models matches at ball level, persists structured innings data, synchronizes live match state through Socket.IO, and provides dedicated scorer, viewer, scorecard, and match-result experiences.

A shorter version:

> Real-time full-stack cricket scoring platform with ball-by-ball state management, live Socket.IO synchronization, persistent match data, and scorer/viewer workflows.

---

# 29. Suggested Technology Tags

Use technologies actually present in the repositories.

Recommended tags:

```text
React
JavaScript
Vite
Node.js
Express
MongoDB
Mongoose
Socket.IO
Zustand
React Router
```

Do not add technologies merely because they would be useful for this type of application.

---

# 30. Suggested Portfolio Project Structure

The existing portfolio architecture uses:

```text
Project
├── overview
├── technologies
├── subsystems
│   └── TechnicalWork
└── links
```

GCB should fit this model.

Recommended project-level concept:

```text
Project
    name: GCB
    description: full-stack real-time cricket scoring platform
    role: Full-stack development
    technologies:
        React
        Vite
        Node.js
        Express
        MongoDB
        Mongoose
        Socket.IO
        Zustand
        React Router
```

---

# 31. Recommended GCB Subsystems

Do not create dozens of tiny subsystems.

A useful breakdown is:

```text
1. Match Management
2. Real-Time Match Engine
3. Ball-by-Ball Scoring
4. Live Match Interface
5. Scorecard & Match Results
6. AI Match Summary
7. Administration & Scorer Access
```

These represent meaningful architectural/product boundaries.

---

# 32. Subsystem: Match Management

### Purpose

Handles creation and configuration of a cricket match.

### Responsibilities

- format selection
- overs configuration
- team configuration
- squad setup
- toss configuration
- scheduling
- scorer PIN
- match initialization

### Frontend evidence

```text
src/pages/MatchCreate.jsx
```

### Backend relationship

Match creation is sent to the backend API and becomes persistent match state.

---

# 33. Subsystem: Real-Time Match Engine

### Purpose

Keep multiple clients synchronized with the authoritative live match.

### Technologies

```text
Socket.IO
Socket.IO Client
```

### Responsibilities

- connect clients
- join match-specific rooms
- receive live state updates
- propagate scoring changes
- keep viewers synchronized

### Key engineering idea

The backend is the source of truth.

```text
Client action
    ↓
Backend
    ↓
Persist / mutate state
    ↓
Emit update
    ↓
Connected match clients
```

---

# 34. Subsystem: Ball-by-Ball Scoring

### Purpose

Represent and process individual cricket deliveries.

### Responsibilities

- runs
- extras
- wickets
- legal balls
- overs
- batter state
- bowler state
- free-hit state
- innings progression
- match progression

### Why this subsystem matters

This is where the project's domain complexity lives.

It is more meaningful to portfolio reviewers than simply saying:

> "Implemented a cricket scoreboard."

---

# 35. Subsystem: Live Match Interface

### Frontend components

```text
LiveMatches.jsx
MatchView.jsx
ScoreHeader.jsx
BatterCard.jsx
BallControls.jsx
OverHistory.jsx
OverEntry.jsx
```

### Responsibilities

- show available live matches
- display current score
- display active players
- enter scoring events
- show over history
- update the UI as new state arrives

---

# 36. Subsystem: Scorecard & Match Results

### Components

```text
FullScorecard.jsx
MatchResult.jsx
```

### Responsibilities

- detailed match statistics
- innings information
- completed match state
- final result
- presentation of recorded match data

The scorecard is the analytical/read-oriented side of the match experience, while the scorer UI is the write-oriented side.

---

# 37. Subsystem: AI Match Summary

### Purpose

Generate a human-readable summary from structured match data.

Conceptual pipeline:

```text
Ball / innings / result data
            ↓
      Summary generation
            ↓
       Match summary
            ↓
        Presentation
```

The portfolio should emphasize the architecture:

> AI is applied after the match data has been structured and recorded.

Do not make AI the headline feature of GCB. The scoring and real-time architecture are the stronger engineering story.

---

# 38. Subsystem: Administration & Scorer Access

### Relevant frontend pieces

```text
MatchCreate.jsx
AdminDeleteMatches.jsx
PinModal.jsx
```

### Responsibilities

- match setup
- scorer PIN
- administrative match deletion
- controlled scoring operations

Again, do not exaggerate this into a full identity platform.

---

# 39. Portfolio Technical Work Items

If the portfolio supports individual technical work entries, use meaningful engineering work.

Good examples:

### Ball-Level Match State

**Problem**

A cricket score cannot safely be represented as one mutable total because each delivery affects multiple pieces of state.

**Implementation**

Persist individual ball events and derive/update innings state from those events.

**Impact**

Provides a structured foundation for scorecards, over history, result calculation, and future match analytics.

---

### Real-Time Match Synchronization

**Problem**

Live viewers should see scoring changes without manually refreshing.

**Implementation**

Use Socket.IO match rooms to broadcast authoritative backend updates to connected clients.

**Impact**

Multiple users can observe the same live match state in near real time.

---

### Scorer-Oriented UI

**Problem**

Ball entry requires frequent, context-sensitive actions.

**Implementation**

Break the match screen into dedicated components for ball controls, batter/bowler selection, over history, and score presentation.

**Impact**

Keeps the scoring workflow focused while allowing the rest of the match state to remain visible.

---

### Cricket-Specific State Handling

**Problem**

Cricket contains rules around legal deliveries, overs, wickets, striker changes, innings, and targets.

**Implementation**

Encode these transitions in backend match/scoring logic rather than treating scoring as simple arithmetic.

**Impact**

Makes the application capable of representing actual match progression.

---

### Full-Stack State Flow

**Problem**

The frontend and backend must remain consistent during a live match.

**Implementation**

Use REST for commands/data access, MongoDB for persistence, and Socket.IO for live propagation.

**Impact**

Creates a clear separation between authoritative server state and client presentation.

---

# 40. Links for the Portfolio

Use the actual project links:

```text
Frontend repository:
https://github.com/adityacoderr/GCB-Frontend

Backend repository:
https://github.com/adityacoderr/GCB-Backend

Live frontend:
https://gcb-frontend-henna.vercel.app
```

The portfolio should ideally expose:

- Live Demo
- Frontend GitHub
- Backend GitHub

If the existing portfolio link model only supports one GitHub URL, prefer the frontend repository as the primary project link and expose the backend separately if the data model allows it.

Do not replace repository links with invented URLs.

---

# 41. Portfolio Implementation Instructions for OpenCode

Before modifying the portfolio:

1. Inspect the portfolio's current project data model.
2. Inspect how projects are rendered.
3. Inspect how subsystems are rendered.
4. Inspect how `TechnicalWork` entries are rendered.
5. Inspect existing project entries to match their writing style.
6. Add GCB using the existing architecture.
7. Do not redesign the portfolio UI unless explicitly requested.
8. Do not create a separate one-off component only for GCB if the existing project system can represent it.
9. Reuse existing project/subsystem/technical-work components.
10. Keep GCB visually consistent with the rest of the portfolio.

---

# 42. Content Rules for the Portfolio

The portfolio copy should communicate engineering depth without becoming a README dump.

Project-level description:

- 1–3 sentences
- explain what GCB does
- mention real-time scoring
- mention ball-level/stateful match handling
- mention full-stack architecture

Subsystem descriptions:

- explain the engineering responsibility
- identify the important implementation idea
- avoid repeating the project description

Technical work:

- explain problem → implementation → consequence
- prioritize engineering decisions
- avoid marketing language

---

# 43. Recommended Project Description

Use or adapt this:

> GCB is a full-stack real-time cricket scoring and match management platform built around ball-level match state. It combines a React/Vite scorer and viewer interface with a Node.js/Express backend, MongoDB persistence, and Socket.IO synchronization so live match state can be recorded, persisted, and distributed to connected clients in real time.

---

# 44. Recommended Short Description

For cards/list views:

> Real-time full-stack cricket scoring platform with ball-by-ball state management, live Socket.IO synchronization, persistent match data, and scorer/viewer workflows.

---

# 45. Recommended Architecture Summary

For a detailed project view:

```text
React/Vite Frontend
        │
        ├── REST
        │
        └── Socket.IO
                │
                ▼
        Node.js / Express
                │
        ┌───────┴────────┐
        │                │
   Scoring Engine    Socket.IO
        │                │
        ▼                ▼
     MongoDB       Live Match Clients
```

---

# 46. What Makes This a Good Portfolio Project

The strongest story is not:

> "I made a cricket app."

The stronger story is:

> "I built a stateful, real-time system around a domain where a single event can cause multiple dependent state transitions."

That demonstrates useful software-engineering concepts:

```text
Domain modeling
State management
REST APIs
Persistent data
Real-time communication
Client/server synchronization
Validation
Component architecture
Event-driven updates
```

This is the angle the portfolio should communicate.

---

# 47. Final Acceptance Criteria

After OpenCode integrates GCB, verify all of the following:

### Data

- GCB exists as a project in the existing portfolio data source.
- Technologies are accurate.
- Repository links are accurate.
- Live demo URL is accurate.

### Content

- Description explains GCB as a full-stack real-time system.
- Ball-level scoring is mentioned.
- Socket.IO real-time behavior is mentioned.
- MongoDB/backend persistence is mentioned.
- Scorer/viewer workflows are represented.
- AI summary is represented only if the existing portfolio has room for it.

### Structure

- GCB uses the existing `Project` structure.
- GCB uses meaningful `Subsystem` entries.
- Technical work uses the existing `TechnicalWork` structure.
- No duplicate project-specific UI architecture is introduced unnecessarily.

### Accuracy

- No fabricated metrics.
- No fabricated users.
- No fabricated performance claims.
- No unsupported technologies.
- No claims of microservices.
- No claims of enterprise scale.
- No claims of full authentication unless supported by the current code.

### UI

- Existing portfolio visual language is preserved.
- Project cards remain consistent.
- Detailed project views remain consistent.
- Mobile layout remains intact.
- Existing projects are not visually broken.

### Verification

Run the portfolio's normal checks after modification:

```text
npm run build
```

and, if available:

```text
npm run lint
```

Then inspect the GCB project page manually.

---

# 48. Source-of-Truth Principle

This document describes the project based on the repositories inspected at the time it was written.

If the code and this document disagree, **the current code wins**.

Before adding any specific technical claim to the portfolio:

```text
Claim
  ↓
Find evidence in repository
  ↓
If verified → include it
If not verified → omit it
```

Do not infer technologies from what a similar application would normally use.

Do not infer architecture from filenames alone when source code can be inspected.

The goal is an accurate engineering portfolio entry, not an impressive-sounding fictional architecture.

---

# 49. One-Sentence Mental Model

If OpenCode needs to understand GCB in one sentence:

> **GCB is a full-stack, real-time cricket match system where a React-based scorer/viewer interacts with a Node.js backend that owns persistent ball-by-ball match state and broadcasts live updates to connected match clients.**
