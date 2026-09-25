import CompactCaseStudy from "./CompactCaseStudy";
import motorPHImage from "../assets/projects/motorph.webp";
import motorPHSystemVisual from "../assets/projects/generated/motorph-project-visual.svg";
import motorPHSystemVisualMobile from "../assets/projects/generated/motorph-mobile.svg";

export default function MotorPHCaseStudy() {
  return (
    <CompactCaseStudy
      className="motorph-compact-case"
      eyebrow="PROJECT 06 / SOFTWARE DEVELOPMENT"
      title={<>MotorPH Payroll<br />Management System</>}
      intro="A desktop payroll management application for employee records, attendance, payroll computation, leave management, and reporting."
      image={motorPHImage}
      imageAlt="MotorPH payroll management system"
      imageCaption="Payroll application interface"
      technicalVisual={motorPHSystemVisual}
      technicalVisualMobile={motorPHSystemVisualMobile}
      technicalVisualAlt="MotorPH payroll system flow from employee inputs through C sharp Windows Forms payroll logic and data to reports"
      technicalVisualCaption="Project visual — system build and verified technical stack"
      sections={[
        {
          label: "01 / PROBLEM",
          title: "Bring recurring payroll tasks into one application.",
          body: "The project focused on organizing employee records, attendance, payroll, leave, deductions, and reporting within a single desktop workflow.",
        },
        {
          label: "02 / APPROACH",
          title: "Model payroll operations as software workflows.",
          body: "C# and Windows Forms were used to create the application interface and organize the underlying employee and payroll processes around reusable operations.",
        },
        {
          label: "03 / SOLUTION",
          title: "A structured desktop payroll workflow.",
          body: "The resulting system brings core payroll tasks into a single application with dedicated screens for records, attendance, payroll, leave, and reporting.",
        },
      ]}
    />
  );
}
