import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import profileImage from "../assets/joshua-carbon.webp";
import LiveEngineeringScene from "../components/LiveEngineeringScene";
import AboutMatrixCanvas from "../components/AboutMatrixCanvas";
import SkillsEngineeringCanvas from "../components/SkillsEngineeringCanvas";
import ContactGlobeNetwork from "../components/ContactGlobeNetwork";

const skillCards = [
  { ic: "IC-01", icon: "</>", title: "Programming & Languages", text: "Python · C · C++ · Embedded C · C# · Visual Basic · SQL · TypeScript" },
  { ic: "IC-02", icon: "⬡", title: "Software Development", text: "OOP · Git · GitHub · REST APIs · Windows Forms · GUI Development · Debugging" },
  { ic: "IC-03", icon: "◎", title: "Web / Full-Stack", text: "React · TypeScript · Vite · React Router · HTML · CSS" },
  { ic: "IC-04", icon: "⚙", title: "QA & Test Automation", text: "Robot Framework · Selenium · SeleniumLibrary · API Testing · Postman · Manual Testing · Test Case Design" },
  { ic: "IC-05", icon: "◉", title: "AI / Computer Vision", text: "YOLOv5 · OpenCV · OCR · Image Processing · Roboflow · Google Colab" },
  { ic: "IC-06", icon: "✦", title: "AI & Automation", text: "Microsoft Copilot Studio · Prompt Engineering · Power Automate · OpenAI API" },
  { ic: "IC-07", icon: "▣", title: "Embedded / IoT", text: "Arduino · Raspberry Pi · ESP32 · ESP8266 · Microcontrollers · Sensors · Blynk · PCB Integration" },
  { ic: "IC-08", icon: "▰", title: "Hardware / Robotics", text: "Hardware Prototyping · PC Prototyping · Microcontroller-Based Systems · Hardware/Software Integration · Calibration · Troubleshooting · Robotics Automation" },
  { ic: "IC-09", icon: "⌁", title: "Engineering Tools", text: "MATLAB · Simulink · Proteus · LTspice · Tinkercad · Fritzing · Packet Tracer · Microsoft Visual Studio · VS Code" },
];

const aboutFoundationLayers = [
  { id: "computer", icon: "▣", title: "COMPUTER ENGINEERING", tags: "Hardware · Embedded · IoT" },
  { id: "software", icon: "⬡", title: "SOFTWARE ENGINEERING", tags: "Programming · OOP · Systems" },
  { id: "web", icon: "◎", title: "WEB / FULL-STACK", tags: "React · TypeScript · APIs · Database" },
  { id: "ai", icon: "✦", title: "AI / AUTOMATION", tags: "AI · Computer Vision · Automation" },
  { id: "quality", icon: "⚙", title: "QUALITY / RELIABILITY", tags: "QA · Testing · Debugging" },
  { id: "prototype", icon: "▰", title: "BUILDING / PROTOTYPING", tags: "Projects · Integration · Experimentation" },
];

const aboutEngineeringProcess = [
  { label: "UNDERSTAND THE PROBLEM", text: "clarify the need" },
  { label: "REVIEW THE PROCESS", text: "find the right path" },
  { label: "INTEGRATE THE SYSTEM", text: "connect the pieces" },
  { label: "DEVELOP SOFTWARE", text: "build the solution" },
  { label: "DELIVER THE SOLUTION", text: "validate and improve" },
];

function emitContactRadarHover(key: string | null) {
  window.dispatchEvent(
    new CustomEvent("contact-radar-hover", {
      detail: { key },
    }),
  );
}

type ContactStatus = "offline" | "connecting" | "online";

const CONTACT_STATUS: Record<
  ContactStatus,
  { text: string; className: string }
> = {
  offline: {
    text: "OFFLINE — link idle",
    className: "status-offline",
  },
  connecting: {
    text: "CONNECTING — establishing link",
    className: "status-connecting",
  },
  online: {
    text: "ONLINE — open to opportunities",
    className: "status-online",
  },
};

function ContactTerminal() {
  const [ping, setPing] = useState("");
  const [syn, setSyn] = useState("");
  const [status, setStatus] = useState<ContactStatus>("offline");
  const [statusText, setStatusText] = useState(
    CONTACT_STATUS.offline.text,
  );
  const [coffee, setCoffee] = useState("");
  const [typing, setTyping] = useState(true);

  useEffect(function () {
    let cancelled = false;

    const sleep = function (ms: number) {
      return new Promise<void>(function (resolve) {
        window.setTimeout(resolve, ms);
      });
    };

    const typeInto = async function (
      text: string,
      setter: (value: string) => void,
      speed: number,
    ) {
      setter("");

      for (let i = 1; i <= text.length; i += 1) {
        if (cancelled) return;

        setter(text.slice(0, i));
        await sleep(speed);
      }
    };

    const run = async function () {
      setTyping(true);

      await sleep(350);
      await typeInto("> ping jcarbon", setPing, 30);

      await sleep(120);
      await typeInto("> SYN → SYN-ACK → ACK", setSyn, 24);

      await sleep(300);
      setTyping(false);

      const sequence: Array<[ContactStatus, number]> = [
        ["offline", 1800],
        ["connecting", 2200],
        ["online", 5600],
      ];

      let firstOnline = true;

      while (!cancelled) {
        for (const pair of sequence) {
          const nextStatus = pair[0];
          const hold = pair[1];

          if (cancelled) return;

          setStatus(nextStatus);
          setTyping(true);

          await typeInto(
            CONTACT_STATUS[nextStatus].text,
            setStatusText,
            20,
          );

          setTyping(false);

          if (nextStatus === "online" && firstOnline) {
            await sleep(180);

            await typeInto(
              "Response time: depends on coffee. ☕",
              setCoffee,
              20,
            );

            firstOnline = false;
          }

          await sleep(hold);
        }
      }
    };

    run();

    return function () {
      cancelled = true;
    };
  }, []);

  return (
    <div
      className="contact-terminal"
      aria-label="Connection status"
      aria-live="polite"
    >
      <span className="contact-terminal-line">
        {ping}
        {typing && ping.length < 13 ? (
          <b className="terminal-caret">▮</b>
        ) : null}
      </span>

      <span className="contact-terminal-line">
        {syn}
        {typing && ping.length >= 13 && syn.length < 19 ? (
          <b className="terminal-caret">▮</b>
        ) : null}
      </span>

      <span
        className={
          "contact-terminal-line contact-terminal-status " +
          CONTACT_STATUS[status].className
        }
      >
        <i aria-hidden="true" /> {statusText}
        {typing &&
        statusText.length < CONTACT_STATUS[status].text.length ? (
          <b className="terminal-caret">▮</b>
        ) : null}
      </span>

      <span className="contact-terminal-line contact-terminal-note">
        {coffee}
      </span>
    </div>
  );
}

type ContactIconKind = "email" | "phone" | "linkedin" | "github";

type ContactCardProps = {
  href: string;
  target?: string;
  rel?: string;
  hoverKey: string;
  iconKind: ContactIconKind;
  label: string;
  value: string;
  hint: string;
  arrow: string;
};

function ContactLogo(props: { kind: ContactIconKind }) {
  if (props.kind === "email") {
    return (
      <svg viewBox="0 0 32 32" className="contact-logo-svg" aria-hidden="true">
        <rect x="4" y="7" width="24" height="18" rx="3" />
        <path d="M5 9l11 9L27 9" />
        <path d="M5 24l8-7M27 24l-8-7" />
      </svg>
    );
  }

  if (props.kind === "phone") {
    return (
      <svg viewBox="0 0 32 32" className="contact-logo-svg" aria-hidden="true">
        <path d="M9 5.5l4.2-1.2 3 6.3-2.8 2.4c1.4 3.1 3.9 5.6 7 7l2.4-2.8 6.3 3-1.2 4.2c-.4 1.5-1.8 2.4-3.3 2.2C13 25.2 6.8 19 5.2 7.4 5 5.9 6 4.5 7.4 4.1z" />
      </svg>
    );
  }

  if (props.kind === "linkedin") {
    return (
      <svg viewBox="0 0 32 32" className="contact-logo-svg contact-logo-linkedin" aria-hidden="true">
        <rect x="4" y="4" width="24" height="24" rx="4" />
        <circle cx="10.5" cy="10.6" r="1.7" />
        <rect x="8.8" y="13.2" width="3.5" height="9.7" rx="0.8" />
        <path d="M15.2 22.9v-9.7h3.5v1.35c.75-1.02 1.9-1.72 3.55-1.72 2.85 0 4.75 1.9 4.75 5.35v4.72h-3.6v-4.1c0-1.55-.56-2.52-1.82-2.52-1.37 0-2.38.96-2.38 2.52v4.1z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 32 32" className="contact-logo-svg contact-logo-github" aria-hidden="true">
      <circle cx="16" cy="16" r="11.5" />
      <path d="M11.2 24.3c.7.3 1.5.5 2.3.6v-3.2c-3 .6-3.6-1.2-3.6-1.2-.5-1.3-1.2-1.7-1.2-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 .1 1.7.5 2.1.9.2-1 .7-1.6 1.2-2-2.4-.3-5-1.2-5-5.3 0-1.2.4-2.2 1.1-3-.1-.3-.5-1.4.1-2.9 0 0 .9-.3 3.1 1.1.9-.3 1.8-.4 2.7-.4.9 0 1.8.1 2.7.4 2.2-1.4 3.1-1.1 3.1-1.1.6 1.5.2 2.6.1 2.9.7.8 1.1 1.8 1.1 3 0 4.1-2.6 5-5 5.3.7.6 1.3 1.5 1.3 3v4.4" />
    </svg>
  );
}

function ContactCard(props: ContactCardProps) {
  return (
    <a
      href={props.href}
      target={props.target}
      rel={props.rel}
      className="contact-item"
      onMouseEnter={function () {
        emitContactRadarHover(props.hoverKey);
      }}
      onMouseLeave={function () {
        emitContactRadarHover(null);
      }}
      onFocus={function () {
        emitContactRadarHover(props.hoverKey);
      }}
      onBlur={function () {
        emitContactRadarHover(null);
      }}
    >
      <span className="contact-icon">
        <ContactLogo kind={props.iconKind} />
      </span>

      <span className="contact-item-content">
        <span className="contact-label">{props.label}</span>
        <span className="contact-value">{props.value}</span>
        <small>{props.hint}</small>
      </span>

      <b>{props.arrow}</b>
    </a>
  );
}

export default function Home() {
  return (
    <main className="home-page">
      <section id="home" className="hero hero-futuristic hero-live">
        <LiveEngineeringScene />

        <div
          className="hero-code-panel system-console"
          aria-hidden="true"
        >
          <span className="system-line system-line-1">
            &gt; Initializing Portfolio...
          </span>
          <span className="system-line system-line-2">
            &gt; Loading Systems...
          </span>
          <span className="system-line system-line-3">
            &gt; Welcome to my digital workspace.
          </span>
          <span className="code-cursor system-caret">▮</span>
        </div>

        <div className="hero-social-rail" aria-label="Social links">
          <a
            href="https://www.linkedin.com/in/joshua-carbon-68b0a5335/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            in
          </a>

          <a
            href="https://github.com/Jcplayer06"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            ◉
          </a>
        </div>

        <div className="hero-content hero-futuristic-copy">
          <p className="hero-label">COMPUTER ENGINEER</p>

          <h1>
            Joshua
            <br />
            <span>Carbon</span>
            <b>.</b>
          </h1>

          <div className="hero-specialties">
            <span>Software</span>
            <i>•</i>
            <span>AI</span>
            <i>•</i>
            <span>Computer Vision</span>
            <i>•</i>
            <span>QA Automation</span>
            <br />
            <span>Full-Stack Web Development</span>
            <i>•</i>
            <span>IoT</span>
          </div>

          <p className="hero-description">
            Computer Engineering graduate focused on building practical
            software and AI systems across automation, computer vision,
            full-stack web, and embedded projects.
          </p>

          <div className="hero-buttons">
            <Link
              to="/projects"
              className="button button-primary hero-glow-button"
            >
              View My Projects <span>→</span>
            </Link>

            <a href="#contact" className="button button-secondary">
              Contact Me <span>→</span>
            </a>
          </div>
        </div>

        <div
          className="hero-tagline"
          aria-label="Turning ideas into solutions"
        >
          TURNING
          <br />
          IDEAS INTO
          <br />
          SOLUTIONS.
        </div>

        <div className="continuous-learning-card">
          <span className="continuous-learning-label">
            CONTINUOUSLY LEARNING
          </span>

          <strong>
            Applying technology.{" "}
            <em>Building, growing,</em>
            <br />
            and staying hungry for more.
          </strong>

          <p>
            I keep learning new tools, applying them to real projects, and
            improving what I build.
          </p>
        </div>

        <div className="hero-tech-card tech-card-a">
          <strong>&lt;/&gt;</strong>
          <span>
            Full-Stack
            <br />
            Web Development
          </span>
        </div>

        <div className="hero-tech-card tech-card-b">
          <strong>◉</strong>
          <span>
            Computer Vision
            <br />
            (YOLOv5)
          </span>
        </div>

        <div className="hero-tech-card tech-card-c">
          <strong>⚙</strong>
          <span>
            QA Automation
            <br />
            (Selenium)
          </span>
        </div>

        <div className="hero-tech-card tech-card-d">
          <strong>▣</strong>
          <span>
            Embedded Systems
            <br />
            &amp; IoT
          </span>
        </div>

        <div className="hero-tech-card tech-card-e">
          <strong>✦</strong>
          <span>
            AI Tools
            <br />
            &amp; Automation
          </span>
        </div>

        <div className="hero-profile-card">
          <div className="hero-profile-corner top-left" />
          <div className="hero-profile-corner top-right" />
          <div className="hero-profile-corner bottom-left" />
          <div className="hero-profile-corner bottom-right" />

          <img src={profileImage} alt="Joshua Carbon" decoding="async" fetchPriority="high" />

          <div className="hero-profile-footer-label">
            ENGINEER <span>//</span> DEVELOPER <span>//</span> PROBLEM SOLVER
          </div>
        </div>

        <svg
          className="hero-tech-connections"
          viewBox="0 0 100 100"
          aria-hidden="true"
          preserveAspectRatio="none"
        >
          <defs>
            <filter
              id="techLineGlow"
              x="-30%"
              y="-30%"
              width="160%"
              height="160%"
            >
              <feGaussianBlur stdDeviation="0.55" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <path
            className="tech-link-line"
            d="M46 17 C51 20 53 25 55 31"
          />
          <path
            className="tech-link-line"
            d="M68 23 C65 29 63 34 61 39"
          />
          <path
            className="tech-link-line"
            d="M51 53 C54 51 57 49 59 47"
          />
          <path
            className="tech-link-line"
            d="M68 56 C65 54 63 52 61 50"
          />
          <path
            className="tech-link-line"
            d="M58 73 C59 66 60 60 60 55"
          />

          <circle
            className="tech-link-node"
            cx="55"
            cy="31"
            r="0.7"
          />
          <circle
            className="tech-link-node"
            cx="61"
            cy="39"
            r="0.7"
          />
          <circle
            className="tech-link-node"
            cx="59"
            cy="47"
            r="0.7"
          />
          <circle
            className="tech-link-node"
            cx="61"
            cy="50"
            r="0.7"
          />
          <circle
            className="tech-link-node"
            cx="60"
            cy="55"
            r="0.7"
          />
        </svg>

        <div className="hero-utility-row">
          <div
            className="hero-live-panel system-active-panel"
            aria-label="Live development system"
          >
            <div className="live-sys-header">
              <b>
                <span className="live-sys-dot">●</span> live.sys
              </b>
              <span className="live-sys-close">×</span>
            </div>

            <p className="live-line live-line-1">
              <em>01</em> connect(); <small>// success</small>
            </p>

            <p className="live-line live-line-2">
              <em>02</em> learn(); <small>// ongoing</small>
            </p>

            <p className="live-line live-line-3">
              <em>03</em> build(); <small>// in progress</small>
            </p>

            <p className="live-line live-line-4">
              <em>04</em> improve(); <small>// always</small>
            </p>

            <small className="live-system-footer">
              // creating a better future...
            </small>

            <span className="live-caret" aria-hidden="true">
              ▮
            </span>
          </div>

          <div className="hero-exploring">
            <b>◉ Currently Exploring</b>
            <span>Web Technologies</span>
            <span>Computer Vision Improvements</span>
            <span>Automation &amp; Testing</span>
            <span>IoT Innovations</span>
          </div>
        </div>
      </section>

      <section
        id="about"
        className="about-section futuristic-section about-live-section"
      >
        <div className="about-live-bg" aria-hidden="true">
          <div className="about-matrix-canvas-wrap" aria-hidden="true">
            <AboutMatrixCanvas />
          </div>
          <span className="about-scan-line" aria-hidden="true" />
        </div>

        <div className="about-reference-header">
          <div>
            <span>ABOUT ME</span>
            <small>GET TO KNOW ME</small>
          </div>
          <b aria-hidden="true">// ENGINEERING PROFILE</b>
        </div>

        <div className="about-reference-shell">
          <aside className="about-profile-panel">
            <span className="about-panel-kicker">ENGINEERING PROFILE</span>
            <h2>How I<br /><em>Build.</em></h2>
            <p className="about-profile-lead">
              I’m a Computer Engineering graduate focused on understanding systems, connecting the right technologies, and turning practical problems into working software.
            </p>

            <div className="about-profile-traits" aria-label="Engineering traits">
              <span><i>◎</i> Problem Solver</span>
              <span><i>◈</i> Systems Thinker</span>
              <span><i>↗</i> Continuous Learner</span>
              <span><i>⌬</i> Engineer at Heart</span>
            </div>

            <div className="about-profile-status">
              <span>BUILD PRINCIPLE</span>
              <strong>TURNING IDEAS INTO SOLUTIONS.</strong>
              <small>Understand · Review · Integrate · Develop · Deliver</small>
            </div>
          </aside>

          <section className="about-approach-panel" aria-label="Engineering approach">
            <div className="about-approach-heading">
              <div>
                <span>MY ENGINEERING APPROACH</span>
                <strong>UNDERSTAND → REVIEW → INTEGRATE → DEVELOP → DELIVER</strong>
              </div>
              <small>HOW THE PIECES CONNECT</small>
            </div>

            <div className="about-process-steps" aria-label="Engineering process">
              {aboutEngineeringProcess.map((step) => (
                <span className="about-process-step" key={step.label}>
                  <b>{step.label}</b>
                  <small>{step.text}</small>
                </span>
              ))}
            </div>

            <div className="about-approach-stack" aria-label="Engineering foundation">
              <span className="about-approach-spine" aria-hidden="true" />
              {aboutFoundationLayers.map((layer) => (
                <article
                  className="about-approach-layer"
                  key={layer.id}
                >
                  <span className="about-approach-icon" aria-hidden="true">
                    <strong>{layer.icon}</strong>
                  </span>
                  <span className="about-approach-copy">
                    <b>{layer.title}</b>
                    <small>{layer.tags}</small>
                  </span>
                </article>
              ))}
            </div>

            <div className="about-right-bottom-grid">
              <div className="about-system-mindset-panel">
                <span>ENGINEERING MINDSET</span>
                <strong>BUILD WITH THE WHOLE SYSTEM IN MIND.</strong>
                <small>Hardware · Software · AI · Quality · Integration</small>
              </div>
              <div className="about-quality-panel about-delivery-panel">
                <span>QUALITY + DELIVERY</span>
                <strong>TEST → VALIDATE → IMPROVE</strong>
                <small>Quality is part of the build, not the last step.</small>
              </div>
            </div>
          </section>
        </div>

        <div className="about-reference-footer">
          <span><i /> ENGINEERING MINDSET</span>
          <small>Computer Engineering is the foundation. AI is the direction I am building toward.</small>
        </div>
      </section>

      <section
        id="skills"
        className="skills-section futuristic-section skills-live-section"
      >
        <SkillsEngineeringCanvas />

        <div className="skills-section-heading" aria-labelledby="skills-section-title">
          <span id="skills-section-title">SKILLS</span>
          <small>TOOLS I WORK WITH</small>
        </div>

        <div className="skills-intro">
          <h2>
            Technologies
            <br />
            <span>that power my solutions.</span>
          </h2>

          <p>
            Programming, software, AI, automation, web, embedded systems,
            and hardware.
          </p>
        </div>

        <div className="skills-grid futuristic-skills-grid">
          {skillCards.map(function (skill) {
            return (
              <article
                className="futuristic-skill-card"
                key={skill.title}
                data-skill={skill.title}
                onMouseEnter={function () {
                  window.dispatchEvent(
                    new CustomEvent("skill-card-hover", {
                      detail: skill.title,
                    }),
                  );
                }}
                onMouseLeave={function () {
                  window.dispatchEvent(
                    new CustomEvent("skill-card-hover", {
                      detail: "",
                    }),
                  );
                }}
              >
                <span className="skill-ic-code">{skill.ic}</span>

                <span className="skill-ic-badge">
                  <strong>{skill.icon}</strong>
                </span>

                <div className="skill-card-content">
                  <h3>{skill.title}</h3>
                  <p>{skill.text}</p>
                </div>
              </article>
            );
          })}
        </div>

        <div className="engineering-tools engineering-practice">
          <span>ENGINEERING PRACTICE</span>
          <b>
            Debugging · Troubleshooting · Calibration · Functional Testing ·
            System Integration · Prototype Development
          </b>
        </div>
      </section>

      <section
        id="contact"
        className="contact-section futuristic-contact"
      >
        <div className="section-index">
          <span>CONTACT</span>
          <small>LET'S WORK TOGETHER</small>
        </div>

        <div className="contact-content-grid">
          <div className="contact-copy">
            <p className="contact-kicker">ESTABLISHING CONNECTION</p>

            <h2>
              Let's
              <br />
              <span>Connect.</span>
            </h2>

            <p>
              I am open to opportunities in software development, QA
              automation, AI, and related engineering roles. Whether you have
              a project, idea, or just want to say hello, feel free to reach
              out.
            </p>

            <ContactTerminal />
          </div>

          <div className="contact-globe-stage">
            <ContactGlobeNetwork />
          </div>
        </div>

        <div
          className="contact-details"
          aria-label="Contact channels"
        >
          <ContactCard
            href="https://mail.google.com/mail/?view=cm&fs=1&to=jacarbon06@gmail.com&su=Portfolio%20Contact"
            target="_blank"
            rel="noopener noreferrer"
            hoverKey="email"
            iconKind="email"
            label="EMAIL"
            value="jacarbon06@gmail.com"
            hint="Open email composer"
            arrow="↗"
          />

          <ContactCard
            href="tel:+639912869067"
            hoverKey="phone"
            iconKind="phone"
            label="PHONE"
            value="0991 286 9067"
            hint="Call directly"
            arrow="→"
          />

          <ContactCard
            href="https://www.linkedin.com/in/joshua-carbon-68b0a5335/"
            target="_blank"
            rel="noopener noreferrer"
            hoverKey="linkedin"
            iconKind="linkedin"
            label="LINKEDIN"
            value="/in/joshua-carbon"
            hint="Open profile"
            arrow="↗"
          />

          <ContactCard
            href="https://github.com/Jcplayer06"
            target="_blank"
            rel="noopener noreferrer"
            hoverKey="github"
            iconKind="github"
            label="GITHUB"
            value="/Jcplayer06"
            hint="Open profile"
            arrow="↗"
          />
        </div>

        <div className="contact-footer-note">
          // end of signal path
        </div>
      </section>
    </main>
  );
}