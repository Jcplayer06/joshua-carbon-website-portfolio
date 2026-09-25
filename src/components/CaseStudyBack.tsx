import { Link } from "react-router-dom";

export default function CaseStudyBack() {
  return (
    <aside className="case-study-nav" aria-label="Project navigation">
      <Link to="/projects" className="case-study-back-link" aria-label="Back to Projects">
        <span className="case-study-back-arrow" aria-hidden="true">←</span>
        <span className="case-study-back-copy">
          <small>PROJECT LAB</small>
          <strong>BACK TO PROJECTS</strong>
        </span>
      </Link>
      <span className="case-study-back-line" aria-hidden="true" />
    </aside>
  );
}
