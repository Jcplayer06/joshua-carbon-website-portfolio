export default function ProjectSystemVisual({
  src,
  mobileSrc,
  alt,
  caption = "Project visual — system build and verified technical stack",
}: {
  src: string;
  mobileSrc?: string;
  alt: string;
  caption?: string;
}) {
  return (
    <figure className="project-system-visual">
      <picture>
        {mobileSrc && <source media="(max-width: 700px)" srcSet={mobileSrc} />}
        <img src={src} alt={alt} loading="lazy" decoding="async" fetchPriority="low" />
      </picture>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
