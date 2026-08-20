import Projects from "../components/Projects";
import "../App.css";

import profileImage from "../assets/joshua-carbon.png";

export default function Home() {
  return (
    <main>

      {/* =================================================
          HERO
      ================================================= */}

      <section
        id="home"
        className="hero"
      >

        <div className="hero-content">

          <p className="hero-label">
            COMPUTER ENGINEER
          </p>

          <h1>
            Joshua
            <br />
            Carbon<span>.</span>
          </h1>

          <p className="hero-description">
            Computer Engineering graduate building
            software, AI, automation, computer vision,
            IoT, and embedded systems.
          </p>

          <div className="hero-buttons">

            <a
              href="#projects"
              className="button button-primary"
            >
              View Projects
            </a>

            <a
              href="#contact"
              className="button button-secondary"
            >
              Contact Me
            </a>

          </div>

        </div>


        {/* PROFILE */}

        <div className="hero-profile">

          <div className="hero-profile-frame">

            <img
              src={profileImage}
              alt="Joshua Carbon"
            />

          </div>

          <p className="hero-profile-label">
            COMPUTER ENGINEER
          </p>

        </div>


        {/* HERO SIDE */}

        <div className="hero-side">

          <div className="hero-line"></div>

          <p>
            SOFTWARE
            <br />
            AI
            <br />
            AUTOMATION
            <br />
            IoT
          </p>

        </div>

      </section>


      {/* =================================================
          ABOUT ME
      ================================================= */}

      <section
        id="about"
        className="about-section"
      >

        <div className="section-heading">

          <p className="section-label">
            ABOUT ME
          </p>

          <h2>
            Engineering across
            <br />
            software & hardware.
          </h2>

        </div>


        <div className="about-content">

          <p>
            I am a Computer Engineering graduate
            with hands-on experience across software
            development, artificial intelligence,
            computer vision, QA automation, embedded
            systems, robotics, and IoT.
          </p>

          <p>
            Through academic, internship, and personal
            projects, I have developed applications,
            automation frameworks, AI systems, and
            hardware prototypes while gaining practical
            experience in debugging, testing, system
            integration, and problem solving.
          </p>

        </div>

      </section>


      {/* =================================================
          TECHNICAL SKILLS
      ================================================= */}

      <section
        id="skills"
        className="skills-section"
      >

        <div className="section-heading">

          <p className="section-label">
            TECHNICAL SKILLS
          </p>

          <h2>
            Tools I work with.
          </h2>

        </div>


        <div className="skills-grid">

          {/* PROGRAMMING */}

          <div className="skill-group">

            <h3>
              Programming
            </h3>

            <p>
              Python · C# · C++ · C · Visual Basic · TypeScript
            </p>

          </div>


          {/* QA AUTOMATION */}

          <div className="skill-group">

            <h3>
              QA Automation
            </h3>

            <p>
              Robot Framework · Selenium · SeleniumLibrary ·
              Test Automation · API Testing · Postman
            </p>

          </div>


          {/* AI / COMPUTER VISION */}

          <div className="skill-group">

            <h3>
              AI / Computer Vision
            </h3>

            <p>
              YOLOv5 · OpenCV · OCR · Roboflow ·
              Google Colab · Image Processing
            </p>

          </div>


          {/* SOFTWARE DEVELOPMENT */}

          <div className="skill-group">

            <h3>
              Software Development
            </h3>

            <p>
              OOP · Git · GitHub · REST APIs ·
              Debugging · Visual Studio · VS Code
            </p>

          </div>


          {/* WEB DEVELOPMENT */}

          <div className="skill-group">

            <h3>
              Web Development
            </h3>

            <p>
              React · TypeScript · Vite · React Router ·
              HTML · CSS
            </p>

          </div>


          {/* EMBEDDED / IoT */}

          <div className="skill-group">

            <h3>
              Embedded / IoT
            </h3>

            <p>
              Arduino · Raspberry Pi · ESP8266 ·
              ESP32 · Blynk · Sensors · PCB Design
            </p>

          </div>


          {/* ENGINEERING TOOLS */}

          <div className="skill-group">

            <h3>
              Engineering Tools
            </h3>

            <p>
              MATLAB · Simulink · Proteus ·
              LTSpice · Tinkercad
            </p>

          </div>

        </div>

      </section>


      {/* =================================================
          PROJECTS
      ================================================= */}

      <section
        id="projects"
        className="projects-section"
      >

        <Projects />

      </section>


      {/* =================================================
          ENGINEERING CASE STUDIES
      ================================================= */}

      <section
        id="case-studies"
        className="case-study-section"
      >

        <div className="section-heading">

          <p className="section-label">
            ENGINEERING CASE STUDIES
          </p>

          <h2>
            How I build
            <br />
            solutions.
          </h2>

        </div>


        <div className="case-study-grid">

          <article>

            <span>
              01
            </span>

            <h3>
              AI Character Recognition
            </h3>

            <p>
              Dataset preparation → model training
              → computer vision → Raspberry Pi
              integration → testing.
            </p>

          </article>


          <article>

            <span>
              02
            </span>

            <h3>
              CompetencyIQ AI
            </h3>

            <p>
              Business requirements → agent design
              → structured prompts → analysis
              → risk evaluation → recommendations.
            </p>

          </article>


          <article>

            <span>
              03
            </span>

            <h3>
              QA Automation
            </h3>

            <p>
              Test design → Robot Framework →
              Selenium → reusable keywords →
              execution → reporting → AI-assisted
              test analysis.
            </p>

          </article>

        </div>

      </section>


      {/* =================================================
          EXPERIENCE
      ================================================= */}

      <section
        id="experience"
        className="experience-section"
      >

        <div className="section-heading">

          <p className="section-label">
            EXPERIENCE
          </p>

          <h2>
            Robotics &
            <br />
            Automation.
          </h2>

        </div>


        <div className="experience-item">

          <div>

            <span className="experience-date">
              2023
            </span>

          </div>


          <div>

            <h3>
              Robotics Automation Intern
            </h3>

            <p className="experience-company">
              Erovutika Electronics Corporation
            </p>

            <p>
              Assisted with robotics automation,
              embedded-system development,
              troubleshooting, testing, debugging,
              calibration, sensor integration,
              prototype development, and system
              validation.
            </p>

          </div>

        </div>

      </section>


      {/* =================================================
          EDUCATION
      ================================================= */}

      <section className="education-section">

        <div className="section-heading">

          <p className="section-label">
            EDUCATION
          </p>

          <h2>
            Computer
            <br />
            Engineering.
          </h2>

        </div>


        <div className="education-item">

          <div>

            <h3>
              Mapúa University
            </h3>

            <p>
              Bachelor of Science in Computer Engineering
            </p>

          </div>

          <span>
            2019 — 2025
          </span>

        </div>


        <div className="education-item">

          <div>

            <h3>
              Bachelor of Science in Electrical Engineering
            </h3>

          </div>

          <span>
            2014 — 2019
          </span>

        </div>

      </section>


      {/* =================================================
          CONTACT
      ================================================= */}

      <section
        id="contact"
        className="contact-section"
      >

        <p className="section-label">
          CONTACT
        </p>

        <h2>
          Let's connect.
        </h2>

        <p className="contact-description">
          I am open to opportunities in software development,
          QA automation, AI, and related engineering roles.
        </p>


        <div className="contact-details">

          {/* EMAIL */}

          <a
            href="mailto:jacarbon06@gmail.com"
            className="contact-item"
          >

            <span className="contact-icon">
              ✉
            </span>

            <span className="contact-item-content">

              <span className="contact-label">
                EMAIL
              </span>

              <span className="contact-value">
                jacarbon06@gmail.com
              </span>

            </span>

          </a>


          {/* LINKEDIN */}

          <a
            href="https://www.linkedin.com/in/joshua-carbon"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-item"
          >

            <span className="contact-icon">
              in
            </span>

            <span className="contact-item-content">

              <span className="contact-label">
                LINKEDIN
              </span>

              <span className="contact-value">
                /in/joshua-carbon
              </span>

            </span>

          </a>


          {/* GITHUB */}

          <a
            href="https://github.com/Jcplayer06"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-item"
          >

            <span className="contact-icon">
              Git
            </span>

            <span className="contact-item-content">

              <span className="contact-label">
                GITHUB
              </span>

              <span className="contact-value">
                /Jcplayer06
              </span>

            </span>

          </a>


          {/* PHONE */}

          <a
            href="tel:09912869067"
            className="contact-item"
          >

            <span className="contact-icon">
              ☎
            </span>

            <span className="contact-item-content">

              <span className="contact-label">
                PHONE
              </span>

              <span className="contact-value">
                0991 286 9067
              </span>

            </span>

          </a>

        </div>

      </section>

    </main>
  );
}