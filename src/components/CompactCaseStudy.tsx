import type { ReactNode } from "react";
import CaseStudyBack from "./CaseStudyBack";
import ProjectSystemVisual from "./ProjectSystemVisual";

type CompactCaseStudyProps = {
  eyebrow: string;
  title: ReactNode;
  intro: string;
  image?: string;
  showHeroImage?: boolean;
  imageAlt?: string;
  imageCaption?: string;
  technicalVisual?: string;
  technicalVisualMobile?: string;
  technicalVisualAlt?: string;
  technicalVisualCaption?: string;
  sections: {
    label: string;
    title: string;
    body: string;
  }[];
  metrics?: { value: string; label: string }[];
  links?: ReactNode;
  className?: string;
  footerNote?: ReactNode;
};

export default function CompactCaseStudy({
  eyebrow,
  title,
  intro,
  image,
  showHeroImage = true,
  imageAlt,
  imageCaption = "Project visual",
  technicalVisual,
  technicalVisualMobile,
  technicalVisualAlt = "Project system overview",
  technicalVisualCaption = "Generated technical system overview",
  sections,
  metrics,
  links,
  className = "",
  footerNote = "Technical details are kept focused on the system, tools, and implementation.",
}: CompactCaseStudyProps) {
  return (
    <main className={`compact-case-study ${className}`.trim()}>
      <CaseStudyBack />

      <header className="compact-case-header">
        <p className="section-label">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="compact-case-intro">{intro}</p>
        {links && <div className="compact-case-actions">{links}</div>}
      </header>

      {image && showHeroImage && (
        <figure className="compact-case-visual">
          <img src={image} alt={imageAlt ?? "Project visual"} loading="eager" decoding="async" />
          <figcaption>{imageCaption}</figcaption>
        </figure>
      )}

      {technicalVisual && (
        <ProjectSystemVisual
          src={technicalVisual}
          mobileSrc={technicalVisualMobile}
          alt={technicalVisualAlt}
          caption={technicalVisualCaption}
        />
      )}

      {metrics && metrics.length > 0 && (
        <section className="compact-case-metrics" aria-label="Project metrics">
          {metrics.map((metric) => (
            <div key={`${metric.value}-${metric.label}`}>
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </div>
          ))}
        </section>
      )}

      <section className="compact-case-sections" aria-label="Project summary">
        {sections.map((section) => (
          <article key={section.label}>
            <p className="section-label">{section.label}</p>
            <h2>{section.title}</h2>
            <p>{section.body}</p>
          </article>
        ))}
      </section>

      <footer className="compact-case-footer">
        <span>PROJECT BRIEF</span>
        <strong>{footerNote}</strong>
      </footer>
    </main>
  );
}
