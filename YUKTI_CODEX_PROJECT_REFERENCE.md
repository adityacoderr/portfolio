# YUKTI --- Codex Project Reference

**Document purpose:** This file gives Codex the minimum authoritative
context required to understand Yukti when implementing or presenting it
inside the engineering portfolio.

**Project status:** Active engineering project. Some
subsystems/specifications are frozen; others are still being designed.
Do not treat every concept mentioned here as implemented.

------------------------------------------------------------------------

# 1. Project Identity

## Name

**Yukti**

## Tagline

**Where Data Behaves**

## What Yukti is

Yukti is a **Distributed Database Management System (D-DBMS)** /
distributed data-system project.

The long-term vision is an intelligent data system where data placement
and behavior can be influenced by metadata, workload characteristics,
system state, and higher-level intelligence.

The current engineering work is deliberately narrower than the full
vision.

The current practical focus is the **core distributed-system foundation
and Storage Engine**.

------------------------------------------------------------------------

# 2. Important Scope Rule

Yukti contains many architectural ideas, but they are **not all
implemented today**.

Codex must distinguish between:

-   **implemented**
-   **designed**
-   **frozen specification**
-   **planned/future**

Never present a planned concept as implemented.

When the status of a feature is unknown, do not invent a status. Use
wording such as:

> Design work in progress.

or

> Planned / future subsystem.

------------------------------------------------------------------------

# 3. Current MVP Direction

The agreed MVP direction is a minimal distributed system containing the
core production-oriented components:

-   IDO
-   UPE
-   BIL
-   Discovery
-   Storage Engine

Advanced capabilities are intentionally deferred until the core system
is stable.

Deferred/future areas include:

-   HBF
-   prediction/intelligence beyond the current BIL/UPE scope
-   replication
-   consensus

This is an important architectural constraint.

Do not portray Yukti as already having a complete production-grade
distributed consensus/replication system.

------------------------------------------------------------------------

# 4. High-Level Architecture

The major conceptual pieces of Yukti include:

``` text
                         YUKTI
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
       IDO                UPE                BIL
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
                       Discovery
                           │
                    Storage Engine
```

There are additional architectural concepts such as HBF, but they are
not part of the current MVP implementation focus.

The portfolio should explain the architecture progressively rather than
presenting every historical/long-term concept as equally implemented.

------------------------------------------------------------------------

# 5. Core Architectural Components

## 5.1 IDO --- Intelligent Data Object

IDO is Yukti's data-object abstraction and has a defined binary
specification.

IDO is not simply a normal database row.

It carries data together with metadata needed by Yukti's data-management
model.

The IDO design is intentionally explicit about:

-   object identity
-   collection/tenant identity
-   version
-   timestamps
-   TTL
-   lifecycle
-   consistency
-   durability
-   priority
-   security
-   access semantics
-   payload type/format/properties

------------------------------------------------------------------------

# 6. IDO v1.1 --- Frozen Binary Specification

**Status: Frozen**

Important fields and layout decisions:

``` text
Magic                  4 B
SchemaVersion          2 B
HeaderFlags            4 B
TotalObjectLength      8 B
HeaderLength           2 B
HeaderChecksum         8 B
ObjectID              24 B recommended
CollectionID           4 B
TenantID               8 B
ObjectVersion          4 B
CreatedAt              8 B
LogicalTimestamp      12 B
TTL                    4 B
LifecycleFlags         4 B
ConsistencyClass       defined
DurabilityClass        defined
BusinessPriority       defined
SecurityLabelID        defined
AccessSemantics        defined
```

The IDO header is designed around a **128-byte header boundary** in the
frozen full-object format.

The payload begins at the 128-byte boundary.

The footer is 8-byte aligned.

The frozen specification uses:

-   `IDO1` as the magic
-   `uint64` total object length
-   XXHash64 for the header checksum
-   a 24-byte recommended ObjectID
-   a 12-byte logical/hybrid timestamp

The payload section contains:

-   PayloadType
-   PayloadFormat
-   PayloadProperties
-   PayloadLength
-   Payload

------------------------------------------------------------------------

# 7. IDO Small-Object Considerations

Two size-oriented modes were discussed:

## Minimal IDO Mode

For very small objects, approximately below 512 bytes, a compact header
around the 48--64 byte range may be used.

This is an optimization concept and should not be represented as the
same thing as the frozen full IDO v1.1 layout unless explicitly
specified.

## Paged Small Objects

Very small payloads, approximately below 64 bytes, may be packed as
multiple IDOs into a page/block.

Again, treat this as a design optimization rather than automatically
claiming it is implemented.

------------------------------------------------------------------------

# 8. Storage Engine

The Storage Engine is one of the main current engineering efforts in
Yukti.

The storage-engine design is deliberately **not being framed as a
generic LSM-tree or B+Tree implementation**.

The design centers around Yukti's own object/segment/page model.

Major storage-engine areas include:

``` text
Storage Engine
│
├── Disk Layout
├── Segment File Format
├── Page Format
├── Object Directory
├── Segment Directory
├── Write Path
├── Read Path
├── Delete & Versioning
├── Recovery & Checkpointing
├── Compaction
└── Garbage Collection
```

This sequence represents the storage-engine design progression.

------------------------------------------------------------------------

# 9. Storage Engine Design Sequence

The established conceptual sequence is:

1.  Disk Layout Specification
2.  Segment File Format
3.  Page Format
4.  Object Directory
5.  Write Path
6.  Read Path
7.  Delete & Versioning
8.  Recovery & Checkpointing
9.  Compaction
10. Garbage Collection

This ordering should be preserved when describing the evolution of the
storage engine.

------------------------------------------------------------------------

# 10. Segment Model

Yukti's storage engine uses **segments** as an important
physical/logical storage unit.

The underlying design assumes immutable segment data.

This has major consequences for:

-   updates
-   versions
-   deletion
-   compaction
-   garbage collection
-   metadata management

Updates are handled through append-oriented/versioned storage rather
than modifying an existing immutable segment in place.

------------------------------------------------------------------------

# 11. Segment Directory v1.2 --- Frozen Architecture

**Status: Frozen**

The Segment Directory is the engine-wide metadata index of all segments.

Its fundamental question is:

> Which segments exist, what state is each one in, and where is it
> located?

Naming aligns with other engine metadata structures:

-   Object Directory
-   Page Directory
-   Segment Directory

------------------------------------------------------------------------

# 12. Segment Directory Authority Model

The Segment Directory follows a **derived-index principle**.

## Authoritative sources

### Segment Headers

Live segment metadata.

### Tombstone Log

Records deleted segments.

These are authoritative.

A persisted Segment Directory snapshot is a **startup optimization**,
not the ultimate source of truth.

The directory must be rebuildable from the authoritative sources.

------------------------------------------------------------------------

# 13. Segment Directory Mutation Rule

The Segment Directory API exclusively mutates `SegmentState`.

The directory owns segment metadata.

The Storage Manager owns physical storage.

These responsibilities must not be mixed.

------------------------------------------------------------------------

# 14. Segment Deletion / Reclamation

The sole deletion path is:

``` text
RECLAIMABLE
     ↓
 DELETED
```

Before physical storage is released:

1.  the tombstone must be durably written/fsynced
2.  the segment's metadata transition must be represented correctly
3.  only then may the Storage Manager release physical storage

This ordering exists to prevent metadata/physical-storage inconsistency.

------------------------------------------------------------------------

# 15. Storage Locator

The Segment Directory uses an **opaque, backend-independent
StorageLocator**.

The directory should not become tightly coupled to a particular physical
storage backend.

This keeps metadata ownership separate from physical storage
implementation.

------------------------------------------------------------------------

# 16. Segment IDs

Segment IDs are:

-   sequential
-   never reused

Do not introduce ID reuse unless the architecture is explicitly changed
later.

------------------------------------------------------------------------

# 17. Segment Directory Rebuildability

Rebuildability is part of the architectural contract.

The Segment Directory can be reconstructed from its authoritative
sources.

This means the persisted directory snapshot is an optimization for
startup, not the sole authority.

------------------------------------------------------------------------

# 18. Compaction

Compaction is a major current Storage Engine design area.

The reason compaction exists is fundamentally connected to these
storage-engine properties:

1.  data is immutable
2.  updates are append-oriented
3.  multiple versions of the same key/object can coexist

Conceptually:

``` text
t1:
A → 10

t2:
A → 20

t3:
A → 30
```

The old versions cannot simply be overwritten in-place inside immutable
segments.

Over time this produces:

-   obsolete versions
-   tombstones
-   dead data
-   read amplification
-   unnecessary storage consumption
-   fragmented useful data

Compaction reorganizes storage to eliminate data that is no longer
needed and improve storage/read behavior.

------------------------------------------------------------------------

# 19. Segment Cleaner / Compaction Direction

A major conceptual direction discussed for Yukti is a **Segment
Cleaner**.

The Segment Cleaner should not blindly compact everything.

The design explores evaluating segment health and selecting work based
on measurable characteristics.

One candidate concept is a **Segment Health Score**.

Potential inputs may include things such as:

-   obsolete/dead data ratio
-   live-data density
-   version density
-   tombstone density
-   fragmentation
-   read relevance
-   reclaimable space
-   age

The exact final formula is **not frozen yet**.

Therefore:

**Do not invent or hardcode a final Segment Health Score formula in
portfolio content.**

The scoring model is still a design discussion area.

------------------------------------------------------------------------

# 20. Compaction Status

Compaction has been discussed and architected deeply, but formula-level
details are still being finalized.

Therefore describe it accurately as:

> A designed Storage Engine subsystem responsible for reclaiming
> obsolete versions/dead data and reorganizing immutable segments.

Do not claim measured compaction performance unless actual benchmark
data exists.

------------------------------------------------------------------------

# 21. Garbage Collection

Garbage Collection follows compaction in the storage-engine design.

The conceptual distinction is:

-   **Compaction** determines/reorganizes useful versus obsolete data
    and produces cleaner storage.
-   **Garbage Collection** is responsible for safely reclaiming storage
    that is no longer needed.

Do not collapse these two concepts into one generic "cleanup" operation.

------------------------------------------------------------------------

# 22. FSM

FSM is part of Yukti's broader engineering work.

When displaying FSM-related work, preserve the distinction between:

-   FSM as a technical subsystem/design
-   Yukti as the parent project
-   portfolio-wide LLD/System Design perspectives

FSM should therefore appear under Yukti's technical work rather than
becoming a separate portfolio project.

If exact FSM states/transitions are not present in the source material,
do not invent them.

------------------------------------------------------------------------

# 23. UPE --- Unified Placement Engine

UPE is a core Yukti component in the MVP architecture.

Its purpose is related to placement decisions.

Earlier Yukti design work includes concepts such as:

-   Node Evaluation
-   Resource Score
-   Placement Decision Score
-   Placement Stability Controller
-   Memory Intelligence Score

These should not automatically be presented as fully implemented
features.

When exact implementation status is unknown, classify them as
architectural/design concepts.

------------------------------------------------------------------------

# 24. BIL --- Behavior Intelligence Layer

BIL is another core Yukti MVP component.

Its role is to provide behavior/workload intelligence that can inform
higher-level decisions.

BIL is part of the current MVP architecture.

Do not claim advanced predictive intelligence unless the corresponding
implementation actually exists.

------------------------------------------------------------------------

# 25. HBF --- Hierarchical Behavior Fabric

HBF is a broader/advanced Yukti architectural concept.

It is **not part of the current minimal MVP implementation focus**.

Treat it as future/deferred architecture.

Do not present HBF as implemented.

------------------------------------------------------------------------

# 26. Discovery / Networking

Discovery is part of the core MVP.

The broader Yukti direction places significant importance on networking
and node discovery.

The networking/discovery layer is intended to support a distributed
system rather than a single-node database.

The project has considered Go as an important language for
networking/concurrency work.

Do not fabricate a finalized discovery protocol if it has not been
explicitly implemented.

------------------------------------------------------------------------

# 27. Query Layer

The Query Layer is conceptually the interface between the
database/user-facing interaction layer and the underlying system.

However, it should not be confused with the current Storage Engine
implementation.

The Storage Engine is being built as an independently understandable
subsystem.

Query-layer work may proceed later or in parallel.

------------------------------------------------------------------------

# 28. Storage Engine vs Query Layer

Important conceptual separation:

``` text
User / Query
     ↓
Query Layer
     ↓
Yukti Core
     ↓
Storage Engine
     ↓
Disk
```

The Storage Engine should not be represented as the entire database.

It is the persistence subsystem underneath the broader Yukti system.

------------------------------------------------------------------------

# 29. Portfolio Representation

When Yukti appears in the portfolio, the preferred hierarchy is:

``` text
Projects
└── Yukti
    ├── Overview
    ├── Architecture
    ├── Storage Engine
    │   ├── Segment Directory
    │   ├── Segment Format
    │   ├── Page Format
    │   ├── Object Directory
    │   ├── Write Path
    │   ├── Read Path
    │   ├── Versioning
    │   ├── Compaction
    │   └── Garbage Collection
    ├── FSM
    ├── UPE
    ├── BIL
    └── Engineering Decisions
```

Individual technical pieces can also be surfaced through the portfolio's
broader engineering pillars:

``` text
System Design
Low-Level Design
Mathematics
Implementation
```

But the canonical ownership remains:

> **Technical Work → Yukti → relevant subsystem**

------------------------------------------------------------------------

# 30. Important Portfolio Rule

Do not build the portfolio around Yukti.

The portfolio contains multiple projects.

Yukti is simply currently one of the deepest technical projects.

The architecture must allow:

``` text
Projects
├── Yukti
├── Flight Status System
├── Project X
└── Future Projects
```

without redesigning the website.

------------------------------------------------------------------------

# 31. Engineering Storytelling

When writing about Yukti, prioritize engineering reasoning.

Use the pattern:

``` text
Why does this problem exist?
        ↓
What constraints does Yukti impose?
        ↓
What design was chosen?
        ↓
Why?
        ↓
What alternatives were rejected?
        ↓
How is it implemented?
        ↓
How is it measured?
        ↓
What are the trade-offs?
```

Do not turn technical pages into marketing copy.

------------------------------------------------------------------------

# 32. Frozen vs Unfrozen Information

## Frozen / authoritative

-   Yukti project identity
-   Current MVP direction
-   IDO v1.1 binary specification
-   Segment Directory v1.2 architecture
-   Segment Directory authority model
-   Segment deletion/reclamation rules
-   Storage ownership boundaries
-   Storage Locator abstraction
-   sequential/non-reused Segment IDs
-   Storage Engine design sequence

## Still evolving

-   Segment Health Score formula
-   final compaction scoring/selection formulas
-   some higher-level intelligence details
-   future replication/consensus architecture
-   exact future Query Layer design
-   advanced HBF behavior

When in doubt, prefer the frozen specification and avoid claiming an
unfrozen concept is final.

------------------------------------------------------------------------

# 33. What Codex Must Not Do

Do not:

-   invent Yukti features
-   invent benchmarks
-   invent performance numbers
-   claim replication exists if it is deferred
-   claim consensus exists if it is deferred
-   claim HBF is implemented
-   claim prediction is implemented without evidence
-   invent final compaction formulas
-   invent FSM states
-   rewrite frozen specifications casually
-   turn design discussions into implementation claims
-   make Yukti the entire portfolio
-   create separate top-level projects for Yukti subsystems

------------------------------------------------------------------------

# 34. Source-of-Truth Principle

When implementing the portfolio:

1.  Prefer actual Yukti repository/code when available.
2.  Prefer frozen specifications/design documents.
3.  Treat design discussions as design material, not implementation
    evidence.
4.  Never fill missing facts with guesses.

If repository evidence conflicts with this document, stop and flag the
conflict rather than silently inventing a resolution.

------------------------------------------------------------------------

# 35. Yukti's Position in the Portfolio

Yukti is especially useful for demonstrating all four engineering
pillars:

``` text
                YUKTI
                  │
       ┌──────────┼──────────┐
       ↓          ↓          ↓
 System Design   LLD    Mathematics
       │          │          │
       └──────────┼──────────┘
                  ↓
             Implementation
```

Examples:

### System Design

-   distributed architecture
-   storage-engine architecture
-   discovery
-   placement
-   compaction architecture

### Low-Level Design

-   IDO binary layout
-   segment format
-   page format
-   Segment Directory
-   state transitions
-   storage ownership boundaries

### Mathematics

-   scoring models
-   placement scoring
-   segment-health modeling
-   complexity/performance reasoning

### Implementation

-   storage engine
-   networking
-   discovery
-   actual Go/code implementations
-   tests
-   benchmarks

The exact content under each pillar must be backed by actual project
work.

------------------------------------------------------------------------

# 36. Final Mental Model

Codex should understand Yukti as:

> **A distributed data-system project whose current engineering focus is
> building a solid core and Storage Engine, while the larger
> architecture explores intelligent data behavior and placement.**

And it should understand the relationship as:

``` text
PORTFOLIO
│
├── PROJECT: Yukti
│   ├── Storage Engine
│   │   ├── Segment Directory
│   │   ├── Compaction
│   │   ├── Garbage Collection
│   │   └── ...
│   ├── FSM
│   ├── UPE
│   ├── BIL
│   └── ...
│
├── PROJECT: Flight Status System
│   └── ...
│
└── FUTURE PROJECTS
```

The portfolio is the container.

Yukti is a project.

Compaction, FSM, Segment Directory, etc. are technical work inside
Yukti.

System Design, LLD, Mathematics, and Implementation are cross-cutting
engineering perspectives.

That distinction must remain intact throughout the website.
