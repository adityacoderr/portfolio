import { useEffect, useState } from "react";
import { analyticsConfig } from "../data/analytics";

type GhUser = {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
};

type GhRepo = {
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  pushed_at: string;
};

const FALLBACK_USER: GhUser = {
  login: "adityacoderr",
  name: "Aditya Pandey",
  avatar_url: "https://avatars.githubusercontent.com/u/142110628?v=4",
  html_url: "https://github.com/adityacoderr",
  bio: "Full-Stack Web Developer currently a Computer Science Student as well as Entrepreneur",
  public_repos: 17,
  followers: 2,
  following: 2,
  created_at: "2023-08-12T16:52:55Z",
};

const FALLBACK_REPOS: GhRepo[] = [
  { name: "GCB-Backend", html_url: "https://github.com/adityacoderr/GCB-Backend", description: "Real-time cricket scoring backend — Node.js, Express, MongoDB, Socket.IO", stargazers_count: 0, forks_count: 0, language: "JavaScript", updated_at: "2026-08-27T00:00:00Z", pushed_at: "2026-08-27T00:00:00Z" },
  { name: "GCB-Frontend", html_url: "https://github.com/adityacoderr/GCB-Frontend", description: "Real-time cricket scoring frontend — React, Vite, Zustand", stargazers_count: 0, forks_count: 0, language: "JavaScript", updated_at: "2026-08-27T00:00:00Z", pushed_at: "2026-08-27T00:00:00Z" },
  { name: "AIRLINES-INDIGO", html_url: "https://github.com/adityacoderr/AIRLINES-INDIGO", description: null, stargazers_count: 0, forks_count: 0, language: "JavaScript", updated_at: "2026-06-16T00:00:00Z", pushed_at: "2026-06-16T00:00:00Z" },
  { name: "ERP", html_url: "https://github.com/adityacoderr/ERP", description: null, stargazers_count: 0, forks_count: 0, language: "JavaScript", updated_at: "2026-06-06T00:00:00Z", pushed_at: "2026-06-06T00:00:00Z" },
  { name: "adityacoderr-portfolio", html_url: "https://github.com/adityacoderr/adityacoderr-portfolio", description: "Engineering portfolio — React + TypeScript", stargazers_count: 0, forks_count: 0, language: "TypeScript", updated_at: "2026-09-03T00:00:00Z", pushed_at: "2026-09-03T00:00:00Z" },
  { name: "content-moderation", html_url: "https://github.com/adityacoderr/content-moderation", description: null, stargazers_count: 0, forks_count: 0, language: "JavaScript", updated_at: "2025-03-22T00:00:00Z", pushed_at: "2025-03-22T00:00:00Z" },
];

const GH_CACHE_KEY = "gh-cache:v1";
const GH_CACHE_TTL = 1000 * 60 * 60 * 6; // 6h

function useGithubData() {
  const [user, setUser] = useState<GhUser | null>(null);
  const [repos, setRepos] = useState<GhRepo[] | null>(null);
  const [loading, setLoading] = useState(true);
  const username = analyticsConfig.github.username;

  useEffect(() => {
    let cancelled = false;

    // fast path: cached data
    try {
      const raw = localStorage.getItem(GH_CACHE_KEY);
      if (raw) {
        const cached = JSON.parse(raw) as { t: number; user: GhUser; repos: GhRepo[] };
        if (Date.now() - cached.t < GH_CACHE_TTL && cached.user?.login?.toLowerCase() === username.toLowerCase()) {
          setUser(cached.user);
          setRepos(cached.repos);
          setLoading(false);
          return;
        }
      }
    } catch {
      // ignore
    }

    async function fetchAll() {
      try {
        setLoading(true);
        const [uRes, rRes] = await Promise.all([
          fetch(`https://api.github.com/users/${username}`),
          fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`),
        ]);
        if (uRes.status === 403 || rRes.status === 403) throw new Error("rate-limited");
        if (!uRes.ok) throw new Error(`GitHub ${uRes.status}`);
        if (!rRes.ok) throw new Error(`GitHub ${rRes.status}`);
        const u = (await uRes.json()) as GhUser;
        const r = (await rRes.json()) as GhRepo[];
        if (!cancelled) {
          setUser(u);
          setRepos(r);
          try {
            localStorage.setItem(GH_CACHE_KEY, JSON.stringify({ t: Date.now(), user: u, repos: r }));
          } catch {
            // ignore
          }
        }
      } catch {
        if (!cancelled) {
          // silent fallback — avoids blank pulse when rate-limited (60/hr unauthenticated)
          setUser(FALLBACK_USER);
          setRepos(FALLBACK_REPOS);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchAll();
    return () => {
      cancelled = true;
    };
  }, [username]);

  return { user, repos, loading };
}

function languageBreakdown(repos: GhRepo[]) {
  const map = new Map<string, number>();
  for (const r of repos) {
    if (!r.language) continue;
    map.set(r.language, (map.get(r.language) ?? 0) + 1);
  }
  const total = Array.from(map.values()).reduce((a, b) => a + b, 0) || 1;
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([lang, count]) => ({ lang, count, pct: Math.round((count / total) * 100) }));
}

const langColor: Record<string, string> = {
  JavaScript: "bg-[#f1e05a]",
  TypeScript: "bg-[#3178c6]",
  Go: "bg-[#00ADD8]",
  Python: "bg-[#3572A5]",
  Java: "bg-[#b07219]",
};

export default function GitHubAnalytics() {
  const { user, repos, loading } = useGithubData();
  const username = analyticsConfig.github.username;

  if (!analyticsConfig.github.enabled) return null;

  const pinned = (() => {
    if (!repos) return [];
    const byName = new Map(repos.map((r) => [r.name.toLowerCase(), r]));
    const explicit = analyticsConfig.github.pinnedRepos
      .map((n) => byName.get(n.toLowerCase()))
      .filter(Boolean) as GhRepo[];
    if (explicit.length > 0) return explicit.slice(0, 6);
    return [...repos].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()).slice(0, 6);
  })();

  const langs = repos ? languageBreakdown(repos) : [];

  return (
    <section className="overflow-hidden" aria-labelledby="github-analytics-title">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4">
          {user ? (
            <img src={user.avatar_url} alt={`${user.login} avatar`} className="h-14 w-14 rounded-full border border-line object-cover" loading="lazy" />
          ) : (
            <div className="h-14 w-14 rounded-full border border-line bg-paper animate-pulse" />
          )}
          <div>
            <h3 id="github-analytics-title" className="text-lg font-semibold tracking-tight text-ink flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 00-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.95 0-1.1.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.3 9.3 0 0112 6.8a9.3 9.3 0 012.5.34c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.69 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.85v2.74c0 .26.18.58.69.48A10 10 0 0012 2z"/></svg>
              GitHub
              <span className="font-mono text-xs font-normal text-muted">@{username}</span>
            </h3>
            {user && <p className="mt-1 text-sm leading-6 text-muted line-clamp-2">{user.bio ?? "GitHub activity and repositories."}</p>}
            {loading && !user && <p className="mt-1 font-mono text-xs text-muted">Loading…</p>}
          </div>
        </div>
        <a href={`https://github.com/${username}`} target="_blank" rel="noreferrer" className="button-secondary !px-3 !py-2 text-xs shrink-0">Open GitHub →</a>
      </div>

      {/* Stats row */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="rounded-md border border-line bg-paper px-3 py-3 text-center">
          <p className="font-mono text-xs uppercase tracking-wide text-muted">Repos</p>
          <p className="mt-1 text-2xl font-semibold text-ink">{user?.public_repos ?? "—"}</p>
        </div>
        <div className="rounded-md border border-line bg-paper px-3 py-3 text-center">
          <p className="font-mono text-xs uppercase tracking-wide text-muted">Followers</p>
          <p className="mt-1 text-2xl font-semibold text-ink">{user?.followers ?? "—"}</p>
        </div>
        <div className="rounded-md border border-line bg-paper px-3 py-3 text-center">
          <p className="font-mono text-xs uppercase tracking-wide text-muted">Following</p>
          <p className="mt-1 text-2xl font-semibold text-ink">{user?.following ?? "—"}</p>
        </div>
      </div>

      {/* Languages */}
      {langs.length > 0 && (
        <div className="mt-4">
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted">Top languages (by repo count)</p>
          <div className="mt-2 flex h-2 overflow-hidden rounded-full border border-line bg-paper">
            {langs.map((l) => (
              <div key={l.lang} className={`${langColor[l.lang] ?? "bg-moss"} transition-all`} style={{ width: `${l.pct}%` }} title={`${l.lang} ${l.pct}%`} />
            ))}
          </div>
          <div className="mt-2 flex flex-wrap gap-3">
            {langs.map((l) => (
              <span key={l.lang} className="inline-flex items-center gap-1.5 font-mono text-xs text-muted">
                <span className={`h-2 w-2 rounded-full ${langColor[l.lang] ?? "bg-moss"}`} aria-hidden="true" /> {l.lang} {l.pct}%
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Contribution chart */}
      {analyticsConfig.github.showContributionChart && (
        <div className="mt-4">
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted">Contribution activity</p>
          <div className="mt-2 overflow-x-auto rounded-md border border-line bg-paper p-2">
            <img
              src={`https://ghchart.rshah.org/${username}`}
              alt={`GitHub contribution chart for ${username}`}
              loading="lazy"
              className="w-full min-w-[640px] object-contain"
              onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
            />
          </div>
          <p className="mt-1.5 font-mono text-[11px] text-muted">Source: ghchart.rshah.org · updates daily, no auth required.</p>
        </div>
      )}

      {/* Pinned / recent repos */}
      <div className="mt-4">
        <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted">Highlighted repositories</p>
        {loading ? (
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-md border border-line bg-paper animate-pulse" />
            ))}
          </div>
        ) : pinned.length === 0 ? (
          <p className="mt-2 text-sm text-muted">No repositories found.</p>
        ) : (
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            {pinned.map((r) => (
              <a key={r.name} href={r.html_url} target="_blank" rel="noreferrer" className="group rounded-md border border-line bg-paper p-3 transition hover:border-ink hover:shadow-sm">
                <p className="flex items-center justify-between gap-2 text-sm font-semibold text-ink group-hover:text-rust">
                  <span className="truncate">{r.name}</span>
                  <span className="shrink-0 font-mono text-xs font-normal text-muted">★ {r.stargazers_count}</span>
                </p>
                {r.description && <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted">{r.description}</p>}
                <p className="mt-2 flex flex-wrap gap-2 font-mono text-[11px] text-muted">
                  {r.language && <span className="rounded border border-line bg-panel px-1.5 py-0.5">{r.language}</span>}
                  <span>updated {new Date(r.updated_at).toLocaleDateString()}</span>
                </p>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
