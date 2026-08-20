import { Link } from "react-router-dom";

import qaAutomationImage from "../assets/projects/qa-automation.png";
import competencyIQImage from "../assets/projects/competencyiq.png";
import japaneseCharacterImage from "../assets/projects/japanese-character.png";
import smartParkingImage from "../assets/projects/smart-parking.png";
import motorPHImage from "../assets/projects/motorph.png";
import waterDispenserImage from "../assets/projects/water-dispenser.png";
import portfolioWebsiteImage from "../assets/projects/portfolio-website.png";

const projects = [
  {
    number: "01",
    title: "AI-Based Japanese Character Recognition",
    category: "AI / COMPUTER VISION",

    description:
      "A Raspberry Pi-based computer vision system using a custom-trained YOLOv5 model to recognize Japanese Kanji characters in real time.",

    technologies: [
      "Python",
      "YOLOv5",
      "Roboflow",
      "OpenCV",
      "Raspberry Pi",
    ],

    image: japaneseCharacterImage,

    path: "/projects/japanese-character",
  },

  {
    number: "02",
    title: "CompetencyIQ AI",
    category: "ARTIFICIAL INTELLIGENCE",

    description:
      "An AI-powered workforce intelligence assistant designed to analyze employee competency, training, certifications, compliance, quality findings, and operational risk.",

    technologies: [
      "Microsoft Copilot Studio",
      "AI",
      "Prompt Engineering",
      "Power Automate",
    ],

    image: competencyIQImage,

    path: "/projects/competencyiq",
  },

  {
    number: "03",
    title: "QA Automation Framework",
    category: "QA AUTOMATION",

    description:
      "A web automation framework built with Python, Robot Framework, and Selenium featuring reusable automation components, automated execution, reporting, and optional AI-assisted test analysis.",

    technologies: [
      "Python",
      "Robot Framework",
      "Selenium",
      "SeleniumLibrary",
      "Git",
    ],

    image: qaAutomationImage,

    path: "/projects/qa-automation",

    github:
      "https://github.com/Jcplayer06/QA-Automation-Framework",
  },

  {
    number: "04",
    title: "Smart Parking System",
    category: "IOT / EMBEDDED SYSTEMS",

    description:
      "An IoT-based parking monitoring system using sensors and an ESP8266 controller to detect parking occupancy and display real-time slot availability through Blynk.",

    technologies: [
      "ESP8266",
      "Arduino",
      "Ultrasonic Sensors",
      "Blynk",
      "C++",
    ],

    image: smartParkingImage,

    path: "/projects/smart-parking",
  },

  {
    number: "05",
    title: "MotorPH Payroll Management System",
    category: "SOFTWARE DEVELOPMENT",

    description:
      "A desktop payroll management system designed to manage employee records, attendance, payroll computation, leave management, deductions, and reporting.",

    technologies: [
      "C#",
      "OOP",
      "Windows Forms",
      "Visual Studio",
    ],

    image: motorPHImage,

    path: "/projects/motorph",
  },

  {
    number: "06",
    title: "Non-Contact Smart Water Dispenser",
    category: "EMBEDDED SYSTEMS / IOT",

    description:
      "An automated water dispenser using infrared sensing for contactless operation, custom PCB design, user authentication, and IoT monitoring through Blynk.",

    technologies: [
      "Arduino",
      "C",
      "IR Sensor",
      "PCB Design",
      "Blynk",
    ],

    image: waterDispenserImage,

    path: "/projects/water-dispenser",
  },
  {
    number: "07",
    title: "Personal Portfolio Website",
    category: "WEB DEVELOPMENT",

    description:
      "This site — a React, TypeScript, and Vite portfolio with React Router-based case study pages per project and a role-tailored resume selector.",

    technologies: [
      "React",
      "TypeScript",
      "Vite",
      "React Router",
    ],

    image: portfolioWebsiteImage,

    path: "/projects/portfolio-website",

    github:
      "https://github.com/Jcplayer06/joshua-carbon-website-portfolio",
  },
];


export default function ProjectsPage() {

  return (

    <main className="projects-page">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <section className="projects-page-header">

        <p className="section-label">
          SELECTED WORK / 07 PROJECTS
        </p>

        <h1>
          Projects
          <br />
          &amp; Case Studies
        </h1>

        <p>
          A collection of software, artificial intelligence,
          QA automation, computer vision, IoT, and embedded
          systems projects developed through academic,
          internship, and personal work.
        </p>

      </section>


      {/* =================================================
          PROJECT LIST
      ================================================= */}

      <section className="projects-showcase">

        {projects.map((project) => (

          <article
            key={project.path}
            className="project-showcase-card"
          >

            {/* =================================================
                PROJECT NUMBER
            ================================================= */}

            <div className="project-showcase-number">
              {project.number}
            </div>


            {/* =================================================
                PROJECT CONTENT
            ================================================= */}

            <div className="project-showcase-content">

              <p className="project-showcase-category">
                {project.category}
              </p>


              <h2>
                {project.title}
              </h2>


              <p className="project-showcase-description">
                {project.description}
              </p>


              {/* =================================================
                  TECHNOLOGIES
              ================================================= */}

              <div className="project-showcase-technologies">

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

              <div className="project-action-links">

                {/* DETAILED INFORMATION */}

                <Link
                  to={project.path}
                  className="project-details-link"
                >
                  View Detailed Information
                  <span>→</span>
                </Link>


                {/* GITHUB — QA AUTOMATION ONLY */}

                {project.github && (

                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-github-link"
                  >
                    View GitHub
                    <span>↗</span>
                  </a>

                )}

              </div>

            </div>


            {/* =================================================
                PROJECT IMAGE
            ================================================= */}

            <div className="project-showcase-image">

              <img
                src={project.image}
                alt={`${project.title} project`}
              />

            </div>

          </article>

        ))}

      </section>


      {/* =================================================
          BOTTOM RESUME CTA
      ================================================= */}

      <section className="projects-bottom">

        <p>
          Want to see my qualifications and technical
          background?
        </p>

        <Link to="/resume">
          View My Resume →
        </Link>

      </section>

    </main>

  );
}