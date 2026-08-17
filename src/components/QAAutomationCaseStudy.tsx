import qaAutomationImage from "../assets/projects/qa-automation.png";

export default function QAAutomationCaseStudy() {
  return (
    <section
      id="qa-automation-case-study"
      className="qa-case-study"
    >

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="qa-case-study-header">

        <p className="section-label">
          CASE STUDY / 03
        </p>

        <h2>
          QA Automation
          <br />
          Framework
        </h2>

        <p className="qa-intro">
          A web automation framework built with
          Python, Robot Framework, and Selenium,
          with optional OpenAI-powered analysis of
          automated test results.
        </p>

      </div>


      {/* =====================================================
          PROJECT OVERVIEW
      ===================================================== */}

      <div className="qa-overview">

        <div>
          <span>PROJECT TYPE</span>

          <strong>
            Web Test Automation
          </strong>
        </div>


        <div>
          <span>FRAMEWORK</span>

          <strong>
            Robot Framework
          </strong>
        </div>


        <div>
          <span>LANGUAGE</span>

          <strong>
            Python
          </strong>
        </div>


        <div>
          <span>WEB AUTOMATION</span>

          <strong>
            Selenium
          </strong>
        </div>

      </div>


      {/* =====================================================
          OBJECTIVE
      ===================================================== */}

      <div className="qa-block">

        <p className="section-label">
          01 / OBJECTIVE
        </p>

        <h3>
          Build a maintainable
          <br />
          automation framework.
        </h3>

        <p>
          This project demonstrates the design and
          implementation of a web test automation
          framework using Python, Robot Framework,
          and Selenium. The framework focuses on
          reusable test components, organized test
          cases, maintainability, reporting, and
          reliable automated execution.
        </p>

      </div>


      {/* =====================================================
          TECHNOLOGY STACK
      ===================================================== */}

      <div className="qa-block">

        <p className="section-label">
          02 / TECHNOLOGY STACK
        </p>

        <h3>
          Built around reusable
          <br />
          automation components.
        </h3>


        <div className="qa-tech-grid">

          <div>
            <span>01</span>

            <strong>
              Python
            </strong>

            <p>
              Used for custom automation libraries,
              helper functions, browser management,
              and framework logic.
            </p>
          </div>


          <div>
            <span>02</span>

            <strong>
              Robot Framework
            </strong>

            <p>
              Provides the readable test syntax,
              keyword-driven structure, test execution,
              and reporting.
            </p>
          </div>


          <div>
            <span>03</span>

            <strong>
              Selenium
            </strong>

            <p>
              Controls the web browser and interacts
              with application elements during
              automated testing.
            </p>
          </div>


          <div>
            <span>04</span>

            <strong>
              Python Libraries
            </strong>

            <p>
              Custom libraries provide reusable
              browser helpers and framework-level
              functionality.
            </p>
          </div>

        </div>

      </div>


      {/* =====================================================
          FRAMEWORK STRUCTURE
      ===================================================== */}

      <div className="qa-block">

        <p className="section-label">
          03 / FRAMEWORK STRUCTURE
        </p>

        <h3>
          Separating tests,
          <br />
          resources, and utilities.
        </h3>


        <div className="qa-flow">

          <div>
            Tests
          </div>

          <span>
            →
          </span>

          <div>
            Keywords
          </div>

          <span>
            →
          </span>

          <div>
            Page / Resources
          </div>

          <span>
            →
          </span>

          <div>
            Custom Libraries
          </div>

        </div>


        <p className="qa-description">
          The project separates test cases from
          reusable keywords, variables, resources,
          page-level components, and custom Python
          libraries. This structure makes the framework
          easier to maintain, extend, and debug.
        </p>

      </div>


      {/* =====================================================
          TEST DESIGN
      ===================================================== */}

      <div className="qa-block">

        <p className="section-label">
          04 / TEST DESIGN
        </p>

        <h3>
          Testing critical user
          <br />
          workflows.
        </h3>


        <div className="qa-test-grid">

          <div>
            <span>01</span>

            <strong>
              Valid Login
            </strong>

            <p>
              Verifies that a valid user can
              successfully authenticate.
            </p>
          </div>


          <div>
            <span>02</span>

            <strong>
              Invalid Login
            </strong>

            <p>
              Verifies that invalid credentials
              produce the expected error message.
            </p>
          </div>


          <div>
            <span>03</span>

            <strong>
              Add to Cart
            </strong>

            <p>
              Verifies that a product can be
              selected and added to the cart.
            </p>
          </div>


          <div>
            <span>04</span>

            <strong>
              Checkout Process
            </strong>

            <p>
              Verifies the checkout workflow
              from cart to order completion.
            </p>
          </div>


          <div>
            <span>05</span>

            <strong>
              Logout
            </strong>

            <p>
              Verifies that the user can safely
              terminate the authenticated session.
            </p>
          </div>

        </div>

      </div>


      {/* =====================================================
          AUTOMATION EXECUTION
      ===================================================== */}

      <div className="qa-block">

        <p className="section-label">
          05 / AUTOMATION EXECUTION
        </p>

        <h3>
          Automated execution with
          <br />
          measurable results.
        </h3>


        <div className="qa-results">

          <div>
            <strong>
              5
            </strong>

            <span>
              Tests Executed
            </span>
          </div>


          <div>
            <strong>
              5
            </strong>

            <span>
              Passed
            </span>
          </div>


          <div>
            <strong>
              0
            </strong>

            <span>
              Failed
            </span>
          </div>


          <div>
            <strong>
              100%
            </strong>

            <span>
              Pass Rate
            </span>
          </div>

        </div>

      </div>


      {/* =====================================================
          PROJECT IMAGE
      ===================================================== */}

      <div className="qa-screenshot">

        <img
          src={qaAutomationImage}
          alt="QA Automation Framework test execution and AI analysis"
        />

      </div>


      {/* =====================================================
          AI TEST ANALYSIS
      ===================================================== */}

      <div className="qa-block">

        <p className="section-label">
          06 / AI TEST ANALYSIS
        </p>

        <h3>
          Turning automated results
          <br />
          into useful insights.
        </h3>

        <p>
          The framework also demonstrates the use
          of AI-assisted analysis for automated test
          results. Test execution information can be
          analyzed to identify potential risks,
          stability concerns, and additional test
          scenarios that may improve coverage.
        </p>


        <div className="qa-ai-grid">

          <div>
            <span>01</span>

            <strong>
              Result Analysis
            </strong>

            <p>
              Reviews automated test execution
              results and identifies important
              observations.
            </p>
          </div>


          <div>
            <span>02</span>

            <strong>
              Risk Assessment
            </strong>

            <p>
              Helps identify areas that may require
              additional validation or testing.
            </p>
          </div>


          <div>
            <span>03</span>

            <strong>
              Additional Tests
            </strong>

            <p>
              Suggests additional scenarios that
              could improve test coverage.
            </p>
          </div>

        </div>

      </div>


      {/* =====================================================
          ENGINEERING VALUE
      ===================================================== */}

      <div className="qa-block">

        <p className="section-label">
          07 / ENGINEERING VALUE
        </p>

        <h3>
          Designed for maintainability
          <br />
          and scalability.
        </h3>

        <p>
          The framework demonstrates practical
          automation engineering concepts including
          reusable keywords, modular test design,
          custom Python libraries, browser
          synchronization, structured resources,
          automated reporting, and AI-assisted
          analysis.
        </p>

      </div>


      {/* =====================================================
          TECHNOLOGIES
      ===================================================== */}

      <div className="qa-block">

        <p className="section-label">
          08 / TECHNOLOGIES
        </p>

        <div className="qa-tech-tags">

          <span>
            Python
          </span>

          <span>
            Robot Framework
          </span>

          <span>
            Selenium
          </span>

          <span>
            SeleniumLibrary
          </span>

          <span>
            Web Automation
          </span>

          <span>
            Test Automation
          </span>

          <span>
            AI-Assisted Testing
          </span>

          <span>
            Automated Reporting
          </span>

        </div>

      </div>


      {/* =====================================================
          BACK TO PROJECTS
      ===================================================== */}

      <div className="case-study-footer">

        <a href="/projects">
          ← Back to All Projects
        </a>

      </div>

    </section>
  );
}