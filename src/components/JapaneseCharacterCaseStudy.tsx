import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import japaneseCharacterImage from "../assets/projects/japanese-character.png";

export default function JapaneseCharacterCaseStudy() {
  const [isImageOpen, setIsImageOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsImageOpen(false);
      }
    };

    if (isImageOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isImageOpen]);

  return (
    <main className="japanese-case-study">

      {/* =================================================
          BACK TO PROJECTS
      ================================================= */}


      {/* =================================================
          HERO
      ================================================= */}

      <section className="japanese-header">

        <p className="section-label">
          PROJECT 01 / AI / COMPUTER VISION
        </p>

        <h1>
          AI-Based Japanese
          <br />
          Character Recognition
        </h1>

        <p className="japanese-intro">
          A Raspberry Pi-based AI system designed to
          detect and recognize Japanese Kanji characters
          from calligraphic works using a custom-trained
          YOLOv5 object detection model.
        </p>

      </section>


      {/* =================================================
          PROJECT OVERVIEW
      ================================================= */}

      <section className="japanese-overview">

        <div>
          <span>PROJECT TYPE</span>

          <strong>
            AI / Computer Vision
          </strong>
        </div>

        <div>
          <span>MODEL</span>

          <strong>
            YOLOv5
          </strong>
        </div>

        <div>
          <span>DATASET</span>

          <strong>
            50 Kanji Classes
          </strong>
        </div>

        <div>
          <span>DEPLOYMENT</span>

          <strong>
            Raspberry Pi 4
          </strong>
        </div>

      </section>


      {/* =================================================
          RESULTS
      ================================================= */}

      <section className="japanese-results">

        <div>
          <strong>
            95.33%
          </strong>

          <span>
            Accuracy
          </span>
        </div>

        <div>
          <strong>
            143 / 150
          </strong>

          <span>
            True Positives
          </span>
        </div>

        <div>
          <strong>
            200
          </strong>

          <span>
            Final Training Epochs
          </span>
        </div>

      </section>


      {/* =================================================
          01 / OBJECTIVE
      ================================================= */}

      <section className="japanese-block">

        <p className="section-label">
          01 / OBJECTIVE
        </p>

        <h2>
          Developing a YOLOv5-based OCR system
          for Japanese character recognition.
        </h2>

        <p>
          The project focused on developing an AI system
          capable of detecting and recognizing Japanese
          Kanji characters from calligraphic works.
        </p>

        <p>
          The system was designed as a live scanning
          application where a camera captures the
          calligraphic work and the trained YOLOv5 model
          analyzes the image to identify the characters.
        </p>

      </section>


      {/* =================================================
          02 / DATASET COLLECTION
      ================================================= */}

      <section className="japanese-block">

        <p className="section-label">
          02 / DATASET COLLECTION
        </p>

        <h2>
          Building a custom dataset of 50 Kanji
          characters.
        </h2>

        <p>
          The dataset focused on 50 selected Kanji
          characters. Character images were collected
          from online sources using different Japanese
          font styles, including TrueType font files
          obtained through Google Fonts.
        </p>

        <p>
          Multiple character representations were used
          to provide variation in the training and testing
          data.
        </p>

      </section>


      {/* =================================================
          03 / ROBOFLOW
      ================================================= */}

      <section className="japanese-block">

        <p className="section-label">
          03 / DATASET PREPARATION
        </p>

        <h2>
          Annotation and augmentation using Roboflow.
        </h2>

        <p>
          Roboflow was used to prepare the custom dataset
          before YOLOv5 training. The character images
          were annotated using bounding boxes and the
          dataset was augmented to introduce additional
          variation into the training data.
        </p>

        <div className="japanese-flow">

          <div>
            <span>01</span>
            Character Images
          </div>

          <span className="flow-arrow">
            →
          </span>

          <div>
            <span>02</span>
            Bounding Box Annotation
          </div>

          <span className="flow-arrow">
            →
          </span>

          <div>
            <span>03</span>
            Image Augmentation
          </div>

          <span className="flow-arrow">
            →
          </span>

          <div>
            <span>04</span>
            YOLOv5 Dataset
          </div>

        </div>

      </section>


      {/* =================================================
          04 / MODEL TRAINING
      ================================================= */}

      <section className="japanese-block">

        <p className="section-label">
          04 / YOLOv5 MODEL TRAINING
        </p>

        <h2>
          Training the custom model in Google Colab.
        </h2>

        <p>
          The prepared dataset was used to train a
          custom YOLOv5 model through Google Colab.
          Training experiments were performed using
          different epoch configurations, including
          50, 100, 150, and 200 epochs.
        </p>

        <p>
          The final testing results were obtained using
          the model trained for 200 epochs.
        </p>

        <div className="japanese-flow">

          <div>
            <span>01</span>
            Roboflow Dataset
          </div>

          <span className="flow-arrow">
            →
          </span>

          <div>
            <span>02</span>
            Google Colab
          </div>

          <span className="flow-arrow">
            →
          </span>

          <div>
            <span>03</span>
            YOLOv5 Training
          </div>

          <span className="flow-arrow">
            →
          </span>

          <div>
            <span>04</span>
            Trained Weights
          </div>

        </div>

      </section>


      {/* =================================================
          05 / MODEL TRANSFER
      ================================================= */}

      <section className="japanese-block">

        <p className="section-label">
          05 / MODEL INTEGRATION
        </p>

        <h2>
          Moving the trained model from Colab
          to the Raspberry Pi system.
        </h2>

        <p>
          After training, the resulting YOLOv5 model
          weights were downloaded from Google Colab
          as part of the final dataset and model package.
        </p>

        <p>
          The trained weights were then transferred to
          the Raspberry Pi and placed within the YOLOv5
          project environment so the trained model could
          be used by the recognition application.
        </p>

        <div className="japanese-flow">

          <div>
            <span>01</span>
            Google Colab
          </div>

          <span className="flow-arrow">
            →
          </span>

          <div>
            <span>02</span>
            Trained Weights
          </div>

          <span className="flow-arrow">
            →
          </span>

          <div>
            <span>03</span>
            YOLOv5 Project
          </div>

          <span className="flow-arrow">
            →
          </span>

          <div>
            <span>04</span>
            Raspberry Pi
          </div>

        </div>

      </section>


      {/* =================================================
          06 / HARDWARE
      ================================================= */}

      <section className="japanese-block">

        <p className="section-label">
          06 / HARDWARE &amp; DEPLOYMENT
        </p>

        <h2>
          Deploying the recognition system
          on Raspberry Pi.
        </h2>

        <p>
          The trained YOLOv5 model was integrated into
          a Raspberry Pi 4 Model B prototype designed
          to capture and analyze Japanese calligraphic
          works.
        </p>

        <div className="japanese-pipeline">

          <div>

            <span>
              01
            </span>

            <strong>
              Raspberry Pi 4
            </strong>

            <p>
              Main computing platform used
              for the deployed system.
            </p>

          </div>


          <div>

            <span>
              02
            </span>

            <strong>
              Webcam
            </strong>

            <p>
              Captures the Japanese
              calligraphic work.
            </p>

          </div>


          <div>

            <span>
              03
            </span>

            <strong>
              YOLOv5
            </strong>

            <p>
              Detects and recognizes the
              trained Kanji classes.
            </p>

          </div>


          <div>

            <span>
              04
            </span>

            <strong>
              Touchscreen GUI
            </strong>

            <p>
              Provides the user interface
              for operating the system.
            </p>

          </div>

        </div>

      </section>


      {/* =================================================
          07 / RECOGNITION PIPELINE
      ================================================= */}

      <section className="japanese-block">

        <p className="section-label">
          07 / RECOGNITION PIPELINE
        </p>

        <h2>
          From camera input to character output.
        </h2>

        <div className="japanese-pipeline">

          <div>

            <span>
              01
            </span>

            <strong>
              Image Capture
            </strong>

            <p>
              The webcam captures the
              calligraphic work.
            </p>

          </div>


          <div>

            <span>
              02
            </span>

            <strong>
              YOLOv5 Detection
            </strong>

            <p>
              The trained model analyzes
              the captured image.
            </p>

          </div>


          <div>

            <span>
              03
            </span>

            <strong>
              Bounding Boxes + NMS
            </strong>

            <p>
              Bounding boxes identify
              characters while NMS helps
              remove redundant detections.
            </p>

          </div>


          <div>

            <span>
              04
            </span>

            <strong>
              Character Output
            </strong>

            <p>
              The recognized Japanese
              character is displayed.
            </p>

          </div>

        </div>

      </section>


      {/* =================================================
          08 / TESTING
      ================================================= */}

      <section className="japanese-block">

        <p className="section-label">
          08 / EXPERIMENTAL TESTING
        </p>

        <h2>
          Evaluating recognition across
          150 test trials.
        </h2>

        <p>
          The prototype was tested using the 50 Kanji
          characters in the dataset. The testing process
          was repeated three times, resulting in a total
          of 150 trials.
        </p>

        <p>
          The results were recorded using a confusion
          matrix to compare the actual character against
          the model's predicted character.
        </p>


        <div className="japanese-results japanese-results-small">

          <div>

            <strong>
              50
            </strong>

            <span>
              Kanji Characters
            </span>

          </div>


          <div>

            <strong>
              3×
            </strong>

            <span>
              Testing Repetitions
            </span>

          </div>


          <div>

            <strong>
              150
            </strong>

            <span>
              Total Trials
            </span>

          </div>

        </div>

      </section>


      {/* =================================================
          09 / RESULTS
      ================================================= */}

      <section className="japanese-block">

        <p className="section-label">
          09 / RESULTS
        </p>

        <h2>
          95.33% recognition accuracy.
        </h2>

        <p>
          The testing produced 143 true positives out
          of 150 total trials, resulting in a reported
          accuracy of 95.33%.
        </p>

        <p>
          The thesis reports that the 200-epoch model
          produced the final testing result, with
          augmentation contributing to variation in
          factors such as brightness and sharpness.
        </p>

      </section>


      {/* =================================================
          10 / TECHNOLOGIES
      ================================================= */}

      <section className="japanese-block">

        <p className="section-label">
          10 / TECHNOLOGIES
        </p>

        <div className="japanese-tech">

          <span>
            Python
          </span>

          <span>
            YOLOv5
          </span>

          <span>
            Roboflow
          </span>

          <span>
            Google Colab
          </span>

          <span>
            OpenCV
          </span>

          <span>
            Raspberry Pi 4
          </span>

          <span>
            Tkinter
          </span>

          <span>
            Computer Vision
          </span>

        </div>

      </section>


      {/* =================================================
          PROJECT IMAGE
      ================================================= */}

      <section className="japanese-project-visual">

        <button
          type="button"
          className="japanese-image-button"
          onClick={() => setIsImageOpen(true)}
          aria-label="Enlarge Japanese character recognition project image"
        >

          <img
            src={japaneseCharacterImage}
            alt="Japanese character recognition AI project"
          />

          <span>
            Click to enlarge
          </span>

        </button>

      </section>


      {/* =================================================
          11 / ENGINEERING EXPERIENCE
      ================================================= */}

      <section className="japanese-block">

        <p className="section-label">
          11 / ENGINEERING EXPERIENCE
        </p>

        <h2>
          End-to-end experience from dataset
          preparation to hardware deployment.
        </h2>

        <p>
          This project provided hands-on experience
          across the AI development workflow: collecting
          and preparing image data, annotating bounding
          boxes, applying augmentation, training a custom
          YOLOv5 model, transferring trained weights,
          integrating the model into a Raspberry Pi
          environment, and validating the deployed
          system through physical testing.
        </p>

      </section>


      {/* =================================================
          PROJECT NOTE
      ================================================= */}

      <section className="japanese-note">

        <p className="section-label">
          PROJECT NOTE
        </p>

        <p>
          This project was developed as an academic
          thesis project. The reported 95.33% accuracy
          represents the testing performed using the
          project's custom dataset and experimental
          setup.
        </p>

      </section>


      {/* =================================================
          FOOTER
      ================================================= */}

      <div className="case-study-footer">

        <Link to="/projects">
          ← Back to All Projects
        </Link>

      </div>


      {/* =================================================
          IMAGE LIGHTBOX
      ================================================= */}

      {isImageOpen && (

        <div
          className="case-study-lightbox"
          onClick={() => setIsImageOpen(false)}
        >

          <button
            type="button"
            className="case-study-lightbox-close"
            onClick={(event) => {

              event.stopPropagation();

              setIsImageOpen(false);

            }}
            aria-label="Close enlarged image"
          >
            ×
          </button>


          <div
            className="case-study-lightbox-content"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <img
              src={japaneseCharacterImage}
              alt="Japanese character recognition project enlarged"
            />

            <p>
              AI-Based Japanese Character Recognition
            </p>

          </div>

        </div>

      )}

    </main>
  );
}