import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Project } from "../data/projects";
import PortfolioSystemThumbnail from "./PortfolioSystemThumbnail";

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

    aiquanta:
      "/projects/aiquanta",

    "portfolio-website":
      "/projects/portfolio-website",

  };


  const projectRoute =
    projectRoutes[project.id];

  const isPortfolioProject = project.id === "portfolio-website";


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

          {project.clientProject && (
            <span className="project-client-tag">
              CLIENT PROJECT
            </span>
          )}

        </div>


        {/* =================================================
            PROJECT IMAGE
        ================================================= */}

        {isPortfolioProject ? (
          <PortfolioSystemThumbnail />
        ) : project.restricted ? (
          <div className="project-image project-image-restricted">
            <span>CLIENT-RESTRICTED</span>
            <strong>Project visual withheld</strong>
            <small>Selected client information is intentionally not published.</small>
          </div>
        ) : project.image ? (
          <button
            type="button"
            className="project-image-button"
            onClick={() => setIsImageOpen(true)}
            aria-label={`View ${project.title} image`}
          >
            <div className="project-image">
              <img src={project.image} alt={`${project.title} project`} />
              <div className="image-overlay"><span>Click to enlarge</span></div>
            </div>
          </button>
        ) : (
          <div className="project-image project-image-restricted">
            <span>PROJECT VISUAL</span>
            <strong>Visual not published</strong>
          </div>
        )}


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
                View Project Brief →
              </Link>

            )}


            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="project-action-link"
              >
                Live Website ↗
              </a>
            )}

            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="project-action-link"
              >
                View GitHub ↗
              </a>
            )}

          </div>

        </div>

      </article>


      {/* =================================================
          IMAGE LIGHTBOX
      ================================================= */}

      {isImageOpen && project.image && !isPortfolioProject && (

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