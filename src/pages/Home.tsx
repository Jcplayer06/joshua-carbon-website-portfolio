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

           {/* PROGRAMMING */}

          <div className="skill-group">

            <h3>
              Programming
            </h3>

            <p>
               Python · C# · C++ · C · Visual Basic · TypeScript
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

          <div className="skill-group"></div>
              <h3>
                Web Development
              </h3>

               <p>
                React · TypeScript · Vite · React Router · HTML · CSS
               </p>

           


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


          {/* LINKEDIN */}

          <a
            href="https://www.linkedin.com/in/joshua-carbon-68b0a5335/"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-item contact-linkedin"
            aria-label="Joshua Carbon on LinkedIn"
          >

            <span
              className="contact-icon linkedin-icon"
              aria-hidden="true"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" />
              </svg>
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
            className="contact-item contact-github"
            aria-label="Joshua Carbon on GitHub"
          >

            <span
              className="contact-icon github-icon"
              aria-hidden="true"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1.16-.02-2.11-3.2.7-3.88-1.35-3.88-1.35-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.03 1.76 2.71 1.25 3.37.96.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.08.78 2.17 0 1.56-.01 2.82-.01 3.2 0 .3.2.66.79.55A11.5 11.5 0 0 0 23.5 12c0-6.27-5.23-11.5-11.5-11.5Z" />
              </svg>
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
            href="tel:+639912869067"
            className="contact-item contact-phone-card"
            aria-label="Call 0991 286 9067"
          >

            <span
              className="contact-icon phone-icon"
              aria-hidden="true"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
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
            className="contact-item contact-email-card"
            aria-label="Email jacarbon06@gmail.com"
          >

            <span
              className="contact-icon email-icon"
              aria-hidden="true"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <path d="M22 6l-10 7L2 6" />
              </svg>
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