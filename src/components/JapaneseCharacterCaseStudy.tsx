import CompactCaseStudy from "./CompactCaseStudy";
import japaneseCharacterImage from "../assets/projects/real/yolo-japanese-character-prototype.webp";
import japaneseSystemVisual from "../assets/projects/generated/japanese-character-project-visual.svg";
import japaneseSystemVisualMobile from "../assets/projects/generated/japanese-character-mobile.svg";

export default function JapaneseCharacterCaseStudy() {
  return (
    <CompactCaseStudy
      className="yolo-compact-case"
      eyebrow="PROJECT 02 / AI / COMPUTER VISION"
      title={<>AI-Based Japanese<br />Character Recognition</>}
      intro="A Raspberry Pi-based computer vision system using a custom-trained YOLOv5 model to detect and recognize Japanese Kanji characters from calligraphic works."
      image={japaneseCharacterImage}
      imageAlt="Japanese character recognition project prototype"
      imageCaption="Actual project prototype / demonstration photo"
      technicalVisual={japaneseSystemVisual}
      technicalVisualMobile={japaneseSystemVisualMobile}
      technicalVisualAlt="Japanese character recognition system flow from webcam image through Raspberry Pi 4 and YOLOv5 to character output"
      technicalVisualCaption="Project visual — system build and verified technical stack"
      metrics={[
        { value: "95.33%", label: "Accuracy" },
        { value: "50", label: "Kanji classes" },
        { value: "150", label: "Test trials" },
      ]}
      sections={[
        {
          label: "01 / PROBLEM",
          title: "Recognizing Japanese calligraphy reliably.",
          body: "The project addressed the difficulty of identifying Japanese characters in written and calligraphic work, where visual variation can make recognition harder.",
        },
        {
          label: "02 / APPROACH",
          title: "Train a custom object-detection model.",
          body: "A 50-class Kanji dataset was prepared with bounding-box annotation and image augmentation in Roboflow, then used for YOLOv5 training and evaluation.",
        },
        {
          label: "03 / RESULT",
          title: "Run recognition on an embedded prototype.",
          body: "The trained model was integrated into a Raspberry Pi-based prototype for live character input and recognition, reporting 95.33% accuracy across 150 trials.",
        },
      ]}
    />
  );
}
