import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Project } from "../data/projects";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({
  project,
}: ProjectCardProps) {

  const [isImageOpen, setIsImageOpen] =
    useState(false);


  // =====================================================
  // ESCAPE KEY
  // =====================================================

  useEffect(() => {

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {

      if (event.key === "Escape") {
        setIsImageOpen(false);
      }

    };


    if (isImageOpen) {

      document.addEventListener(
        "keydown",
        handleKeyDown
      );

      document.body.style.overflow =
        "hidden";

    }


    return () => {

      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

      document.body.style.overflow = "";

    };

  }, [isImageOpen]);


  // =====================================================
  // PROJECT ROUTE
  // =====================================================

  const projectRoutes: Record<
    string,
    string
  > = {

    "japanese-character":
      "/projects/japanese-character",

    competencyiq:
      "/projects/competencyiq",

    "qa-automation":
      "/projects/qa-automation",

    "smart-parking":
      "/projects/smart-parking",

    motorph:
      "/projects/motorph",

    "water-dispenser":
      "/projects/water-dispenser",

  };


  const projectRoute =
    projectRoutes[project.id];


  return (
    <>

      {/* =================================================
          PROJECT CARD
      ================================================= */}

      <article
        className={`project-card ${
          project.featured
            ? "project-card-featured"
            : ""
        }`}
      >


        {/* =================================================
            PROJECT HEADER
        ================================================= */}

        <div className="project-card-top">

          <span className="project-number">
            {project.number}
          </span>

          <span className="project-category">
            {project.category}
          </span>

        </div>


        {/* =================================================
            PROJECT IMAGE
        ================================================= */}

        <button
          type="button"
          className="project-image-button"
          onClick={() =>
            setIsImageOpen(true)
          }
          aria-label={`View ${project.title} image`}
        >

          <div className="project-image">

            <img
              src={project.image}
              alt={`${project.title} project`}
            />

            <div className="image-overlay">

              <span>
                Click to enlarge
              </span>

            </div>

          </div>

        </button>


        {/* =================================================
            PROJECT CONTENT
        ================================================= */}

        <div className="project-content">

          <h3>
            {project.title}
          </h3>


          <p>
            {project.description}
          </p>


          {/* =================================================
              METRICS
          ================================================= */}

          {project.metrics &&
            project.metrics.length > 0 && (

              <div className="project-metrics">

                {project.metrics.map(
                  (metric) => (

                    <div
                      className="metric"
                      key={metric.label}
                    >

                      <strong>
                        {metric.value}
                      </strong>

                      <span>
                        {metric.label}
                      </span>

                    </div>

                  )
                )}

              </div>

            )}


          {/* =================================================
              TECHNOLOGIES
          ================================================= */}

          <div className="project-technologies">

            {project.technologies.map(
              (technology) => (

                <span
                  key={technology}
                >
                  {technology}
                </span>

              )
            )}

          </div>


          {/* =================================================
              PROJECT ACTIONS
          ================================================= */}

          <div className="project-actions">

            {projectRoute && (

              <Link
                to={projectRoute}
                className="project-action-link"
              >
                View Case Study →
              </Link>

            )}


            {project.id ===
              "qa-automation" &&
              project.github && (

                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-action-link"
                >
                  View GitHub →
                </a>

              )}

          </div>

        </div>

      </article>


      {/* =================================================
          IMAGE LIGHTBOX
      ================================================= */}

      {isImageOpen && (

        <div
          className="image-lightbox"
          onClick={() =>
            setIsImageOpen(false)
          }
        >


          {/* CLOSE */}

          <button
            type="button"
            className="lightbox-close"
            onClick={(event) => {

              event.stopPropagation();

              setIsImageOpen(false);

            }}
            aria-label="Close image"
          >
            ×
          </button>


          {/* IMAGE */}

          <div
            className="lightbox-content"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <img
              src={project.image}
              alt={`${project.title} enlarged`}
            />

            <div className="lightbox-caption">
              {project.title}
            </div>

          </div>

        </div>

      )}

    </>
  );
}