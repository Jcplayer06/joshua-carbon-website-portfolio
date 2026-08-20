import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/Home";
import ProjectsPage from "./pages/ProjectsPage";
import ResumePage from "./pages/ResumePage";

import QAAutomationPage from "./pages/QAAutomationPage";
import CompetencyIQPage from "./pages/CompetencyIQPage";
import JapaneseCharacterPage from "./pages/JapaneseCharacterPage";
import SmartParkingPage from "./pages/SmartParkingPage";
import MotorPHPage from "./pages/MotorPHPage";
import WaterDispenserPage from "./pages/WaterDispenserPage";
import PortfolioWebsitePage from "./pages/PortfolioWebsitePage";

import heroBackground from "./assets/hero-tech-bg.png";

import "./App.css";

function App() {
  return (
    <BrowserRouter>

      <div className="portfolio">

        {/* GLOBAL BACKGROUND */}

        <div
          className="global-tech-background"
          style={{
            backgroundImage: `url(${heroBackground})`,
          }}
        />

        <ScrollToTop />

        <Navbar />

        <Routes>

          {/* HOME */}

          <Route
            path="/"
            element={<Home />}
          />


          {/* PROJECTS */}

          <Route
            path="/projects"
            element={<ProjectsPage />}
          />


          {/* RESUME */}

          <Route
            path="/resume"
            element={<ResumePage />}
          />


          {/* QA AUTOMATION */}

          <Route
            path="/projects/qa-automation"
            element={<QAAutomationPage />}
          />


          {/* COMPETENCY IQ */}

          <Route
            path="/projects/competencyiq"
            element={<CompetencyIQPage />}
          />


          {/* JAPANESE CHARACTER */}

          <Route
            path="/projects/japanese-character"
            element={<JapaneseCharacterPage />}
          />


          {/* SMART PARKING */}

          <Route
            path="/projects/smart-parking"
            element={<SmartParkingPage />}
          />


          {/* MOTORPH */}

          <Route
            path="/projects/motorph"
            element={<MotorPHPage />}
          />


          {/* WATER DISPENSER */}

          <Route
            path="/projects/water-dispenser"
            element={<WaterDispenserPage />}
          />


          {/* PORTFOLIO WEBSITE */}

          <Route
            path="/projects/portfolio-website"
            element={<PortfolioWebsitePage />}
          />

        </Routes>

      </div>

    </BrowserRouter>
  );
}

export default App;