import { HashRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/LandingPage/LandingPage";
import HomePage from "./Pages/HomePage/HomePage";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/*" element={<LandingPage />}/>
        <Route path="Home" element={<HomePage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
