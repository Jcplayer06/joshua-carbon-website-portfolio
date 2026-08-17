import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

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
    <header className="navbar">

      {/* LOGO */}

      <Link
        to="/"
        className="navbar-logo"
      >
        JC
      </Link>


      {/* NAVIGATION */}

      <nav className="navbar-links">

        {/* HOME */}

        <Link to="/">
          Home
        </Link>


        {/* ABOUT ME */}

        <a
          href="/#about"
          onClick={(event) =>
            goToHomeSection(event, "about")
          }
        >
          About Me
        </a>


        {/* SKILLS */}

        <a
          href="/#skills"
          onClick={(event) =>
            goToHomeSection(event, "skills")
          }
        >
          Skills
        </a>


        {/* PROJECTS */}

        <Link to="/projects">
          Projects
        </Link>


        {/* RESUME */}

        <Link to="/resume">
          Resume
        </Link>


        {/* CONTACT */}

        <a
          href="/#contact"
          onClick={(event) =>
            goToHomeSection(event, "contact")
          }
        >
          Contact
        </a>

      </nav>

    </header>
  );
}