import CompactCaseStudy from "./CompactCaseStudy";
import smartParkingImage from "../assets/projects/real/smart-parking-prototype.webp";
import smartParkingSystemVisual from "../assets/projects/generated/smart-parking-project-visual.svg";
import smartParkingSystemVisualMobile from "../assets/projects/generated/smart-parking-mobile.svg";

export default function SmartParkingCaseStudy() {
  return (
    <CompactCaseStudy
      className="parking-compact-case"
      eyebrow="PROJECT 05 / IoT / EMBEDDED SYSTEMS"
      title={<>Smart Parking<br />System</>}
      intro="An IoT-based parking monitoring system using IR sensors and an ESP8266 to detect slot occupancy and present availability through Blynk."
      image={smartParkingImage}
      imageAlt="Smart parking system prototype"
      imageCaption="Actual project prototype / demonstration photo"
      technicalVisual={smartParkingSystemVisual}
      technicalVisualMobile={smartParkingSystemVisualMobile}
      technicalVisualAlt="Smart parking flow from IR sensors through ESP8266 and Wi-Fi to Blynk slot status"
      technicalVisualCaption="Project visual — system build and verified technical stack"
      sections={[
        {
          label: "01 / PROBLEM",
          title: "Identify parking availability at a glance.",
          body: "The system was designed to detect whether individual parking spaces were occupied and make that information easier to view remotely.",
        },
        {
          label: "02 / HARDWARE",
          title: "Connect each slot to the controller.",
          body: "IR sensors provide the occupancy inputs, while the ESP8266 acts as the controller and network link. A local LCD provides a direct system-status view.",
        },
        {
          label: "03 / SOLUTION",
          title: "Publish live slot status to Blynk.",
          body: "The controller maps sensor states to parking slots and sends the current availability to a Blynk mobile interface for real-time monitoring.",
        },
      ]}
    />
  );
}
