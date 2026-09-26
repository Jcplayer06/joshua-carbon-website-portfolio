import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE_URL = "https://joshua-carbon-portfolio.netlify.app";
const DEFAULT_IMAGE = `${SITE_URL}/favicon.svg`;

type PageMeta = {
  title: string;
  description: string;
};

const META: Record<string, PageMeta> = {
  "/": {
    title: "Joshua Carbon | Computer Engineer — Software, QA Automation & AI",
    description:
      "Joshua Carbon's project portfolio featuring software, QA automation, AI/computer vision, web development, and embedded IoT engineering projects.",
  },
  "/projects": {
    title: "Projects | Joshua Carbon — Computer Engineer",
    description:
      "Selected software, QA automation, AI/computer vision, web, and embedded engineering projects by Joshua Carbon.",
  },
  "/resume": {
    title: "Resume | Joshua Carbon — Computer Engineer",
    description:
      "Resume, technical skills, experience, education, and projects of Joshua Carbon, Computer Engineer.",
  },
  "/projects/qa-automation": {
    title: "QA Automation Framework | Joshua Carbon",
    description:
      "Python, Robot Framework, Selenium, and SeleniumLibrary test automation project by Joshua Carbon.",
  },
  "/projects/competencyiq": {
    title: "CompetencyIQ AI | Joshua Carbon",
    description:
      "AI assistant built with Microsoft Copilot Studio and Power Automate for workforce competency and quality intelligence.",
  },
  "/projects/japanese-character": {
    title: "Japanese Character Recognition | Joshua Carbon",
    description:
      "YOLOv5 computer vision and OCR project for Japanese character recognition using Python, OpenCV, Roboflow, and Raspberry Pi.",
  },
  "/projects/smart-parking": {
    title: "Smart Parking System | Joshua Carbon",
    description:
      "ESP8266-based smart parking prototype using IR sensors, Wi-Fi, Arduino, and Blynk.",
  },
  "/projects/motorph": {
    title: "MotorPH Payroll Management System | Joshua Carbon",
    description:
      "C# payroll management system project featuring employee records, attendance, payroll processing, and reporting workflows.",
  },
  "/projects/water-dispenser": {
    title: "Non-Contact Smart Water Dispenser | Joshua Carbon",
    description:
      "Embedded smart water dispenser prototype using an ATmega328P, IR sensing, water-level sensing, pump control, LCD, and custom PCB hardware.",
  },
  "/projects/aiquanta": {
    title: "AIQUANTA Training Consultancy Services | Joshua Carbon",
    description:
      "Production client website and operations platform for AIQUANTA Training Consultancy Services.",
  },
  "/projects/portfolio-website": {
    title: "Portfolio Website | Joshua Carbon",
    description:
      "React, TypeScript, Vite, CSS, responsive design, Canvas, Git, and Netlify engineering portfolio.",
  },
  "/projects/client/thermal-therapy-device": {
    title: "Thermal Therapy Device | Joshua Carbon",
    description:
      "Client engineering project by Joshua Carbon.",
  },
  "/projects/client/wallpaper-applicator": {
    title: "Automated Wallpaper Applicator | Joshua Carbon",
    description:
      "Client engineering project by Joshua Carbon.",
  },
  "/projects/client/iot-water-quality": {
    title: "IoT Water Quality Monitoring | Joshua Carbon",
    description:
      "Client engineering project by Joshua Carbon.",
  },
  "/projects/client/piso-wifi": {
    title: "Piso WiFi Setup | Joshua Carbon",
    description:
      "Client engineering project by Joshua Carbon.",
  },
};

const CANONICAL_PATHS: Record<string, string> = {
  "/projects/thermal-therapy-device":
    "/projects/client/thermal-therapy-device",
  "/projects/wallpaper-applicator":
    "/projects/client/wallpaper-applicator",
  "/projects/iot-water-quality":
    "/projects/client/iot-water-quality",
  "/projects/piso-wifi":
    "/projects/client/piso-wifi",
};

function clientMeta(pathname: string): PageMeta {
  const id = pathname.slice("/projects/client/".length);

  const label = id
    .split("-")
    .filter(Boolean)
    .map(
      (part) =>
        part.charAt(0).toUpperCase() + part.slice(1)
    )
    .join(" ");

  return {
    title: `${label} | Joshua Carbon`,
    description:
      `Client engineering project: ${label}, presented in the Joshua Carbon portfolio.`,
  };
}

function getMeta(pathname: string): PageMeta {
  if (META[pathname]) return META[pathname];

  if (pathname.startsWith("/projects/client/")) {
    return clientMeta(pathname);
  }

  return {
    title: "Joshua Carbon | Computer Engineer",
    description:
      "Portfolio of Joshua Carbon featuring software development, QA automation, AI/computer vision, web, and embedded engineering projects.",
  };
}

function setMeta(
  attribute: "name" | "property",
  key: string,
  content: string,
) {
  let node = document.head.querySelector<HTMLMetaElement>(
    `meta[${attribute}="${key}"]`,
  );

  if (!node) {
    node = document.createElement("meta");
    node.setAttribute(attribute, key);
    document.head.appendChild(node);
  }

  node.content = content;
}

function setCanonical(url: string) {
  let node =
    document.head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );

  if (!node) {
    node = document.createElement("link");
    node.rel = "canonical";
    document.head.appendChild(node);
  }

  node.href = url;
}

function setJsonLd(data: unknown) {
  const existing = document.head.querySelector(
    'script[data-seo-jsonld="portfolio"]',
  );

  existing?.remove();

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.dataset.seoJsonld = "portfolio";
  script.textContent = JSON.stringify(data);

  document.head.appendChild(script);
}

export default function SEO() {
  const { pathname } = useLocation();

  useEffect(() => {
    const normalizedPath =
      pathname.replace(/\/+$/, "") || "/";

    const canonicalPath =
      CANONICAL_PATHS[normalizedPath] ?? normalizedPath;

    const canonicalUrl =
      `${SITE_URL}${canonicalPath}`;

    const meta = getMeta(canonicalPath);

    document.title = meta.title;

    setMeta(
      "name",
      "description",
      meta.description,
    );

    setMeta(
      "name",
      "author",
      "Joshua Carbon",
    );

    setMeta(
      "name",
      "robots",
      "index,follow,max-image-preview:large",
    );

    setMeta(
      "name",
      "theme-color",
      "#020a11",
    );

    // Search-intent phrases related to the actual portfolio.
    setMeta(
      "name",
      "keywords",
      "Joshua Carbon Project Portfolio, Joshua Carbon Mapua Project Portfolio, Joshua Carbon Project Website Portfolio, Joshua Carbon Mapúa University projects, Joshua Carbon Computer Engineering projects, Joshua Carbon software engineering projects, Joshua Carbon QA automation projects, Joshua Carbon AI computer vision projects",
    );

    setMeta(
      "property",
      "og:type",
      "website",
    );

    setMeta(
      "property",
      "og:site_name",
      "Joshua Carbon | Computer Engineer",
    );

    setMeta(
      "property",
      "og:title",
      meta.title,
    );

    setMeta(
      "property",
      "og:description",
      meta.description,
    );

    setMeta(
      "property",
      "og:url",
      canonicalUrl,
    );

    setMeta(
      "property",
      "og:image",
      DEFAULT_IMAGE,
    );

    setMeta(
      "property",
      "og:image:alt",
      "Joshua Carbon portfolio",
    );

    setMeta(
      "name",
      "twitter:card",
      "summary",
    );

    setMeta(
      "name",
      "twitter:title",
      meta.title,
    );

    setMeta(
      "name",
      "twitter:description",
      meta.description,
    );

    setMeta(
      "name",
      "twitter:image",
      DEFAULT_IMAGE,
    );

    setCanonical(canonicalUrl);

    setJsonLd({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          name: "Joshua Carbon | Computer Engineer",
          alternateName: [
            "Joshua Carbon Project Portfolio",
            "Joshua Carbon Mapua Project Portfolio",
            "Joshua Carbon Project Website Portfolio",
          ],
          url: SITE_URL,
          inLanguage: "en",
        },
        {
          "@type": "Person",
          name: "Joshua Carbon",
          jobTitle: "Computer Engineer",
          url: SITE_URL,
        },
        {
          "@type": "WebPage",
          name: meta.title,
          description: meta.description,
          url: canonicalUrl,
          inLanguage: "en",
          isPartOf: {
            "@type": "WebSite",
            url: SITE_URL,
          },
        },
      ],
    });
  }, [pathname]);

  return null;
}
