import { useEffect, useMemo, useState } from "react";
import { contact, notes, pillars, profile, projects, stackGroups, technicalWorks } from "./data/portfolio";
import type {
  ContentBlock,
  EngineeringNote,
  Pillar,
  PillarId,
  Project,
  Subsystem,
  TechnicalWork
} from "./types";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "System Design", href: "/pillars/system-design" },
  { label: "LLD", href: "/pillars/low-level-design" },
  { label: "Mathematics", href: "/pillars/mathematics" },
  { label: "Notes", href: "/notes" },
  { label: "About", href: "/about" }
];

function navigateTo(href: string) {
  window.history.pushState({}, "", href);
  window.scrollTo({ top: 0 });
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function usePathname() {
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    const onPopState = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  return pathname;
}

function Link({
  href,
  children,
  className = ""
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={className}
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        navigateTo(href);
      }}
    >
      {children}
    </a>
  );
}

function setPageMeta(title: string, description: string) {
  document.title = `${title} | Aditya Pandey - Engineer`;
  const descriptionTag = document.querySelector('meta[name="description"]');
  descriptionTag?.setAttribute("content", description);
  const ogTitle = document.querySelector('meta[property="og:title"]');
  ogTitle?.setAttribute("content", `${title} | Aditya Pandey - Engineer`);
  const ogDescription = document.querySelector('meta[property="og:description"]');
  ogDescription?.setAttribute("content", description);
}

function findSubsystem(subsystems: Subsystem[], id?: string): Subsystem | undefined {
  if (!id) return undefined;
  for (const subsystem of subsystems) {
    if (subsystem.id === id) return subsystem;
    const nested = findSubsystem(subsystem.children ?? [], id);
    if (nested) return nested;
  }
  return undefined;
}

function getProject(id: string) {
  return projects.find((project) => project.id === id);
}

function getPillar(id: PillarId) {
  return pillars.find((pillar) => pillar.id === id);
}

function getWorkForProject(projectId: string) {
  return technicalWorks.filter((work) => work.projectId === projectId);
}

function getWorkForPillar(pillarId: PillarId) {
  return technicalWorks.filter((work) => work.pillars.includes(pillarId));
}

function getWorkForSubsystem(projectId: string, subsystemId: string) {
  return technicalWorks.filter((work) => work.projectId === projectId && work.subsystemId === subsystemId);
}

function getNote(id: string) {
  return notes.find((note) => note.id === id);
}

function estimateReadingTime(sections: { blocks: ContentBlock[] }[]): string {
  let words = 0;
  for (const section of sections) {
    for (const block of section.blocks) {
      if (block.kind === "paragraph" || block.kind === "callout" || block.kind === "math") {
        words += block.text.split(/\s+/).filter(Boolean).length;
      } else if (block.kind === "code") {
        words += block.code.split(/\s+/).filter(Boolean).length / 2;
      } else if (block.kind === "list") {
        words += block.items.join(" ").split(/\s+/).filter(Boolean).length;
      } else if (block.kind === "flow") {
        words += block.steps.join(" ").split(/\s+/).filter(Boolean).length;
      }
    }
  }
  const minutes = Math.max(1, Math.round(words / 180));
  return minutes === 1 ? "1 min read" : `${minutes} min read`;
}

function Layout({ children, path }: { children: React.ReactNode; path: string }) {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="sticky top-0 z-20 border-b border-line/80 bg-paper/94 backdrop-blur">
        <div className="h-1 w-full bg-gradient-to-r from-rust via-moss to-graph" aria-hidden="true" />
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4" aria-label="Primary navigation">
          <Link href="/" className="group flex items-center gap-2 font-mono text-sm font-semibold tracking-normal text-ink">
            <span className="h-2 w-2 bg-rust transition group-hover:bg-graph" aria-hidden="true" />
            aditya.engineering
          </Link>
          <div className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link ${path === item.href ? "nav-link-active" : ""}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <a className="button-secondary" href={contact.github} rel="noreferrer" target="_blank">
              GitHub
            </a>
            <a className="button-primary" href={`mailto:${contact.email}`}>
              Contact
            </a>
          </div>
        </nav>
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-5 pb-3 lg:hidden">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={`mobile-nav ${path === item.href ? "mobile-nav-active" : ""}`}>
              {item.label}
            </Link>
          ))}
        </div>
      </header>
      <main id="main">{children}</main>
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-panel">
      <div className="h-1 w-full bg-gradient-to-r from-rust via-moss to-graph" aria-hidden="true" />
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-rust">Engineering Portfolio</p>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
            A project-agnostic portfolio for system design, low-level design, mathematical reasoning, implementation notes, and measured trade-offs.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {navItems.slice(1).map((item) => (
            <Link key={item.href} href={item.href} className="text-muted transition hover:text-ink">
              {item.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 border-t border-line px-5 py-4 font-mono text-xs text-muted">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <span>Built as a technical notebook · no fabricated metrics</span>
      </div>
    </footer>
  );
}

function Section({
  eyebrow,
  title,
  intro,
  children
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="section">
      <div className="section-heading">
        {eyebrow && (
          <div className="mb-3 flex items-center gap-4">
            <span className="section-label">{eyebrow}</span>
            <span className="section-rule" aria-hidden="true" />
          </div>
        )}
        <h2>{title}</h2>
        {intro && <p>{intro}</p>}
      </div>
      {children}
    </section>
  );
}

function PillarBadge({ id }: { id: PillarId }) {
  const pillar = getPillar(id);
  return pillar ? (
    <Link href={`/pillars/${pillar.id}`} className="tag">
      {pillar.shortTitle}
    </Link>
  ) : null;
}

function RelationLine({ projectId, subsystemId }: { projectId: string; subsystemId?: string }) {
  const project = getProject(projectId);
  const subsystem = project ? findSubsystem(project.subsystems, subsystemId) : undefined;
  return (
    <p className="font-mono text-xs text-muted">
      {project && <Link href={`/projects/${project.id}`} className="hover:text-ink">{project.name}</Link>}
      {subsystem && (
        <>
          <span> / </span>
          <span className="text-muted">{subsystem.title}</span>
        </>
      )}
    </p>
  );
}

function FlowDiagram({ steps }: { steps: string[] }) {
  return (
    <div className="flow" role="list" aria-label="Data or state flow">
      {steps.map((step, index) => (
        <div key={`${index}-${step}`} className="flow-step" role="listitem">
          {index > 0 && <span className="flow-arrow" aria-hidden="true">→</span>}
          <span className="flow-node">{step}</span>
        </div>
      ))}
    </div>
  );
}

function ContentBlocks({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="content-blocks">
      {blocks.map((block, index) => {
        switch (block.kind) {
          case "paragraph":
            return <p key={index}>{block.text}</p>;
          case "code":
            return (
              <figure key={index} className="code-block-wrap">
                {block.label && <figcaption className="code-label">{block.label}</figcaption>}
                <pre className="code-block">
                  <code>{block.code}</code>
                </pre>
              </figure>
            );
          case "list":
            return block.ordered ? (
              <ol key={index} className="content-list">
                {block.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ol>
            ) : (
              <ul key={index} className="content-list">
                {block.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            );
          case "flow":
            return <FlowDiagram key={index} steps={block.steps} />;
          case "callout":
            return (
              <aside key={index} className={`callout callout-${block.variant ?? "info"}`}>
                {block.text}
              </aside>
            );
          case "math":
            return (
              <div key={index} className="math-block" aria-label="Equation">
                {block.text}
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}

function WorkCard({ work }: { work: TechnicalWork }) {
  return (
    <article className="item-card">
      <p className="font-mono text-xs uppercase text-muted">{work.type.replaceAll("-", " ")}</p>
      <h3>
        <Link href={`/work/${work.id}`}>{work.title}</Link>
      </h3>
      <p>{work.summary}</p>
      <div className="mt-4">
        <RelationLine projectId={work.projectId} subsystemId={work.subsystemId} />
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {work.pillars.map((pillarId) => (
          <PillarBadge key={pillarId} id={pillarId} />
        ))}
      </div>
    </article>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const workCount = getWorkForProject(project.id).length;
  const subsystemCount = countSubsystems(project.subsystems);
  return (
    <article className="item-card">
      <p className="font-mono text-xs uppercase text-muted">{project.status}</p>
      <h3>
        <Link href={`/projects/${project.id}`}>{project.name}</Link>
      </h3>
      <p>{project.shortDescription}</p>
      <p className="mt-4 font-mono text-xs text-muted">
        {subsystemCount} subsystem{subsystemCount === 1 ? "" : "s"} · {workCount} technical work{workCount === 1 ? "" : "s"}
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        {project.pillars.map((pillarId) => (
          <PillarBadge key={pillarId} id={pillarId} />
        ))}
      </div>
    </article>
  );
}

function countSubsystems(subsystems: Subsystem[]): number {
  return subsystems.reduce(
    (total, subsystem) => total + 1 + (subsystem.children ? countSubsystems(subsystem.children) : 0),
    0
  );
}

function NoteCard({ note }: { note: EngineeringNote }) {
  const project = note.relatedProjectId ? getProject(note.relatedProjectId) : undefined;
  const subsystem = project ? findSubsystem(project.subsystems, note.relatedSubsystemId) : undefined;
  const readingTime = estimateReadingTime(note.content);
  return (
    <article className="item-card">
      <p className="font-mono text-xs uppercase text-muted">
        {note.status} · {note.category} · {readingTime}
      </p>
      <h3>
        <Link href={`/notes/${note.id}`}>{note.title}</Link>
      </h3>
      <p>{note.description}</p>
      {(project || subsystem) && (
        <p className="mt-4 font-mono text-xs text-muted">
          {project?.name}
          {subsystem ? ` / ${subsystem.title}` : ""}
        </p>
      )}
      <div className="mt-5 flex flex-wrap gap-2">
        {note.pillarIds.map((pillarId) => (
          <PillarBadge key={pillarId} id={pillarId} />
        ))}
      </div>
    </article>
  );
}

function HomePage() {
  useEffect(() => {
    setPageMeta(
      "Homepage",
      "An engineering portfolio organized around system design, low-level design, mathematics, implementation, and technical trade-offs."
    );
  }, []);

  const featured = projects.filter((project) => project.featured);
  const others = projects.filter((project) => !project.featured);

  const selectedWorkIds = [
    "airlines-status-event-flow",
    "yukti-ido-v11",
    "airlines-realtime-layer",
    "yukti-compaction"
  ];
  const selectedWorks = technicalWorks.filter((work) => selectedWorkIds.includes(work.id));

  return (
    <>
      <section className="hero">
        <div className="mx-auto max-w-7xl px-5 py-16 md:py-28">
          <p className="font-mono text-sm uppercase tracking-[0.16em] text-rust">
            {profile.name} · {profile.course} · {profile.location}
          </p>
          <h1 className="mt-6">
            I design and build <span className="text-rust">systems</span>.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
            A technical notebook for the work I have built and the decisions behind it.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/projects" className="button-primary">
              Explore projects
            </Link>
            <Link href="/pillars/system-design" className="button-secondary">
              Engineering pillars
            </Link>
          </div>
        </div>
      </section>

      <Section
        eyebrow="01 / Pillars"
        title="Engineering perspective"
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {pillars.map((pillar) => (
            <article key={pillar.id} className="pillar-panel">
              <p className="font-mono text-xs uppercase text-muted">{pillar.shortTitle}</p>
              <h3>
                <Link href={`/pillars/${pillar.id}`}>{pillar.title}</Link>
              </h3>
              <p>{pillar.description}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section eyebrow="02 / Projects" title="Featured projects">
        {featured.length > 0 && (
          <div className={`grid gap-4 ${featured.length > 1 ? "lg:grid-cols-2" : ""}`}>
            {featured.map((project) => (
              <FeaturedProjectPanel key={project.id} project={project} />
            ))}
          </div>
        )}
        {others.length > 0 && (
          <div className={`mt-4 grid gap-4 ${others.length > 1 ? "md:grid-cols-2" : ""}`}>
            {others.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </Section>

      <Section eyebrow="03 / Selected work" title="Selected work">
        <WorkCards items={selectedWorks} emptyText="No technical work has been published yet." />
      </Section>

      <Section eyebrow="04 / Notes" title="Notes">
        <NoteList notesToShow={notes.slice(0, 4)} />
      </Section>

      <ContactBand />
    </>
  );
}

function FeaturedProjectPanel({ project }: { project: Project }) {
  const work = getWorkForProject(project.id);
  const subsystemCount = countSubsystems(project.subsystems);
  return (
    <article className="featured-panel">
      <p className="font-mono text-xs uppercase text-muted">{project.status}</p>
      <h3>
        <Link href={`/projects/${project.id}`}>{project.name}</Link>
      </h3>
      {project.tagline && <p className="featured-tagline">{project.tagline}</p>}
      <p>{project.shortDescription}</p>
      <p className="mt-4 font-mono text-xs text-muted">
        {subsystemCount} subsystems · {work.length} technical work{work.length === 1 ? "" : "s"}
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        {project.pillars.map((pillarId) => (
          <PillarBadge key={pillarId} id={pillarId} />
        ))}
      </div>
      <div className="mt-auto pt-6">
        <Link href={`/projects/${project.id}`} className="button-secondary">
          Open project
        </Link>
      </div>
    </article>
  );
}

function ProjectsPage() {
  useEffect(() => {
    setPageMeta("Projects", "Project hierarchy for systems, subsystems, technical work, and related engineering notes.");
  }, []);

  return (
    <PageIntro
      eyebrow="Projects"
      title="Projects are containers for engineering work"
      intro="Each project owns metadata, subsystems, technical work, case studies, notes, and links. Yukti is one project inside this model, not the root of the portfolio."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </PageIntro>
  );
}

function ProjectPage({ project }: { project: Project }) {
  const work = getWorkForProject(project.id);
  const relatedNotes = notes.filter((note) => note.relatedProjectId === project.id);

  useEffect(() => {
    setPageMeta(project.name, project.shortDescription);
  }, [project]);

  return (
    <PageIntro eyebrow="Project" title={project.name} intro={project.longDescription}>
      {project.tagline && (
        <p className="mt-3 font-mono text-sm text-rust">{project.tagline}</p>
      )}
      <div className="mt-10 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="panel">
          <dl className="details-list">
            <div>
              <dt>Status</dt>
              <dd>{project.status}</dd>
            </div>
            <div>
              <dt>Technologies</dt>
              <dd>
                {project.technologies.length
                  ? project.technologies.join(" · ")
                  : "To be added from verified project material"}
              </dd>
            </div>
            <div>
              <dt>Pillars</dt>
              <dd className="flex flex-wrap gap-2">
                {project.pillars.map((pillarId) => (
                  <PillarBadge key={pillarId} id={pillarId} />
                ))}
              </dd>
            </div>
            {project.links.length > 0 && (
              <div>
                <dt>Links</dt>
                <dd className="flex flex-wrap gap-2">
                  {project.links.map((link) => (
                    <a key={link.href} href={link.href} className="tag" rel="noreferrer" target="_blank">
                      {link.label}
                    </a>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        </div>
        <SubsystemTree project={project} />
      </div>
      <div className="mt-10">
        <h2 className="content-heading">Related technical work</h2>
        <div className="mt-4">
          <WorkCards items={work} />
        </div>
      </div>
      <div className="mt-10">
        <h2 className="content-heading">Related notes</h2>
        <NoteList notesToShow={relatedNotes} />
      </div>
    </PageIntro>
  );
}

function SubsystemTree({ project }: { project: Project }) {
  return (
    <section className="panel" aria-labelledby="subsystems-title">
      <h2 id="subsystems-title" className="content-heading">Subsystems</h2>
      <div className="mt-5 space-y-3">
        {project.subsystems.map((subsystem) => (
          <SubsystemNode key={subsystem.id} project={project} subsystem={subsystem} depth={0} />
        ))}
      </div>
    </section>
  );
}

function SubsystemNode({ project, subsystem, depth }: { project: Project; subsystem: Subsystem; depth: number }) {
  return (
    <div className={depth > 0 ? "ml-5 border-l border-line pl-4" : ""}>
      <span className="font-semibold text-ink">{subsystem.title}</span>
      <p className="mt-1 text-sm leading-6 text-muted">{subsystem.description}</p>
      {subsystem.children && (
        <div className="mt-3 space-y-3">
          {subsystem.children.map((child) => (
            <SubsystemNode key={child.id} project={project} subsystem={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

function SubsystemPage({ project, subsystem }: { project: Project; subsystem: Subsystem }) {
  const work = getWorkForSubsystem(project.id, subsystem.id);

  useEffect(() => {
    setPageMeta(`${project.name} / ${subsystem.title}`, subsystem.description);
  }, [project, subsystem]);

  return (
    <PageIntro eyebrow={`${project.name} subsystem`} title={subsystem.title} intro={subsystem.description}>
      <div className="breadcrumb">
        <Link href="/projects">Projects</Link>
        <span>/</span>
        <Link href={`/projects/${project.id}`}>{project.name}</Link>
        <span>/</span>
        <span>{subsystem.title}</span>
      </div>
      {subsystem.children && <div className="mt-8"><SubsystemTree project={{ ...project, subsystems: subsystem.children }} /></div>}
      <div className="mt-10">
        <h2 className="content-heading">Related technical work</h2>
        <div className="mt-4">
          <WorkCards items={work} emptyText="No verified technical work has been published for this subsystem yet." />
        </div>
      </div>
    </PageIntro>
  );
}

function PillarPage({ pillar }: { pillar: Pillar }) {
  const work = getWorkForPillar(pillar.id);
  const relatedNotes = notes.filter((note) => note.pillarIds.includes(pillar.id));

  useEffect(() => {
    setPageMeta(pillar.title, pillar.description);
  }, [pillar]);

  return (
    <PageIntro eyebrow="Engineering pillar" title={pillar.title} intro={pillar.description}>
      <div className="panel">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h2 className="content-heading">Topics</h2>
          <div className="flex flex-wrap gap-2">
            {pillar.topics.map((topic) => (
              <span key={topic} className="chip">
                {topic}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="content-heading">Referenced technical work</h2>
        <div className="mt-4">
          <WorkCards items={work} emptyText="No verified technical work is referenced under this pillar yet." />
        </div>
      </div>
      <div className="mt-10">
        <h2 className="content-heading">Related notes</h2>
        <NoteList notesToShow={relatedNotes} />
      </div>
    </PageIntro>
  );
}

function WorkPage({ work }: { work: TechnicalWork }) {
  const project = getProject(work.projectId);
  const subsystem = project ? findSubsystem(project.subsystems, work.subsystemId) : undefined;
  const relatedNotes = work.relatedNoteIds
    .map((id) => getNote(id))
    .filter((note): note is EngineeringNote => Boolean(note));
  const relatedWorks = technicalWorks.filter(
    (item) => item.id !== work.id && item.projectId === work.projectId
  );

  useEffect(() => {
    setPageMeta(work.title, work.summary);
  }, [work]);

  return (
    <PageIntro eyebrow={work.type.replaceAll("-", " ")} title={work.title} intro={work.summary}>
      <div className="breadcrumb">
        <Link href="/projects">Projects</Link>
        {project && (
          <>
            <span>/</span>
            <Link href={`/projects/${project.id}`}>{project.name}</Link>
          </>
        )}
        {project && subsystem && (
          <>
            <span>/</span>
            <Link href={`/projects/${project.id}/${subsystem.id}`}>{subsystem.title}</Link>
          </>
        )}
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {work.pillars.map((pillarId) => (
          <PillarBadge key={pillarId} id={pillarId} />
        ))}
      </div>
      {work.tags.length > 0 && (
        <p className="mt-4 font-mono text-xs text-muted">{work.tags.map((tag) => `#${tag}`).join(" ")}</p>
      )}
      <article className="technical-page">
        {work.sections.map((section) => (
          <section key={section.label}>
            <h2>{section.label}</h2>
            <ContentBlocks blocks={section.blocks} />
          </section>
        ))}
      </article>
      {relatedNotes.length > 0 && (
        <div className="mt-10">
          <h2 className="content-heading">Related notes</h2>
          <NoteList notesToShow={relatedNotes} />
        </div>
      )}
      {relatedWorks.length > 0 && (
        <div className="mt-10">
          <h2 className="content-heading">More from this project</h2>
          <div className="mt-4">
            <WorkCards items={relatedWorks} emptyText="No other technical work in this project yet." />
          </div>
        </div>
      )}
    </PageIntro>
  );
}

function NotesPage() {
  useEffect(() => {
    setPageMeta("Engineering Notes", "Technical notes infrastructure for storage, systems, algorithms, mathematics, and implementation details.");
  }, []);

  return (
    <PageIntro
      eyebrow="Engineering notes"
      title="Notes are first-class technical content"
      intro="Notes can relate to projects, subsystems, pillars, and technical work. Draft and planned placeholders exist only where verified article content is not yet available."
    >
      <NoteList notesToShow={notes} initial={0} />
    </PageIntro>
  );
}

function NotePage({ note }: { note: EngineeringNote }) {
  const project = note.relatedProjectId ? getProject(note.relatedProjectId) : undefined;
  const subsystem = project ? findSubsystem(project.subsystems, note.relatedSubsystemId) : undefined;
  const readingTime = estimateReadingTime(note.content);

  const relatedWorks = technicalWorks.filter((work) => {
    if (work.relatedNoteIds.includes(note.id)) return true;
    if (note.relatedProjectId && work.projectId === note.relatedProjectId) {
      if (!note.relatedSubsystemId) return true;
      return work.subsystemId === note.relatedSubsystemId;
    }
    return false;
  });

  const relatedNotes = notes.filter(
    (candidate) =>
      candidate.id !== note.id &&
      (candidate.relatedProjectId === note.relatedProjectId ||
        candidate.pillarIds.some((pillar) => note.pillarIds.includes(pillar)))
  );

  useEffect(() => {
    setPageMeta(note.title, note.description);
  }, [note]);

  return (
    <PageIntro eyebrow={note.category} title={note.title} intro={note.description}>
      <div className="breadcrumb">
        <Link href="/notes">Notes</Link>
        {project && (
          <>
            <span>/</span>
            <Link href={`/projects/${project.id}`}>{project.name}</Link>
          </>
        )}
        {project && subsystem && (
          <>
            <span>/</span>
            <Link href={`/projects/${project.id}/${subsystem.id}`}>{subsystem.title}</Link>
          </>
        )}
      </div>
      <p className="mt-6 font-mono text-xs uppercase text-muted">
        {note.status} · {readingTime}
        {note.date ? ` · ${note.date}` : ""}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {note.pillarIds.map((pillarId) => (
          <PillarBadge key={pillarId} id={pillarId} />
        ))}
      </div>
      {note.tags.length > 0 && (
        <p className="mt-4 font-mono text-xs text-muted">{note.tags.map((tag) => `#${tag}`).join(" ")}</p>
      )}
      <article className="technical-page">
        {note.content.map((section) => (
          <section key={section.label}>
            <h2>{section.label}</h2>
            <ContentBlocks blocks={section.blocks} />
          </section>
        ))}
      </article>
      {relatedWorks.length > 0 && (
        <div className="mt-10">
          <h2 className="content-heading">Related technical work</h2>
          <div className="mt-4">
            <WorkCards items={relatedWorks} />
          </div>
        </div>
      )}
      {relatedNotes.length > 0 && (
        <div className="mt-10">
          <h2 className="content-heading">Related notes</h2>
          <NoteList notesToShow={relatedNotes} />
        </div>
      )}
    </PageIntro>
  );
}

function ShowAllGrid<T>({
  items,
  render,
  initial = 2,
  emptyText,
  gridClassName = "grid gap-4 md:grid-cols-2"
}: {
  items: T[];
  render: (item: T) => React.ReactNode;
  initial?: number;
  emptyText: string;
  gridClassName?: string;
}) {
  const [expanded, setExpanded] = useState(false);

  if (!items.length) {
    return <p className="empty-state">{emptyText}</p>;
  }

  const visible = expanded || initial === 0 ? items : items.slice(0, initial);

  return (
    <>
      <div className={gridClassName}>
        {visible.map((item) => render(item))}
      </div>
      {initial > 0 && items.length > initial && (
        <div className="mt-5">
          <button
            type="button"
            className="button-secondary"
            onClick={() => setExpanded((value) => !value)}
          >
            {expanded ? "Show less" : `Show all (${items.length})`}
          </button>
        </div>
      )}
    </>
  );
}

function WorkCards({ items, initial = 2, emptyText }: { items: TechnicalWork[]; initial?: number; emptyText?: string }) {
  return (
    <ShowAllGrid
      items={items}
      initial={initial}
      emptyText={emptyText ?? "No verified technical work has been published yet."}
      render={(work) => <WorkCard key={work.id} work={work} />}
    />
  );
}

function NoteList({ notesToShow, initial = 2 }: { notesToShow: EngineeringNote[]; initial?: number }) {
  const order = { published: 0, draft: 1, planned: 2 };
  const sorted = [...notesToShow].sort((a, b) => order[a.status] - order[b.status]);

  return (
    <ShowAllGrid
      items={sorted}
      initial={initial}
      emptyText="No related notes have been published yet."
      render={(note) => <NoteCard key={note.id} note={note} />}
    />
  );
}

function AboutPage() {
  useEffect(() => {
    setPageMeta("About", "How the portfolio is organized and the engineering philosophy behind it.");
  }, []);

  return (
    <>
      <section className="hero">
        <div className="mx-auto max-w-7xl px-5 py-16 md:py-24">
          <p className="eyebrow">About</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-ink md:text-6xl">
            {profile.name}
          </h1>
          <p className="mt-3 font-mono text-sm text-rust">{profile.course} · {profile.location}</p>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
            I am a final-year computer science student. Most of my time goes into building and breaking software:
            distributed systems, storage engines, and full-stack applications. This page is about how I work, not a
            rehearsed biography.
          </p>
          <div className="about-statement mt-8">
            <p>I love building systems that evolve, and designing for evolution is what engineering is for.</p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a className="button-primary" href={`mailto:${contact.email}`}>
              Email
            </a>
            <a className="button-secondary" href={contact.github} rel="noreferrer" target="_blank">
              GitHub
            </a>
            <a className="button-secondary" href={contact.linkedin} rel="noreferrer" target="_blank">
              LinkedIn
            </a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div className="mb-3 flex items-center gap-4">
            <span className="section-label">Working method</span>
            <span className="section-rule" aria-hidden="true" />
          </div>
          <h2>How I work</h2>
          <p>Every technical page follows the same loop, and every project keeps its work in one place.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="panel">
            <h3 className="font-semibold">A fixed chain for every page</h3>
            <p className="mt-3 text-sm leading-6 text-muted">
              Why the work exists, the constraints around it, the approach I picked, the alternatives I rejected, and
              how it behaves in practice. Implementation is always presented with measurements and honest trade-offs.
            </p>
          </div>
          <div className="panel">
            <h3 className="font-semibold">Projects are containers, not identity</h3>
            <p className="mt-3 text-sm leading-6 text-muted">
              A project owns its subsystems, technical work, and notes. A piece of work can belong to a project and to
              one or more pillars at the same time, without duplicating the underlying content.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div className="mb-3 flex items-center gap-4">
            <span className="section-label">Stack</span>
            <span className="section-rule" aria-hidden="true" />
          </div>
          <h2>Technical stack</h2>
          <p>Everything here comes from verified project material.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stackGroups.map((group) => (
            <div key={group.label} className="panel">
              <h3 className="font-semibold">{group.label}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">{group.items.join(" · ")}</p>
            </div>
          ))}
        </div>
      </section>

      <ContactBand />
    </>
  );
}

function ContactBand() {
  return (
    <section className="bg-panel">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-14 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="eyebrow !mb-2">Contact</p>
          <h2 className="text-2xl font-semibold tracking-tight text-ink md:text-3xl">Open to engineering conversations</h2>
          <p className="mt-3 max-w-xl text-base leading-7 text-muted">
            Reach out for system design, storage engines, distributed systems, low-level design, or implementation
            discussions.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a className="button-primary" href={`mailto:${contact.email}`}>
            Email
          </a>
          <a className="button-secondary" href={contact.linkedin} rel="noreferrer" target="_blank">
            LinkedIn
          </a>
          <a className="button-secondary" href={contact.github} rel="noreferrer" target="_blank">
            GitHub
          </a>
        </div>
      </div>
    </section>
  );
}

function PageIntro({
  eyebrow,
  title,
  intro,
  children
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-7xl px-5 py-12 md:py-16">
      <div className="max-w-3xl">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="page-title">{title}</h1>
        <p className="mt-5 text-lg leading-8 text-muted">{intro}</p>
      </div>
      <div className="mt-10">{children}</div>
    </div>
  );
}

function NotFoundPage() {
  useEffect(() => {
    setPageMeta("Not Found", "The requested portfolio page was not found.");
  }, []);

  return (
    <PageIntro eyebrow="404" title="Page not found" intro="This route does not match a project, subsystem, pillar, note, or technical work entry.">
      <Link href="/" className="button-primary">Return home</Link>
    </PageIntro>
  );
}

export default function App() {
  const path = usePathname();

  const page = useMemo(() => {
    if (path === "/") return <HomePage />;
    if (path === "/projects") return <ProjectsPage />;
    if (path === "/notes") return <NotesPage />;
    if (path === "/about") return <AboutPage />;

    const parts = path.split("/").filter(Boolean);
    if (parts[0] === "pillars" && parts[1]) {
      const pillar = pillars.find((item) => item.id === parts[1]);
      return pillar ? <PillarPage pillar={pillar} /> : <NotFoundPage />;
    }

    if (parts[0] === "projects" && parts[1]) {
      const project = projects.find((item) => item.id === parts[1]);
      if (!project) return <NotFoundPage />;
      if (parts[2]) {
        const subsystem = findSubsystem(project.subsystems, parts[2]);
        return subsystem ? <SubsystemPage project={project} subsystem={subsystem} /> : <NotFoundPage />;
      }
      return <ProjectPage project={project} />;
    }

    if (parts[0] === "work" && parts[1]) {
      const work = technicalWorks.find((item) => item.id === parts[1]);
      return work ? <WorkPage work={work} /> : <NotFoundPage />;
    }

    if (parts[0] === "notes" && parts[1]) {
      const note = notes.find((item) => item.id === parts[1]);
      return note ? <NotePage note={note} /> : <NotFoundPage />;
    }

    return <NotFoundPage />;
  }, [path]);

  return <Layout path={path}>{page}</Layout>;
}
