import { useEffect, useMemo, useRef, useState } from "react";
import { achievements, contact, journey, notes, projects, technicalWorks } from "../data/portfolio";

function navigateTo(href: string) {
  window.history.pushState({}, "", href);
  window.scrollTo({ top: 0 });
  window.dispatchEvent(new PopStateEvent("popstate"));
}

type SearchItem = {
  id: string;
  kind: "project" | "work" | "note" | "journey" | "achievement" | "page";
  title: string;
  description: string;
  tags: string[];
  displayTags: string[]; // tags shown as chips
  href: string;
  status?: string;
  category?: string;
};

const searchItems: SearchItem[] = [
  ...projects.map((p) => ({
    id: p.id,
    kind: "project" as const,
    title: p.name,
    description: p.shortDescription,
    // searchable tags: name, tagline, technologies, pillars + generic project terms for "projects" query
    tags: [
      "project",
      "projects",
      ...p.pillars,
      ...p.technologies.map((t) => t.toLowerCase()),
      p.name.toLowerCase(),
      ...(p.tagline ? [p.tagline.toLowerCase()] : []),
      ...p.name.toLowerCase().split(/\s+/),
    ],
    displayTags: [
      ...p.pillars,
      ...p.technologies.slice(0, 4).map((t) => t.toLowerCase()),
    ],
    href: `/projects/${p.id}`,
    status: p.status,
    category: "Project",
  })),
  ...technicalWorks.map((w) => ({
    id: w.id,
    kind: "work" as const,
    title: w.title,
    description: w.summary,
    tags: w.tags,
    displayTags: w.tags,
    href: `/work/${w.id}`,
    status: w.type,
    category: `Technical Work · ${w.projectId}`,
  })),
  ...notes.map((n) => ({
    id: n.id,
    kind: "note" as const,
    title: n.title,
    description: n.description,
    tags: n.tags,
    displayTags: n.tags,
    href: `/notes/${n.id}`,
    status: n.status,
    category: n.category,
  })),
  ...journey.map((j, idx) => ({
    id: `journey-${idx}`,
    kind: "journey" as const,
    title: j.title,
    description: j.description,
    tags: [
      "journey",
      "timeline",
      "experience",
      j.period.toLowerCase(),
      j.title.toLowerCase(),
      j.organization.toLowerCase(),
      ...j.title.toLowerCase().split(/\s+/),
      ...j.organization.toLowerCase().split(/\s+/),
    ],
    displayTags: [j.period.toLowerCase(), j.organization.toLowerCase().replace(/\s+/g, "-")],
    href: "/#journey",
    status: j.period,
    category: j.organization,
  })),
  ...achievements.map((a, idx) => ({
    id: `achievement-${idx}`,
    kind: "achievement" as const,
    title: a.title,
    description: a.description + (a.subtitle ? ` ${a.subtitle}` : ""),
    tags: [
      "achievement",
      "achievements",
      "certification",
      "certifications",
      a.category.toLowerCase(),
      a.title.toLowerCase(),
      ...(a.subtitle ? [a.subtitle.toLowerCase()] : []),
      ...a.title.toLowerCase().split(/\s+/),
    ],
    displayTags: [a.category.toLowerCase(), ...(a.subtitle ? [a.subtitle.toLowerCase().replace(/\s+/g, "-")] : [])],
    href: contact.linkedin,
    status: a.category,
    category: a.subtitle ?? "Achievement",
  })),
  {
    id: "about",
    kind: "page" as const,
    title: "About",
    description: "How the portfolio is organized and the engineering philosophy behind it. Stack, working method, contact and personal statement.",
    tags: ["about", "philosophy", "stack", "contact", "working method", "engineering philosophy", "aditya"],
    displayTags: ["about", "stack"],
    href: "/about",
    status: "Page",
    category: "About",
  },
];

const allUniqueTags = Array.from(new Set(searchItems.flatMap((i) => i.tags))).sort((a, b) =>
  a.localeCompare(b)
);

// Important unique tags only - curated by frequency (hide long spammy list per user request)
const tagFrequency = new Map<string, number>();
searchItems.forEach((item) => {
  new Set(item.tags).forEach((t) => tagFrequency.set(t, (tagFrequency.get(t) ?? 0) + 1));
});
const importantTags = (() => {
  const sorted = Array.from(tagFrequency.entries())
    .filter(([t]) => t.length >= 2 && !t.includes(" ") && !t.match(/^\d/))
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([t]) => t);
  const base = sorted.slice(0, 10);
  // ensure key navigation tags always visible in browse
  for (const must of ["about", "projects", "journey", "achievement"]) {
    if (!base.includes(must) && sorted.includes(must)) {
      base[base.length - 1] = must;
    } else if (!sorted.includes(must)) {
      // still inject if not in sorted (e.g. about is low freq)
      if (!base.includes(must)) base[base.length - 1] = must;
    }
  }
  return base;
})();

function normalizeQuery(q: string): string {
  let nq = q.toLowerCase().replace(/^#/, "").trim();
  // typo tolerance: "projets"/"projet" -> "projects"/"project" (French typo user reported)
  nq = nq.replaceAll("projet", "project");
  return nq;
}

function scoreItem(item: SearchItem, q: string): number {
  const normalizedQ = normalizeQuery(q);
  const tags = item.tags.map((t) => t.toLowerCase());
  const title = item.title.toLowerCase();
  const desc = item.description.toLowerCase();

  // Kind aliases: searching "projects"/"project" shows all projects, "notes" shows notes, "journey"/"achievement"/"about" etc.
  const kindAliases: Record<string, SearchItem["kind"][]> = {
    project: ["project"],
    projects: ["project"],
    note: ["note"],
    notes: ["note"],
    work: ["work"],
    works: ["work"],
    technical: ["work"],
    "technical work": ["work"],
    journey: ["journey"],
    timeline: ["journey"],
    experience: ["journey"],
    achievement: ["achievement"],
    achievements: ["achievement"],
    certification: ["achievement"],
    certifications: ["achievement"],
    about: ["page"],
    philosophy: ["page"],
  };
  if (kindAliases[normalizedQ]?.includes(item.kind)) return 95;

  // Highest priority: exact tag match
  if (tags.some((t) => t === normalizedQ)) return 100;
  // Tag prefix / contains
  if (tags.some((t) => t.startsWith(normalizedQ))) return 80;
  if (tags.some((t) => t.includes(normalizedQ))) return 70;
  if (title.includes(normalizedQ)) return 50;
  if (desc.includes(normalizedQ)) return 30;
  return 0;
}

function getMatchedTags(item: SearchItem, q: string): string[] {
  if (!q.trim()) return [];
  const nq = normalizeQuery(q);
  return item.tags.filter((t) => t.toLowerCase().includes(nq));
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function Highlight({ text, query }: { text: string; query: string }) {
  const raw = query.trim().replace(/^#/, "");
  const q = normalizeQuery(query);
  const effective = raw.toLowerCase() === q.toLowerCase() ? raw : q;
  // try normalized first, fallback to raw
  if (!q) return <>{text}</>;
  const tryHighlight = (term: string) => {
    if (!term || !text.toLowerCase().includes(term.toLowerCase())) return null;
    const regex = new RegExp(`(${escapeRegExp(term)})`, "ig");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      part.toLowerCase() === term.toLowerCase() ? (
        <mark key={i} className="bg-rust/15 text-rust ring-1 ring-rust/20 rounded-[2px] px-0.5 py-0">
          {part}
        </mark>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };
  return <>{tryHighlight(effective) ?? tryHighlight(raw) ?? text}</>;
}

function TagWithHighlight({ tag, query }: { tag: string; query: string }) {
  const q = normalizeQuery(query);
  const raw = query.trim().replace(/^#/, "");
  const effective = tag.toLowerCase().includes(q.toLowerCase()) ? q : raw;
  if (!effective || !tag.toLowerCase().includes(effective.toLowerCase())) {
    return <span>#{tag}</span>;
  }
  const regex = new RegExp(`(${escapeRegExp(effective)})`, "ig");
  const parts = tag.split(regex);
  return (
    <span>
      #
      {parts.map((part, i) =>
        part.toLowerCase() === effective.toLowerCase() ? (
          <mark key={i} className="bg-rust text-paper px-0.5 rounded-[2px]">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}

export default function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [desktopOpen, setDesktopOpen] = useState(false);
  const desktopInputRef = useRef<HTMLInputElement>(null);

  const normalized = normalizeQuery(query);

  const results = useMemo(() => {
    if (!normalized) return [];
    const scored = searchItems
      .map((item) => ({ item, score: scoreItem(item, normalized) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title))
      .slice(0, 12)
      .map((x) => x.item);
    return scored;
  }, [normalized]);

  const hasQuery = normalized.length > 0;

  // Display order is grouped by kind (matches rendered order) so numbering 1,2,3 is sequential
  const orderedResults = useMemo(() => {
    const kindOrder: Record<SearchItem["kind"], number> = {
      project: 0,
      work: 1,
      note: 2,
      journey: 3,
      achievement: 4,
      page: 5,
    };
    return [...results].sort((a, b) => kindOrder[a.kind] - kindOrder[b.kind] || results.indexOf(a) - results.indexOf(b));
  }, [results]);

  // Type-to-focus for desktop: any printable char opens desktop search when no input focused
  // + digit shortcuts 1-9 to open nth result
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isEditable =
        !!target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable ||
          target.tagName === "SELECT");

      // Esc closes
      if (e.key === "Escape") {
        if (desktopOpen) {
          setDesktopOpen(false);
          setQuery("");
          (target as HTMLElement)?.blur?.();
        }
        return;
      }

      // Cmd/Ctrl+K opens desktop
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setDesktopOpen(true);
        requestAnimationFrame(() => desktopInputRef.current?.focus());
        return;
      }

      // '/' opens desktop if not already editing
      if (!isEditable && e.key === "/" && !desktopOpen) {
        e.preventDefault();
        setDesktopOpen(true);
        requestAnimationFrame(() => desktopInputRef.current?.focus());
        return;
      }

      // Digit shortcuts: press 1-9 to open nth visible result when palette is open
      if (desktopOpen && hasQuery && orderedResults.length > 0 && /^[1-9]$/.test(e.key) && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const idx = parseInt(e.key, 10) - 1;
        if (idx < orderedResults.length && idx < 9) {
          e.preventDefault();
          const href = orderedResults[idx].href;
          // inline navigate to avoid stale closure on handleNavigate
          setDesktopOpen(false);
          setQuery("");
          if (href.startsWith("http")) {
            window.open(href, "_blank", "noopener,noreferrer");
          } else if (href.includes("#")) {
            const [, hash] = href.split("#");
            navigateTo(href);
            setTimeout(() => {
              const el = document.getElementById(hash);
              if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100);
          } else {
            navigateTo(href);
          }
          return;
        }
      }

      // If already focused in an input, let natural typing happen
      // For mobile input, we handle via onChange; for desktopOpen we also handle via input.
      if (isEditable) return;

      // Desktop type-to-focus: any single printable char (exclude modifiers) auto-opens
      // Only on desktop viewport (>=1024) to avoid hijacking mobile typing before tapping bar
      if (!desktopOpen && e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
        // Allow letters, numbers, #, and symbols
        if (/^[a-zA-Z0-9#\-_]$/.test(e.key)) {
          // ignore if user is on mobile viewport - explicit bar should be used
          if (window.innerWidth < 1024) return;
          e.preventDefault();
          setDesktopOpen(true);
          setQuery(e.key);
          requestAnimationFrame(() => {
            const el = desktopInputRef.current;
            if (el) {
              el.focus();
              // place cursor at end
              const len = e.key.length;
              el.setSelectionRange(len, len);
            }
          });
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [desktopOpen, hasQuery, orderedResults]);

  // Focus desktop input when opened
  useEffect(() => {
    if (desktopOpen) {
      requestAnimationFrame(() => desktopInputRef.current?.focus());
    }
  }, [desktopOpen]);

  // Close desktop on popstate (navigation)
  useEffect(() => {
    const onNav = () => {
      setDesktopOpen(false);
    };
    window.addEventListener("popstate", onNav);
    return () => window.removeEventListener("popstate", onNav);
  }, []);

  // Allow header button to open desktop palette via custom event
  useEffect(() => {
    const onOpen = () => {
      setDesktopOpen(true);
      requestAnimationFrame(() => desktopInputRef.current?.focus());
    };
    window.addEventListener("open-global-search", onOpen as EventListener);
    return () => window.removeEventListener("open-global-search", onOpen as EventListener);
  }, []);

  const handleNavigate = (href: string) => {
    setDesktopOpen(false);
    setQuery("");
    if (href.startsWith("http")) {
      window.open(href, "_blank", "noopener,noreferrer");
      return;
    }
    if (href.includes("#")) {
      const [path, hash] = href.split("#");
      navigateTo(href);
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
      if (path && window.location.pathname !== path) {
        // already handled by navigateTo
      }
    } else {
      navigateTo(href);
    }
  };

  const handleTagClick = (tag: string) => {
    setQuery(tag);
    setDesktopOpen(true);
    requestAnimationFrame(() => desktopInputRef.current?.focus());
  };

  return (
    <>
      {/* Search palette overlay - works on both desktop (hidden bar + type-to-focus) and mobile (icon trigger) */}
      {desktopOpen && (
        <div className="fixed inset-0 z-40" role="dialog" aria-modal="true" aria-label="Search">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm dark:bg-black/50"
            onClick={() => {
              setDesktopOpen(false);
            }}
          />
          <div className="relative mx-auto mt-[6vh] lg:mt-[12vh] w-full max-w-2xl px-4">
            <div className="overflow-hidden rounded-xl border border-line bg-panel shadow-soft">
              <div className="flex items-center gap-3 border-b border-line px-4 py-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6d675f" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                <input
                  ref={desktopInputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search projects, notes, journey, achievements, about…  e.g. compaction"
                  aria-label="Search"
                  className="h-9 w-full bg-transparent font-mono text-sm text-ink placeholder:text-muted focus:outline-none"
                />
                <kbd className="hidden sm:inline-flex rounded border border-line bg-paper px-1.5 py-1 font-mono text-[10px] text-muted">ESC</kbd>
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="rounded px-2 py-1 font-mono text-xs text-muted hover:text-ink"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="max-h-[62vh] lg:max-h-[58vh] overflow-auto">
                <SearchResultsList
                  query={normalized}
                  rawQuery={query}
                  results={results}
                  hasQuery={hasQuery}
                  onNavigate={handleNavigate}
                  onTagClick={handleTagClick}
                  allTags={allUniqueTags}
                  variant="desktop"
                  onClose={() => setDesktopOpen(false)}
                />
              </div>

              <div className="border-t border-line bg-paper px-4 py-2.5 flex items-center justify-between gap-3">
                <span className="font-mono text-[11px] leading-none text-muted">{hasQuery ? `${results.length} result${results.length === 1 ? "" : "s"} · projects, notes, journey, achievements & about` : `${searchItems.length} searchable items`}</span>
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  <span className="hidden sm:inline font-mono text-[11px] text-muted">
                    {hasQuery && results.length > 0 ? "press 1 for 1st · 2 for 2nd · 3 for 3rd … 9 to open · " : ""}
                    ↵ to open · ESC to close
                  </span>
                  <button
                    type="button"
                    onClick={() => setDesktopOpen(false)}
                    aria-label="Close search dialog"
                    className="inline-flex h-8 items-center gap-1.5 rounded-md border border-line bg-panel px-3 font-mono text-xs font-medium text-ink transition hover:border-ink hover:bg-paper focus:outline-none focus:ring-2 focus:ring-graph/20 active:scale-[0.97] lg:hidden"
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                    Close
                  </button>
                </div>
              </div>
            </div>
            <p className="mt-3 text-center font-mono text-xs text-paper/80">Tip: just start typing anywhere — no need to click</p>
          </div>
        </div>
      )}
    </>
  );
}

function SearchResultsList({
  query,
  rawQuery: _rawQuery,
  results,
  hasQuery,
  onNavigate,
  onTagClick,
  allTags,
  variant,
  onClose: _onClose,
}: {
  query: string;
  rawQuery: string;
  results: SearchItem[];
  hasQuery: boolean;
  onNavigate: (href: string) => void;
  onTagClick: (tag: string) => void;
  allTags: string[];
  variant: "mobile" | "desktop";
  onClose: () => void;
}) {
  if (!hasQuery) {
    // Empty state: show important unique hashtags only (user requested hide long list)
    return (
      <div className="p-4">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted">Browse by hashtag</p>
        <p className="mt-1 text-sm leading-6 text-muted">Tap a tag to see projects, notes, journey, achievements & about.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {importantTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onTagClick(tag)}
              className="tag hover:border-rust hover:text-rust"
            >
              #{tag}
            </button>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2 font-mono text-[10px] text-muted">
          <span className="rounded bg-graph/10 border border-graph/20 px-1.5 py-0.5 text-graph">Project</span>
          <span className="rounded bg-rust/10 border border-rust/20 px-1.5 py-0.5 text-rust">Technical Work</span>
          <span className="rounded bg-moss/10 border border-moss/20 px-1.5 py-0.5 text-moss">Note</span>
          <span className="rounded bg-[#6b5b95]/10 border border-[#6b5b95]/20 px-1.5 py-0.5 text-[#6b5b95]">Journey</span>
          <span className="rounded bg-[#2a7a6b]/10 border border-[#2a7a6b]/20 px-1.5 py-0.5 text-[#2a7a6b]">Achievement</span>
          <span className="rounded bg-ink/10 border border-ink/20 px-1.5 py-0.5 text-ink">Page</span>
        </div>
        <p className="mt-3 font-mono text-xs text-muted">
          Or start typing — matched keyword is highlighted across titles, descriptions & tags.
        </p>
      </div>
    );
  }

  if (results.length === 0) {
    const suggestions = allTags.filter((t) => t.toLowerCase().includes(query)).slice(0, 6);
    return (
      <div className="p-6 text-center">
        <p className="text-sm font-medium text-ink">
          No results for “<Highlight text={query} query={query} />”
        </p>
        <p className="mt-1 text-sm text-muted">Try a different hashtag or keyword.</p>
        {suggestions.length > 0 && (
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {suggestions.map((tag) => (
              <button key={tag} type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => onTagClick(tag)} className="tag">
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  const projectItems = results.filter((r) => r.kind === "project");
  const works = results.filter((r) => r.kind === "work");
  const noteItems = results.filter((r) => r.kind === "note");
  const journeyItems = results.filter((r) => r.kind === "journey");
  const achievementItems = results.filter((r) => r.kind === "achievement");
  const pageItems = results.filter((r) => r.kind === "page");

  const kindMeta = {
    project: { label: "Project", color: "bg-graph text-paper border-graph", dot: "bg-graph" },
    work: { label: "Technical Work", color: "bg-rust text-paper border-rust", dot: "bg-rust" },
    note: { label: "Note", color: "bg-moss text-paper border-moss", dot: "bg-moss" },
    journey: { label: "Journey", color: "bg-[#6b5b95] text-paper border-[#6b5b95]", dot: "bg-[#6b5b95]" },
    achievement: { label: "Achievement", color: "bg-[#2a7a6b] text-paper border-[#2a7a6b]", dot: "bg-[#2a7a6b]" },
    page: { label: "Page", color: "bg-ink text-paper border-ink", dot: "bg-ink" },
  } as const;

  // Number badge is sequential in display order (1,2,3...) not score order, so grouped lists don't look random
  const orderedForDisplay = [...projectItems, ...works, ...noteItems, ...journeyItems, ...achievementItems, ...pageItems];
  const getItemNumber = (item: SearchItem): number | null => {
    const idx = orderedForDisplay.indexOf(item);
    if (idx === -1 || idx >= 9) return null;
    return idx + 1;
  };

  const renderItem = (item: SearchItem) => {
    const num = getItemNumber(item);
    return (
      <li key={`${item.kind}-${item.id}`}>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onNavigate(item.href)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onNavigate(item.href);
          }}
          className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-paper transition"
        >
          {num !== null && (
            <span
              aria-hidden="true"
              className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded border border-line bg-paper font-mono text-xs font-semibold text-muted shadow-sm"
              title={`Press ${num} to open`}
            >
              {num}
            </span>
          )}
          <span className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide ${kindMeta[item.kind].color}`}>
                <span className={`h-1.5 w-1.5 rounded-full bg-paper`} aria-hidden="true" />
                {kindMeta[item.kind].label}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wide rounded bg-paper border border-line px-1.5 py-0.5 text-muted">{item.status}</span>
              {item.category && <span className="font-mono text-[10px] text-muted hidden sm:inline">· {item.category}</span>}
            </span>
            <span className="text-sm font-semibold text-ink line-clamp-1">
              <Highlight text={item.title} query={query} />
            </span>
            <span className="text-sm leading-6 text-muted line-clamp-2">
              <Highlight text={item.description} query={query} />
            </span>
            {item.displayTags.length > 0 && (
              <span className="flex flex-wrap gap-1.5 pt-1">
                {item.displayTags.map((tag) => {
                  const isMatch = tag.toLowerCase().includes(query.toLowerCase());
                  return (
                    <span
                      key={tag}
                      className={`inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-xs transition ${isMatch ? "border-rust bg-rust text-paper" : "border-line bg-paper text-muted"}`}
                    >
                      <TagWithHighlight tag={tag} query={query} />
                    </span>
                  );
                })}
              </span>
            )}
          </span>
          {num !== null && (
            <span className="hidden sm:inline-flex shrink-0 items-center gap-1 font-mono text-[10px] text-muted/70 mt-1">
              press <kbd className="rounded border border-line bg-paper px-1 py-0.5 text-[10px] text-muted">{num}</kbd>
            </span>
          )}
        </button>
      </li>
    );
  };

  return (
    <div className={variant === "desktop" ? "py-2" : "py-2"}>
      {/* Show matched tag chips for quick refinement with highlight */}
      {(() => {
        const matchedTags = Array.from(new Set(results.flatMap((r) => getMatchedTags(r, query)))).slice(0, 8);
        if (matchedTags.length === 0) return null;
        return (
          <div className="px-4 pb-2 flex flex-wrap gap-1.5">
            {matchedTags.map((t) => (
              <button
                key={t}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onTagClick(t)}
                className="inline-flex items-center rounded-full border border-rust bg-rust px-2.5 py-1 font-mono text-xs text-paper hover:bg-ink hover:border-ink transition"
              >
                <TagWithHighlight tag={t} query={query} />
              </button>
            ))}
          </div>
        );
      })()}

      {projectItems.length > 0 && (
        <div>
          <p className="px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] text-muted">
            Projects · {projectItems.length}
          </p>
          <ul className="divide-y divide-line/60">{projectItems.map(renderItem)}</ul>
        </div>
      )}

      {works.length > 0 && (
        <div className={projectItems.length ? "border-t border-line mt-2 pt-2" : ""}>
          <p className="px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] text-muted">
            Technical Work · {works.length}
          </p>
          <ul className="divide-y divide-line/60">{works.map(renderItem)}</ul>
        </div>
      )}

      {noteItems.length > 0 && (
        <div className={projectItems.length || works.length ? "border-t border-line mt-2 pt-2" : ""}>
          <p className="px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] text-muted">Notes · {noteItems.length}</p>
          <ul className="divide-y divide-line/60">{noteItems.map(renderItem)}</ul>
        </div>
      )}

      {journeyItems.length > 0 && (
        <div className={projectItems.length || works.length || noteItems.length ? "border-t border-line mt-2 pt-2" : ""}>
          <p className="px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] text-muted">Journey · {journeyItems.length}</p>
          <ul className="divide-y divide-line/60">{journeyItems.map(renderItem)}</ul>
        </div>
      )}

      {achievementItems.length > 0 && (
        <div className={projectItems.length || works.length || noteItems.length || journeyItems.length ? "border-t border-line mt-2 pt-2" : ""}>
          <p className="px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] text-muted">Achievements · {achievementItems.length}</p>
          <ul className="divide-y divide-line/60">{achievementItems.map(renderItem)}</ul>
        </div>
      )}

      {pageItems.length > 0 && (
        <div className={projectItems.length || works.length || noteItems.length || journeyItems.length || achievementItems.length ? "border-t border-line mt-2 pt-2" : ""}>
          <p className="px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] text-muted">Pages · {pageItems.length}</p>
          <ul className="divide-y divide-line/60">{pageItems.map(renderItem)}</ul>
        </div>
      )}
    </div>
  );
}
