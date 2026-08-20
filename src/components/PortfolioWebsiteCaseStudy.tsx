import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import portfolioWebsiteImage from "../assets/projects/portfolio-website.png";

// NOTE: this component intentionally reuses the existing
// ".motorph-*" CSS classes from App.css so it matches the visual
// style of the other case study pages without needing any new CSS.

export default function PortfolioWebsiteCaseStudy() {
  const [isImageOpen, setIsImageOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsImageOpen(false);
      }
    };

    if (isImageOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isImageOpen]);

  return (
    <main className="motorph-case-study">

      {/* =================================================
          HERO
      ================================================= */}

      <section className="motorph-header">

        <p className="section-label">
          PROJECT 07 / WEB DEVELOPMENT
        </p>

        <h1>
          Personal Portfolio
          <br />
          Website
        </h1>

        <p className="motorph-intro">
          A personal portfolio site built to showcase
          software development, QA automation, and AI
          projects — designed and developed from scratch
          using React, TypeScript, and Vite, and deployed
          through Netlify.
        </p>

      </section>


      {/* =================================================
          PROJECT OVERVIEW
      ================================================= */}

      <section className="motorph-overview">

        <div>
          <span>
            PROJECT TYPE
          </span>

          <strong>
            Personal Website
          </strong>
        </div>

        <div>
          <span>
            LANGUAGE
          </span>

          <strong>
            TypeScript
          </strong>
        </div>

        <div>
          <span>
            DEVELOPMENT
          </span>

          <strong>
            Vite + VS Code
          </strong>
        </div>

        <div>
          <span>
            DEPLOYMENT
          </span>

          <strong>
            Netlify
          </strong>
        </div>

      </section>


      {/* =================================================
          01 / OBJECTIVE
      ================================================= */}

      <section className="motorph-block">

        <p className="section-label">
          01 / OBJECTIVE
        </p>

        <h2>
          Build a single place to showcase
          my work across three roles.
        </h2>

        <p>
          I wanted one site that could represent my
          range as a Computer Engineering graduate —
          software development, QA automation, and AI —
          instead of three disconnected resumes with
          no shared home.
        </p>

        <p>
          The goal was a fast, clean, single-page-app
          style portfolio: a homepage that introduces
          me, a projects section with real case studies,
          and a resume page that lets recruiters pick
          the version most relevant to the role they're
          hiring for.
        </p>

      </section>


      {/* =================================================
          02 / TOOLS & LANGUAGES
      ================================================= */}

      <section className="motorph-block">

        <p className="section-label">
          02 / TOOLS &amp; LANGUAGES
        </p>

        <h2>
          The stack behind the site.
        </h2>

        <div className="motorph-feature-grid">

          <div>
            <span>
              01
            </span>

            <strong>
              React
            </strong>

            <p>
              Component-based UI library used to
              build every section of the site.
            </p>
          </div>


          <div>
            <span>
              02
            </span>

            <strong>
              TypeScript
            </strong>

            <p>
              Added type safety across components,
              route props, and project data.
            </p>
          </div>


          <div>
            <span>
              03
            </span>

            <strong>
              Vite
            </strong>

            <p>
              Fast dev server and build tool used
              instead of Create React App.
            </p>
          </div>


          <div>
            <span>
              04
            </span>

            <strong>
              React Router
            </strong>

            <p>
              Handles navigation between the homepage,
              projects, case studies, and resume page.
            </p>
          </div>


          <div>
            <span>
              05
            </span>

            <strong>
              Hand-Written CSS
            </strong>

            <p>
              A custom dark-mode design system built
              without a CSS framework, for full control
              over layout and styling.
            </p>
          </div>


          <div>
            <span>
              06
            </span>

            <strong>
              Git &amp; GitHub
            </strong>

            <p>
              Used for version control and to host the
              project's source code.
            </p>
          </div>

        </div>

      </section>


      {/* =================================================
          03 / DEVELOPMENT WORKFLOW
      ================================================= */}

      <section className="motorph-block">

        <p className="section-label">
          03 / DEVELOPMENT WORKFLOW
        </p>

        <h2>
          From layout plan to live site.
        </h2>

        <div className="motorph-flow">

          <div>
            Plan Sections
          </div>

          <span>
            →
          </span>

          <div>
            Build Components
          </div>

          <span>
            →
          </span>

          <div>
            Style &amp; Design
          </div>

          <span>
            →
          </span>

          <div>
            Add Project Content
          </div>

          <span>
            →
          </span>

          <div>
            Test &amp; Deploy
          </div>

        </div>

      </section>


      {/* =================================================
          04 / STRUCTURE & DESIGN
      ================================================= */}

      <section className="motorph-block">

        <p className="section-label">
          04 / STRUCTURE &amp; DESIGN
        </p>

        <h2>
          Organizing the site around
          reusable components.
        </h2>

        <p>
          The site is broken into a Navbar, a Home page
          with Hero / About / Skills / Contact sections,
          a Projects page that lists every project, a
          dedicated case-study page per project, and a
          Resume page that serves role-specific PDFs.
        </p>


        <div className="motorph-oop-grid">

          <div>
            <strong>
              Component Reuse
            </strong>

            <p>
              Shared components like the Navbar and
              project cards are reused across pages
              instead of duplicated.
            </p>
          </div>


          <div>
            <strong>
              Routing
            </strong>

            <p>
              React Router maps each URL path to the
              page or case-study component that should
              render there.
            </p>
          </div>


          <div>
            <strong>
              Design System
            </strong>

            <p>
              A consistent dark color palette, spacing
              scale, and typography are reused across
              every section.
            </p>
          </div>


          <div>
            <strong>
              Responsiveness
            </strong>

            <p>
              Layouts adjust for smaller screens so the
              site stays usable on mobile devices.
            </p>
          </div>

        </div>

      </section>


      {/* =================================================
          05 / CONTENT & DATA
      ================================================= */}

      <section className="motorph-block">

        <p className="section-label">
          05 / CONTENT &amp; DATA
        </p>

        <h2>
          Keeping project and resume
          content easy to update.
        </h2>

        <p>
          Each project's details — title, description,
          technologies, and images — are defined as
          structured data rather than hardcoded into
          the page markup, so new projects can be added
          without rebuilding the layout each time. The
          Resume page follows the same pattern, mapping
          each tailored PDF to its role and description.
        </p>

      </section>


      {/* =================================================
          06 / TESTING & DEPLOYMENT
      ================================================= */}

      <section className="motorph-block">

        <p className="section-label">
          06 / TESTING &amp; DEPLOYMENT
        </p>

        <h2>
          From local preview to a
          live public link.
        </h2>

        <div className="motorph-processing">

          <div>
            <span>
              01
            </span>

            <strong>
              Local Dev Server
            </strong>

            <p>
              Ran the site locally with Vite to preview
              changes instantly during development.
            </p>
          </div>


          <div>
            <span>
              02
            </span>

            <strong>
              Cross-Device Check
            </strong>

            <p>
              Reviewed layout and navigation on desktop
              and mobile screen sizes.
            </p>
          </div>


          <div>
            <span>
              03
            </span>

            <strong>
              Production Build
            </strong>

            <p>
              Built an optimized production bundle
              ready for deployment.
            </p>
          </div>


          <div>
            <span>
              04
            </span>

            <strong>
              Netlify Deployment
            </strong>

            <p>
              Deployed the build to Netlify, connected
              to the GitHub repository for updates.
            </p>
          </div>

        </div>

      </section>


      {/* =================================================
          07 / TECHNOLOGIES
      ================================================= */}

      <section className="motorph-block">

        <p className="section-label">
          07 / TECHNOLOGIES
        </p>

        <div className="motorph-tech">

          <span>
            React
          </span>

          <span>
            TypeScript
          </span>

          <span>
            Vite
          </span>

          <span>
            React Router
          </span>

          <span>
            CSS
          </span>

          <span>
            Git / GitHub
          </span>

          <span>
            Netlify
          </span>

        </div>

      </section>


      {/* =================================================
          FINAL OUTPUT
      ================================================= */}

      <section className="motorph-image">

        <button
          type="button"
          className="motorph-image-button"
          onClick={() => setIsImageOpen(true)}
          aria-label="Enlarge Personal Portfolio Website image"
        >

          <img
            src={portfolioWebsiteImage}
            alt="Personal Portfolio Website"
          />

          <span>
            Click to enlarge
          </span>

        </button>

      </section>


      {/* =================================================
          08 / ENGINEERING EXPERIENCE
      ================================================= */}

      <section className="motorph-block">

        <p className="section-label">
          08 / ENGINEERING EXPERIENCE
        </p>

        <h2>
          Applying the same build-and-test
          mindset to a personal project.
        </h2>

        <p>
          Building this site gave me hands-on practice
          with component-based frontend development,
          TypeScript, client-side routing, and deploying
          a production build — the same problem-solving
          and testing mindset I bring to my software and
          QA automation projects, applied here to a
          public-facing web application.
        </p>

      </section>


      {/* =================================================
          PROJECT NOTE
      ================================================= */}

      <section className="motorph-note">

        <p className="section-label">
          PROJECT NOTE
        </p>

        <p>
          This portfolio site is actively maintained —
          new projects, resume updates, and design
          refinements are added over time as this
          page and the rest of the site evolve.
        </p>

      </section>


      {/* =================================================
          FOOTER
      ================================================= */}

      <div className="case-study-footer">

        <Link to="/projects">
          ← Back to All Projects
        </Link>

      </div>


      {/* =================================================
          IMAGE LIGHTBOX
      ================================================= */}

      {isImageOpen && (

        <div
          className="case-study-lightbox"
          onClick={() => setIsImageOpen(false)}
        >

          <button
            type="button"
            className="case-study-lightbox-close"
            onClick={(event) => {
              event.stopPropagation();
              setIsImageOpen(false);
            }}
            aria-label="Close enlarged image"
          >
            ×
          </button>


          <div
            className="case-study-lightbox-content"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <img
              src={portfolioWebsiteImage}
              alt="Personal Portfolio Website enlarged"
            />

            <p>
              Personal Portfolio Website
            </p>

          </div>

        </div>

      )}

    </main>
  );
}
