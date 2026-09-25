import { useEffect, useState } from "react";

type ResumeConfig = {
  id: string;
  category: string;
  title: string;
  description: string;
  technologies: string[];
  file: string;
  preview: string;
  emphasis: string;
  sourceName: string;
};

const RESUMES: ResumeConfig[] = [
  {
    id: "software",
    category: "SOFTWARE ENGINEERING",
    title: "Computer Engineer / Software Developer",
    description:
      "Computer Engineering graduate with hands-on experience building and integrating software across web, desktop, and AI-enabled systems. Delivered AIQUANTA as a real client platform, built CompetencyIQ AI, and developed a custom-trained YOLOv5 computer-vision system.",
    technologies: ["C#", "Python", "C++", "OOP", "Git"],
    file: "/resumes/software-engineer-resume-current.pdf",
    preview: "/resumes/previews/current/software-engineer-resume-current.webp",
    emphasis: "Software Development · Web · AI-Enabled Systems · Integration",
    sourceName: "Joshua_Carbon_Software_Engineer.pdf",
  },
  {
    id: "fullstack",
    category: "FULL-STACK WEB DEVELOPMENT",
    title: "Junior Web Developer / Full-Stack Developer",
    description:
      "Computer Engineering graduate with hands-on full-stack development centered on AIQUANTA, a real client-facing platform built with React, TypeScript, and Vite, spanning API/data integration, administration, reporting, AI-assisted inquiry handling, SEO, and deployment.",
    technologies: ["React", "TypeScript", "REST APIs", "SQL", "Git"],
    file: "/resumes/full-stack-web-developer-resume-current.pdf",
    preview: "/resumes/previews/current/full-stack-web-developer-resume-current.webp",
    emphasis: "React · TypeScript · API/Data Integration · Client Delivery",
    sourceName: "Joshua_Carbon_FullStack_Web_Developer.pdf",
  },
  {
    id: "qa",
    category: "QA AUTOMATION / SDET",
    title: "Computer Engineer / QA Automation",
    description:
      "Computer Engineering graduate with a software development foundation and hands-on QA automation experience. Built a reusable Python/Robot Framework/Selenium framework and also delivered AIQUANTA.",
    technologies: ["Python", "Robot Framework", "Selenium", "Test Automation", "QA"],
    file: "/resumes/qa-automation-resume-current.pdf",
    preview: "/resumes/previews/current/qa-automation-resume-current.webp",
    emphasis: "Automation Framework · Test Design · Reporting · Debugging",
    sourceName: "Joshua_Carbon_QA_Automation_SDET.pdf",
  },
  {
    id: "ai",
    category: "ARTIFICIAL INTELLIGENCE",
    title: "Computer Engineer / AI Developer",
    description:
      "Computer Engineering graduate focused on practical AI application: a custom-trained YOLOv5 computer-vision system, an AI assistant built in Microsoft Copilot Studio using prompt engineering, and AI-assisted functionality inside AIQUANTA.",
    technologies: ["Python", "YOLOv5", "OpenCV", "Roboflow", "AI"],
    file: "/resumes/ai-developer-resume-current.pdf",
    preview: "/resumes/previews/current/ai-developer-resume-current.webp",
    emphasis: "YOLOv5 · Computer Vision · AI Agents · Prompt Engineering",
    sourceName: "Joshua_Carbon_AI_Developer.pdf",
  },
  {
    id: "it",
    category: "IT SPECIALIST",
    title: "Computer Engineer / IT Support",
    description:
      "Computer Engineering graduate with hands-on experience across IT troubleshooting, hardware/software support, and networking. Configured a client Piso WiFi deployment end-to-end, including physical setup, TP-Link, Omada Web Controller, and the client payment workflow.",
    technologies: ["IT Support", "Networking", "Hardware", "Troubleshooting", "Cisco"],
    file: "/resumes/it-specialist-resume-current.pdf",
    preview: "/resumes/previews/current/it-specialist-resume-current.webp",
    emphasis: "Hardware · Networking · Systems Troubleshooting · Client Deployment",
    sourceName: "Joshua_Carbon_IT_Specialist.pdf",
  },
];

const BUILD_STEPS = [
  "> target: role configuration",
  "> emphasis: relevant engineering evidence",
  "> artifact: ATS-ready PDF",
];

function ResumeBuildLog() {
  const [buildStep, setBuildStep] = useState(0);

  useEffect(() => {
    const timers = BUILD_STEPS.map((_, index) =>
      window.setTimeout(() => setBuildStep(index + 1), 230 * (index + 1)),
    );
    return () => timers.forEach(window.clearTimeout);
  }, []);

  return (
    <div className="resume-build-log">
      <span>BUILD LOG</span>
      {BUILD_STEPS.map((step, index) => (
        <p key={step} className={index < buildStep ? "is-visible" : ""}>
          {step}
        </p>
      ))}
    </div>
  );
}

export default function ResumePage() {
  const [selectedId, setSelectedId] = useState(RESUMES[0].id);
  const selected =
    RESUMES.find((resume) => resume.id === selectedId) ?? RESUMES[0];

  return (
    <main className="resume-page resume-engineering-page">
      <header className="resume-hero">
        <p className="resume-kicker">ENGINEERING PROFILE / RESUME</p>
        <h1>
          Select a resume
          <br />
          for the role.
        </h1>
        <p className="resume-intro">
          One engineering background, presented through different role-focused
          versions. Choose a target, review the emphasis, and open the actual
          PDF.
        </p>
      </header>

      <section
        className="resume-workbench"
        aria-label="Resume selector and preview"
      >
        <aside className="resume-role-panel">
          <div className="resume-panel-head">
            <span>ROLE TARGETS</span>
            <small>{RESUMES.length} CONFIGURATIONS AVAILABLE</small>
          </div>

          <div className="resume-role-list">
            {RESUMES.map((resume) => {
              const active = resume.id === selected.id;
              return (
                <button
                  type="button"
                  key={resume.id}
                  className={`resume-role-button${active ? " is-active" : ""}`}
                  onClick={() => setSelectedId(resume.id)}
                  aria-pressed={active}
                >
                  <span className="resume-role-dot" aria-hidden="true" />
                  <span className="resume-role-copy">
                    <strong>{resume.category}</strong>
                    <small>{resume.title}</small>
                  </span>
                  <em>{active ? "SELECTED" : "OPEN"}</em>
                </button>
              );
            })}
          </div>

          <ResumeBuildLog key={selected.id} />
        </aside>

        <section className="resume-preview-panel">
          <div className="resume-preview-header">
            <div>
              <span>{selected.category}</span>
              <h2>{selected.title}</h2>
            </div>
            <span className="resume-artifact-state">CURRENT PDF</span>
          </div>

          <div className="resume-preview-body">
            <div className="resume-preview-copy">
              <span className="resume-mini-label">ROLE EMPHASIS</span>
              <p className="resume-emphasis">{selected.emphasis}</p>
              <p className="resume-description">{selected.description}</p>

              <div
                className="resume-tags"
                aria-label="Highlighted technologies"
              >
                {selected.technologies.map((technology) => (
                  <span key={technology}>{technology}</span>
                ))}
              </div>

              <div className="resume-actions">
                <a
                  href={selected.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resume-primary-action"
                >
                  Open Full Resume <span>↗</span>
                </a>
                <a
                  href={selected.file}
                  download
                  className="resume-secondary-action"
                >
                  Download PDF <span>↓</span>
                </a>
              </div>
            </div>

            <div className="resume-pdf-frame">
              <div className="resume-pdf-toolbar">
                <div>
                  <span>PAGE 01</span>
                  <small>LIVE DOCUMENT PREVIEW · {selected.sourceName}</small>
                </div>
                <a
                  href={selected.file}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  OPEN PDF ↗
                </a>
              </div>

              <a
                className="resume-document-preview"
                href={selected.file}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${selected.title} PDF`}
              >
                <div className="resume-paper-shadow" aria-hidden="true" />
                <img
                  src={selected.preview}
                  alt={`${selected.title} page 1 preview`}
                  loading="eager"
                />
              </a>

              <div className="resume-preview-caption">
                <span>TEXT-BASED / ATS READY</span>
                <small>CLICK THE DOCUMENT TO OPEN THE FULL PDF</small>
              </div>
            </div>
          </div>
        </section>
      </section>

      <section className="resume-career-record">
        <div className="resume-record-head">
          <span>CAREER RECORD</span>
          <small>THE SOURCE DOCUMENTS REMAIN THE AUTHORITY</small>
        </div>
        <div
          className="resume-record-table"
          role="table"
          aria-label="Career record"
        >
          <div className="resume-record-row resume-record-row-head" role="row">
            <span>PERIOD</span>
            <span>RECORD</span>
            <span>DETAIL</span>
          </div>
          <div className="resume-record-row" role="row">
            <span>2019 – 2025</span>
            <strong>BS COMPUTER ENGINEERING</strong>
            <span>Mapúa University</span>
          </div>
          <div className="resume-record-row" role="row">
            <span>2014 – 2019</span>
            <strong>BS ELECTRICAL ENGINEERING</strong>
            <span>Mapúa University</span>
          </div>
          <div className="resume-record-row" role="row">
            <span>May 2023 – Aug 2023</span>
            <strong>INTERN / OJT</strong>
            <span>Erovoutika Robotics and Automation Solution</span>
          </div>
        </div>
      </section>

      <footer className="resume-page-footer">
        <span>ERRATA: NONE KNOWN</span>
        <a href="/resume">RESET RESUME SELECTION ↻</a>
      </footer>
    </main>
  );
}
