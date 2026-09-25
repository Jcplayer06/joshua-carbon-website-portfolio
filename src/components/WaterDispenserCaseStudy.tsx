import CompactCaseStudy from "./CompactCaseStudy";
import waterDispenserImage from "../assets/projects/real/water-dispenser-ir-demo.webp";
import waterDispenserSystemVisual from "../assets/projects/generated/water-dispenser-project-visual.svg";
import waterDispenserSystemVisualMobile from "../assets/projects/generated/water-dispenser-mobile.svg";

export default function WaterDispenserCaseStudy() {
  return (
    <CompactCaseStudy
      className="water-compact-case"
      eyebrow="PROJECT 07 / EMBEDDED SYSTEMS / IoT"
      title={<>Non-Contact Smart<br />Water Dispenser</>}
      intro="An automated water dispenser using IR hand detection, an ATmega328P controller, a pump, water-level sensing, and custom PCB work."
      image={waterDispenserImage}
      imageAlt="Non-contact smart water dispenser demonstration"
      imageCaption="Actual project prototype / IR sensor demonstration"
      technicalVisual={waterDispenserSystemVisual}
      technicalVisualMobile={waterDispenserSystemVisualMobile}
      technicalVisualAlt="Non-contact water dispenser flow from IR and ultrasonic sensing through ATmega328P to pump and display outputs"
      technicalVisualCaption="Project visual — system build and verified technical stack"
      sections={[
        {
          label: "01 / PROBLEM",
          title: "Dispense water without physical contact.",
          body: "The project focused on hands-free dispensing while providing direct device feedback and water-level indication.",
        },
        {
          label: "02 / HARDWARE",
          title: "Integrate sensing, control, and output.",
          body: "IR-based hand detection provides the trigger, the ATmega328P coordinates the device logic and pump, and an ultrasonic sensor measures the water level. A custom PCB ties the hardware together.",
        },
        {
          label: "03 / SOLUTION",
          title: "A contactless embedded dispensing system.",
          body: "The completed prototype combines sensing, pump control, and local status feedback in one embedded system.",
        },
      ]}
    />
  );
}
