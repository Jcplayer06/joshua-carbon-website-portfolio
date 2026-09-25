import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileHeaderVisible, setMobileHeaderVisible] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("home");

  const mobileHeaderHideTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const clearHideTimer = () => {
      if (mobileHeaderHideTimer.current !== undefined) {
        window.clearTimeout(mobileHeaderHideTimer.current);
        mobileHeaderHideTimer.current = undefined;
      }
    };

    const revealDuringActivity = () => {
      if (window.innerWidth > 700) {
        setMobileHeaderVisible(true);
        return;
      }

      setMobileHeaderVisible(true);
      clearHideTimer();

      if (menuOpen || window.scrollY <= 12) return;

      mobileHeaderHideTimer.current = window.setTimeout(() => {
        if (!menuOpen && window.scrollY > 12) {
          setMobileHeaderVisible(false);
        }
      }, 550);
    };

    const keepVisibleAtTop = () => {
      if (window.innerWidth <= 700 && window.scrollY <= 12) {
        clearHideTimer();
        setMobileHeaderVisible(true);
      }
    };

    const handleResize = () => {
      if (window.innerWidth > 700 || window.scrollY <= 12 || menuOpen) {
        clearHideTimer();
        setMobileHeaderVisible(true);
      }
    };

    window.addEventListener("scroll", revealDuringActivity, { passive: true });
    window.addEventListener("wheel", revealDuringActivity, { passive: true });
    window.addEventListener("touchmove", revealDuringActivity, { passive: true });
    window.addEventListener("touchstart", revealDuringActivity, { passive: true });
    window.addEventListener("resize", handleResize);
    window.addEventListener("scrollend", keepVisibleAtTop as EventListener);

    handleResize();

    return () => {
      window.removeEventListener("scroll", revealDuringActivity);
      window.removeEventListener("wheel", revealDuringActivity);
      window.removeEventListener("touchmove", revealDuringActivity);
      window.removeEventListener("touchstart", revealDuringActivity);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scrollend", keepVisibleAtTop as EventListener);
      clearHideTimer();
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  useEffect(() => {
    // Home sections are tracked below. Route-level active styling is derived at render time.
    if (location.pathname !== "/") return;

    const sectionIds = ["home", "about", "skills", "contact"];
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (!sections.length) {
      const frame = window.requestAnimationFrame(() => setActiveSection("home"));
      return () => window.cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target.id) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        root: null,
        rootMargin: "-18% 0px -55% 0px",
        threshold: [0.08, 0.2, 0.4, 0.6],
      }
    );

    sections.forEach((section) => observer.observe(section));

    const frame = window.requestAnimationFrame(() => {
      const initialHash = location.hash.replace("#", "");
      if (sectionIds.includes(initialHash)) {
        setActiveSection(initialHash);
      } else if (window.scrollY < 160) {
        setActiveSection("home");
      }
    });

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [location.pathname, location.hash]);

  const routeActiveSection =
    location.pathname.startsWith("/projects")
      ? "projects"
      : location.pathname === "/resume"
        ? "resume"
        : "";

  const resolvedActiveSection = location.pathname === "/" ? activeSection : routeActiveSection;

  const goHome = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setMenuOpen(false);

    if (location.pathname === "/") {
      // React Router does not change location for a same-route Link, so explicitly
      // clear any section state and return the user to the top of Home.
      if (window.location.hash) {
        window.history.replaceState(null, "", "/");
      }
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      setActiveSection("home");
      return;
    }

    navigate("/");
    window.setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      setActiveSection("home");
    }, 60);
  };

  const goToHomeSection = (
    event: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string
  ) => {
    event.preventDefault();

    // Already on Home
    if (location.pathname === "/") {
      const element = document.getElementById(sectionId);

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }

      return;
    }

    // Navigate to Home
    navigate("/");

    // Wait for Home to render, then scroll to section
    setTimeout(() => {
      const element = document.getElementById(sectionId);

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

  return (
    <header className={`navbar${mobileHeaderVisible ? " is-mobile-visible" : " is-mobile-idle"}${menuOpen ? " is-menu-open" : ""}`}>

      {/* LOGO */}

      <div className="navbar-brand">
        <Link
          to="/"
          className="navbar-logo"
        >
          JC
        </Link>
        <div className="navbar-brand-copy">
          <strong>JOSHUA CARBON</strong>
          <span>COMPUTER ENGINEER</span>
        </div>
      </div>


      {/* NAVIGATION */}

      <button
        type="button"
        className={`navbar-menu-toggle ${menuOpen ? "is-open" : ""}`}
        onClick={() => setMenuOpen((open) => !open)}
        aria-label={menuOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={menuOpen}
      >
        <span />
        <span />
        <span />
      </button>

      <nav className={`navbar-links ${menuOpen ? "is-open" : ""}`}>

        {/* HOME */}

        <Link
          className={resolvedActiveSection === "home" ? "nav-active" : ""}
          to="/"
          onClick={goHome}
        >
          Home
        </Link>


        {/* ABOUT ME */}

        <a
          href="/#about"
          aria-current={resolvedActiveSection === "about" ? "page" : undefined}
          className={resolvedActiveSection === "about" ? "nav-active" : ""}
          onClick={(event) => {
            setMenuOpen(false);
            goToHomeSection(event, "about");
          }}
        >
          About Me
        </a>


        {/* SKILLS */}

        <a
          href="/#skills"
          aria-current={resolvedActiveSection === "skills" ? "page" : undefined}
          className={resolvedActiveSection === "skills" ? "nav-active" : ""}
          onClick={(event) => {
            setMenuOpen(false);
            goToHomeSection(event, "skills");
          }}
        >
          Skills
        </a>


        {/* PROJECTS */}

        <Link className={resolvedActiveSection === "projects" ? "nav-active" : ""} to="/projects" onClick={() => setMenuOpen(false)}>
          Projects
        </Link>


        {/* RESUME */}

        <Link className={resolvedActiveSection === "resume" ? "nav-active" : ""} to="/resume" onClick={() => setMenuOpen(false)}>
          Resume
        </Link>


        {/* CONTACT */}

        <a
          href="/#contact"
          aria-current={resolvedActiveSection === "contact" ? "page" : undefined}
          className={resolvedActiveSection === "contact" ? "nav-active" : ""}
          onClick={(event) => {
            setMenuOpen(false);
            goToHomeSection(event, "contact");
          }}
        >
          Contact
        </a>

      </nav>

    </header>
  );
}