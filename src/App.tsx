import { HashRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import LandingPage from "./Pages/LandingPage/LandingPage";
import HomePage from "./Pages/HomePage/HomePage";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LandingPage />} />
        <Route path="home" element={<HomePage />} />
        <Route path="/*" element={<LandingPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
