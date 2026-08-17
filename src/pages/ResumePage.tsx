export default function ResumePage() {
  const resumes = [
    {
      number: "01",
      category: "SOFTWARE ENGINEERING",
      title: "Computer Engineer / Software Developer",
      description:
        "Tailored for software development opportunities, highlighting C#, Python, C++, object-oriented programming, desktop applications, debugging, and software engineering projects.",
      technologies: [
        "C#",
        "Python",
        "C++",
        "OOP",
        "Git",
      ],
      file: "/resumes/software-engineer-resume.pdf",
    },

    {
      number: "02",
      category: "QA AUTOMATION / SDET",
      title: "Computer Engineer / QA Automation",
      description:
        "Tailored for QA automation and SDET opportunities, highlighting Python, Robot Framework, Selenium, test design, debugging, reporting, and automation framework development.",
      technologies: [
        "Python",
        "Robot Framework",
        "Selenium",
        "Test Automation",
        "QA",
      ],
      file: "/resumes/qa-automation-resume.pdf",
    },

    {
      number: "03",
      category: "ARTIFICIAL INTELLIGENCE",
      title: "Computer Engineer / AI Developer",
      description:
        "Tailored for AI and computer vision opportunities, highlighting Python, YOLOv5, OpenCV, Roboflow, Microsoft Copilot Studio, Raspberry Pi, and AI-focused projects.",
      technologies: [
        "Python",
        "YOLOv5",
        "OpenCV",
        "Roboflow",
        "AI",
      ],
      file: "/resumes/ai-developer-resume.pdf",
    },
  ];

  return (
    <main className="resume-page">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <section className="resume-page-header">

        <p className="section-label">
          RESUME
        </p>

        <h1>
          Select a resume
          <br />
          for the role.
        </h1>

        <p>
          I maintain tailored versions of my resume
          for different engineering and software roles.
          Each version emphasizes the experience and
          technical skills most relevant to its target
          position.
        </p>

      </section>


      {/* =================================================
          RESUME LIST
      ================================================= */}

      <section className="resume-list">

        {resumes.map((resume) => (

          <article
            key={resume.file}
            className="resume-item"
          >

            {/* NUMBER */}

            <div className="resume-item-number">
              {resume.number}
            </div>


            {/* CONTENT */}

            <div className="resume-item-content">

              <p className="resume-item-category">
                {resume.category}
              </p>

              <h2>
                {resume.title}
              </h2>

              <p className="resume-item-description">
                {resume.description}
              </p>


              {/* TECHNOLOGIES */}

              <div className="resume-item-technologies">

                {resume.technologies.map(
                  (technology) => (
                    <span
                      key={technology}
                    >
                      {technology}
                    </span>
                  )
                )}

              </div>


              {/* ACTIONS */}

              <div className="resume-item-actions">

                <a
                  href={resume.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resume-view-link"
                >
                  View Resume →
                </a>

                <a
                  href={resume.file}
                  download
                  className="resume-download-link"
                >
                  Download PDF ↓
                </a>

              </div>

            </div>

          </article>

        ))}

      </section>


      {/* =================================================
          FOOTER NOTE
      ================================================= */}

      <section className="resume-page-footer">

        <p>
          Each version presents the same engineering
          background from a different role-focused
          perspective.
        </p>

      </section>

    </main>
  );
}