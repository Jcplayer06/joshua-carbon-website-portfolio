import portfolioIntroImage from "../assets/projects/portfolio-website-system-architecture.webp";
import portfolioIntroMobile from "../assets/projects/generated/portfolio-website-mobile.svg";

export default function PortfolioSystemThumbnail({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`portfolio-system-thumbnail${compact ? " is-compact" : ""}`} aria-label="Personal Portfolio Website system architecture infographic">
      <picture>
        <source media="(max-width: 700px)" srcSet={portfolioIntroMobile} />
        <img
          src={portfolioIntroImage}
          alt="Personal Portfolio Website system architecture and verified technology stack"
          loading="lazy"
          decoding="async"
          fetchPriority="low"
        />
      </picture>
    </div>
  );
}
