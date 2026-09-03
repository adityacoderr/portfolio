import { useEffect, useState } from "react";
import { analyticsConfig } from "../data/analytics";

type AcSubmissionNum = { difficulty: string; count: number; submissions: number };
type RecentSubmission = {
  title: string;
  titleSlug: string;
  timestamp: string;
  statusDisplay: string;
  lang: string;
};
type LeetData = {
  totalSolved: number;
  totalQuestions: number;
  easySolved: number;
  totalEasy: number;
  mediumSolved: number;
  totalMedium: number;
  hardSolved: number;
  totalHard: number;
  ranking: number;
  contributionPoint: number;
  reputation: number;
  submissionCalendar?: Record<string, number>;
  matchedUserStats?: { acSubmissionNum: AcSubmissionNum[] };
  recentSubmissions?: RecentSubmission[];
};

function timeAgo(ts: string): string {
  const sec = Date.now() / 1000 - Number(ts);
  if (sec < 60) return `${Math.max(0, Math.floor(sec))}s ago`;
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
  return `${Math.floor(sec / 86400)}d ago`;
}

function useLeetCode() {
  const [data, setData] = useState<LeetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);
  const username = analyticsConfig.leetcode.username;
  const apiBase = analyticsConfig.leetcode.apiBase;

  useEffect(() => {
    let cancelled = false;
    async function fetchData(isPoll = false) {
      try {
        if (!isPoll) setLoading(true);
        const res = await fetch(`${apiBase}/userProfile/${username}`);
        if (!res.ok) throw new Error(`LeetCode API ${res.status}`);
        const json = (await res.json()) as LeetData;
        if (!cancelled) setData(json);
      } catch {
        // silent — no error UI per request
      } finally {
        if (!cancelled && !isPoll) setLoading(false);
      }
    }
    fetchData(false);
    const id = window.setInterval(() => {
      fetchData(true);
      setTick((t) => t + 1);
    }, 30000);
    // re-render every 30s for timeAgo freshness even without fetch
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [username, apiBase]);

  void tick; // keep tick alive for timeAgo refresh
  return { data, loading };
}

function ProgressRing({ solved, total, label, color }: { solved: number; total: number; label: string; color: string }) {
  const pct = total ? Math.round((solved / total) * 100) : 0;
  const radius = 28;
  const circ = 2 * Math.PI * radius;
  const dash = (pct / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative h-[72px] w-[72px]">
        <svg width={72} height={72} viewBox="0 0 72 72" className="-rotate-90">
          <circle cx={36} cy={36} r={radius} fill="none" stroke="currentColor" className="text-line" strokeWidth={6} />
          <circle cx={36} cy={36} r={radius} fill="none" stroke={color} strokeWidth={6} strokeLinecap="round" strokeDasharray={`${dash} ${circ}`} />
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <span className="font-mono text-xs font-semibold text-ink">{solved}<span className="text-muted">/{total}</span></span>
        </div>
      </div>
      <span className="font-mono text-xs uppercase tracking-wide" style={{ color }}>{label}</span>
      <span className="font-mono text-[11px] text-muted">{pct}%</span>
    </div>
  );
}

function Heatmap({ calendar }: { calendar: Record<string, number> }) {
  // calendar: unix timestamp (seconds) -> count
  const entries = Object.entries(calendar).sort((a, b) => Number(a[0]) - Number(b[0]));
  if (entries.length === 0) return <p className="text-sm text-muted">No submission history yet.</p>;
  // render last 20 weeks ~ 140 days
  const last = entries.slice(-140);
  const max = Math.max(...last.map(([, v]) => v), 1);
  return (
    <div className="flex flex-wrap gap-1">
      {last.map(([ts, count]) => {
        const intensity = count === 0 ? 0 : Math.min(4, Math.ceil((count / max) * 4));
        const bg = ["bg-paper border-line", "bg-moss/20 border-moss/20", "bg-moss/40 border-moss/30", "bg-moss/70 border-moss/40", "bg-moss border-moss"][intensity];
        const date = new Date(Number(ts) * 1000).toLocaleDateString();
        return <span key={ts} title={`${date}: ${count} submission(s)`} className={`h-3 w-3 rounded-sm border ${bg}`} aria-label={`${date} ${count}`} />;
      })}
    </div>
  );
}

export default function LeetCodeAnalytics() {
  const { data, loading } = useLeetCode();
  const username = analyticsConfig.leetcode.username;

  if (!analyticsConfig.leetcode.enabled) return null;

  const ac = data?.matchedUserStats?.acSubmissionNum ?? [];
  const solvedAll = ac.find((x) => x.difficulty === "All")?.count ?? data?.totalSolved ?? 0;
  const recent = data?.recentSubmissions?.[0];
  const recentSec = recent ? Date.now() / 1000 - Number(recent.timestamp) : Infinity;
  const isLive = recentSec < 600; // within 10 min considered live solving

  return (
    <section className="overflow-hidden" aria-labelledby="leetcode-analytics-title">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 id="leetcode-analytics-title" className="flex items-center gap-2 text-lg font-semibold tracking-tight text-ink">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded bg-[#FFA116] text-[11px] font-bold text-white">LC</span>
            LeetCode
            <span className="font-mono text-xs font-normal text-muted">@{username}</span>
          </h3>
          <p className="mt-1 max-w-xl text-sm leading-6 text-muted">Problem solving — difficulty breakdown and submission activity.</p>
          {loading && !data && <p className="mt-1 font-mono text-xs text-muted">Loading…</p>}
        </div>
        <a href={`https://leetcode.com/${username}/`} target="_blank" rel="noreferrer" className="button-secondary !px-3 !py-2 text-xs shrink-0">Open LeetCode →</a>
      </div>

      {/* Realtime: what you're currently solving — polls every 30s */}
      <div className="mt-3 overflow-hidden rounded-md border border-line bg-paper">
        <div className="flex items-center justify-between gap-2 border-b border-line bg-panel px-3 py-2">
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wide text-muted">
            <span className={`h-1.5 w-1.5 rounded-full ${isLive ? "bg-emerald-500 animate-pulse" : "bg-line"}`} aria-hidden="true" />
            {isLive ? "live — currently solving" : "last activity"}
          </span>
          <span className="font-mono text-[11px] text-muted">auto · 30s poll</span>
        </div>
        {recent ? (
          <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5">
            <div className="min-w-0">
              <a
                href={`https://leetcode.com/problems/${recent.titleSlug}/`}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-semibold text-ink hover:text-rust truncate"
                title={recent.title}
              >
                {recent.title}
              </a>
              <p className="font-mono text-xs text-muted">
                {recent.statusDisplay} · {recent.lang} · {timeAgo(recent.timestamp)}
              </p>
            </div>
            <a
              href={`https://leetcode.com/problems/${recent.titleSlug}/`}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 rounded border border-line bg-panel px-2.5 py-1 font-mono text-xs text-ink hover:border-ink"
            >
              Open →
            </a>
          </div>
        ) : (
          <p className="px-3 py-2.5 font-mono text-xs text-muted">{loading ? "Checking recent submissions…" : "No recent submissions found."}</p>
        )}
      </div>

      {/* Summary stats */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-md border border-line bg-paper px-3 py-3 text-center">
          <p className="font-mono text-xs uppercase tracking-wide text-muted">Solved</p>
          <p className="mt-1 text-2xl font-semibold text-ink">{data ? solvedAll : loading ? "…" : "—"}<span className="text-sm font-normal text-muted">/{data?.totalQuestions ?? "–"}</span></p>
          <p className="font-mono text-[11px] text-muted">All problems</p>
        </div>
        <div className="rounded-md border border-line bg-paper px-3 py-3 text-center">
          <p className="font-mono text-xs uppercase tracking-wide text-muted">Reputation</p>
          <p className="mt-1 text-2xl font-semibold text-ink">{data?.reputation ?? (loading ? "…" : "—")}</p>
          <p className="font-mono text-[11px] text-muted">{data ? `${data.contributionPoint} pts` : ""}</p>
        </div>
      </div>

      {/* Difficulty rings */}
      {data && (
        <div className="mt-4 flex flex-wrap justify-center gap-6 rounded-md border border-line bg-paper p-3 sm:gap-10">
          <ProgressRing solved={data.easySolved} total={data.totalEasy} label="Easy" color="#00af9b" />
          <ProgressRing solved={data.mediumSolved} total={data.totalMedium} label="Medium" color="#ffc01e" />
          <ProgressRing solved={data.hardSolved} total={data.totalHard} label="Hard" color="#ff375b" />
        </div>
      )}

      {/* Submission calendar */}
      {data?.submissionCalendar && Object.keys(data.submissionCalendar).length > 0 && (
        <div className="mt-4">
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted">Submission calendar (last ~20 weeks)</p>
          <div className="mt-2 rounded-md border border-line bg-paper p-3">
            <Heatmap calendar={data.submissionCalendar} />
          </div>
        </div>
      )}


    </section>
  );
}
