# Homepage Additions — OpenCode Implementation Reference

## Purpose

This document defines three homepage additions for the portfolio:

1. **Download Resume** button
2. **Journey** timeline
3. **Achievements & Certifications** section

Use this document as the implementation reference for OpenCode.

The content below is based on the user's actual resume. Do not invent dates, roles, achievements, technologies, metrics, or career events that are not supported by the resume.

---

# 1. Homepage Placement

Recommended homepage order:

```text
Hero
  ↓
About / Introduction
  ↓
Journey
  ↓
Achievements & Certifications
  ↓
Featured Projects
  ↓
Skills / Technical Areas
  ↓
Contact
```

The exact placement can follow the portfolio's existing visual hierarchy if another nearby location fits better, but:

- Journey should appear relatively early because it explains the user's progression.
- Achievements should follow Journey or sit immediately before Projects.
- The Resume button should be available from the Hero/primary introduction area and can also be repeated in a suitable navigation/CTA location if the existing design supports it.

Do not redesign the entire homepage just to add these sections.

Reuse the portfolio's existing typography, spacing, cards, animations, colors, responsive behavior, and component conventions.

---

# 2. Download Resume

## Requirement

Add a clear **Download Resume** button.

The user will place the actual resume file in:

```text
public/resume.pdf
```

Therefore the browser-accessible path should be:

```text
/resume.pdf
```

Do not create a fake resume.

Do not link to:

- Google Drive
- Dropbox
- an external resume service
- an invented URL

The portfolio should serve the resume from its own `/public` asset.

---

## Expected Implementation

The source file will exist at:

```text
/public/resume.pdf
```

The button/link should target:

```text
/resume.pdf
```

Preferred behavior:

- open/download the real PDF
- work in production after deployment
- work during local development
- not depend on an external service

Example conceptual implementation:

```jsx
<a href="/resume.pdf" download>
  Download Resume
</a>
```

Whether the `download` attribute is used should follow the existing project conventions and desired browser behavior.

If the existing portfolio has a CTA/button component, reuse it rather than creating a completely separate button style.

---

## Resume Button UX

The button should be visually recognizable as a primary or secondary CTA.

Suggested label:

```text
Download Resume
```

Optional icon:

```text
Download
```

Do not overcomplicate the interaction.

The user should be able to understand immediately that clicking it accesses the resume.

---

## Verification

After implementation, verify:

```text
public/resume.pdf
       ↓
/resume.pdf
       ↓
Download Resume button
```

OpenCode should verify that the path is not broken.

If the actual `resume.pdf` is not yet present in the repository during implementation, do not fabricate one. The user will add it to `/public`.

---

# 3. Journey Timeline

## Purpose

Add a **Journey** section that communicates the user's engineering progression.

This should not simply become another project list.

The purpose is to answer:

> How did this engineer get from early technical/product work to their current systems/backend/infrastructure focus?

Use a timeline or chronological visual treatment consistent with the portfolio's existing design language.

---

# 4. Source of Journey Content

The attached resume is the source of truth.

Resume information:

### 2021–2022

**ONISORIGINALS**

**Founder / Technical Lead**

Resume states that the user:

- led technical architecture and development of e-commerce and internal software systems
- built web applications
- built backend APIs
- built automation workflows
- built operational dashboards
- managed engineering decisions across product development, deployment, and technical operations

Source:

```text
ONISORIGINALS — 2021–2022
Founder / Technical Lead
```

---

### 2023–2027

**Uttarakhand Technical University, Dehradun**

**B.Tech — Computer Science Engineering**

The resume lists:

```text
Uttarakhand Technical University, Dehradun
2023 – 2027
B.Tech — Computer Science Engineering
```

Do not change this into a completed degree.

The stated period is **2023–2027**.

---

### Systems / Distributed Systems Direction

The resume identifies the user's current engineering focus as:

```text
Software Engineer | Systems · Backend · Infrastructure
```

It also states a focus on:

- systems
- backend engineering
- distributed architectures

The resume describes **Yukti** as:

> A distributed data-system project with a custom storage engine.

It specifically mentions work around:

- distributed data-system architecture
- IDO
- UPE
- BIL
- Discovery
- custom Storage Engine
- immutable segments
- object/segment metadata
- read/write paths
- versioning
- recovery
- compaction
- garbage collection
- IDO binary format
- rebuildable Segment Directory
- metadata ownership
- storage-reclamation boundaries

Important:

**The resume does not provide dates for Yukti.**

Therefore, do not assign Yukti a fabricated year in the timeline.

---

### Real-Time / Backend Systems

The resume describes:

**AIRLINES-INDIGO — Flight Status & Notification System**

Technologies listed:

```text
React
Node.js
MongoDB
Socket.IO
Docker
```

The resume states that the system:

- is a containerized full-stack flight-status system
- uses REST APIs
- uses MongoDB persistence
- uses Socket.IO
- uses Docker and Docker Compose
- persists flight-status changes
- resolves subscribed passengers
- creates notification records
- pushes targeted real-time updates through user-specific Socket.IO rooms
- maintains persistent notification history
- maintains database-level subscription integrity
- supports live dashboard updates
- supports admin-triggered flight events

Again:

**The resume does not provide a project date.**

Do not place AIRLINES-INDIGO on a fabricated year in the chronological timeline.

---

# 5. Recommended Journey Narrative

Use the following as the conceptual progression:

```text
2021–2022
Founder / Technical Lead
ONISORIGINALS

Started by taking ownership of technical architecture,
product development, backend systems, automation,
deployment, and operational tooling.

        ↓

2023–2027
B.Tech — Computer Science Engineering
Uttarakhand Technical University

Formal computer science education alongside increasingly
systems-oriented engineering work.

        ↓

Systems & Backend Engineering
Current Engineering Direction

Developing deeper expertise in systems, backend engineering,
distributed architectures, Linux, networking, infrastructure,
and storage systems.

        ↓

Representative Systems Work
Yukti + AIRLINES-INDIGO

Building distributed storage architecture and real-time
backend systems involving persistent state, event-driven
updates, APIs, containers, and infrastructure.
```

The final two entries are **not dated career events**. They represent the user's engineering direction and representative work from the resume.

If the UI requires every timeline item to have a date, do not fake dates. Instead use labels such as:

```text
Current Focus
```

or:

```text
Systems Engineering
```

or:

```text
Recent Systems Work
```

---

# 6. Journey Design

Recommended visual structure:

```text
                    JOURNEY

2021–2022 ────────●
                  │
                  │ ONISORIGINALS
                  │ Founder / Technical Lead
                  │
                  ●
2023–2027 ────────
                  │ B.Tech CSE
                  │ Uttarakhand Technical University
                  │
                  ●
Current Focus ────
                  │ Systems · Backend · Infrastructure
                  │
                  ●
Representative ───
Systems Work      │ Yukti / AIRLINES-INDIGO
```

The exact layout can be:

- vertical timeline
- horizontal timeline
- alternating timeline cards

Choose whichever fits the current portfolio best.

Do not introduce an unnecessarily elaborate timeline library if a simple existing component/CSS implementation is sufficient.

---

# 7. Journey Content Rules

The Journey should communicate progression, not dump the entire resume.

Each timeline item should contain:

```text
Period / Label
Title
Organization or context
Short explanation
```

Keep each description concise.

Avoid copying all resume bullet points verbatim into the homepage.

The resume remains the detailed document.

The homepage Journey should act as a visual summary.

---

# 8. Achievements & Certifications

## Section Title

Recommended:

```text
Achievements & Certifications
```

Alternative:

```text
Achievements & Recognition
```

Prefer **Achievements & Certifications** because the list contains both competitive achievements and formal certifications.

---

# 9. Achievement Data

The resume confirms the following four entries:

### 1. 2× National Hackathon Winner

This should receive the strongest visual emphasis.

Display:

```text
2× National Hackathon Winner
```

Do not invent the names of the hackathons.

Do not invent years.

Do not invent prize amounts.

Do not invent participating organizations.

Do not invent project names.

Only state what is confirmed.

---

### 2. AWS Cloud Practitioner — ICT Academy

Display:

```text
AWS Cloud Practitioner
ICT Academy
```

or:

```text
AWS Cloud Practitioner — ICT Academy
```

Do not claim additional AWS certifications.

Do not invent a certification date.

Do not invent a credential ID.

---

### 3. NPTEL Certification — Programming in Java

Display:

```text
NPTEL Certification
Programming in Java
```

or:

```text
NPTEL Certification — Programming in Java
```

Do not invent a score, percentile, examination date, or certificate ID.

---

### 4. ISRO Hackathon Participant

Display:

```text
ISRO Hackathon Participant
```

Do not change this to:

```text
ISRO Hackathon Winner
```

The resume explicitly says **Participant**.

Do not invent the hackathon year, project, rank, or award.

---

# 10. Achievement Visual Hierarchy

Do not make all four entries visually identical.

The strongest hierarchy should be:

```text
2× National Hackathon Winner
        ↓
AWS Cloud Practitioner
NPTEL — Programming in Java
        ↓
ISRO Hackathon Participant
```

A possible layout:

```text
┌──────────────────────────────────────────────┐
│        ACHIEVEMENTS & CERTIFICATIONS         │
│                                              │
│  ★  2× National Hackathon Winner            │
│     National-level competitive achievement   │
│                                              │
│  AWS Cloud Practitioner     NPTEL             │
│  ICT Academy               Programming Java  │
│                                              │
│  ISRO Hackathon Participant                  │
└──────────────────────────────────────────────┘
```

The exact layout should follow the portfolio's existing design system.

---

# 11. Achievement Copy

Use concise supporting text.

Recommended:

### 2× National Hackathon Winner

> Winner at two national-level hackathons.

### AWS Cloud Practitioner — ICT Academy

> AWS cloud fundamentals certification through ICT Academy.

### NPTEL Certification — Programming in Java

> NPTEL certification in Programming in Java.

### ISRO Hackathon Participant

> Participated in an ISRO hackathon.

Do not add unsupported claims about what was built or learned unless the resume explicitly supports them.

---

# 12. Data Model Guidance

If the portfolio has a centralized data file, achievements and journey should preferably live in structured data rather than being hardcoded deep inside JSX.

Conceptually:

```js
const journey = [
  {
    period: "2021–2022",
    title: "Founder / Technical Lead",
    organization: "ONISORIGINALS",
    description: "..."
  },
  {
    period: "2023–2027",
    title: "B.Tech — Computer Science Engineering",
    organization: "Uttarakhand Technical University",
    description: "..."
  },
  {
    period: "Current Focus",
    title: "Systems · Backend · Infrastructure",
    organization: "Engineering Direction",
    description: "..."
  }
]

const achievements = [
  {
    title: "2× National Hackathon Winner",
    category: "Achievement"
  },
  {
    title: "AWS Cloud Practitioner",
    subtitle: "ICT Academy",
    category: "Certification"
  },
  {
    title: "NPTEL Certification",
    subtitle: "Programming in Java",
    category: "Certification"
  },
  {
    title: "ISRO Hackathon Participant",
    category: "Achievement"
  }
]
```

Adapt this to the portfolio's existing types.

Do not create a second competing data architecture if the project already has a suitable structure.

---

# 13. Relationship With Projects

Do not duplicate the entire project descriptions inside Journey.

Use Journey to establish progression:

```text
Founder / Product Engineering
        ↓
Formal CS Education
        ↓
Systems / Backend Direction
        ↓
Distributed + Real-Time Systems
```

Use Projects to provide the technical deep dives:

```text
Yukti
GCB
AIRLINES-INDIGO
Gait Recognition
Cricket Analysis
...
```

This keeps the homepage from becoming repetitive.

---

# 14. Resume as the Detailed Source

The homepage should summarize the resume.

The resume should remain the detailed artifact.

Therefore:

```text
Homepage
    = concise story

Resume
    = detailed professional document
```

The Download Resume CTA provides the deeper information for visitors who want it.

---

# 15. Accuracy Rules

These rules are mandatory.

### Do not invent dates

The resume only explicitly gives:

```text
ONISORIGINALS: 2021–2022
B.Tech: 2023–2027
```

Yukti and AIRLINES-INDIGO do not have dates in the resume.

### Do not change status

B.Tech is:

```text
2023–2027
```

not "graduated".

ISRO is:

```text
Participant
```

not "winner".

### Do not invent credentials

Do not add:

- credential IDs
- certificate URLs
- scores
- ranks
- dates
- issuing details

unless provided elsewhere.

### Do not inflate achievements

"2× National Hackathon Winner" is already strong.

Do not add unsupported claims such as:

```text
Top 1%
Best developer
National champion
Government-recognized innovator
```

unless verified.

---

# 16. Responsive Design

All three additions must work on:

```text
Desktop
Tablet
Mobile
```

For the Journey:

- timeline should collapse cleanly on narrow screens
- avoid horizontal overflow
- cards should remain readable
- dates/labels should not collide with the timeline

For Achievements:

- cards should stack appropriately
- the primary achievement should remain visually prominent

For Resume:

- CTA should remain accessible on mobile
- do not make the button depend on hover

---

# 17. Accessibility

Use semantic HTML where practical.

For the resume:

```html
<a href="/resume.pdf" download>
```

is preferable to a JavaScript-only click handler.

For Journey:

- use meaningful headings
- ensure timeline content remains understandable without visual positioning

For Achievements:

- use semantic headings/list structures
- icons should not be the only way to communicate meaning

Do not sacrifice accessibility for visual effects.

---

# 18. Animation

If the portfolio already uses animation:

- animate Journey entries subtly
- animate Achievement cards consistently
- avoid excessive motion

Do not add a large animation library solely for these sections.

Respect reduced-motion preferences if the existing project supports them.

---

# 19. Integration Checklist

OpenCode should complete the following.

## Resume

- [ ] Support `/public/resume.pdf`
- [ ] Add "Download Resume" CTA
- [ ] Link to `/resume.pdf`
- [ ] Do not create fake resume content
- [ ] Verify link behavior

## Journey

- [ ] Add Journey section
- [ ] Use resume as source of truth
- [ ] Include ONISORIGINALS — 2021–2022
- [ ] Include B.Tech — 2023–2027
- [ ] Represent current Systems / Backend / Infrastructure direction
- [ ] Reference Yukti and AIRLINES-INDIGO only as undated representative work unless another verified source supplies dates
- [ ] Do not invent chronology

## Achievements

- [ ] Add Achievements & Certifications section
- [ ] Add 2× National Hackathon Winner
- [ ] Add AWS Cloud Practitioner — ICT Academy
- [ ] Add NPTEL Certification — Programming in Java
- [ ] Add ISRO Hackathon Participant
- [ ] Give the hackathon win stronger visual emphasis
- [ ] Do not invent additional achievement details

## Design

- [ ] Reuse existing portfolio design language
- [ ] Preserve existing responsiveness
- [ ] Preserve existing animations/interactions
- [ ] Avoid unnecessary architectural/UI rewrites
- [ ] Verify existing sections still work

---

# 20. Final Homepage Mental Model

The homepage should tell this story:

```text
WHO I AM
    ↓
WHAT I'VE DONE
    ↓
HOW I GOT HERE
    ↓
WHAT I'VE ACHIEVED
    ↓
WHAT I'VE BUILT
    ↓
HOW TO CONTACT / EXPLORE MORE
```

The three additions fit into that story as:

```text
Journey
    → explains progression

Achievements & Certifications
    → establishes credibility

Download Resume
    → provides the detailed professional profile
```

The result should feel like an integrated part of the portfolio, not three unrelated widgets added to the homepage.

---

# 21. Source Reference

Primary source for Journey and Achievements:

**Aditya Pandey — Resume**

Relevant verified information:

```text
Software Engineer | Systems · Backend · Infrastructure

ONISORIGINALS
2021–2022
Founder / Technical Lead

Uttarakhand Technical University, Dehradun
2023–2027
B.Tech — Computer Science Engineering

Achievements:
• 2× National Hackathon Winner
• AWS Cloud Practitioner — ICT Academy
• NPTEL Certification — Programming in Java
• ISRO Hackathon Participant
```

The resume also identifies the user's systems/backend direction and projects including Yukti and AIRLINES-INDIGO.

Source-derived content must remain faithful to the resume.

If the portfolio repository contains newer, explicitly verified information, OpenCode may use that newer information where appropriate, but it must not contradict or fabricate resume details.

---

# 22. One-Line Implementation Summary

> Add a native `/resume.pdf` download CTA, a concise resume-derived engineering Journey timeline, and a visually prioritized Achievements & Certifications section, all integrated into the existing portfolio architecture and design system without inventing unsupported career details.
