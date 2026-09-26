import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { projects, type Project } from "../data/projects";

const filters = [
  "ALL",
  "WEB / FULL-STACK",
  "AI / VISION",
  "QA AUTOMATION",
  "SOFTWARE",
  "IOT / EMBEDDED",
  "CLIENT PROJECTS",
];

const routeForProject: Record<string, string> = {
  "japanese-character": "/projects/japanese-character",
  competencyiq: "/projects/competencyiq",
  "qa-automation": "/projects/qa-automation",
  "smart-parking": "/projects/smart-parking",
  motorph: "/projects/motorph",
  "water-dispenser": "/projects/water-dispenser",
  aiquanta: "/projects/aiquanta",
  "portfolio-website": "/projects/portfolio-website",
  "thermal-therapy-device": "/projects/client/thermal-therapy-device",
  "wallpaper-applicator": "/projects/client/wallpaper-applicator",
  "iot-water-quality": "/projects/client/iot-water-quality",
  "piso-wifi": "/projects/client/piso-wifi",
};

function matchesFilter(project: Project, filter: string) {
  const value = `${project.category} ${project.title}`.toUpperCase();

  if (filter === "ALL") return true;
  if (filter === "CLIENT PROJECTS") return Boolean(project.clientProject);
  if (filter === "WEB / FULL-STACK") {
    return value.includes("WEB") || value.includes("FULL-STACK") || value.includes("AIQUANTA") || value.includes("PORTFOLIO");
  }
  if (filter === "AI / VISION") {
    return value.includes("AI") || value.includes("COMPUTER VISION");
  }
  return value.includes(filter);
}

function ProjectInsightPicker({
  selectedProject,
  primaryProjects,
  clientProjects,
  onSelect,
}: {
  selectedProject: Project;
  primaryProjects: Project[];
  clientProjects: Project[];
  onSelect: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (!pickerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const choose = (id: string) => {
    onSelect(id);
    setOpen(false);
  };

  return (
    <div className="project-lab-mobile-selector" ref={pickerRef}>
      <label id="project-insight-picker-label">CHOOSE PROJECT</label>
      <button
        type="button"
        className="project-lab-mobile-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby="project-insight-picker-label"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="project-lab-mobile-trigger-number">{selectedProject.number}</span>
        <span className="project-lab-mobile-trigger-title">{selectedProject.title}</span>
        <i aria-hidden="true">⌄</i>
      </button>

      {open && (
        <div className="project-lab-mobile-menu" role="listbox" aria-label="Choose project for Project Insight">
          <span className="project-lab-mobile-group-label">PROJECT ARCHIVE</span>
          {primaryProjects.map((project) => (
            <button
              type="button"
              role="option"
              aria-selected={selectedProject.id === project.id}
              key={project.id}
              className={selectedProject.id === project.id ? "active" : ""}
              onClick={() => choose(project.id)}
            >
              <b>{project.number}</b>
              <span>{project.title}</span>
            </button>
          ))}
          <span className="project-lab-mobile-group-label">FREELANCE / CLIENT PROJECTS</span>
          {clientProjects.map((project) => (
            <button
              type="button"
              role="option"
              aria-selected={selectedProject.id === project.id}
              key={project.id}
              className={selectedProject.id === project.id ? "active" : ""}
              onClick={() => choose(project.id)}
            >
              <b>{project.number}</b>
              <span>{project.title}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectLabCard({
  project,
  displayNumber,
  selected,
  onSelect,
}: {
  project: Project;
  displayNumber: string;
  selected: boolean;
  onSelect: () => void;
}) {
  const route = routeForProject[project.id];

  return (
    <article className={`project-lab-card${selected ? " is-selected" : ""}`}>
      <button
        type="button"
        className="project-lab-select"
        onClick={onSelect}
        aria-pressed={selected}
      >
        <span className="project-lab-card-image">
          {project.image ? (
            <img src={project.image} alt={`${project.title} project preview`} />
          ) : (
            <span className="project-lab-artifact-empty">CLIENT PROJECT · VISUAL LIMITED</span>
          )}
          <span className="project-lab-card-number">{displayNumber}</span>
          {project.clientProject && <span className="project-lab-client-badge">CLIENT</span>}
        </span>

        <span className="project-lab-card-body">
          <span className="project-lab-card-category">{project.category}</span>
          <strong>{project.title}</strong>
          <span className="project-lab-card-description">{project.description}</span>
          <span className="project-lab-card-techs">
            {project.technologies.slice(0, 4).map((technology) => (
              <span key={technology}>{technology}</span>
            ))}
          </span>
        </span>

        <span className="project-lab-card-arrow" aria-hidden="true">↗</span>
      </button>

      <div className="project-lab-card-action">
        {route && (
          <Link to={route}>{project.clientProject ? "View Client Project Brief" : "View Project Brief"} <b>→</b></Link>
        )}
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Live Website <b>↗</b>
          </a>
        )}
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub <b>↗</b>
          </a>
        )}
        {!route && !project.liveUrl && !project.github && (
          <span className="project-lab-card-client-note">
            {project.clientProject ? "Client project · Open brief" : "Select for project insight"}
          </span>
        )}
      </div>
    </article>
  );
}

export default function ProjectsPage() {
  const firstProject = projects.find((project) => project.id === "aiquanta") ?? projects[0];
  const projectOrder = firstProject
    ? [firstProject, ...projects.filter((project) => project.id !== firstProject.id)]
    : projects;

  const primaryProjects = projectOrder.filter((project) => project.archiveGroup !== "client");
  const clientProjects = projectOrder.filter((project) => project.archiveGroup === "client");

  const [filter, setFilter] = useState("ALL");
  const [selectedId, setSelectedId] = useState(firstProject?.id ?? "");

  const selectedProject = projectOrder.find((project) => project.id === selectedId) ?? firstProject;
  const visiblePrimaryProjects = primaryProjects.filter((project) => matchesFilter(project, filter));
  const visibleClientProjects = clientProjects.filter((project) => matchesFilter(project, filter));

  if (!selectedProject) return null;

  const selectedRoute = routeForProject[selectedProject.id];
  const displayNumberFor = (project: Project) => project.number;

  const renderArchiveGrid = (items: Project[]) => (
    <div className="project-lab-grid">
      {items.map((project) => (
        <ProjectLabCard
          key={project.id}
          project={project}
          displayNumber={displayNumberFor(project)}
          selected={selectedProject.id === project.id}
          onSelect={() => setSelectedId(project.id)}
        />
      ))}
    </div>
  );

  return (
    <main className="projects-lab-page">
      <header className="projects-lab-header">
        <div className="projects-lab-heading-copy">
          <span className="projects-lab-kicker">PROJECTS</span>
          <span className="projects-lab-subkicker">SYSTEMS I HAVE BUILT</span>
          <h1>
            From engineering problems<br />
            to <span>working systems.</span>
          </h1>
        </div>

        <div className="projects-lab-intro">
          <span>ENGINEERING PROJECT ARCHIVE</span>
          <p>
            A collection of software, AI, QA automation, web, IoT, embedded, and client engineering work.
            Each project documents a practical problem, the system built around it, and the tools used to bring it together.
          </p>
          <div className="projects-lab-process" aria-label="Engineering process">
            <span>BUILD</span><i>→</i><span>INTEGRATE</span><i>→</i><span>TEST</span><i>→</i><span>REFINE</span>
          </div>
        </div>
      </header>

      <section className="project-lab-insight project-lab-insight-primary" aria-label="Project insight">
        <aside className="project-lab-insight-nav">
          <span>PROJECT INSIGHT</span>
          <small>SELECT A SYSTEM</small>

          <ProjectInsightPicker
            selectedProject={selectedProject}
            primaryProjects={primaryProjects}
            clientProjects={clientProjects}
            onSelect={setSelectedId}
          />

          <div className="project-lab-desktop-selector" aria-label="Choose project">
            <span className="project-lab-selector-group-label">PROJECT ARCHIVE</span>
            {primaryProjects.map((project) => (
              <button
                type="button"
                key={project.id}
                onClick={() => setSelectedId(project.id)}
                className={selectedProject.id === project.id ? "active" : ""}
                aria-label={`Select ${project.title}`}
              >
                <b>{project.number}</b>
                <span>{project.title}</span>
              </button>
            ))}

            <span className="project-lab-selector-group-label">FREELANCE / CLIENT</span>
            {clientProjects.map((project) => (
              <button
                type="button"
                key={project.id}
                onClick={() => setSelectedId(project.id)}
                className={selectedProject.id === project.id ? "active" : ""}
                aria-label={`Select ${project.title}`}
              >
                <b>{project.number}</b>
                <span>{project.title}</span>
              </button>
            ))}
          </div>
        </aside>

        <div className="project-lab-insight-main">
          <div className="project-lab-insight-heading">
            <span>{selectedProject.category}</span>
            <h2>{selectedProject.title}</h2>
            <small>{selectedProject.projectType ?? "ENGINEERING PROJECT"}</small>
          </div>

          <p className="project-lab-insight-description">
            {selectedProject.description}
          </p>

          <div className="project-lab-insight-grid">
            <div>
              <span>PROJECT TYPE</span>
              <strong>{selectedProject.clientProject ? "FREELANCE / CLIENT PROJECT" : (selectedProject.projectType ?? selectedProject.category)}</strong>
            </div>
            <div>
              <span>ROLE / CONTRIBUTION</span>
              <strong>{selectedProject.role ?? "System Development · Integration · Testing"}</strong>
            </div>
            <div>
              <span>TECHNOLOGIES</span>
              <strong>{selectedProject.technologies.slice(0, 7).join(" · ")}</strong>
            </div>
            <div>
              <span>ACCESS</span>
              <strong>
                {selectedProject.clientProject ? "CLIENT PROJECT" : (selectedRoute ? "PROJECT BRIEF" : "PROJECT INSIGHT")}
              </strong>
            </div>
          </div>

          <div className="project-lab-insight-actions">
            {selectedRoute && (
              <Link className="project-lab-primary-action" to={selectedRoute}>
                {selectedProject.clientProject ? "View Client Project Brief" : "View Project Brief"} <b>→</b>
              </Link>
            )}
            {selectedProject.liveUrl && (
              <a
                className="project-lab-secondary-action"
                href={selectedProject.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Live Website <b>↗</b>
              </a>
            )}
            {selectedProject.github && (
              <a
                className="project-lab-secondary-action"
                href={selectedProject.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub <b>↗</b>
              </a>
            )}
          </div>
        </div>

        <div className="project-lab-insight-artifact">
          <div className="project-lab-artifact-label">
            <span>ARTIFACT</span>
            <b>PROJECT VIEW</b>
          </div>
          {selectedProject.image ? (
            <img src={selectedProject.image} alt={`${selectedProject.title} artifact`} loading="eager" decoding="async" />
          ) : (
            <div className="project-lab-artifact-empty">CLIENT PROJECT · VISUAL LIMITED</div>
          )}
        </div>
      </section>

      <section className="project-lab-global-filters" aria-label="Project filters">
        <div>
          <span className="projects-lab-kicker">FILTER SYSTEMS</span>
          <span className="project-lab-archive-note">BROWSE BY ENGINEERING DOMAIN OR CLIENT DELIVERY</span>
        </div>
        <div className="project-lab-filter-bar" role="tablist" aria-label="Project filters">
          {filters.map((item) => (
            <button
              key={item}
              type="button"
              className={filter === item ? "active" : ""}
              onClick={() => setFilter(item)}
              role="tab"
              aria-selected={filter === item}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      {visiblePrimaryProjects.length > 0 && (
        <section className="project-lab-archive" aria-label="Primary project archive">
          <div className="project-lab-archive-header project-lab-section-header">
            <div>
              <span className="projects-lab-kicker">PROJECT ARCHIVE</span>
              <span className="project-lab-archive-note">SELECT A SYSTEM TO UPDATE THE PROJECT INSIGHT ABOVE</span>
            </div>
          </div>

          {renderArchiveGrid(visiblePrimaryProjects)}
        </section>
      )}

      {visibleClientProjects.length > 0 && (
        <section className="project-lab-archive project-lab-client-archive" aria-label="Freelance and client projects">
          <div className="project-lab-client-heading">
            <div>
              <span className="projects-lab-kicker">FREELANCE / CLIENT ENGINEERING</span>
              <span className="project-lab-archive-note">PAID TECHNICAL WORK · PROTOTYPING · DEPLOYMENT · TROUBLESHOOTING</span>
            </div>
          </div>

          {renderArchiveGrid(visibleClientProjects)}
        </section>
      )}

      {visiblePrimaryProjects.length === 0 && visibleClientProjects.length === 0 && (
        <section className="project-lab-empty" aria-live="polite">
          No projects match this filter.
        </section>
      )}

      <footer className="projects-lab-footer">
        <div>
          <span>PROJECT ARCHIVE</span>
          <strong>Built to show how engineering becomes software.</strong>
        </div>
        <Link to="/resume">View Resume →</Link>
      </footer>
    </main>
  );
}
