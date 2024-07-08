import "./index.css"
import { Routes, Route } from "react-router";
import LoginForm from "../../Components/LoginForm/LoginForm";
import RegisterForm from "../../Components/RegisterForm/RegisterForm";

function LandingPage() {
    return (
        <div className="landing-page-container">
            <Routes>
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/*" element={<LoginForm />} />
            </Routes>
        </div>
    );
}
export default LandingPage;