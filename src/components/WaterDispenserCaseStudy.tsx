import waterDispenserImage from "../assets/projects/water-dispenser.png";

export default function WaterDispenserCaseStudy() {
  return (
    <section
      id="water-dispenser-case-study"
      className="water-case-study"
    >

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="water-header">

        <p className="section-label">
          CASE STUDY / 06
        </p>

        <h2>
          Smart Water
          <br />
          Dispenser
        </h2>

        <p className="water-intro">
          A non-contact smart water dispenser
          developed using infrared sensing,
          embedded electronics, PCB design,
          and a mobile-connected interface.
        </p>

      </div>


      {/* =====================================================
          OVERVIEW
      ===================================================== */}

      <div className="water-overview">

        <div>

          <span>
            PROJECT TYPE
          </span>

          <strong>
            Embedded / IoT
          </strong>

        </div>


        <div>

          <span>
            INPUT
          </span>

          <strong>
            Infrared Sensor
          </strong>

        </div>


        <div>

          <span>
            CONTROL
          </span>

          <strong>
            Embedded Electronics
          </strong>

        </div>


        <div>

          <span>
            CONNECTIVITY
          </span>

          <strong>
            Blynk
          </strong>

        </div>

      </div>


      {/* =====================================================
          OBJECTIVE
      ===================================================== */}

      <div className="water-block">

        <p className="section-label">
          01 / OBJECTIVE
        </p>

        <h3>
          Create a hands-free water
          dispensing system.
        </h3>

        <p>
          The project focused on developing a
          non-contact water dispenser that could
          detect a user's hand through an infrared
          sensor and activate the dispensing
          mechanism without requiring physical
          contact with the device.
        </p>

      </div>


      {/* =====================================================
          SENSOR OPERATION
      ===================================================== */}

      <div className="water-block">

        <p className="section-label">
          02 / SENSOR OPERATION
        </p>

        <h3>
          Detect presence without
          physical contact.
        </h3>

        <p>
          An infrared sensor is used to detect the
          presence of an object or hand within the
          sensor's detection area. When the required
          condition is detected, the embedded control
          system activates the dispensing mechanism.
        </p>


        <div className="water-flow">

          <div>
            Hand Detected
          </div>

          <span>
            ↓
          </span>

          <div>
            Infrared Sensor
          </div>

          <span>
            ↓
          </span>

          <div>
            Embedded Controller
          </div>

          <span>
            ↓
          </span>

          <div>
            Dispensing Mechanism
          </div>

        </div>

      </div>


      {/* =====================================================
          SYSTEM ARCHITECTURE
      ===================================================== */}

      <div className="water-block">

        <p className="section-label">
          03 / SYSTEM ARCHITECTURE
        </p>

        <h3>
          Hardware and software working
          as one system.
        </h3>


        <div className="water-architecture">

          <div>

            <span>
              01
            </span>

            <strong>
              Infrared Sensor
            </strong>

            <p>
              Detects the user's hand or object
              without requiring physical contact.
            </p>

          </div>


          <div>

            <span>
              02
            </span>

            <strong>
              Control Electronics
            </strong>

            <p>
              Processes the sensor state and
              controls the dispensing operation.
            </p>

          </div>


          <div>

            <span>
              03
            </span>

            <strong>
              PCB / Circuit
            </strong>

            <p>
              Provides the electronic connections
              required by the system components.
            </p>

          </div>


          <div>

            <span>
              04
            </span>

            <strong>
              Mobile Interface
            </strong>

            <p>
              Provides connected monitoring and
              interaction through Blynk.
            </p>

          </div>

        </div>

      </div>


      {/* =====================================================
          EMBEDDED DESIGN
      ===================================================== */}

      <div className="water-block">

        <p className="section-label">
          04 / EMBEDDED DESIGN
        </p>

        <h3>
          Translating sensor input into
          physical action.
        </h3>

        <p>
          The system demonstrates the integration
          of sensing, control logic, and physical
          output. The sensor provides the input
          condition while the embedded electronics
          determine when the dispensing mechanism
          should operate.
        </p>


        <div className="water-state-grid">

          <div>

            <span>
              STATE 01
            </span>

            <strong>
              No Detection
            </strong>

            <p>
              The sensor does not detect a hand
              or object within the configured
              detection area.
            </p>

          </div>


          <div>

            <span>
              STATE 02
            </span>

            <strong>
              Detection
            </strong>

            <p>
              The infrared sensor detects the
              required presence condition.
            </p>

          </div>


          <div>

            <span>
              STATE 03
            </span>

            <strong>
              Activation
            </strong>

            <p>
              The control system activates the
              dispensing operation.
            </p>

          </div>


          <div>

            <span>
              STATE 04
            </span>

            <strong>
              Completion
            </strong>

            <p>
              The dispensing operation stops
              when the required condition is no
              longer detected.
            </p>

          </div>

        </div>

      </div>


      {/* =====================================================
          PCB DESIGN
      ===================================================== */}

      <div className="water-block">

        <p className="section-label">
          05 / PCB DESIGN
        </p>

        <h3>
          Designing the electronics around
          the physical system.
        </h3>

        <p>
          PCB design was part of the project,
          requiring the electronic components and
          connections to be organized into a
          practical circuit for the dispenser.
        </p>


        <div className="water-flow">

          <div>
            Sensor
          </div>

          <span>
            +
          </span>

          <div>
            Control Circuit
          </div>

          <span>
            +
          </span>

          <div>
            Output
          </div>

          <span>
            =
          </span>

          <div>
            Integrated System
          </div>

        </div>

      </div>


      {/* =====================================================
          MOBILE CONNECTIVITY
      ===================================================== */}

      <div className="water-block">

        <p className="section-label">
          06 / MOBILE CONNECTIVITY
        </p>

        <h3>
          Connecting the physical system
          to a mobile interface.
        </h3>

        <p>
          Blynk was integrated as part of the
          project's connected interface, providing
          a mobile-based way to interact with or
          monitor the system.
        </p>


        <div className="water-flow">

          <div>
            Embedded Device
          </div>

          <span>
            ↓
          </span>

          <div>
            IoT Connection
          </div>

          <span>
            ↓
          </span>

          <div>
            Blynk
          </div>

          <span>
            ↓
          </span>

          <div>
            Mobile Interface
          </div>

        </div>

      </div>


      {/* =====================================================
          SOFTWARE
      ===================================================== */}

      <div className="water-block">

        <p className="section-label">
          07 / SOFTWARE
        </p>

        <h3>
          Embedded programming and
          interface development.
        </h3>

        <p>
          The project combined embedded programming
          for the sensor and control system with
          interface development for the connected
          mobile application.
        </p>


        <div className="water-tech">

          <span>
            Arduino Programming
          </span>

          <span>
            Visual Basic
          </span>

          <span>
            Blynk
          </span>

          <span>
            Infrared Sensor
          </span>

          <span>
            PCB Design
          </span>

          <span>
            Embedded Systems
          </span>

        </div>

      </div>


      {/* =====================================================
          ENGINEERING EXPERIENCE
      ===================================================== */}

      <div className="water-block">

        <p className="section-label">
          08 / ENGINEERING EXPERIENCE
        </p>

        <h3>
          Hardware, firmware, interface,
          and integration.
        </h3>

        <p>
          This project provided practical experience
          in combining electronics, sensors,
          embedded programming, PCB design, and
          software interfaces into a single working
          system.
        </p>

      </div>


      {/* =====================================================
          PROJECT IMAGE
      ===================================================== */}

      <div className="water-image">

        <img
          src={waterDispenserImage}
          alt="Smart Water Dispenser project"
          className="water-project-image"
        />

      </div>


      {/* =====================================================
          PROJECT NOTE
      ===================================================== */}

      <div className="water-note">

        <p className="section-label">
          PROJECT NOTE
        </p>

        <p>
          The Smart Water Dispenser demonstrates
          hands-free interaction through infrared
          sensing and embedded control. The project
          also incorporates PCB design and a
          connected mobile interface as part of
          the overall system.
        </p>

      </div>


      {/* =====================================================
          BACK TO PROJECTS
      ===================================================== */}

      <div className="case-study-footer">

        <a href="/projects">
          ← Back to All Projects
        </a>

      </div>

    </section>
  );
}