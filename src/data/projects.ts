import japaneseCharacterImage from "../assets/projects/japanese-character.png";
import competencyIQImage from "../assets/projects/competencyiq.png";
import qaAutomationImage from "../assets/projects/qa-automation.png";
import smartParkingImage from "../assets/projects/smart-parking.png";
import motorPHImage from "../assets/projects/motorph.png";
import waterDispenserImage from "../assets/projects/water-dispenser.png";

export interface Project {
  id: string;
  number: string;
  category: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  featured?: boolean;

  metrics?: {
    value: string;
    label: string;
  }[];

  github?: string;
}

export const projects: Project[] = [

  // ==========================================
  // 01 - AI / COMPUTER VISION
  // ==========================================

  {
    id: "japanese-character",

    number: "01",

    category: "AI / COMPUTER VISION",

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

    number: "02",

    category: "AI APPLICATION",

    title: "CompetencyIQ AI",

    description:
      "An AI-powered workforce intelligence assistant designed to analyze employee competency, training, certifications, compliance, quality findings, and operational risk.",

    image: competencyIQImage,

    technologies: [
      "Microsoft Copilot Studio",
      "AI",
      "Prompt Engineering",
      "Power Automate",
    ],

    featured: true,
  },


  // ==========================================
  // 03 - QA AUTOMATION
  // ==========================================

  {
    id: "qa-automation",

    number: "03",

    category: "QA AUTOMATION",

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

    number: "04",

    category: "IoT / EMBEDDED",

    title: "Smart Parking System",

    description:
      "An IoT-based parking monitoring system using sensors and an ESP8266 controller to detect parking occupancy and display real-time slot availability through a Blynk mobile application.",

    image: smartParkingImage,

    technologies: [
      "ESP8266",
      "Arduino",
      "Ultrasonic Sensors",
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

    number: "05",

    category: "SOFTWARE DEVELOPMENT",

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

    number: "06",

    category: "EMBEDDED SYSTEMS / IoT",

    title: "Non-Contact Smart Water Dispenser",

    description:
      "An automated water dispenser using infrared sensing for contactless operation, a custom PCB, user authentication, and IoT monitoring through the Blynk platform.",

    image: waterDispenserImage,

    technologies: [
      "Arduino",
      "C",
      "IR Sensor",
      "Ultrasonic Sensor",
      "PCB Design",
      "Blynk",
      "IoT",
    ],

    featured: false,
  },
];