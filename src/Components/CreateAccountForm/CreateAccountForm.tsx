import "./index.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router";

function CreateAccountForm() {
    const navigate = useNavigate();

    // Create new account with given inputs and navigate to home page on success
    const handleSubmit = () => {
        navigate("/Home");
    }

    return (
        <div className="create-account-container">
            <h1 className="login-form-title">Create an account!</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="usernameInput"><b>Username*</b></label>
                    <input type="email" className="form-control" id="usernameInput" placeholder="Create a username" />
                </div>
                <div className="form-group">
                    <label htmlFor="emailInput"><b>Email*</b></label>
                    <input type="email" className="form-control" id="emailInput" placeholder="Enter your email" />
                </div>
                <div className="form-group">
                    <label htmlFor="passwordInput"><b>Password*</b></label>
                    <input type="password" className="form-control" id="passwordInput" placeholder="Create a password" />
                </div>
                <button type="submit" className="btn btn-primary"><b>Submit</b></button>
            </form>
        </div>
    );
}
export default CreateAccountForm;