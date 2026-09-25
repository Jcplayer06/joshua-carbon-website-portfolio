import CompactCaseStudy from "./CompactCaseStudy";
import qaAutomationImage from "../assets/projects/qa-automation.webp";
import qaSystemVisual from "../assets/projects/generated/qa-automation-project-visual.svg";
import qaSystemVisualMobile from "../assets/projects/generated/qa-automation-mobile.svg";

export default function QAAutomationCaseStudy() {
  return (
    <CompactCaseStudy
      className="qa-compact-case"
      eyebrow="PROJECT 04 / QA AUTOMATION / SDET"
      title={<>QA Automation<br />Framework</>}
      intro="A structured web UI automation framework built with Python, Robot Framework, Selenium, and SeleniumLibrary, with reusable keywords, test execution, reporting, and optional AI-assisted result analysis."
      image={qaAutomationImage}
      imageAlt="QA automation framework test execution interface"
      imageCaption="Automation framework / test execution visual"
      technicalVisual={qaSystemVisual}
      technicalVisualMobile={qaSystemVisualMobile}
      technicalVisualAlt="QA automation framework flow from Robot Framework test cases through reusable keywords and Selenium to web verification and reports"
      technicalVisualCaption="Project visual — system build and verified technical stack"
      sections={[
        {
          label: "01 / PROBLEM",
          title: "Manual web checks are repetitive and easy to miss.",
          body: "The project focused on creating a structured way to automate repeatable browser checks for key application workflows.",
        },
        {
          label: "02 / APPROACH",
          title: "Separate test cases from reusable actions.",
          body: "Robot Framework test files use reusable keywords and shared resources to keep automation organized, readable, and easier to maintain.",
        },
        {
          label: "03 / SOLUTION",
          title: "Execute, verify, and report browser tests.",
          body: "Selenium drives the web interface while Robot Framework records results and produces reports; an optional OpenAI integration can assist with test-result analysis.",
        },
      ]}
    />
  );
}
