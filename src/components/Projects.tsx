import { projects } from "../data/projects";
import ProjectCard from "./ProjectCard";

export default function Projects() {

  const featuredProject =
    projects.find(
      (project) =>
        project.id ===
        "japanese-character"
    );

  const otherProjects =
    projects.filter(
      (project) =>
        project.id !==
        "japanese-character"
    );


  return (

    <section
      id="projects"
      className="projects-section"
    >

      {/* =====================================
          SECTION HEADER
      ====================================== */}

      <div className="section-heading">

        <p className="section-label">
          SELECTED WORK
        </p>

        <h2>
          Projects
        </h2>

        <p>
          A collection of software,
          artificial intelligence,
          QA automation, IoT,
          and embedded systems
          projects.
        </p>

      </div>


      {/* =====================================
          FEATURED PROJECT
      ====================================== */}

      {featuredProject && (

        <div className="featured-project">

          <ProjectCard
            project={
              featuredProject
            }
          />

        </div>

      )}


      {/* =====================================
          OTHER PROJECTS
      ====================================== */}

      <div className="projects-grid">

        {otherProjects.map(
          (project) => (

            <ProjectCard
              key={project.id}
              project={project}
            />

          )
        )}

      </div>

    </section>

  );
}