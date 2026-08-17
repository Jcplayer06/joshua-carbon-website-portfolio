import { Link } from "react-router-dom";

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

        {/* =================================================
            HERO CONTENT
        ================================================= */}

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
            Computer Engineering graduate with hands-on
            experience in software development, QA
            automation, artificial intelligence, computer
            vision, IoT, and embedded systems.
          </p>

          <p className="hero-description hero-description-secondary">
            I build practical solutions through academic,
            internship, and personal projects, with a focus
            on problem-solving, testing, system integration,
            and continuous learning.
          </p>


          {/* HERO BUTTONS */}

          <div className="hero-buttons">

            <Link
              to="/projects"
              className="button button-primary"
            >
              View My Projects →
            </Link>

            <a
              href="#contact"
              className="button button-secondary"
            >
              Contact Me →
            </a>

          </div>

        </div>


        {/* =================================================
            PROFILE PHOTO
        ================================================= */}

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


        {/* =================================================
            HERO SIDE
        ================================================= */}

        <div className="hero-side">

          <div className="hero-line"></div>

          <p>
            SOFTWARE
            <br />
            AI
            <br />
            QA AUTOMATION
            <br />
            IoT
          </p>

        </div>

      </section>


      {/* =================================================
          ABOUT
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
            Building software.
            <br />
            Solving problems.
            <br />
            Learning continuously.
          </h2>

        </div>


        <div className="about-content">

          <p>
            I am a Computer Engineering graduate with
            practical experience developing software
            applications, QA automation frameworks,
            AI-powered solutions, computer vision systems,
            and embedded/IoT projects.
          </p>

          <p>
            My projects have given me hands-on experience
            with Python, C#, Robot Framework, Selenium,
            AI tools, computer vision, embedded systems,
            and system integration. I enjoy understanding
            how systems work, identifying problems, and
            building reliable solutions to address them.
          </p>

          <p>
            I am currently seeking opportunities where I
            can apply my technical skills, contribute to a
            development or QA team, and continue growing
            as a software, QA automation, or AI-focused
            engineer.
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

          <div className="skill-group">

            <h3>
              Programming
            </h3>

            <p>
              Python · C# · C++ · C · Visual Basic
            </p>

          </div>


          <div className="skill-group">

            <h3>
              QA Automation
            </h3>

            <p>
              Robot Framework · Selenium ·
              SeleniumLibrary · Test Automation
            </p>

          </div>


          <div className="skill-group">

            <h3>
              AI / Computer Vision
            </h3>

            <p>
              YOLOv5 · OpenCV · Roboflow ·
              Google Colab · Image Processing
            </p>

          </div>


          <div className="skill-group">

            <h3>
              Software Development
            </h3>

            <p>
              OOP · Git · GitHub · REST APIs ·
              Debugging · Visual Studio · VS Code
            </p>

          </div>


          <div className="skill-group">

            <h3>
              Embedded / IoT
            </h3>

            <p>
              Arduino · Raspberry Pi · ESP8266 ·
              Blynk · Sensors · PCB Design
            </p>

          </div>


          <div className="skill-group">

            <h3>
              Engineering Tools
            </h3>

            <p>
              MATLAB · Packet Tracer · Microsoft
              Visual Studio · VS Code
            </p>

          </div>

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
          I am open to opportunities in software
          development, QA automation, AI, and related
          engineering roles.
        </p>


        {/* CONTACT DETAILS */}

        <div className="contact-details">


          {/* PHONE */}

          <a
            href="tel:+639912869067"
            className="contact-item contact-phone"
            aria-label="Call 0991 286 9067"
          >

            <span
              className="contact-icon phone-icon"
              aria-hidden="true"
            >
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


          {/* EMAIL */}

          <a
            href="mailto:jacarbon06@gmail.com"
            className="contact-item contact-email"
            aria-label="Email jacarbon06@gmail.com"
          >

            <span
              className="contact-icon email-icon"
              aria-hidden="true"
            >
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

        </div>

      </section>

    </main>
  );
}