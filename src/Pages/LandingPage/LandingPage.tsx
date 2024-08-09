import "./index.css"
import { Routes, Route } from "react-router";
import LoginForm from "../../Components/LoginForm/LoginForm";
import RegisterForm from "../../Components/RegisterForm/RegisterForm";

function LandingPage() {
    return (
        <div className="landing-page-container">
            <div className="landing-page-left-main">

            </div>
            <div className="landing-page-right-main">
                {/* <div className="landing-page-logo-container">
                    <h1>Name</h1>
                </div> */}
                <div className="landing-page-form-container">
                    <Routes>
                        <Route path="/login" element={<LoginForm />} />
                        <Route path="/register" element={<RegisterForm />} />
                        <Route path="/*" element={<LoginForm />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}
export default LandingPage;