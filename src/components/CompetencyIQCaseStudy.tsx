import CompactCaseStudy from "./CompactCaseStudy";
import competencyIQImage from "../assets/projects/competencyiq.webp";
import competencySystemVisual from "../assets/projects/generated/competencyiq-project-visual.svg";
import competencySystemVisualMobile from "../assets/projects/generated/competencyiq-mobile.svg";

export default function CompetencyIQCaseStudy() {
  return (
    <CompactCaseStudy
      className="competency-compact-case"
      eyebrow="PROJECT 03 / AI APPLICATION / AGENT"
      title={<>CompetencyIQ<br /><span>AI.</span></>}
      intro="An AI assistant built in Microsoft Copilot Studio to help connect workforce competency, training, certification, quality, performance, risk, and compliance information."
      image={competencyIQImage}
      imageAlt="CompetencyIQ AI assistant interface"
      imageCaption="AI assistant concept / project interface"
      technicalVisual={competencySystemVisual}
      technicalVisualMobile={competencySystemVisualMobile}
      technicalVisualAlt="CompetencyIQ AI system flow from workforce information through Copilot Studio and prompt-guided analysis to insights and workflow"
      technicalVisualCaption="Project visual — system build and verified technical stack"
      sections={[
        {
          label: "01 / PROBLEM",
          title: "Too many workforce signals across separate records.",
          body: "Competency, training, certification, performance, audit, quality, risk, and compliance information needed a more usable way to explore relationships and gaps.",
        },
        {
          label: "02 / UNDERSTANDING",
          title: "Turn business questions into guided AI analysis.",
          body: "The assistant was structured around practical organizational questions, using prompt engineering to guide how the AI interprets and presents the available information.",
        },
        {
          label: "03 / SOLUTION",
          title: "A practical AI layer for workforce intelligence.",
          body: "CompetencyIQ provides a conversational interface for exploring employee capability, training needs, certifications, quality findings, and related operational signals.",
        },
      ]}
    />
  );
}
