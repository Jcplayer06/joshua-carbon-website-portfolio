import CompactCaseStudy from "./CompactCaseStudy";
import aiquantaImage from "../assets/projects/aiquanta-real-homepage.webp";
import aiquantaSystemVisual from "../assets/projects/generated/aiquanta-project-visual.svg";
import aiquantaSystemVisualMobile from "../assets/projects/generated/aiquanta-mobile.svg";

export default function AIQUANTACaseStudy() {
  return (
    <CompactCaseStudy
      className="aiquanta-compact-case"
      eyebrow="PROJECT 01 / FULL-STACK · WEB / CLIENT"
      title={<>AIQUANTA<br />Training Consultancy Services</>}
      intro="A paid client project that grew from a public consulting website into a secure intake and small operations platform for AIQUANTA Training Consultancy Services."
      image={aiquantaImage}
      imageAlt="Current AIQUANTA Training Consultancy Services public homepage"
      imageCaption="Current AIQUANTA public homepage — public-facing content only"
      technicalVisual={aiquantaSystemVisual}
      technicalVisualMobile={aiquantaSystemVisualMobile}
      technicalVisualAlt="AIQUANTA system architecture showing the public frontend, HTTPS API, security gates, hybrid AI assessment, D1 database, administration, and email flow"
      technicalVisualCaption="Project visual — system build and verified technical stack"
      sections={[
        {
          label: "01 / PROBLEM",
          title: "Turn a consulting website into a usable business entry point.",
          body: "The client needed a clear public experience for its consulting and training services, with a reliable path from visitor interest to a structured consultation inquiry.",
        },
        {
          label: "02 / UNDERSTANDING",
          title: "Connect the public experience to a controlled workflow.",
          body: "The system separates the browser from sensitive decisions: the Worker owns the API contract and server-side checks, while D1 stores operational state and the admin layer provides human governance.",
        },
        {
          label: "03 / SOLUTION",
          title: "Build the intake, AI, data, and delivery layers together.",
          body: "The final system combines React/TypeScript/Vite, a Cloudflare Worker API, D1 relational storage, a hybrid deterministic-plus-AI inquiry assessment flow, authenticated administration, analytics/reporting, Microsoft Graph email, and technical SEO including metadata, canonical URLs, sitemap/robots, and structured data.",
        },
      ]}
      links={
        <a href="https://aiquantaph.com/" target="_blank" rel="noopener noreferrer" className="compact-case-live-link">
          Visit AIQUANTA Website ↗
        </a>
      }
    />
  );
}
