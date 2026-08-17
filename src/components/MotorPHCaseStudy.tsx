import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import motorPHImage from "../assets/projects/motorph.png";

export default function MotorPHCaseStudy() {
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
          BACK TO PROJECTS
      ================================================= */}


      {/* =================================================
          HERO
      ================================================= */}

      <section className="motorph-header">

        <p className="section-label">
          PROJECT 05 / SOFTWARE DEVELOPMENT
        </p>

        <h1>
          MotorPH
          <br />
          Payroll System
        </h1>

        <p className="motorph-intro">
          A desktop payroll management application
          developed to manage employee records,
          attendance, payroll computation, leave
          management, and reporting using C# and
          object-oriented programming.
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
            Software Application
          </strong>
        </div>

        <div>
          <span>
            LANGUAGE
          </span>

          <strong>
            C#
          </strong>
        </div>

        <div>
          <span>
            DEVELOPMENT
          </span>

          <strong>
            Visual Studio
          </strong>
        </div>

        <div>
          <span>
            CONCEPTS
          </span>

          <strong>
            OOP / Data Management
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
          Develop a structured payroll
          management application.
        </h2>

        <p>
          The MotorPH Payroll Management System
          was developed as a desktop application
          for managing employee information,
          attendance records, payroll computation,
          leave management, and reporting.
        </p>

        <p>
          The project focused on translating a
          real-world payroll workflow into a
          structured software application.
        </p>

      </section>


      {/* =================================================
          02 / CORE FEATURES
      ================================================= */}

      <section className="motorph-block">

        <p className="section-label">
          02 / CORE FEATURES
        </p>

        <h2>
          Employee and payroll management.
        </h2>

        <div className="motorph-feature-grid">

          <div>
            <span>
              01
            </span>

            <strong>
              Employee Records
            </strong>

            <p>
              Manage employee information and
              related payroll records.
            </p>
          </div>


          <div>
            <span>
              02
            </span>

            <strong>
              Attendance
            </strong>

            <p>
              Store and process employee
              attendance information.
            </p>
          </div>


          <div>
            <span>
              03
            </span>

            <strong>
              Payroll Computation
            </strong>

            <p>
              Calculate payroll information based
              on employee and attendance records.
            </p>
          </div>


          <div>
            <span>
              04
            </span>

            <strong>
              Leave Management
            </strong>

            <p>
              Manage employee leave information
              within the payroll workflow.
            </p>
          </div>


          <div>
            <span>
              05
            </span>

            <strong>
              Reporting
            </strong>

            <p>
              Generate organized payroll and
              employee information.
            </p>
          </div>


          <div>
            <span>
              06
            </span>

            <strong>
              Data Management
            </strong>

            <p>
              Organize application data for
              consistent processing and retrieval.
            </p>
          </div>

        </div>

      </section>


      {/* =================================================
          03 / APPLICATION WORKFLOW
      ================================================= */}

      <section className="motorph-block">

        <p className="section-label">
          03 / APPLICATION WORKFLOW
        </p>

        <h2>
          From employee records to payroll.
        </h2>

        <div className="motorph-flow">

          <div>
            Employee Records
          </div>

          <span>
            →
          </span>

          <div>
            Attendance
          </div>

          <span>
            →
          </span>

          <div>
            Payroll Processing
          </div>

          <span>
            →
          </span>

          <div>
            Leave / Adjustments
          </div>

          <span>
            →
          </span>

          <div>
            Payroll Report
          </div>

        </div>

      </section>


      {/* =================================================
          04 / SOFTWARE ENGINEERING
      ================================================= */}

      <section className="motorph-block">

        <p className="section-label">
          04 / SOFTWARE ENGINEERING
        </p>

        <h2>
          Applying object-oriented
          programming.
        </h2>

        <p>
          The application was designed using
          object-oriented programming principles
          to organize employee, payroll, attendance,
          and related application logic into
          maintainable software components.
        </p>


        <div className="motorph-oop-grid">

          <div>
            <strong>
              Encapsulation
            </strong>

            <p>
              Organize data and related behavior
              within appropriate classes.
            </p>
          </div>


          <div>
            <strong>
              Abstraction
            </strong>

            <p>
              Separate implementation details
              from the functionality exposed to
              the application.
            </p>
          </div>


          <div>
            <strong>
              Reusability
            </strong>

            <p>
              Structure common operations so
              application logic can be reused.
            </p>
          </div>


          <div>
            <strong>
              Maintainability
            </strong>

            <p>
              Keep the system organized so
              individual components can be
              modified more easily.
            </p>
          </div>

        </div>

      </section>


      {/* =================================================
          05 / DATA MANAGEMENT
      ================================================= */}

      <section className="motorph-block">

        <p className="section-label">
          05 / DATA MANAGEMENT
        </p>

        <h2>
          Organizing employee information
          for application processing.
        </h2>

        <p>
          The project involved managing structured
          employee and payroll information. The
          application was designed to organize
          its data and processing so that employee
          information could be consistently retrieved
          and used during payroll operations.
        </p>

      </section>


      {/* =================================================
          06 / PAYROLL PROCESSING
      ================================================= */}

      <section className="motorph-block">

        <p className="section-label">
          06 / PAYROLL PROCESSING
        </p>

        <h2>
          Automating repetitive payroll tasks.
        </h2>

        <div className="motorph-processing">

          <div>
            <span>
              01
            </span>

            <strong>
              Employee Information
            </strong>

            <p>
              Retrieve the employee's relevant
              payroll information.
            </p>
          </div>


          <div>
            <span>
              02
            </span>

            <strong>
              Attendance Data
            </strong>

            <p>
              Use recorded attendance information
              in payroll processing.
            </p>
          </div>


          <div>
            <span>
              03
            </span>

            <strong>
              Payroll Calculation
            </strong>

            <p>
              Process the information required
              for payroll computation.
            </p>
          </div>


          <div>
            <span>
              04
            </span>

            <strong>
              Payroll Output
            </strong>

            <p>
              Present the processed payroll
              information through the application.
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
            C#
          </span>

          <span>
            Object-Oriented Programming
          </span>

          <span>
            Visual Studio
          </span>

          <span>
            Desktop Application
          </span>

          <span>
            Data Management
          </span>

        </div>

      </section>


      {/* =================================================
          PROJECT IMAGE
      ================================================= */}

      <section className="motorph-image">

        <button
          type="button"
          className="motorph-image-button"
          onClick={() => setIsImageOpen(true)}
          aria-label="Enlarge MotorPH Payroll System image"
        >

          <img
            src={motorPHImage}
            alt="MotorPH Payroll Management System"
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
          Building software around a
          real-world business process.
        </h2>

        <p>
          This project provided practical experience
          in translating a business workflow into
          a software application, designing
          structured application logic, applying
          object-oriented programming, handling
          employee information, and automating
          repetitive payroll-related operations.
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
          The MotorPH Payroll Management System
          demonstrates software development and
          object-oriented programming experience
          through a desktop payroll application.
          Specific implementation details and
          storage mechanisms should be interpreted
          according to the project's actual source
          code and documentation.
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
              src={motorPHImage}
              alt="MotorPH Payroll Management System enlarged"
            />

            <p>
              MotorPH Payroll Management System
            </p>

          </div>

        </div>

      )}

    </main>
  );
}