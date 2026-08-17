import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import smartParkingImage from "../assets/projects/smart-parking.png";

export default function SmartParkingCaseStudy() {
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
    <main className="parking-case-study">

      {/* =================================================
          BACK TO PROJECTS
      ================================================= */}


      {/* =================================================
          HERO
      ================================================= */}

      <section className="parking-header">

        <p className="section-label">
          PROJECT 04 / IOT / EMBEDDED SYSTEMS
        </p>

        <h1>
          Smart Parking
          <br />
          System
        </h1>

        <p className="parking-intro">
          An IoT-based parking monitoring system
          using ultrasonic sensors and an ESP8266
          controller to detect parking occupancy
          and display parking-slot availability
          through a Blynk mobile application.
        </p>

      </section>


      {/* =================================================
          PROJECT OVERVIEW
      ================================================= */}

      <section className="parking-overview">

        <div>
          <span>
            PROJECT TYPE
          </span>

          <strong>
            IoT / Embedded Systems
          </strong>
        </div>

        <div>
          <span>
            CONTROLLER
          </span>

          <strong>
            ESP8266
          </strong>
        </div>

        <div>
          <span>
            SENSORS
          </span>

          <strong>
            Ultrasonic Sensors
          </strong>
        </div>

        <div>
          <span>
            MONITORING
          </span>

          <strong>
            Blynk
          </strong>
        </div>

      </section>


      {/* =================================================
          01 / OBJECTIVE
      ================================================= */}

      <section className="parking-block">

        <p className="section-label">
          01 / OBJECTIVE
        </p>

        <h2>
          Monitor parking availability using
          connected sensors.
        </h2>

        <p>
          The project was designed to monitor
          individual parking spaces using sensors
          and provide parking information through
          a connected mobile interface.
        </p>

        <p>
          The system connects the physical parking
          environment to a digital representation
          of available and occupied spaces, allowing
          users to identify parking availability
          without having to inspect every space
          manually.
        </p>

      </section>


      {/* =================================================
          02 / HARDWARE
      ================================================= */}

      <section className="parking-block">

        <p className="section-label">
          02 / HARDWARE &amp; COMPONENTS
        </p>

        <h2>
          Connecting physical sensors to an
          IoT controller.
        </h2>

        <p>
          The system uses ultrasonic sensors to
          detect the occupancy state of individual
          parking spaces. An ESP8266 microcontroller
          handles the sensor information and provides
          the connectivity required for the IoT
          monitoring interface.
        </p>


        <div className="parking-hardware-grid">

          <div>

            <span>
              01
            </span>

            <strong>
              ESP8266
            </strong>

            <p>
              Microcontroller used to process the
              sensor information and connect the
              system to the IoT platform.
            </p>

          </div>


          <div>

            <span>
              02
            </span>

            <strong>
              Ultrasonic Sensors
            </strong>

            <p>
              Sensors used to determine the
              occupancy state of individual
              parking spaces.
            </p>

          </div>


          <div>

            <span>
              03
            </span>

            <strong>
              Blynk
            </strong>

            <p>
              Mobile IoT interface used to
              visualize the parking information.
            </p>

          </div>


          <div>

            <span>
              04
            </span>

            <strong>
              Parking Layout
            </strong>

            <p>
              Physical parking spaces mapped
              to corresponding digital status
              information.
            </p>

          </div>

        </div>

      </section>


      {/* =================================================
          03 / SYSTEM ARCHITECTURE
      ================================================= */}

      <section className="parking-block">

        <p className="section-label">
          03 / SYSTEM ARCHITECTURE
        </p>

        <h2>
          From physical parking slots
          to mobile monitoring.
        </h2>

        <div className="parking-flow">

          <div>
            Parking Slot
          </div>

          <span>
            →
          </span>

          <div>
            Ultrasonic Sensor
          </div>

          <span>
            →
          </span>

          <div>
            ESP8266
          </div>

          <span>
            →
          </span>

          <div>
            Blynk
          </div>

          <span>
            →
          </span>

          <div>
            Mobile Application
          </div>

        </div>

      </section>


      {/* =================================================
          04 / SENSOR DETECTION
      ================================================= */}

      <section className="parking-block">

        <p className="section-label">
          04 / SENSOR-BASED DETECTION
        </p>

        <h2>
          Each parking slot has an
          occupancy state.
        </h2>

        <p>
          Ultrasonic sensors are positioned within
          the parking layout to determine whether
          individual spaces are available or occupied.
        </p>

        <p>
          The detected state is then processed by
          the controller and reflected in the parking
          information presented to the user.
        </p>


        <div className="parking-status-grid">

          <div>

            <span>
              FREE
            </span>

            <strong>
              Parking Available
            </strong>

            <p>
              The sensor indicates that the
              corresponding parking space
              is available.
            </p>

          </div>


          <div>

            <span>
              OCCUPIED
            </span>

            <strong>
              Parking Unavailable
            </strong>

            <p>
              The sensor indicates that the
              corresponding parking space
              is occupied.
            </p>

          </div>

        </div>

      </section>


      {/* =================================================
          05 / PARKING LAYOUT
      ================================================= */}

      <section className="parking-block">

        <p className="section-label">
          05 / PARKING LAYOUT
        </p>

        <h2>
          Mapping physical slots to
          digital status.
        </h2>

        <p>
          Individual parking spaces are represented
          according to their physical positions in
          the parking layout. This allows the user
          to identify both the availability state
          and the location of an available space.
        </p>


        <div className="parking-layout">

          <div className="parking-slot">

            <span>
              A1
            </span>

            <strong>
              FREE
            </strong>

          </div>


          <div className="parking-slot">

            <span>
              A2
            </span>

            <strong>
              OCCUPIED
            </strong>

          </div>


          <div className="parking-slot">

            <span>
              A3
            </span>

            <strong>
              FREE
            </strong>

          </div>


          <div className="parking-slot">

            <span>
              B1
            </span>

            <strong>
              OCCUPIED
            </strong>

          </div>


          <div className="parking-slot">

            <span>
              B2
            </span>

            <strong>
              FREE
            </strong>

          </div>


          <div className="parking-slot">

            <span>
              B3
            </span>

            <strong>
              OCCUPIED
            </strong>

          </div>

        </div>

      </section>


      {/* =================================================
          06 / IOT CONNECTION
      ================================================= */}

      <section className="parking-block">

        <p className="section-label">
          06 / IOT CONNECTION
        </p>

        <h2>
          Connecting the embedded system
          to Blynk.
        </h2>

        <p>
          The ESP8266 acts as the connection between
          the physical sensor system and the Blynk
          monitoring interface. Sensor states are
          processed by the controller and represented
          digitally so that users can monitor the
          parking environment remotely.
        </p>


        <div className="parking-flow">

          <div>
            Sensor Data
          </div>

          <span>
            →
          </span>

          <div>
            ESP8266
          </div>

          <span>
            →
          </span>

          <div>
            IoT Connection
          </div>

          <span>
            →
          </span>

          <div>
            Blynk Dashboard
          </div>

          <span>
            →
          </span>

          <div>
            Parking Status
          </div>

        </div>

      </section>


      {/* =================================================
          07 / BLYNK APPLICATION
      ================================================= */}

      <section className="parking-block">

        <p className="section-label">
          07 / BLYNK APPLICATION
        </p>

        <h2>
          Making parking information
          accessible through a mobile interface.
        </h2>

        <p>
          Blynk provides the mobile monitoring
          interface for viewing the parking system.
          The sensor-driven parking states are
          represented through the application so
          users can determine which spaces are
          available.
        </p>

      </section>


      {/* =================================================
          08 / USER EXPERIENCE
      ================================================= */}

      <section className="parking-block">

        <p className="section-label">
          08 / USER EXPERIENCE
        </p>

        <h2>
          Check availability before
          choosing a parking space.
        </h2>

        <div className="parking-experience">

          <div>

            <span>
              01
            </span>

            <strong>
              Open the Blynk application
            </strong>

            <p>
              Access the connected parking
              monitoring interface.
            </p>

          </div>


          <div>

            <span>
              02
            </span>

            <strong>
              View parking layout
            </strong>

            <p>
              Review the represented parking
              spaces and their current states.
            </p>

          </div>


          <div>

            <span>
              03
            </span>

            <strong>
              Identify a free slot
            </strong>

            <p>
              Locate available spaces based
              on the sensor-driven status.
            </p>

          </div>


          <div>

            <span>
              04
            </span>

            <strong>
              Navigate to the space
            </strong>

            <p>
              Use the displayed parking location
              to identify where an available slot
              is located.
            </p>

          </div>

        </div>

      </section>


      {/* =================================================
          09 / END-TO-END WORKFLOW
      ================================================= */}

      <section className="parking-block">

        <p className="section-label">
          09 / END-TO-END WORKFLOW
        </p>

        <h2>
          From vehicle presence to
          parking information.
        </h2>

        <div className="parking-pipeline">

          <div>

            <span>
              01
            </span>

            <strong>
              Physical Environment
            </strong>

            <p>
              A vehicle occupies or leaves
              a parking space.
            </p>

          </div>


          <div>

            <span>
              02
            </span>

            <strong>
              Sensor Detection
            </strong>

            <p>
              The ultrasonic sensor detects
              the current state of the space.
            </p>

          </div>


          <div>

            <span>
              03
            </span>

            <strong>
              ESP8266 Processing
            </strong>

            <p>
              The controller processes the
              sensor information.
            </p>

          </div>


          <div>

            <span>
              04
            </span>

            <strong>
              Blynk Visualization
            </strong>

            <p>
              The parking status is presented
              through the mobile interface.
            </p>

          </div>

        </div>

      </section>


      {/* =================================================
          10 / TECHNOLOGIES
      ================================================= */}

      <section className="parking-block">

        <p className="section-label">
          10 / TECHNOLOGIES
        </p>

        <div className="parking-tech">

          <span>
            ESP8266
          </span>

          <span>
            Arduino
          </span>

          <span>
            C++
          </span>

          <span>
            Ultrasonic Sensors
          </span>

          <span>
            Blynk
          </span>

          <span>
            IoT
          </span>

          <span>
            Embedded Systems
          </span>

        </div>

      </section>


      {/* =================================================
          PROJECT IMAGE
      ================================================= */}

      <section className="parking-image">

        <button
          type="button"
          className="parking-image-button"
          onClick={() => setIsImageOpen(true)}
          aria-label="Enlarge Smart Parking System image"
        >

          <img
            src={smartParkingImage}
            alt="Smart Parking System with sensor-based parking monitoring"
          />

          <span>
            Click to enlarge
          </span>

        </button>

      </section>


      {/* =================================================
          11 / ENGINEERING EXPERIENCE
      ================================================= */}

      <section className="parking-block">

        <p className="section-label">
          11 / ENGINEERING EXPERIENCE
        </p>

        <h2>
          Integrating hardware, connectivity,
          and software.
        </h2>

        <p>
          This project provided practical experience
          connecting physical sensors to a
          microcontroller, processing sensor states,
          establishing IoT connectivity, and
          presenting hardware-generated information
          through a mobile application.
        </p>

        <p>
          It also provided experience in thinking
          about the relationship between the physical
          environment and its digital representation,
          which is a core concept in IoT systems.
        </p>

      </section>


      {/* =================================================
          PROJECT NOTE
      ================================================= */}

      <section className="parking-note">

        <p className="section-label">
          PROJECT NOTE
        </p>

        <p>
          The parking-layout visualization shown
          in this case study represents the system's
          intended mapping of sensor states to
          individual parking locations. The actual
          hardware configuration and sensor
          implementation should be interpreted
          according to the project's implementation.
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
              src={smartParkingImage}
              alt="Smart Parking System enlarged"
            />

            <p>
              Smart Parking System
            </p>

          </div>

        </div>

      )}

    </main>
  );
}