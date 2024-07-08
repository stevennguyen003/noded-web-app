import "./index.css"
import { Routes, Route } from "react-router";
import LoginForm from "../../Components/LoginForm/LoginForm";
import RegisterForm from "../../Components/RegisterForm/RegisterForm";

function LandingPage() {
    return (
        <div className="landing-page-container">
            <div className="login-panel-container">
                <Routes>
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/register" element={<RegisterForm />} />
                    <Route path="/*" element={<LoginForm />} />
                </Routes>
            </div>
        </div>
    );
}
export default LandingPage;