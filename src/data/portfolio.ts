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
      "Minimal distributed system: IDO, UPE, BIL, Discovery, and Storage Engine. Advanced capabilities (HBF, replication, consensus) deferred."
  },
  {
    id: "storage-engine",
    title: "Storage Engine",
    description:
      "Persistence subsystem built around Yukti's own object/segment/page model with immutable segments.",
    children: [
      {
        id: "segment-directory",
        title: "Segment Directory",
        description: "Engine-wide metadata index of all segments; derived-index architecture."
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
        id: "compaction",
        title: "Compaction",
        description: "Reorganization of stored segments to reclaim obsolete versions."
      }
    ]
  }
];

const gcbSubsystems: Subsystem[] = [
  {
    id: "match-management",
    title: "Match Management",
    description: "Handles creation and configuration of cricket matches including format, overs, teams, squads, toss, scheduling, and scorer PIN."
  },
  {
    id: "realtime-engine",
    title: "Real-Time Match Engine",
    description: "Socket.IO-based synchronization keeping multiple clients in sync with authoritative live match state through match-specific rooms."
  },
  {
    id: "ball-by-ball-scoring",
    title: "Ball-by-Ball Scoring",
    description: "Core domain logic processing individual cricket deliveries: runs, extras, wickets, legal balls, overs, batter/bowler state, free-hit, innings and match progression."
  },
  {
    id: "live-match-interface",
    title: "Live Match Interface",
    description: "React frontend components for match discovery, live score display, active players, ball controls, over history, and real-time UI updates."
  },
  {
    id: "scorecard-results",
    title: "Scorecard & Match Results",
    description: "Detailed match statistics, innings information, completed match state, final result, and presentation of recorded match data."
  },
  {
    id: "ai-summary",
    title: "AI Match Summary",
    description: "Generates human-readable match summaries from structured ball/innings/result data as an additional layer on top of recorded match data."
  },
  {
    id: "admin-scorer-access",
    title: "Administration & Scorer Access",
    description: "Match setup, scorer PIN-based access for match operations, and administrative match deletion."
  }
];

export const projects: Project[] = [
  {
    id: "yukti",
    name: "Yukti",
    tagline: "Where Data Behaves",
    shortDescription:
      "A distributed data-system project building a minimal distributed system (IDO, UPE, BIL, Discovery, Storage Engine) with an intelligent data placement vision.",
    longDescription:
      "Yukti is a Distributed Database Management System (D-DBMS) project. The current engineering focus is an agreed MVP: a minimal distributed system with core production-oriented components (IDO, UPE, BIL, Discovery, and the Storage Engine). The Storage Engine is a key effort—built around Yukti's own object/segment/page model with immutable segments, append-oriented versioned storage, and a derived-index Segment Directory. Advanced capabilities (HBF, replication, consensus, prediction) are deferred until the core is stable.",
    status: "Active engineering project",
    technologies: [],
    pillars: ["system-design", "low-level-design", "mathematics", "implementation"],
    subsystems: yuktiSubsystems,
    links: [],
    featured: true
  },
  {
    id: "gcb",
    name: "GCB",
    tagline: "Gully Cricket Board",
    shortDescription:
      "Real-time full-stack cricket scoring platform with ball-by-ball state management, live Socket.IO synchronization, persistent match data, and scorer/viewer workflows.",
    longDescription:
      "GCB is a full-stack real-time cricket scoring and match management platform built around ball-level match state. It combines a React/Vite scorer and viewer interface with a Node.js/Express backend, MongoDB persistence, and Socket.IO synchronization so live match state can be recorded, persisted, and distributed to connected clients in real time. The system models cricket as an evolving state machine where each delivery affects multiple dependent state variables (score, wickets, legal balls, overs, striker/non-striker, bowler, innings, target, result). Key engineering aspects include stateful domain modeling, real-time synchronization via Socket.IO match rooms, persistent ball-level data storage, and a scorer-oriented UI composed of dedicated components for ball controls, player selection, over history, and score presentation.",
    status: "Full-stack real-time application",
    technologies: [
      "React",
      "JavaScript",
      "Vite",
      "Node.js",
      "Express",
      "MongoDB",
      "Mongoose",
      "Socket.IO",
      "Zustand",
      "React Router"
    ],
    pillars: ["system-design", "low-level-design", "implementation"],
    subsystems: gcbSubsystems,
    links: [
      {
        label: "Live Demo",
        href: "https://gcb-frontend-henna.vercel.app"
      },
      {
        label: "Frontend Source",
        href: "https://github.com/adityacoderr/GCB-Frontend"
      },
      {
        label: "Backend Source",
        href: "https://github.com/adityacoderr/GCB-Backend"
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
    id: "gcb-ball-level-state",
    title: "Ball-Level Match State",
    projectId: "gcb",
    subsystemId: "ball-by-ball-scoring",
    pillars: ["system-design", "low-level-design", "implementation"],
    type: "case-study",
    tags: ["domain-modeling", "state-management", "cricket"],
    summary:
      "A cricket score cannot safely be represented as one mutable total because each delivery affects multiple pieces of state. GCB persists individual ball events and derives/updates innings state from those events.",
    sections: [
      {
        label: "Problem",
        blocks: [
          {
            kind: "paragraph",
            text: "Cricket has many dependent state variables. Changing one event can affect score, wickets, legal balls, over, striker, non-striker, bowler, innings, target, and result simultaneously. A simple score total is insufficient."
          }
        ]
      },
      {
        label: "Implementation",
        blocks: [
          {
            kind: "paragraph",
            text: "Persist individual ball events with batter, bowler, runs, extras, wicket, dismissal info, legal-ball state, over state, and striker/non-striker. Derive innings state from the sequence of ball events rather than maintaining a single mutable aggregate."
          },
          {
            kind: "code",
            label: "Ball event conceptual model",
            language: "text",
            code: "Ball\n  ├── batter\n  ├── bowler\n  ├── runs\n  ├── extras\n  ├── wicket\n  ├── dismissal information\n  ├── legal-ball state\n  ├── over state\n  ├── striker/non-striker\n  └── innings state"
          }
        ]
      },
      {
        label: "Impact",
        blocks: [
          {
            kind: "list",
            items: [
              "Provides a structured foundation for scorecards, over history, result calculation, and future match analytics.",
              "Enables accurate reconstruction of match state at any point.",
              "Supports cricket-specific rules: wides/no-balls not counting as legal balls, free hits, striker changes on runs/wickets, over transitions, innings completion."
            ]
          }
        ]
      }
    ],
    relatedNoteIds: []
  },
  {
    id: "gcb-realtime-sync",
    title: "Real-Time Match Synchronization",
    projectId: "gcb",
    subsystemId: "realtime-engine",
    pillars: ["system-design", "implementation"],
    type: "design-record",
    tags: ["socket-io", "realtime", "synchronization"],
    summary:
      "Live viewers should see scoring changes without manually refreshing. GCB uses Socket.IO match rooms to broadcast authoritative backend updates to connected clients.",
    sections: [
      {
        label: "Problem",
        blocks: [
          {
            kind: "paragraph",
            text: "Multiple users need to observe the same live match state in near real time. Polling is inefficient and doesn't scale well for live sports scoring."
          }
        ]
      },
      {
        label: "Implementation",
        blocks: [
          {
            kind: "paragraph",
            text: "Socket.IO server on the backend. Clients join match-specific rooms (match:<matchId>). On scoring action: backend validates, persists to MongoDB, mutates authoritative match state, emits update to the match room. All connected clients in that room receive the update."
          },
          {
            kind: "code",
            label: "Real-time flow",
            language: "text",
            code: "Scorer action\n    │\n    ▼\nBackend scoring logic\n    │\n    ├── update database\n    │\n    └── emit match update\n             │\n             ▼\n        Match room\n         /       \\\n        /         \\\n   Viewer A     Viewer B\n        \\         /\n         live score"
          }
        ]
      },
      {
        label: "Key engineering idea",
        blocks: [
          {
            kind: "paragraph",
            text: "The backend is the source of truth. Match rooms provide natural isolation—Match A updates go to Match A room, Match B updates go to Match B room—avoiding broadcasting every match update to every connected client."
          }
        ]
      },
      {
        label: "Impact",
        blocks: [
          {
            kind: "list",
            items: [
              "Multiple users can observe the same live match state in near real time.",
              "Scorer and viewers stay synchronized without polling.",
              "Match-specific rooms provide natural isolation between concurrent matches."
            ]
          }
        ]
      }
    ],
    relatedNoteIds: []
  },
  {
    id: "gcb-scorer-ui",
    title: "Scorer-Oriented UI",
    projectId: "gcb",
    subsystemId: "live-match-interface",
    pillars: ["low-level-design", "implementation"],
    type: "case-study",
    tags: ["ui", "workflow", "react", "zustand"],
    summary:
      "Ball entry requires frequent, context-sensitive actions. GCB breaks the match screen into dedicated components for ball controls, batter/bowler selection, over history, and score presentation, coordinated via Zustand.",
    sections: [
      {
        label: "Problem",
        blocks: [
          {
            kind: "paragraph",
            text: "The scorer needs to enter ball-by-ball data quickly while seeing current match context: active batters, bowler, score, overs, recent balls. A single monolithic component would be unwieldy."
          }
        ]
      },
      {
        label: "Implementation",
        blocks: [
          {
            kind: "list",
            items: [
              "BallControls.jsx: primary scoring input interface",
              "SelectBowlerModal.jsx / SelectNextBatterModal.jsx / NewBatsmanModal.jsx: player selection flows",
              "OverEntry.jsx / OverHistory.jsx: over-level context",
              "ScoreHeader.jsx / BatterCard.jsx: current match state display",
              "FullScorecard.jsx: analytical/read-oriented view",
              "MatchResult.jsx: completed match presentation",
              "Zustand store (matchStore.js): centralized client-side match state"
            ]
          },
          {
            kind: "paragraph",
            text: "Components read from shared Zustand state rather than independently fetching. Socket.IO updates mutate the store, triggering reactive UI updates across all components."
          }
        ]
      },
      {
        label: "Impact",
        blocks: [
          {
            kind: "list",
            items: [
              "Keeps the scoring workflow focused while allowing the rest of the match state to remain visible.",
              "Separation of scoring UI (write-oriented) from scorecard (read-oriented) matches real cricket workflows.",
              "Centralized client state prevents inconsistency between components showing the same match data."
            ]
          }
        ]
      }
    ],
    relatedNoteIds: []
  },
  {
    id: "gcb-cricket-state-handling",
    title: "Cricket-Specific State Handling",
    projectId: "gcb",
    subsystemId: "ball-by-ball-scoring",
    pillars: ["low-level-design", "implementation"],
    type: "design-record",
    tags: ["domain-logic", "state-machine", "validation"],
    summary:
      "Cricket contains rules around legal deliveries, overs, wickets, striker changes, innings, and targets. GCB encodes these transitions in backend scoring logic rather than treating scoring as simple arithmetic.",
    sections: [
      {
        label: "Problem",
        blocks: [
          {
            kind: "paragraph",
            text: "One delivery can: add runs, change striker, add extras, count/not count as legal ball, produce wicket, trigger free hit, end over, end innings, potentially end match. These rules are interdependent."
          }
        ]
      },
      {
        label: "Implementation",
        blocks: [
          {
            kind: "list",
            items: [
              "Innings state machine: MATCH_CREATED → SETUP → INNINGS_1 → INNINGS_1_COMPLETE → INNINGS_2 → TARGET_REACHED/OVERS_EXHAUSTED/ALL_OUT → MATCH_COMPLETE",
              "Legal ball determination: wides/no-balls don't increment ball count; free hit state after no-ball",
              "Striker/non-striker swap on odd runs, end of over, wicket",
              "Bowler change at over boundary",
              "Target calculation for second innings",
              "Result determination: target reached, overs exhausted, all out, follow-on, declaration"
            ]
          }
        ]
      },
      {
        label: "Impact",
        blocks: [
          {
            kind: "list",
            items: [
              "Makes the application capable of representing actual match progression.",
              "Backend owns authoritative match state; frontend renders that state.",
              "Enables accurate scorecards, over history, and AI summaries derived from structured data."
            ]
          }
        ]
      }
    ],
    relatedNoteIds: []
  },
  {
    id: "gcb-fullstack-state-flow",
    title: "Full-Stack State Flow",
    projectId: "gcb",
    subsystemId: "realtime-engine",
    pillars: ["system-design", "implementation"],
    type: "design-record",
    tags: ["architecture", "rest", "websockets", "persistence"],
    summary:
      "The frontend and backend must remain consistent during a live match. GCB uses REST for commands/data access, MongoDB for persistence, and Socket.IO for live propagation.",
    sections: [
      {
        label: "Problem",
        blocks: [
          {
            kind: "paragraph",
            text: "A live match involves commands (scoring actions), queries (match state, scorecard), persistence (ball logs, innings, results), and real-time updates. These must stay consistent."
          }
        ]
      },
      {
        label: "Implementation",
        blocks: [
          {
            kind: "code",
            label: "Communication model",
            language: "text",
            code: "REST API\n    ├── Match creation\n    ├── Match state retrieval\n    ├── Scoring actions (commands)\n    ├── Scorecard / history queries\n    └── Admin operations\n\nSocket.IO\n    ├── Match room join/leave\n    ├── Live state updates (server → client)\n    └── Scoring action acknowledgments\n\nMongoDB\n    ├── Matches\n    ├── Squads / Players\n    ├── Innings\n    ├── Ball logs\n    ├── Results\n    └── Match metadata"
          }
        ]
      },
      {
        label: "Impact",
        blocks: [
          {
            kind: "list",
            items: [
              "Creates a clear separation between authoritative server state and client presentation.",
              "REST handles request/response operations; Socket.IO handles low-latency server-to-client updates.",
              "Persistent ball-level data enables scorecards, over history, and analytics after the match ends."
            ]
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
  }
];

export const stackGroups = [
  {
    label: "Portfolio Implementation",
    items: ["React", "TypeScript", "Vite", "Tailwind CSS"]
  },
  {
    label: "Languages",
    items: ["TypeScript (portfolio)", "Go (Yukti design consideration)"]
  },
  {
    label: "Frontend",
    items: ["React", "Vite", "Tailwind CSS", "React Router"]
  },
  {
    label: "Backend",
    items: []
  },
  {
    label: "Databases",
    items: ["SQL", "Cassandra", "RocksDB", "DynamoDB", "Amazon Aurora"]
  },
  {
    label: "Infrastructure",
    items: ["Docker", "Docker Compose"]
  },
  {
    label: "Systems",
    items: ["Distributed Systems (Yukti)", "Storage Engines", "Networking"]
  },
  {
    label: "Tools",
    items: ["Git", "GitHub", "kind", "kubectl", "Linux"]
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
