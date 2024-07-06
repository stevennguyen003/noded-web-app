import "./index.css"
import CreateAccountForm from "../../Components/CreateAccountForm/CreateAccountForm";

function LandingPage() {
    return (
        <div className="landing-page-container">
            <div className="login-panel-container">
                <CreateAccountForm/>
            </div>
        </div>
    );
}
export default LandingPage;