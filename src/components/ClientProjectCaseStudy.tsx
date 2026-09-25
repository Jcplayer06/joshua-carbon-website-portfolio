import { Navigate, useLocation, useParams } from "react-router-dom";
import CompactCaseStudy from "./CompactCaseStudy";
import { projects } from "../data/projects";
import thermalSystemVisual from "../assets/projects/generated/thermal-therapy-device-project-visual.svg";
import thermalSystemVisualMobile from "../assets/projects/generated/thermal-therapy-device-mobile.svg";
import wallpaperSystemVisual from "../assets/projects/generated/wallpaper-applicator-project-visual.svg";
import wallpaperSystemVisualMobile from "../assets/projects/generated/wallpaper-applicator-mobile.svg";
import waterQualitySystemVisual from "../assets/projects/generated/iot-water-quality-project-visual.svg";
import waterQualitySystemVisualMobile from "../assets/projects/generated/iot-water-quality-mobile.svg";
import pisoSystemVisual from "../assets/projects/generated/piso-wifi-project-visual.svg";
import pisoSystemVisualMobile from "../assets/projects/generated/piso-wifi-mobile.svg";

const briefs = {
  "thermal-therapy-device": {
    problem: "A client needed a compact prototype for controlled hot and cold thermal treatment.",
    understanding: "The work centered on the Peltier-based thermal approach, physical construction, and practical hot/cold operation.",
    solution: "Fabricated the prototype and supported the thermal-control implementation and testing for dual-temperature operation.",
    role: "Prototype fabrication · thermal control · testing",
    build: "Peltier-based thermal module → temperature-control electronics → physical treatment surface.",
    integration: "Thermal hardware + control electronics + fabricated enclosure",
    flow: ["Thermal input", "Peltier module", "Temperature control", "Thermal surface"],
  },
  "wallpaper-applicator": {
    problem: "The client project aimed to make wallpaper application easier while incorporating a more convenient cutting process.",
    understanding: "The design moved through virtual prototyping and revisions before physical prototype development, with attention to usability and manufacturability.",
    solution: "Contributed to the product design, developed the Arduino-based automation concept for the cutting mechanism, and supported prototype documentation.",
    role: "Design contribution · Arduino automation · documentation",
    build: "Arduino Uno → motor driver → stepper motor → automated cutting mechanism within the mechanical applicator.",
    integration: "Mechanical design + Arduino control + motorized cutting",
    flow: ["User input", "Arduino Uno", "Motor driver", "Stepper motor", "Cutting mechanism"],
  },
  "iot-water-quality": {
    problem: "An existing IoT water-quality prototype needed completed documentation and supporting project data, and the hardware required troubleshooting when it failed during demonstration.",
    understanding: "The existing system combined pH, turbidity, and temperature sensing with an ATmega328P/ESP8266 design and mobile monitoring.",
    solution: "Completed and organized the technical documentation and supporting data, then troubleshot and repaired the prototype for demonstration.",
    role: "Documentation · data support · prototype repair",
    build: "pH + turbidity + temperature sensors → ATmega328P / ESP8266 → wireless data path → mobile monitoring.",
    integration: "Sensors + microcontrollers + Wi-Fi + monitoring",
    flow: ["Water sensors", "ATmega328P / ESP8266", "Wi-Fi", "Mobile monitoring"],
  },
  "piso-wifi": {
    problem: "A client needed a working Piso WiFi deployment with physical networking, managed access, and a practical payment workflow.",
    understanding: "The setup required physical connection of the network hardware and internet source, TP-Link wireless configuration through the Omada Web Controller, and portal/voucher preparation.",
    solution: "Set up the physical network, configured the TP-Link/Omada environment, created portal and voucher access, and integrated the client's payment workflow.",
    role: "Hardware setup · network configuration · deployment",
    build: "Internet source → TP-Link network hardware → Omada Web Controller → portal / voucher access → client payment workflow.",
    integration: "Physical network + Omada management + access + payment",
    flow: ["PLDT internet", "TP-Link hardware", "Omada Controller", "Portal / vouchers", "Payment workflow"],
  },
} as const;

type BriefKey = keyof typeof briefs;

const visualByProject: Record<BriefKey, { src: string; mobileSrc: string; alt: string }> = {
  "thermal-therapy-device": { src: thermalSystemVisual, mobileSrc: thermalSystemVisualMobile, alt: "Thermal therapy device flow from mode selection through Arduino Uno, temperature control, Peltier module, and thermal output" },
  "wallpaper-applicator": { src: wallpaperSystemVisual, mobileSrc: wallpaperSystemVisualMobile, alt: "Automated wallpaper applicator flow from pushbutton through Arduino Uno, A4988 driver, NEMA 17 motor, and cutting mechanism" },
  "iot-water-quality": { src: waterQualitySystemVisual, mobileSrc: waterQualitySystemVisualMobile, alt: "IoT water quality flow from pH, turbidity, and temperature sensors through ATmega328P and ESP8266 to mobile monitoring" },
  "piso-wifi": { src: pisoSystemVisual, mobileSrc: pisoSystemVisualMobile, alt: "Piso WiFi deployment flow from PLDT internet through TP-Link hardware and Omada Web Controller to portal, vouchers, and payment workflow" },
};

export default function ClientProjectCaseStudy() {
  const location = useLocation();
  const params = useParams<{ projectId?: string }>();
  const projectId = params.projectId ?? location.pathname.split("/").filter(Boolean).pop();
  const project = projects.find((item) => item.id === projectId && item.clientProject);
  const brief = projectId && projectId in briefs ? briefs[projectId as BriefKey] : undefined;

  if (!project || !brief) return <Navigate to="/projects" replace />;

  return (
    <CompactCaseStudy
      className="client-brief-compact-case"
      eyebrow={`${project.number} / ${project.category} / CLIENT PROJECT`}
      title={project.title}
      intro={project.description}
      image={project.image}
      imageAlt={`${project.title} client project visual`}
      imageCaption="Client project visual — detailed client material is not published."
      technicalVisual={visualByProject[projectId as BriefKey].src}
      technicalVisualMobile={visualByProject[projectId as BriefKey].mobileSrc}
      technicalVisualAlt={visualByProject[projectId as BriefKey].alt}
      technicalVisualCaption="Project visual — public brief only; detailed client material is not published."
      footerNote="CLIENT PROJECT · Public information intentionally limited."
      sections={[
        {
          label: "01 / PROBLEM",
          title: "What needed to be addressed.",
          body: brief.problem,
        },
        {
          label: "02 / UNDERSTANDING",
          title: "How the work was approached.",
          body: brief.understanding,
        },
        {
          label: "03 / SOLUTION",
          title: "What was delivered.",
          body: brief.solution,
        },
      ]}
    />
  );
}
