import CompactCaseStudy from "./CompactCaseStudy";
import portfolioIntroImage from "../assets/projects/portfolio-website-system-architecture.webp";

export default function PortfolioWebsiteCaseStudy() {
  return (
    <CompactCaseStudy
      className="portfolio-compact-case"
      eyebrow="PROJECT 08 / WEB DEVELOPMENT"
      title={<>Personal Portfolio<br />Website</>}
      intro="A React, TypeScript, and Vite portfolio built as a routed engineering interface with project briefs, role-tailored resumes, responsive layouts, and custom technical visuals."
      image={portfolioIntroImage}
      showHeroImage={true}
      imageAlt="Personal Portfolio Website system architecture and verified technology stack infographic"
      imageCaption="Project visual — system architecture and verified technology stack"
      sections={[
        {
          label: "01 / PROBLEM",
          title: "Present different engineering projects as one system.",
          body: "The portfolio needed to show software, AI, QA, web, embedded, and client work without falling back to a generic card-grid presentation.",
        },
        {
          label: "02 / APPROACH",
          title: "Build reusable pages and visual primitives.",
          body: "Shared project data, project routing, resume configuration, responsive rules, and technical visual components keep the experience consistent while allowing each surface to differ.",
        },
        {
          label: "03 / SOLUTION",
          title: "A portfolio that demonstrates the engineering process.",
          body: "The site combines routed project briefs, responsive UI, interactive visual systems, project data, resume assets, and Netlify deployment into one working application.",
        },
      ]}
    />
  );
}
