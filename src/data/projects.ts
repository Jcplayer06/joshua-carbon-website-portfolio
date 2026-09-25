import japaneseCharacterImage from "../assets/projects/real/yolo-japanese-character-prototype.webp";
import competencyIQImage from "../assets/projects/competencyiq.webp";
import qaAutomationImage from "../assets/projects/qa-automation.webp";
import smartParkingImage from "../assets/projects/real/smart-parking-prototype.webp";
import motorPHImage from "../assets/projects/motorph.webp";
import waterDispenserImage from "../assets/projects/real/water-dispenser-ir-demo.webp";
import aiquantaImage from "../assets/projects/aiquanta-real-homepage.webp";
import thermalTherapyImage from "../assets/projects/client/thermal-therapy-control.webp";
import wallpaperApplicatorImage from "../assets/projects/client/wallpaper-applicator.webp";
import iotWaterQualityImage from "../assets/projects/client/iot-water-quality.webp";
import pisoWifiImage from "../assets/projects/client/piso-wifi-schematic.svg";
import portfolioWebsiteIntroImage from "../assets/projects/portfolio-website-system-architecture.webp";

export interface Project {
  id: string;
  number: string;
  category: string;
  title: string;
  description: string;
  image?: string;
  technologies: string[];
  featured?: boolean;
  restricted?: boolean;
  projectType?: string;
  role?: string;
  clientProject?: boolean;
  archiveGroup?: "primary" | "client";

  metrics?: {
    value: string;
    label: string;
  }[];

  github?: string;
  liveUrl?: string;
}

export const projects: Project[] = [

  // ==========================================
  // 01 - AI / COMPUTER VISION
  // ==========================================

  {
    id: "japanese-character",

    number: "02",

    category: "AI / COMPUTER VISION",
    projectType: "ACADEMIC / THESIS PROJECT",

    title: "AI-Based Japanese Character Recognition",

    description:
      "A Raspberry Pi-based computer vision system using a custom-trained YOLOv5 model to recognize Japanese Kanji characters in real time.",

    image: japaneseCharacterImage,

    technologies: [
      "Python",
      "YOLOv5",
      "Roboflow",
      "OpenCV",
      "Google Colab",
      "Raspberry Pi",
      "Tkinter",
    ],

    featured: true,

    metrics: [
      {
        value: "95.33%",
        label: "Accuracy",
      },

      {
        value: "50",
        label: "Kanji Classes",
      },

      {
        value: "150",
        label: "Test Trials",
      },
    ],
  },


  // ==========================================
  // 02 - COMPETENCYIQ AI
  // ==========================================

  {
    id: "competencyiq",

    number: "03",

    category: "AI APPLICATION",
    projectType: "AI APPLICATION / AGENT",
    role: "AI Assistant Development · Prompt Engineering",

    title: "CompetencyIQ AI",

    description:
      "An AI-powered employee competency and quality intelligence assistant for analyzing employee profiles, training history, post-training assessments, technical certifications, certification expiry, training needs, competency assessments, work performance, audit performance, quality findings, operational risk indicators, and compliance status.",

    image: competencyIQImage,

    technologies: [
      "Microsoft Copilot Studio",
      "Power Automate",
      "AI Assistant",
      "Prompt Engineering",
      "Workforce Intelligence",
      "Quality Intelligence",
    ],

    featured: false,
  },


  // ==========================================
  // 03 - QA AUTOMATION
  // ==========================================

  {
    id: "qa-automation",

    number: "04",

    category: "QA AUTOMATION",
    projectType: "SOFTWARE / AUTOMATION PROJECT",

    title: "QA Automation Framework",

    description:
      "A QA automation framework built with Python, Robot Framework, and Selenium, featuring reusable automation components, automated test execution, reporting, and optional OpenAI-powered analysis of test results.",

    image: qaAutomationImage,

    technologies: [
      "Python",
      "Robot Framework",
      "Selenium",
      "SeleniumLibrary",
      "OpenAI API",
      "Git",
    ],

    featured: true,

    github:
      "https://github.com/Jcplayer06/QA-Automation-Framework",
  },


  // ==========================================
  // 04 - SMART PARKING
  // ==========================================

  {
    id: "smart-parking",

    number: "05",

    category: "IoT / EMBEDDED",
    projectType: "ACADEMIC / IoT PROJECT",

    title: "Smart Parking System",

    description:
      "An IoT-based parking monitoring system using sensors and an ESP8266 controller to detect parking occupancy and display real-time slot availability through a Blynk mobile application.",

    image: smartParkingImage,

    technologies: [
      "ESP8266",
      "Arduino",
      "IR Sensors",
      "Blynk",
      "IoT",
      "C++",
    ],

    featured: true,
  },


  // ==========================================
  // 05 - MOTORPH
  // ==========================================

  {
    id: "motorph",

    number: "06",

    category: "SOFTWARE DEVELOPMENT",
    projectType: "ACADEMIC / SOFTWARE PROJECT",

    title: "MotorPH Payroll Management System",

    description:
      "A desktop payroll management system designed to manage employee records, attendance, payroll computation, leave management, deductions, and reporting.",

    image: motorPHImage,

    technologies: [
      "C#",
      "SQL",
      "Object-Oriented Programming",
      "Visual Studio",
      "Windows Forms",
    ],

    featured: false,
  },


  // ==========================================
  // 06 - WATER DISPENSER
  // ==========================================

  {
    id: "water-dispenser",

    number: "07",

    category: "EMBEDDED SYSTEMS / IoT",
    projectType: "ACADEMIC / EMBEDDED PROJECT",

    title: "Non-Contact Smart Water Dispenser",

    description:
      "An automated water dispenser using IR hand detection, an ATmega328P controller, ultrasonic water-level sensing, a pump, status displays, and custom PCB work.",

    image: waterDispenserImage,

    technologies: [
      "ATmega328P",
      "C / C++",
      "IR Sensor",
      "Ultrasonic Sensor",
      "PCB Design",
      "Water Pump",
      "LCD Display (I2C)",
      "MOSFET",
    ],

    featured: false,
  },


  // ==========================================
  // 07 - AIQUANTA
  // ==========================================

  {
    id: "aiquanta",

    number: "01",

    category: "FULL-STACK / AI / WEB",
    projectType: "FREELANCE / CLIENT PROJECT",
    role: "Client Web Platform · Integration · Deployment",
    clientProject: true,

    title: "AIQUANTA Training Consultancy Services",

    description:
      "A paid client project that evolved from a public consulting website into a secure intake and small operations platform with API, database, hybrid AI assessment, reporting, email, SEO, and security layers.",

    image: aiquantaImage,

    technologies: [
      "React",
      "TypeScript",
      "Vite",
      "Cloudflare Worker",
      "D1",
      "Workers AI",
      "Microsoft Graph",
      "Analytics / Reporting",
      "Technical SEO",
      "Turnstile",
      "Authentication / 2FA",
      "Git / GitHub",
    ],

    liveUrl: "https://aiquantaph.com/",
    featured: true,
  },

  // ==========================================
  // 08 - PORTFOLIO WEBSITE
  // ==========================================

  {
    id: "portfolio-website",

    number: "08",

    category: "WEB DEVELOPMENT",
    projectType: "PERSONAL SOFTWARE PROJECT",

    title: "Personal Portfolio Website",

    description:
      "A React, TypeScript, and Vite portfolio built as an engineering interface with routed project briefs, role-tailored resumes, a live PCB-style Skills system, a project lab, responsive layouts, and custom visual systems across About and Contact.",

    image: portfolioWebsiteIntroImage,

    technologies: [
      "React",
      "TypeScript",
      "Vite",
      "React Router",
      "Canvas",
      "CSS Animations",
      "Responsive Design",
      "CSS",
    ],

    featured: false,

    github:
      "https://github.com/Jcplayer06/joshua-carbon-website-portfolio",

  },

  // ==========================================
  // F01 - THERMAL THERAPY DEVICE
  // ==========================================

  {
    id: "thermal-therapy-device",
    number: "F01",
    category: "HARDWARE / THERMAL",
    projectType: "FREELANCE / CLIENT PROJECT",
    role: "Prototype Fabrication · Thermal Control · Testing",
    clientProject: true,
    archiveGroup: "client",
    title: "Dual-Temperature Thermal Therapy Device",
    description:
      "A client engineering project involving the fabrication and testing of a dual-temperature thermal therapy prototype using Peltier-based temperature control for hot and cold operation.",
    image: thermalTherapyImage,
    technologies: [
      "Arduino Uno",
      "Peltier Module",
      "Thermistor Feedback",
      "PID Temperature Control",
      "Prototype Fabrication",
    ],
  },

  // ==========================================
  // F02 - WALLPAPER APPLICATOR
  // ==========================================

  {
    id: "wallpaper-applicator",
    number: "F02",
    category: "PRODUCT DESIGN / AUTOMATION",
    projectType: "FREELANCE / CLIENT PROJECT",
    role: "Design Contribution · Arduino Automation · Documentation",
    clientProject: true,
    archiveGroup: "client",
    title: "Automated Wallpaper Applicator",
    description:
      "A client product-design project combining a wallpaper application mechanism with an Arduino-based cutting automation concept, virtual prototyping, design revisions, and physical prototype development.",
    image: wallpaperApplicatorImage,
    technologies: [
      "Arduino Uno",
      "A4988 Motor Driver",
      "NEMA 17 Stepper Motor",
      "Pushbutton",
      "Fusion 360",
      "Prototype Development",
    ],
  },

  // ==========================================
  // F03 - IOT WATER QUALITY
  // ==========================================

  {
    id: "iot-water-quality",
    number: "F03",
    category: "IoT / EMBEDDED / TROUBLESHOOTING",
    projectType: "FREELANCE / CLIENT PROJECT",
    role: "Documentation · Data Support · Prototype Repair",
    clientProject: true,
    archiveGroup: "client",
    title: "IoT Water Quality Monitoring System",
    description:
      "A client IoT project involving completion of technical documentation and project data support for an existing prototype, plus troubleshooting and repair when the system failed during demonstration.",
    image: iotWaterQualityImage,
    technologies: [
      "ESP8266",
      "ATmega328P",
      "pH Sensor",
      "Turbidity Sensor",
      "Temperature Sensor",
      "PCB Design",
      "Wi-Fi / TCP-IP",
      "Mobile Monitoring",
      "LED Alerts",
    ],
  },

  // ==========================================
  // F04 - PISO WIFI
  // ==========================================

  {
    id: "piso-wifi",
    number: "F04",
    category: "NETWORKING / IT",
    projectType: "FREELANCE / CLIENT PROJECT",
    role: "Hardware Setup · Network Configuration · Deployment",
    clientProject: true,
    archiveGroup: "client",
    title: "Piso WiFi Network Setup",
    description:
      "A client networking deployment where physical hardware and connections were set up and configured through TP-Link equipment and the Omada Web Controller, including portal, voucher, and payment workflow configuration.",
    image: pisoWifiImage,
    technologies: [
      "TP-Link",
      "Omada Web Controller",
      "Wi-Fi",
      "Captive Portal",
      "Voucher Access",
      "Piso WiFi",
      "GCash",
    ],
  },

];