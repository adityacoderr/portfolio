import type { EngineeringNote, Pillar, Project, Subsystem, TechnicalWork } from "../types";

export const pillars: Pillar[] = [
  {
    id: "system-design",
    title: "System Design",
    shortTitle: "System",
    description:
      "Architecture, boundaries, data flow, consistency, scalability, and failure modes.",
    topics: [
      "Distributed systems",
      "Storage systems",
      "Fault tolerance",
      "Consistency",
      "Networking",
      "Architectural trade-offs"
    ]
  },
  {
    id: "low-level-design",
    title: "Low-Level Design",
    shortTitle: "LLD",
    description:
      "Interfaces, state machines, data structures, serialization, module boundaries, and error paths.",
    topics: [
      "Data structures",
      "State machines",
      "File formats",
      "Concurrency",
      "APIs",
      "Error handling"
    ]
  },
  {
    id: "mathematics",
    title: "Mathematics",
    shortTitle: "Math",
    description:
      "Reasoning with probability, discrete structures, complexity, models, and performance limits.",
    topics: [
      "Algorithms",
      "Complexity",
      "Probability",
      "Graph theory",
      "Optimization",
      "Performance modeling"
    ]
  },
  {
    id: "implementation",
    title: "Implementation",
    shortTitle: "Build",
    description:
      "Turning designs into working software through code, tests, profiling, and measurements.",
    topics: [
      "Code",
      "Testing",
      "Benchmarks",
      "Profiling",
      "Failure handling",
      "Real-world constraints"
    ]
  }
];

const yuktiSubsystems: Subsystem[] = [
  {
    id: "architecture",
    title: "Architecture",
    description:
      "Project-level component boundaries. The agreed MVP is a minimal distributed system: IDO, UPE, BIL, Discovery, and the Storage Engine. HBF, replication, and consensus are deferred."
  },
  {
    id: "ido",
    title: "IDO",
    description:
      "The Intelligent Data Object is Yukti's data-object abstraction, carrying data together with the metadata the data-management model needs."
  },
  {
    id: "storage-engine",
    title: "Storage Engine",
    description:
      "The persistence subsystem underneath the broader system, built around Yukti's own object/segment/page model and immutable segments.",
    children: [
      {
        id: "segment-directory",
        title: "Segment Directory",
        description: "Engine-wide metadata index of all segments."
      },
      {
        id: "segment-format",
        title: "Segment Format",
        description: "Physical/logical layout of a segment file."
      },
      {
        id: "page-format",
        title: "Page Format",
        description: "Layout of pages within segments."
      },
      {
        id: "object-directory",
        title: "Object Directory",
        description: "Locating objects within segments."
      },
      {
        id: "write-path",
        title: "Write Path",
        description: "Flow from accepted write to durable representation."
      },
      {
        id: "read-path",
        title: "Read Path",
        description: "Flow from lookup request to returned versioned data."
      },
      {
        id: "versioning",
        title: "Versioning",
        description: "Rules for version identity, visibility, and retention."
      },
      {
        id: "compaction",
        title: "Compaction",
        description: "Reorganization of stored segments and obsolete records."
      },
      {
        id: "garbage-collection",
        title: "Garbage Collection",
        description: "Safe reclamation of storage no longer needed."
      }
    ]
  },
  {
    id: "upe",
    title: "UPE",
    description:
      "Unified Placement Engine (core MVP component related to placement decisions)."
  },
  {
    id: "bil",
    title: "BIL",
    description:
      "Behavior Intelligence Layer (core MVP component providing behavior/workload intelligence)."
  },
  {
    id: "discovery",
    title: "Discovery",
    description:
      "Node discovery and networking layer supporting distributed operation. Protocol details are not fabricated."
  },
  {
    id: "engineering-decisions",
    title: "Engineering Decisions",
    description: "Decision records and trade-off notes for Yukti."
  }
];

export const projects: Project[] = [
  {
    id: "yukti",
    name: "Yukti",
    tagline: "Where Data Behaves",
    shortDescription:
      "A distributed data-system project whose current engineering focus is building a solid core and Storage Engine, while the larger architecture explores intelligent data behavior and placement.",
    longDescription:
      "Yukti is a Distributed Database Management System (D-DBMS) project. The long-term vision is an intelligent data system where data placement and behavior can be influenced by metadata, workload characteristics, system state, and higher-level intelligence. The current engineering work is deliberately narrower: the agreed MVP is a minimal distributed system containing the core production-oriented components (IDO, UPE, BIL, Discovery, and the Storage Engine). Advanced capabilities such as HBF, replication, consensus, and prediction beyond the current BIL/UPE scope are deferred until the core system is stable.",
    status: "Active engineering project",
    technologies: [],
    pillars: ["system-design", "low-level-design", "mathematics", "implementation"],
    subsystems: yuktiSubsystems,
    links: [],
    featured: true
  },
  {
    id: "airlines-indigo",
    name: "AIRLINES-INDIGO",
    tagline: "Flight Status & Notification System",
    shortDescription:
      "A containerized full-stack flight-status and notification system that combines REST APIs, MongoDB persistence, and Socket.IO real-time delivery to propagate flight-status changes to subscribed passengers.",
    longDescription:
      "AIRLINES-INDIGO is a full-stack application that simulates an airline flight-status notification system. Passengers can view flights and flight details, subscribe to flight updates, receive real-time status updates and notifications, and view notification history. An admin can use a dashboard to change flight status (On Time, Delayed, Cancelled, Boarding, Departed), update gate information, and trigger notifications to passengers subscribed to the affected flight. The core engineering story is propagating a persistent flight-state change to exactly the users who care about it while retaining notification history: persistent state, REST, MongoDB persistence, Socket.IO event delivery, subscriber-specific routing, and notification history.",
    status: "Full-stack real-time system",
    technologies: [
      "React",
      "Vite",
      "Tailwind CSS",
      "Node.js",
      "Express",
      "Socket.IO",
      "MongoDB",
      "Mongoose",
      "Docker",
      "Docker Compose"
    ],
    pillars: ["system-design", "low-level-design", "implementation"],
    subsystems: [
      {
        id: "architecture",
        title: "Architecture",
        description: "Full-stack architecture: frontend, backend, MongoDB, REST, and Socket.IO."
      },
      {
        id: "rest-api",
        title: "REST API",
        description: "Routes, controllers, services, and validation behind /api."
      },
      {
        id: "real-time-layer",
        title: "Real-Time Layer",
        description: "Socket.IO delivery of flight updates and targeted notifications."
      },
      {
        id: "subscription-system",
        title: "Subscription System",
        description: "Passenger subscriptions and subscriber-specific routing."
      },
      {
        id: "notification-pipeline",
        title: "Notification Pipeline",
        description: "Persisted notifications plus live Socket.IO delivery."
      },
      {
        id: "database-design",
        title: "Database Design",
        description: "MongoDB data models, relationships, and integrity constraints."
      },
      {
        id: "docker-infrastructure",
        title: "Docker / Docker Compose",
        description: "Containerized multi-service local environment."
      },
      {
        id: "frontend",
        title: "Frontend",
        description: "React UI with REST (Axios) and Socket.IO client communication."
      }
    ],
    links: [
      {
        label: "Source",
        href: "https://github.com/adityacoderr/AIRLINES-INDIGO"
      }
    ],
    featured: true
  }
];

export const technicalWorks: TechnicalWork[] = [
  {
    id: "yukti-mvp-architecture",
    title: "MVP Architecture",
    projectId: "yukti",
    subsystemId: "architecture",
    pillars: ["system-design"],
    type: "design-record",
    tags: ["architecture", "mvp", "distributed-systems"],
    summary:
      "The agreed MVP is a minimal distributed system with five core components (IDO, UPE, BIL, Discovery, and the Storage Engine), while advanced capabilities such as replication, consensus, and HBF are explicitly deferred.",
    sections: [
      {
        label: "Problem",
        blocks: [
          {
            kind: "paragraph",
            text: "Yukti is a Distributed Database Management System (D-DBMS) project. The long-term vision is an intelligent data system where data placement and behavior can be influenced by metadata, workload characteristics, system state, and higher-level intelligence. The current engineering work is deliberately narrower than the full vision."
          }
        ]
      },
      {
        label: "Constraints",
        blocks: [
          {
            kind: "list",
            items: [
              "The agreed MVP is a minimal distributed system containing the core production-oriented components: IDO, UPE, BIL, Discovery, and the Storage Engine.",
              "Advanced capabilities are intentionally deferred until the core system is stable.",
              "Deferred areas include HBF, prediction beyond the current BIL/UPE scope, replication, and consensus."
            ]
          }
        ]
      },
      {
        label: "Architecture",
        blocks: [
          {
            kind: "code",
            label: "Component diagram",
            language: "text",
            code: "                         YUKTI\n                           |\n        ┌──────────────────┼──────────────────┐\n        │                  │                  │\n       IDO                UPE                BIL\n        │                  │                  │\n        └──────────────────┼──────────────────┘\n                           |\n                       Discovery\n                           |\n                    Storage Engine"
          },
          {
            kind: "paragraph",
            text: "There are additional architectural concepts such as HBF, but they are not part of the current MVP implementation focus. The architecture is explained progressively rather than presenting every historical or long-term concept as equally implemented."
          }
        ]
      },
      {
        label: "Layer boundaries",
        blocks: [
          {
            kind: "paragraph",
            text: "The Storage Engine is the persistence subsystem underneath the broader system. It is not the entire database, and it is built as an independently understandable subsystem."
          },
          {
            kind: "flow",
            steps: ["User / Query", "Query Layer", "Yukti Core", "Storage Engine", "Disk"]
          },
          {
            kind: "paragraph",
            text: "The Query Layer is conceptually the interface between the database/user-facing interaction layer and the underlying system, but it should not be confused with the current Storage Engine implementation."
          }
        ]
      },
      {
        label: "Status",
        blocks: [
          {
            kind: "callout",
            variant: "warning",
            text: "The MVP direction is agreed. Replication, consensus, and HBF are deferred; prediction beyond the current BIL/UPE scope must not be presented as implemented."
          }
        ]
      }
    ],
    relatedNoteIds: []
  },
  {
    id: "yukti-storage-engine-model",
    title: "Storage Engine: Model and Design Sequence",
    projectId: "yukti",
    subsystemId: "storage-engine",
    pillars: ["system-design", "low-level-design"],
    type: "design-record",
    tags: ["storage-engine", "segments", "design-sequence"],
    summary:
      "The Storage Engine is one of Yukti's main current engineering efforts. It is deliberately not framed as a generic LSM-tree or B+Tree implementation, and centers on Yukti's own object/segment/page model built around immutable segments.",
    sections: [
      {
        label: "Problem",
        blocks: [
          {
            kind: "paragraph",
            text: "The Storage Engine is one of the main current engineering efforts in Yukti. Its design is deliberately not being framed as a generic LSM-tree or B+Tree implementation; it centers around Yukti's own object/segment/page model."
          }
        ]
      },
      {
        label: "Segment model",
        blocks: [
          {
            kind: "paragraph",
            text: "Yukti's storage engine uses segments as an important physical/logical storage unit. The underlying design assumes immutable segment data. Updates are handled through append-oriented, versioned storage rather than modifying an existing immutable segment in place."
          },
          {
            kind: "paragraph",
            text: "Immutability has major consequences for updates, versions, deletion, compaction, garbage collection, and metadata management; it is the reason the later engine areas exist."
          }
        ]
      },
      {
        label: "Design sequence",
        blocks: [
          {
            kind: "paragraph",
            text: "The established conceptual sequence for the storage-engine design is preserved as the documentation order."
          },
          {
            kind: "flow",
            steps: [
              "Disk Layout Specification",
              "Segment File Format",
              "Page Format",
              "Object Directory",
              "Write Path",
              "Read Path",
              "Delete & Versioning",
              "Recovery & Checkpointing",
              "Compaction",
              "Garbage Collection"
            ]
          }
        ]
      },
      {
        label: "Boundaries",
        blocks: [
          {
            kind: "paragraph",
            text: "The Storage Engine should not be represented as the entire database. It is the persistence subsystem underneath the broader Yukti system. Query-layer work may proceed later or in parallel, but the Storage Engine is built as an independently understandable subsystem."
          }
        ]
      }
    ],
    relatedNoteIds: []
  },
  {
    id: "yukti-segment-directory-v12",
    title: "Segment Directory: Derived-Index Architecture",
    projectId: "yukti",
    subsystemId: "segment-directory",
    pillars: ["system-design", "low-level-design"],
    type: "specification",
    tags: ["metadata", "directory", "specification"],
    summary:
      "The engine-wide metadata index of all segments. It follows a derived-index principle: the persisted snapshot is a startup optimization, and the directory must be rebuildable from authoritative sources.",
    sections: [
      {
        label: "Problem",
        blocks: [
          {
            kind: "paragraph",
            text: "The Segment Directory is the engine-wide metadata index of all segments. Its fundamental question is: which segments exist, what state is each one in, and where is it located?"
          }
        ]
      },
      {
        label: "Authority model",
        blocks: [
          {
            kind: "paragraph",
            text: "The Segment Directory follows a derived-index principle. The authoritative sources are the segment headers (live segment metadata) and the Tombstone Log (records of deleted segments). A persisted Segment Directory snapshot is a startup optimization, not the ultimate source of truth. The directory must be rebuildable from the authoritative sources."
          }
        ]
      },
      {
        label: "Mutation rule",
        blocks: [
          {
            kind: "paragraph",
            text: "The Segment Directory API exclusively mutates SegmentState. The directory owns segment metadata; the Storage Manager owns physical storage. These responsibilities must not be mixed."
          }
        ]
      },
      {
        label: "Deletion path",
        blocks: [
          {
            kind: "flow",
            steps: ["RECLAIMABLE", "DELETED"]
          },
          {
            kind: "paragraph",
            text: "Before physical storage is released: the tombstone must be durably written/fsynced, the segment's metadata transition must be represented correctly, and only then may the Storage Manager release physical storage. This ordering exists to prevent metadata/physical-storage inconsistency."
          }
        ]
      },
      {
        label: "Design decisions",
        blocks: [
          {
            kind: "list",
            items: [
              "StorageLocator is opaque and backend-independent; the directory is not tightly coupled to a particular physical storage backend.",
              "Segment IDs are sequential and never reused.",
              "Rebuildability is part of the architectural contract, which means the persisted snapshot is an optimization for startup, not the sole authority."
            ]
          }
        ]
      },
      {
        label: "Status",
        blocks: [
          {
            kind: "callout",
            text: "Status: Architecture locked; design record current."
          }
        ]
      }
    ],
    relatedNoteIds: []
  },
  {
    id: "yukti-compaction",
    title: "Storage Engine Compaction",
    projectId: "yukti",
    subsystemId: "compaction",
    pillars: ["system-design", "low-level-design", "implementation"],
    type: "case-study",
    tags: ["storage-engine", "compaction", "trade-offs"],
    summary:
      "A designed Storage Engine subsystem responsible for reclaiming obsolete versions and dead data by reorganizing immutable segments. The selection and scoring model is still being finalized.",
    sections: [
      {
        label: "Problem",
        blocks: [
          {
            kind: "paragraph",
            text: "Compaction exists because of the storage engine's core properties: data is immutable, updates are append-oriented, and multiple versions of the same key/object can coexist. Old versions cannot simply be overwritten in place inside immutable segments."
          }
        ]
      },
      {
        label: "Model",
        blocks: [
          {
            kind: "code",
            label: "Version stack for one object",
            language: "text",
            code: "t1:  A → 10\nt2:  A → 20\nt3:  A → 30"
          },
          {
            kind: "paragraph",
            text: "Over time this produces obsolete versions, tombstones, dead data, read amplification, unnecessary storage consumption, and fragmented useful data. Compaction reorganizes storage to eliminate data that is no longer needed and improve storage and read behavior."
          }
        ]
      },
      {
        label: "Design direction",
        blocks: [
          {
            kind: "paragraph",
            text: "A major conceptual direction is a Segment Cleaner: rather than blindly compacting everything, the design explores evaluating segment health and selecting work based on measurable characteristics."
          }
        ]
      },
      {
        label: "Status",
        blocks: [
          {
            kind: "callout",
            variant: "warning",
            text: "The selection and scoring model is still a design discussion area. Do not claim measured compaction performance unless actual benchmark data exists."
          }
        ]
      }
    ],
    relatedNoteIds: ["compaction-note"]
  },
  {
    id: "yukti-garbage-collection",
    title: "Garbage Collection: Safe Reclamation",
    projectId: "yukti",
    subsystemId: "garbage-collection",
    pillars: ["system-design", "low-level-design"],
    type: "technical-note",
    tags: ["storage-engine", "garbage-collection"],
    summary:
      "Garbage Collection follows compaction in the storage-engine design. Compaction determines and reorganizes useful versus obsolete data; Garbage Collection safely reclaims storage that is no longer needed.",
    sections: [
      {
        label: "Problem",
        blocks: [
          {
            kind: "paragraph",
            text: "After compaction has determined what is useful and reorganized storage, there remains the separate problem of reclaiming physical storage that is no longer needed. This is not the same operation as compaction."
          }
        ]
      },
      {
        label: "Compaction vs Garbage Collection",
        blocks: [
          {
            kind: "list",
            items: [
              "Compaction determines and reorganizes useful versus obsolete data, and produces cleaner storage.",
              "Garbage Collection is responsible for safely reclaiming storage that is no longer needed."
            ]
          }
        ]
      },
      {
        label: "Status",
        blocks: [
          {
            kind: "callout",
            variant: "info",
            text: "These two concepts must not be collapsed into one generic 'cleanup' operation."
          }
        ]
      }
    ],
    relatedNoteIds: ["garbage-collection-note"]
  },
  {
    id: "yukti-upe-bil",
    title: "UPE and BIL: Placement and Behavior Intelligence",
    projectId: "yukti",
    subsystemId: "upe",
    pillars: ["system-design", "mathematics"],
    type: "design-record",
    tags: ["placement", "intelligence", "mvp"],
    summary:
      "UPE and BIL are core MVP components. UPE is related to placement decisions; BIL provides behavior/workload intelligence that informs higher-level decisions. Both are architectural/design concepts until implementation is verified.",
    sections: [
      {
        label: "Problem",
        blocks: [
          {
            kind: "paragraph",
            text: "A distributed data system must decide where data lives and how the system behaves under changing workloads. In the MVP architecture these responsibilities are assigned to UPE (placement) and BIL (behavior intelligence)."
          }
        ]
      },
      {
        label: "UPE",
        blocks: [
          {
            kind: "paragraph",
            text: "UPE (the Unified Placement Engine) is a core MVP component whose purpose is related to placement decisions. Earlier design work includes the following concepts:"
          },
          {
            kind: "list",
            items: [
              "Node Evaluation",
              "Resource Score",
              "Placement Decision Score",
              "Placement Stability Controller",
              "Memory Intelligence Score"
            ]
          },
          {
            kind: "callout",
            variant: "warning",
            text: "These are architectural/design concepts and should not automatically be presented as fully implemented features. When exact implementation status is unknown, classify them as architectural concepts."
          }
        ]
      },
      {
        label: "BIL",
        blocks: [
          {
            kind: "paragraph",
            text: "BIL (the Behavior Intelligence Layer) is another core MVP component. Its role is to provide behavior/workload intelligence that can inform higher-level decisions."
          },
          {
            kind: "callout",
            variant: "warning",
            text: "Do not claim advanced predictive intelligence unless the corresponding implementation actually exists."
          }
        ]
      },
      {
        label: "Status",
        blocks: [
          {
            kind: "callout",
            text: "Status: core MVP components; implementation evidence to be verified from source."
          }
        ]
      }
    ],
    relatedNoteIds: []
  },
  {
    id: "airlines-status-event-flow",
    title: "Flight Status Mutation & Event Flow",
    projectId: "airlines-indigo",
    subsystemId: "rest-api",
    pillars: ["system-design", "low-level-design", "implementation"],
    type: "case-study",
    tags: ["event-flow", "state-change", "case-study"],
    summary:
      "The primary event trigger of the system: an admin status change is validated, persisted in MongoDB, broadcast to dashboard clients, and routed to exactly the subscribed passengers as targeted Socket.IO notifications.",
    sections: [
      {
        label: "Problem",
        blocks: [
          {
            kind: "paragraph",
            text: "When an admin changes a flight status, the change must be validated, persisted, visible to everyone viewing the flight, and routed to exactly the passengers subscribed to that flight. The strongest technical concept is persistent state change + event propagation + subscriber-specific notification delivery."
          }
        ]
      },
      {
        label: "Mutation flow",
        blocks: [
          {
            kind: "flow",
            steps: [
              "Request",
              "Validate flight ID",
              "Find existing flight",
              "Check for meaningful change",
              "Update flight in database",
              "Broadcast flightUpdated",
              "Find subscribers",
              "Create notification for each subscriber",
              "Emit notification to each user's Socket.IO room",
              "Return updated flight + notification count"
            ]
          }
        ]
      },
      {
        label: "Trigger endpoint",
        blocks: [
          {
            kind: "code",
            label: "Primary event trigger",
            language: "text",
            code: "POST /api/flights/:id/status\n\nChanges: Status, Reason, Gate"
          },
          {
            kind: "paragraph",
            text: "This endpoint is the primary event trigger. It validates the MongoDB ObjectId of the flight, checks that the change is meaningful, persists the update, and then drives both delivery channels."
          }
        ]
      },
      {
        label: "Two delivery channels",
        blocks: [
          {
            kind: "list",
            items: [
              "flightUpdated: broadcast to dashboard and flight viewers (everyone watching the flight state).",
              "notification: emitted to the specific user's Socket.IO room (exactly the subscribed passengers)."
            ]
          }
        ]
      },
      {
        label: "End-to-end passenger flow",
        blocks: [
          {
            kind: "flow",
            steps: [
              "Open Dashboard",
              "View Flights",
              "Open Flight Details",
              "Subscribe to Flight",
              "Socket joins user room",
              "Admin changes flight status",
              "Backend persists event",
              "Notification generated",
              "Socket.IO pushes notification",
              "Passenger receives update",
              "Notification remains available in history"
            ]
          }
        ]
      },
      {
        label: "Trade-offs",
        blocks: [
          {
            kind: "list",
            items: [
              "REST handles resource retrieval and request/response operations; Socket.IO handles low-latency server-to-client updates.",
              "Notifications are both stored and pushed: a real-time experience plus historical access.",
              "User-specific rooms (user:<userId>) allow targeted delivery instead of broadcasting every notification to every client."
            ]
          }
        ]
      }
    ],
    relatedNoteIds: ["airlines-realtime-notes"]
  },
  {
    id: "airlines-architecture",
    title: "System Architecture: REST + Real-Time + Persistence",
    projectId: "airlines-indigo",
    subsystemId: "architecture",
    pillars: ["system-design"],
    type: "design-record",
    tags: ["architecture", "full-stack", "event-driven"],
    summary:
      "A containerized full-stack flight-status notification system combining REST APIs, MongoDB persistence, and Socket.IO real-time delivery, presented as an event-propagation system rather than a stack list.",
    sections: [
      {
        label: "Problem",
        blocks: [
          {
            kind: "paragraph",
            text: "How do you propagate a persistent flight-state change to exactly the users who care about it, while retaining notification history? The system combines state, REST, persistence, push/event delivery, subscription routing, and notification history."
          }
        ]
      },
      {
        label: "Architecture",
        blocks: [
          {
            kind: "code",
            label: "Docker Compose topology",
            language: "text",
            code: "                         Docker Compose\n                              |\n             ┌────────────────┼────────────────┐\n             │                │                │\n             ▼                ▼                ▼\n        Frontend          Backend           MongoDB\n        React/Vite        Node/Express       Mongo\n          :5173              :5000\n             │                │\n             │      REST      │\n             └───────────────►│\n                              │\n                              │ Socket.IO\n                              ▼\n                         Connected Clients"
          },
          {
            kind: "paragraph",
            text: "The backend depends on MongoDB; the frontend depends on the backend. Backend exposes port 5000, frontend exposes port 5173, and MongoDB uses a named Docker volume."
          }
        ]
      },
      {
        label: "Frontend communication",
        blocks: [
          {
            kind: "code",
            label: "Dual communication model",
            language: "text",
            code: "React UI\n   |\n   ├── Axios ───────────────► Express REST API\n   |\n   └── Socket.IO Client ────► Socket.IO Server"
          },
          {
            kind: "paragraph",
            text: "This dual communication model is an important system-design detail: Axios handles HTTP requests, while Socket.IO Client handles real-time updates."
          }
        ]
      },
      {
        label: "Core insight",
        blocks: [
          {
            kind: "callout",
            text: "Persistent state change + event propagation + subscriber-specific notification delivery. The technology stack supports the engineering story; it is not the story itself."
          }
        ]
      },
      {
        label: "Status",
        blocks: [
          {
            kind: "callout",
            text: "Full-stack real-time system. Local containerized startup via docker compose; the live demo is deployed at airlines-indigo.vercel.app."
          }
        ]
      }
    ],
    relatedNoteIds: []
  },
  {
    id: "airlines-rest-api",
    title: "REST API Design",
    projectId: "airlines-indigo",
    subsystemId: "rest-api",
    pillars: ["system-design", "low-level-design"],
    type: "design-record",
    tags: ["rest", "api", "layering"],
    summary:
      "The /api surface groups flights, subscriptions, and notifications behind a health endpoint, with a layered request flow through routes, controllers, services, and Mongoose models.",
    sections: [
      {
        label: "API surface",
        blocks: [
          {
            kind: "code",
            label: "Route groups",
            language: "text",
            code: "/api/flights\n/api/subscriptions\n/api/notifications\n/api/health"
          },
          {
            kind: "code",
            label: "Flight routes",
            language: "text",
            code: "GET  /api/flights\nGET  /api/flights/:id\nPOST /api/flights/:id/status"
          },
          {
            kind: "code",
            label: "Subscription routes",
            language: "text",
            code: "POST   /api/subscriptions\nGET    /api/subscriptions/:userId\nDELETE /api/subscriptions/:flightId"
          },
          {
            kind: "code",
            label: "Notification routes",
            language: "text",
            code: "GET   /api/notifications/:userId\nPATCH /api/notifications/:id/read"
          }
        ]
      },
      {
        label: "Request layering",
        blocks: [
          {
            kind: "flow",
            steps: ["HTTP Request", "Express Routes", "Controllers", "Services", "Mongoose Models", "MongoDB"]
          },
          {
            kind: "paragraph",
            text: "Routes define endpoints, controllers handle HTTP-level orchestration and responses, services handle reusable business/data operations, and models define the MongoDB/Mongoose data structures."
          }
        ]
      },
      {
        label: "Middleware & errors",
        blocks: [
          {
            kind: "list",
            items: [
              "Enables CORS and parses JSON.",
              "Uses Morgan logging and mounts /api routes.",
              "Registers centralized error handling after the API routes.",
              "Controllers forward errors using next(error)."
            ]
          },
          {
            kind: "paragraph",
            text: "GET /api/flights/:id validates the MongoDB ObjectId; POST /api/flights/:id/status is the primary event trigger."
          }
        ]
      }
    ],
    relatedNoteIds: []
  },
  {
    id: "airlines-realtime-layer",
    title: "Real-Time Layer with Socket.IO",
    projectId: "airlines-indigo",
    subsystemId: "real-time-layer",
    pillars: ["system-design", "implementation"],
    type: "design-record",
    tags: ["websockets", "socket-io", "realtime"],
    summary:
      "A Socket.IO server attached to the HTTP server delivers flightUpdated broadcasts to dashboard clients and targeted notification events to per-user rooms.",
    sections: [
      {
        label: "Problem",
        blocks: [
          {
            kind: "paragraph",
            text: "REST alone is pull-based: a client has to ask whether state changed. Flight-status changes need to reach clients with low latency, and notifications must reach exactly the right users."
          }
        ]
      },
      {
        label: "Model",
        blocks: [
          {
            kind: "code",
            label: "Room targeting",
            language: "text",
            code: "socket.emit(\"join\", userId)\n\nserver places the socket into:\n  user:<userId>\n\nexample:\n  user:12345"
          },
          {
            kind: "paragraph",
            text: "On connection the frontend emits join(userId). The backend places the socket into the user:<userId> room, which enables targeted passenger notifications."
          }
        ]
      },
      {
        label: "Events",
        blocks: [
          {
            kind: "list",
            items: [
              "flightUpdated: broadcast for dashboard / flight-state updates.",
              "notification: emitted to the user's Socket.IO room for individual subscribers."
            ]
          },
          {
            kind: "code",
            label: "Targeted emission",
            language: "text",
            code: "io.to(`user:${subscriber.userId}`).emit(\"notification\", ...)"
          },
          {
            kind: "callout",
            text: "Do not invent additional event types; the documented set is flightUpdated and notification."
          }
        ]
      },
      {
        label: "Trade-off",
        blocks: [
          {
            kind: "paragraph",
            text: "User-specific rooms give targeted delivery instead of broadcasting every notification to every client, at the cost of tracking which room each connected user belongs to."
          }
        ]
      }
    ],
    relatedNoteIds: ["airlines-realtime-notes"]
  },
  {
    id: "airlines-subscription-system",
    title: "Subscription Routing & User Rooms",
    projectId: "airlines-indigo",
    subsystemId: "subscription-system",
    pillars: ["system-design", "low-level-design"],
    type: "design-record",
    tags: ["subscriptions", "routing", "indexing"],
    summary:
      "Passengers subscribe to flights, the service resolves which users care about a flight, and a unique compound index on (userId, flightId) prevents duplicate subscriptions at the database level.",
    sections: [
      {
        label: "Problem",
        blocks: [
          {
            kind: "paragraph",
            text: "A notification must reach only the passengers subscribed to the affected flight. That requires a subscription record per user/flight pair and a way to resolve all subscribers of a flight."
          }
        ]
      },
      {
        label: "Service operations",
        blocks: [
          {
            kind: "code",
            label: "Subscription API",
            language: "text",
            code: "POST   /api/subscriptions\nGET    /api/subscriptions/:userId\nDELETE /api/subscriptions/:flightId"
          },
          {
            kind: "list",
            items: [
              "subscribe",
              "getSubscriptions",
              "removeSubscription",
              "getFlightSubscribers"
            ]
          },
          {
            kind: "paragraph",
            text: "getFlightSubscribers(flightId) determines which users should receive updates for a flight. It is the bridge between the persisted state change and notification creation."
          }
        ]
      },
      {
        label: "Data model",
        blocks: [
          {
            kind: "code",
            label: "Subscription fields",
            language: "text",
            code: "userId\nflightId     references Flight\ncreatedAt\nupdatedAt"
          }
        ]
      },
      {
        label: "Integrity",
        blocks: [
          {
            kind: "paragraph",
            text: "A unique compound index on (userId, flightId) prevents duplicate subscriptions for the same user/flight pair at the database level, instead of relying on application checks alone."
          },
          {
            kind: "code",
            label: "Unique compound index",
            language: "text",
            code: "unique index (userId, flightId)"
          }
        ]
      }
    ],
    relatedNoteIds: ["airlines-subscription-index-note"]
  },
  {
    id: "airlines-notification-pipeline",
    title: "Notification Pipeline: Persisted + Live",
    projectId: "airlines-indigo",
    subsystemId: "notification-pipeline",
    pillars: ["system-design", "low-level-design", "implementation"],
    type: "design-record",
    tags: ["notifications", "pipeline", "events"],
    summary:
      "Notifications are persisted in MongoDB and pushed through Socket.IO, giving both real-time delivery and historical access.",
    sections: [
      {
        label: "Problem",
        blocks: [
          {
            kind: "paragraph",
            text: "A status event must reach the right user in real time and remain accessible later. Pushing alone loses history; storing alone loses the live experience. The pipeline does both."
          }
        ]
      },
      {
        label: "Model",
        blocks: [
          {
            kind: "flow",
            steps: ["Flight Event", "Socket.IO", "Live UI", "Flight Event", "MongoDB", "Notification History"]
          }
        ]
      },
      {
        label: "API",
        blocks: [
          {
            kind: "code",
            label: "Notification routes",
            language: "text",
            code: "GET   /api/notifications/:userId\nPATCH /api/notifications/:id/read"
          },
          {
            kind: "paragraph",
            text: "Users can retrieve notification history and mark notifications as read."
          }
        ]
      },
      {
        label: "Data model",
        blocks: [
          {
            kind: "code",
            label: "Notification fields",
            language: "text",
            code: "userId\nflightId\ntype\ntitle\nmessage\nisRead\ncreatedAt\nupdatedAt"
          }
        ]
      },
      {
        label: "Types",
        blocks: [
          {
            kind: "list",
            items: ["ON_TIME", "DELAYED", "CANCELLED", "BOARDING", "DEPARTED", "GATE_CHANGED"]
          },
          {
            kind: "callout",
            text: "These are the documented notification types. Do not assume every type is triggered by every code path without verification."
          }
        ]
      }
    ],
    relatedNoteIds: []
  },
  {
    id: "airlines-data-model",
    title: "Data Model & Integrity",
    projectId: "airlines-indigo",
    subsystemId: "database-design",
    pillars: ["low-level-design", "system-design"],
    type: "design-record",
    tags: ["data-model", "mongodb", "indexing"],
    summary:
      "The Flight, Subscription, and Notification collections, their relationships, and their constraints, including the status enum, unique flightNumber, and the compound index protecting subscription integrity.",
    sections: [
      {
        label: "Problem",
        blocks: [
          {
            kind: "paragraph",
            text: "Three entities drive the system (Flight, Subscription, and Notification), and the relationships between them must stay consistent under concurrent reads and writes."
          }
        ]
      },
      {
        label: "Flight model",
        blocks: [
          {
            kind: "code",
            label: "Flight fields",
            language: "text",
            code: "flightNumber    unique\norigin\ndestination\ndepartureTime\narrivalTime\nstatus\ngate\ndelayReason\ncreatedAt\nupdatedAt"
          },
          {
            kind: "paragraph",
            text: "Flight status is constrained to On Time, Delayed, Cancelled, Boarding, and Departed. flightNumber is unique."
          }
        ]
      },
      {
        label: "Relationships",
        blocks: [
          {
            kind: "code",
            label: "Data relationships",
            language: "text",
            code: "Flight\n  |\n  ├───────────────┐\n  │               │\n  ▼               ▼\nSubscription   Notification\n  │               │\n  └── userId ─────┘"
          },
          {
            kind: "paragraph",
            text: "Subscription.flightId and Notification.flightId both reference Flight; both contain a userId."
          }
        ]
      },
      {
        label: "Integrity",
        blocks: [
          {
            kind: "paragraph",
            text: "The Subscription collection has a unique compound index on (userId, flightId), preventing duplicate subscriptions for the same user/flight pair."
          }
        ]
      }
    ],
    relatedNoteIds: ["airlines-subscription-index-note"]
  },
  {
    id: "airlines-docker-compose",
    title: "Containerized Architecture with Docker Compose",
    projectId: "airlines-indigo",
    subsystemId: "docker-infrastructure",
    pillars: ["system-design", "implementation"],
    type: "design-record",
    tags: ["docker", "docker-compose", "infrastructure"],
    summary:
      "Three primary Compose services (frontend, backend, and MongoDB) with a named volume for database persistence and a documented docker compose up --build startup.",
    sections: [
      {
        label: "Problem",
        blocks: [
          {
            kind: "paragraph",
            text: "The application is a multi-service system. Docker packages it into a reproducible local environment instead of depending on manual setup of Node and MongoDB."
          }
        ]
      },
      {
        label: "Compose model",
        blocks: [
          {
            kind: "code",
            label: "docker-compose.yml",
            language: "text",
            code: "docker-compose.yml\n│\n├── mongodb\n│   ├── mongo:8\n│   └── persistent volume\n│\n├── backend\n│   ├── build: ./backend\n│   ├── port: 5000\n│   └── depends_on: mongodb\n│\n└── frontend\n    ├── build: ./frontend\n    ├── port: 5173\n    └── depends_on: backend"
          }
        ]
      },
      {
        label: "Persistence & demo data",
        blocks: [
          {
            kind: "paragraph",
            text: "MongoDB uses a named volume (mongo_data:/data/db), separating database data from the container lifecycle. The repository also contains demo MongoDB backup data restored with mongorestore; present this as demo-data restoration, not as a production backup architecture."
          }
        ]
      },
      {
        label: "Boundaries",
        blocks: [
          {
            kind: "callout",
            variant: "warning",
            text: "Do not exaggerate this into Kubernetes, cloud orchestration, or a production container platform. The Vercel deployment is the live demo; the Docker Compose stack itself is not running on Vercel."
          }
        ]
      }
    ],
    relatedNoteIds: []
  }
];

export const notes: EngineeringNote[] = [
  {
    id: "storage-engine-note-template",
    title: "Storage Engine Design Note",
    description:
      "Draft note structure for storage-engine topics such as segments, write paths, read paths, versioning, compaction, and garbage collection.",
    category: "Storage Systems",
    tags: ["storage-engine", "segments", "versioning"],
    relatedProjectId: "yukti",
    relatedSubsystemId: "storage-engine",
    pillarIds: ["system-design", "low-level-design", "implementation"],
    status: "draft",
    content: [
      {
        label: "Status",
        blocks: [
          {
            kind: "callout",
            text: "This note is intentionally unpublished until verified technical details are available."
          }
        ]
      }
    ]
  },
  {
    id: "segment-format-note",
    title: "Segment File Format",
    description:
      "Planned note on the physical/logical layout of Yukti segment files.",
    category: "Storage Systems",
    tags: ["segments", "file-format"],
    relatedProjectId: "yukti",
    relatedSubsystemId: "segment-format",
    pillarIds: ["low-level-design"],
    status: "planned",
    content: [
      {
        label: "Status",
        blocks: [
          {
            kind: "callout",
            text: "Planned note. Content will be written from the design progression when verified material is available."
          }
        ]
      }
    ]
  },
  {
    id: "page-format-note",
    title: "Page Format",
    description:
      "Planned note on the layout of pages within Yukti segments.",
    category: "Storage Systems",
    tags: ["pages", "file-format"],
    relatedProjectId: "yukti",
    relatedSubsystemId: "page-format",
    pillarIds: ["low-level-design"],
    status: "planned",
    content: [
      {
        label: "Status",
        blocks: [
          {
            kind: "callout",
            text: "Planned note. Content will be written from the design progression when verified material is available."
          }
        ]
      }
    ]
  },
  {
    id: "object-directory-note",
    title: "Object Directory",
    description:
      "Planned note on locating objects within segments.",
    category: "Storage Systems",
    tags: ["objects", "directory"],
    relatedProjectId: "yukti",
    relatedSubsystemId: "object-directory",
    pillarIds: ["system-design", "low-level-design"],
    status: "planned",
    content: [
      {
        label: "Status",
        blocks: [
          {
            kind: "callout",
            text: "Planned note. Content will be written from the design progression when verified material is available."
          }
        ]
      }
    ]
  },
  {
    id: "write-path-note",
    title: "Write Path",
    description:
      "Planned note on the flow from accepted write to durable representation.",
    category: "Storage Systems",
    tags: ["write-path", "durability"],
    relatedProjectId: "yukti",
    relatedSubsystemId: "write-path",
    pillarIds: ["system-design", "low-level-design", "implementation"],
    status: "planned",
    content: [
      {
        label: "Status",
        blocks: [
          {
            kind: "callout",
            text: "Planned note. Content will be written from the design progression when verified material is available."
          }
        ]
      }
    ]
  },
  {
    id: "read-path-note",
    title: "Read Path",
    description:
      "Planned note on the flow from lookup request to returned versioned data.",
    category: "Storage Systems",
    tags: ["read-path", "lookup"],
    relatedProjectId: "yukti",
    relatedSubsystemId: "read-path",
    pillarIds: ["system-design", "low-level-design", "implementation"],
    status: "planned",
    content: [
      {
        label: "Status",
        blocks: [
          {
            kind: "callout",
            text: "Planned note. Content will be written from the design progression when verified material is available."
          }
        ]
      }
    ]
  },
  {
    id: "versioning-note",
    title: "Versioning",
    description:
      "Planned note on version identity, visibility, and retention rules.",
    category: "Storage Systems",
    tags: ["versioning", "timestamps"],
    relatedProjectId: "yukti",
    relatedSubsystemId: "versioning",
    pillarIds: ["system-design", "low-level-design"],
    status: "planned",
    content: [
      {
        label: "Status",
        blocks: [
          {
            kind: "callout",
            text: "Planned note. Content will be written from the design progression when verified material is available."
          }
        ]
      }
    ]
  },
  {
    id: "compaction-note",
    title: "Compaction",
    description:
      "Planned note on reorganizing immutable segments to reclaim obsolete versions and dead data.",
    category: "Storage Systems",
    tags: ["compaction", "segments"],
    relatedProjectId: "yukti",
    relatedSubsystemId: "compaction",
    pillarIds: ["system-design", "low-level-design", "implementation"],
    status: "planned",
    content: [
      {
        label: "Status",
        blocks: [
          {
            kind: "callout",
            text: "Planned note. The compaction case study records the verified design direction; this article will go deeper when the selection/scoring model is finalized."
          }
        ]
      }
    ]
  },
  {
    id: "garbage-collection-note",
    title: "Garbage Collection",
    description:
      "Planned note on safely reclaiming storage that is no longer needed.",
    category: "Storage Systems",
    tags: ["garbage-collection", "reclamation"],
    relatedProjectId: "yukti",
    relatedSubsystemId: "garbage-collection",
    pillarIds: ["system-design", "low-level-design"],
    status: "planned",
    content: [
      {
        label: "Status",
        blocks: [
          {
            kind: "callout",
            text: "Planned note. Content will be written from the design progression when verified material is available."
          }
        ]
      }
    ]
  },
  {
    id: "distributed-systems-notes",
    title: "Distributed Systems",
    description:
      "Planned notes on distributed-system topics: networking, discovery, consistency, and fault tolerance.",
    category: "Distributed Systems",
    tags: ["distributed-systems", "networking", "consistency"],
    pillarIds: ["system-design", "low-level-design"],
    status: "planned",
    content: [
      {
        label: "Status",
        blocks: [
          {
            kind: "callout",
            text: "Planned series. Articles will be written alongside verified project material."
          }
        ]
      }
    ]
  },
  {
    id: "algorithms-and-math-notes",
    title: "Algorithms and Performance Modeling",
    description:
      "Planned notes on algorithms, complexity, probability, and performance models used in the projects.",
    category: "Mathematics",
    tags: ["algorithms", "complexity", "models"],
    pillarIds: ["mathematics", "implementation"],
    status: "planned",
    content: [
      {
        label: "Status",
        blocks: [
          {
            kind: "callout",
            text: "Planned series. Articles will be written when there is verified work to document."
          }
        ]
      }
    ]
  },
  {
    id: "airlines-realtime-notes",
    title: "Real-Time Delivery with Socket.IO",
    description:
      "Planned note on the Socket.IO layer: user rooms, the flightUpdated broadcast, and targeted notification emission.",
    category: "Real-Time Systems",
    tags: ["socket-io", "realtime", "websockets"],
    relatedProjectId: "airlines-indigo",
    relatedSubsystemId: "real-time-layer",
    pillarIds: ["system-design", "implementation"],
    status: "planned",
    content: [
      {
        label: "Status",
        blocks: [
          {
            kind: "callout",
            text: "Planned note. The design record documents the verified architecture; this article will go deeper into the implementation."
          }
        ]
      }
    ]
  },
  {
    id: "airlines-subscription-index-note",
    title: "Compound Indexes and Subscription Integrity",
    description:
      "Planned note on the unique (userId, flightId) compound index that prevents duplicate flight subscriptions at the database level.",
    category: "Database Design",
    tags: ["mongodb", "indexing", "integrity"],
    relatedProjectId: "airlines-indigo",
    relatedSubsystemId: "database-design",
    pillarIds: ["low-level-design", "system-design"],
    status: "planned",
    content: [
      {
        label: "Status",
        blocks: [
          {
            kind: "callout",
            text: "Planned note. Content will be written from the verified data model when the article is published."
          }
        ]
      }
    ]
  }
];

export const stackGroups = [
  {
    label: "Portfolio Implementation",
    items: ["React", "TypeScript", "Vite", "Tailwind CSS"]
  },
  {
    label: "Languages",
    items: ["TypeScript (portfolio)", "Go (Yukti design consideration)", "JavaScript / Node.js (AIRLINES-INDIGO)"]
  },
  {
    label: "Frontend",
    items: ["React", "Vite", "Tailwind CSS", "React Router", "Socket.IO Client"]
  },
  {
    label: "Backend",
    items: ["Node.js", "Express", "Socket.IO", "Mongoose"]
  },
  {
    label: "Databases",
    items: ["MongoDB"]
  },
  {
    label: "Infrastructure",
    items: ["Docker", "Docker Compose", "Vercel (demo deployment)"]
  },
  {
    label: "Systems",
    items: ["Distributed Systems (Yukti)", "Storage Engines", "Real-Time Event Delivery", "Networking"]
  },
  {
    label: "Tools",
    items: ["Git", "GitHub"]
  }
];

export const profile = {
  name: "Aditya Pandey",
  course: "B.Tech (CSE), final year",
  location: "India"
};

export const contact = {
  email: "adityacoderr@example.com",
  github: "https://github.com/adityacoderr",
  linkedin: "https://www.linkedin.com/in/aditya-pandey-037872262"
};
