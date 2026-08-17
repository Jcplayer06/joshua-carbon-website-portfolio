export default function ResumePage() {
  return (
    <main className="resume-page">

      {/* HERO */}

      <section className="resume-hero">

        <p className="section-label">
          RESUME
        </p>

        <h1>
          Select a resume
          <br />
          for the role.
        </h1>

        <p className="resume-intro">
          I maintain tailored versions of my resume for
          different engineering and software roles, 
          highlighting the skills, projects, and technical experience most relevant to each role.
        </p>

      </section>


      {/* RESUME LIST */}

      <section className="resume-list">

        {/* QA AUTOMATION */}

        <article className="resume-item">

          <div className="resume-number">
            01
          </div>

          <div className="resume-main">

            <p className="resume-category">
              QA AUTOMATION / SDET
            </p>

            <h2>
              Computer Engineer / QA Automation
            </h2>

            <p>
              Tailored for QA Automation, SDET, software
              testing, and test automation opportunities.
              Highlights Python, Robot Framework, Selenium,
              debugging, test design, and automation framework
              development.
            </p>

            <div className="resume-tags">

              <span>Python</span>
              <span>Robot Framework</span>
              <span>Selenium</span>
              <span>Test Automation</span>
              <span>Git</span>

            </div>

            <div className="resume-actions">

              <a
                href="/resumes/Joshua-Carbon-QA-Automation-Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Resume →
              </a>

              <a
                href="/resumes/Joshua-Carbon-QA-Automation-Resume.pdf"
                download
              >
                Download PDF ↓
              </a>

            </div>

          </div>

        </article>


        {/* SOFTWARE DEVELOPMENT */}

        <article className="resume-item">

          <div className="resume-number">
            02
          </div>

          <div className="resume-main">

            <p className="resume-category">
              SOFTWARE DEVELOPMENT
            </p>

            <h2>
              Computer Engineer / Software Developer
            </h2>

            <p>
              Tailored for junior software development
              opportunities, highlighting C#, Python,
              C++, object-oriented programming, desktop
              applications, debugging, and software projects.
            </p>

            <div className="resume-tags">

              <span>C#</span>
              <span>Python</span>
              <span>C++</span>
              <span>OOP</span>
              <span>Git</span>

            </div>

            <div className="resume-actions">

              <a
                href="/resumes/Joshua-Carbon-Software-Developer-Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Resume →
              </a>

              <a
                href="/resumes/Joshua-Carbon-Software-Developer-Resume.pdf"
                download
              >
                Download PDF ↓
              </a>

            </div>

          </div>

        </article>


        {/* AI DEVELOPER */}

        <article className="resume-item">

          <div className="resume-number">
            03
          </div>

          <div className="resume-main">

            <p className="resume-category">
              ARTIFICIAL INTELLIGENCE
            </p>

            <h2>
              Computer Engineer / AI Developer
            </h2>

            <p>
              Tailored for AI, computer vision, and related
              engineering opportunities, highlighting Python,
              YOLOv5, OpenCV, Roboflow, Microsoft Copilot Studio,
              Raspberry Pi, and AI-focused projects.
            </p>

            <div className="resume-tags">

              <span>Python</span>
              <span>YOLOv5</span>
              <span>OpenCV</span>
              <span>Roboflow</span>
              <span>AI</span>

            </div>

            <div className="resume-actions">

              <a
                href="/resumes/Joshua-Carbon-ai-Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Resume →
              </a>

              <a
                href="/resumes/Joshua-Carbon-ai-Resume.pdf"
                download
              >
                Download PDF ↓
              </a>

            </div>

          </div>

        </article>

      </section>


      {/* FOOTER NOTE */}

      <section className="resume-note">

        <p>
          Each version presents the same engineering
          background from a different role-focused perspective.
        </p>

      </section>

    </main>
  );
}