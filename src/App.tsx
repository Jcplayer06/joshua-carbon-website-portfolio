import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";
import SEO from "./components/SEO";

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
import AIQUANTAPage from "./pages/AIQUANTAPage";
import ClientProjectPage from "./pages/ClientProjectPage";

import AnimatedTechBackground from "./components/AnimatedTechBackground";

import "./App.css";

function AppShell() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
      <div className="portfolio">

        {!isHome && <AnimatedTechBackground />}

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


          {/* AIQUANTA */}

          <Route
            path="/projects/aiquanta"
            element={<AIQUANTAPage />}
          />


          {/* PORTFOLIO WEBSITE */}

          <Route
            path="/projects/portfolio-website"
            element={<PortfolioWebsitePage />}
          />


          {/* FREELANCE / CLIENT PROJECTS */}

          {/* Parameterized route is the canonical client-project path. */}
          <Route path="/projects/client/:projectId" element={<ClientProjectPage />} />

          {/* Legacy/direct slugs remain supported. */}
          <Route path="/projects/thermal-therapy-device" element={<ClientProjectPage />} />
          <Route path="/projects/wallpaper-applicator" element={<ClientProjectPage />} />
          <Route path="/projects/iot-water-quality" element={<ClientProjectPage />} />
          <Route path="/projects/piso-wifi" element={<ClientProjectPage />} />

        </Routes>

      </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <SEO />
      <Navbar />
      <AppShell />
    </BrowserRouter>
  );
}

export default App;