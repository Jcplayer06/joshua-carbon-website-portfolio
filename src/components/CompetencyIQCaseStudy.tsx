import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import competencyIQImage from "../assets/projects/competencyiq.png";

export default function CompetencyIQCaseStudy() {
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
    <main className="competency-case-study">

      {/* =================================================
          BACK TO PROJECTS
      ================================================= */}


      {/* =================================================
          HERO
      ================================================= */}

      <section className="competency-header">

        <p className="section-label">
          PROJECT 02 / ARTIFICIAL INTELLIGENCE
        </p>

        <h1>
          CompetencyIQ
          <br />
          AI
        </h1>

        <p className="competency-intro">
          An AI-powered workforce competency and
          quality intelligence assistant designed
          to transform workforce-related information
          into structured competency, training,
          compliance, quality, and risk insights.
        </p>

      </section>


      {/* =================================================
          PROJECT OVERVIEW
      ================================================= */}

      <section className="competency-overview">

        <div>
          <span>
            PROJECT TYPE
          </span>

          <strong>
            AI Workforce Intelligence
          </strong>
        </div>

        <div>
          <span>
            PLATFORM
          </span>

          <strong>
            Microsoft Copilot Studio
          </strong>
        </div>

        <div>
          <span>
            AI ASSISTANT
          </span>

          <strong>
            ListBot
          </strong>
        </div>

        <div>
          <span>
            FOCUS
          </span>

          <strong>
            Competency &amp; Risk
          </strong>
        </div>

      </section>


      {/* =================================================
          PROJECT PURPOSE
      ================================================= */}

      <section className="competency-block">

        <p className="section-label">
          01 / PROJECT OBJECTIVE
        </p>

        <h2>
          Turning workforce information into
          actionable intelligence.
        </h2>

        <p>
          CompetencyIQ AI was designed as an AI-powered
          workforce competency and quality intelligence
          assistant.
        </p>

        <p>
          The concept focuses on helping HR personnel,
          training teams, supervisors, quality engineers,
          auditors, and management analyze workforce
          information and identify areas requiring
          attention or improvement.
        </p>

      </section>


      {/* =================================================
          LISTBOT
      ================================================= */}

      <section className="competency-block">

        <p className="section-label">
          02 / AI ASSISTANT
        </p>

        <h2>
          ListBot
        </h2>

        <p>
          ListBot is the AI assistant within the
          CompetencyIQ concept. Its role is to analyze
          employee-related records and generate
          structured insights related to competency,
          compliance, training, performance, and
          quality.
        </p>

      </section>


      {/* =================================================
          DATA SOURCES
      ================================================= */}

      <section className="competency-block">

        <p className="section-label">
          03 / DATA ANALYSIS
        </p>

        <h2>
          Workforce information the assistant
          can analyze.
        </h2>

        <div className="competency-grid">

          <div>
            <strong>
              Employee Profiles
            </strong>

            <p>
              Employee-related information used as
              a basis for workforce and competency
              analysis.
            </p>
          </div>


          <div>
            <strong>
              Training History
            </strong>

            <p>
              Training records used to identify
              development needs and evaluate
              training effectiveness.
            </p>
          </div>


          <div>
            <strong>
              Technical Certifications
            </strong>

            <p>
              Certification records and expiry
              status used to identify potential
              compliance concerns.
            </p>
          </div>


          <div>
            <strong>
              Competency Assessments
            </strong>

            <p>
              Assessment information used to identify
              strengths, weaknesses, and competency
              gaps.
            </p>
          </div>


          <div>
            <strong>
              Work Performance
            </strong>

            <p>
              Performance indicators used to support
              workforce capability evaluation.
            </p>
          </div>


          <div>
            <strong>
              Audit &amp; Quality Findings
            </strong>

            <p>
              Quality and audit information used to
              identify recurring findings and potential
              operational risks.
            </p>
          </div>

        </div>

      </section>


      {/* =================================================
          COMPETENCY ANALYSIS
      ================================================= */}

      <section className="competency-block">

        <p className="section-label">
          04 / COMPETENCY ANALYSIS
        </p>

        <h2>
          Identifying capability and
          development gaps.
        </h2>

        <p>
          The assistant can analyze available
          employee information to identify strengths,
          weaknesses, readiness, competency gaps,
          and training needs.
        </p>

        <p>
          Based on the available information, the
          concept can also recommend relevant training
          or certification actions.
        </p>


        <div className="competency-flow">

          <div>
            Employee Information
          </div>

          <span>
            →
          </span>

          <div>
            Competency Evaluation
          </div>

          <span>
            →
          </span>

          <div>
            Gap Identification
          </div>

          <span>
            →
          </span>

          <div>
            Training / Certification
            Recommendation
          </div>

        </div>

      </section>


      {/* =================================================
          COMPLIANCE & QUALITY
      ================================================= */}

      <section className="competency-block">

        <p className="section-label">
          05 / COMPLIANCE &amp; QUALITY
        </p>

        <h2>
          Detecting recurring issues and
          potential compliance risks.
        </h2>

        <p>
          CompetencyIQ can analyze certification
          status, training requirements, audit
          performance, and quality findings to
          highlight certification lapses, missing
          training requirements, recurring audit
          findings, and potential operational or
          compliance risks.
        </p>

      </section>


      {/* =================================================
          RISK EVALUATION
      ================================================= */}

      <section className="competency-block">

        <p className="section-label">
          06 / RISK EVALUATION
        </p>

        <h2>
          LOW · MEDIUM · HIGH
        </h2>

        <p>
          The assistant classifies potential
          operational or compliance risks as
          LOW, MEDIUM, or HIGH based on the
          available indicators and explains the
          factors contributing to the assessment.
        </p>


        <div className="risk-grid">

          <div>
            <span>
              LOW
            </span>

            <p>
              No significant risk indicators
              identified based on the available
              information.
            </p>
          </div>


          <div>
            <span>
              MEDIUM
            </span>

            <p>
              Indicators may require monitoring,
              additional training, or preventive
              action.
            </p>
          </div>


          <div>
            <span>
              HIGH
            </span>

            <p>
              Significant competency, compliance,
              quality, or operational risk
              indicators are present.
            </p>
          </div>

        </div>

      </section>


      {/* =================================================
          TRAINING INTELLIGENCE
      ================================================= */}

      <section className="competency-block">

        <p className="section-label">
          07 / TRAINING INTELLIGENCE
        </p>

        <h2>
          Evaluating training effectiveness.
        </h2>

        <p>
          Training effectiveness can be evaluated
          using available assessments, audit outcomes,
          and performance indicators.
        </p>

        <p>
          The assistant can use these indicators to
          identify learning gaps and support
          development recommendations for workforce
          improvement.
        </p>

      </section>


      {/* =================================================
          AI WORKFLOW
      ================================================= */}

      <section className="competency-block">

        <p className="section-label">
          08 / AI WORKFLOW
        </p>

        <h2>
          From workforce information to
          recommended actions.
        </h2>


        <div className="competency-flow">

          <div>
            Workforce Records
          </div>

          <span>
            →
          </span>

          <div>
            Competency Analysis
          </div>

          <span>
            →
          </span>

          <div>
            Compliance / Quality
          </div>

          <span>
            →
          </span>

          <div>
            Risk Evaluation
          </div>

          <span>
            →
          </span>

          <div>
            Recommended Actions
          </div>

        </div>

      </section>


      {/* =================================================
          STRUCTURED OUTPUT
      ================================================= */}

      <section className="competency-block">

        <p className="section-label">
          09 / STRUCTURED OUTPUT
        </p>

        <h2>
          Consistent and organized AI responses.
        </h2>

        <div className="output-list">

          <div>
            <span>
              01
            </span>

            <strong>
              Employee Summary
            </strong>
          </div>


          <div>
            <span>
              02
            </span>

            <strong>
              Competency Assessment
            </strong>
          </div>


          <div>
            <span>
              03
            </span>

            <strong>
              Compliance / Quality Observations
            </strong>
          </div>


          <div>
            <span>
              04
            </span>

            <strong>
              Risk Evaluation
            </strong>
          </div>


          <div>
            <span>
              05
            </span>

            <strong>
              Recommended Actions
            </strong>
          </div>

        </div>

      </section>


      {/* =================================================
          AI BEHAVIOR
      ================================================= */}

      <section className="competency-block">

        <p className="section-label">
          10 / AI BEHAVIOR
        </p>

        <h2>
          Designed for structured,
          data-driven responses.
        </h2>

        <p>
          The assistant is designed to maintain a
          professional, analytical, and business-oriented
          communication style.
        </p>

        <p>
          Responses are organized into clear sections
          and focus on competency evaluation, training
          effectiveness, certification compliance,
          audit performance, workforce readiness,
          operational risk, and continuous improvement.
        </p>

      </section>


      {/* =================================================
          DATA INTEGRITY
      ================================================= */}

      <section className="competency-note">

        <p className="section-label">
          DATA INTEGRITY
        </p>

        <p>
          When sufficient information is unavailable,
          the assistant is designed to clearly state
          assumptions and request additional information
          when necessary. It should not generate
          fictional employee information unless explicitly
          requested for demonstration purposes.
        </p>

      </section>


      {/* =================================================
          PROJECT IMAGE
      ================================================= */}

      <section className="competency-project-visual">

        <button
          type="button"
          className="competency-image-button"
          onClick={() => setIsImageOpen(true)}
          aria-label="Enlarge CompetencyIQ AI project image"
        >

          <img
            src={competencyIQImage}
            alt="CompetencyIQ AI workforce intelligence interface"
          />

          <span>
            Click to enlarge
          </span>

        </button>

      </section>


      {/* =================================================
          TECHNOLOGIES
      ================================================= */}

      <section className="competency-block">

        <p className="section-label">
          11 / TECHNOLOGIES
        </p>

        <div className="competency-tech">

          <span>
            Microsoft Copilot Studio
          </span>

          <span>
            Generative AI
          </span>

          <span>
            AI Prompt Engineering
          </span>

          <span>
            Workforce Analytics
          </span>

          <span>
            Structured AI Responses
          </span>

        </div>

      </section>


      {/* =================================================
          ENGINEERING EXPERIENCE
      ================================================= */}

      <section className="competency-block">

        <p className="section-label">
          12 / ENGINEERING EXPERIENCE
        </p>

        <h2>
          Designing an AI assistant around
          a real-world business problem.
        </h2>

        <p>
          This project provided hands-on experience
          with designing an AI assistant concept,
          defining its purpose and behavior, structuring
          workforce information for analysis, and
          designing prompts and response formats
          intended to produce useful business-oriented
          insights.
        </p>

        <p>
          The project also involved thinking about
          data availability, response consistency,
          competency analysis, training intelligence,
          compliance, quality findings, and risk
          evaluation as interconnected areas of
          workforce decision support.
        </p>

      </section>


      {/* =================================================
          PROJECT NOTE
      ================================================= */}

      <section className="competency-note">

        <p className="section-label">
          PROJECT NOTE
        </p>

        <p>
          CompetencyIQ AI is presented as an AI
          assistant concept and prototype demonstrating
          how workforce-related information can be
          transformed into structured competency,
          compliance, training, quality, and risk
          insights.
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
              src={competencyIQImage}
              alt="CompetencyIQ AI project enlarged"
            />

            <p>
              CompetencyIQ AI
            </p>

          </div>

        </div>

      )}

    </main>
  );
}