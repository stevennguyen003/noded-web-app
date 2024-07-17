import "./index.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import * as userClient from "../../Clients/userClient";
import { User } from "../../Clients/userClient";
import { useNavigate } from "react-router";
import { useState } from "react";
import { Link } from "react-router-dom";

// Component for the login form displayed on the landing page
function LoginForm() {
    const navigate = useNavigate();
    // Represents the inputted credentials as a User object
    const [credentials, setCredentials] = useState<User>({
        _id: "",
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        profilePicture: "",
        groups: []
    });
    // State to handle login success
    const [loginFailed, setLoginFailed] = useState(false);
    // Used on form submit, executes signin call
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await userClient.signin(credentials);
            console.log("User signed in:", response);
            // Navigate user to home page on success
            navigate("/home/default");
        } catch (error) {
            console.error("Error signing in:", error);
            setLoginFailed(true);
        }
    }
    // Handles changing states for all input fields
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        switch (id) {
            case "usernameInput":
                setCredentials({ ...credentials, username: value })
                break;
            case "passwordInput":
                setCredentials({ ...credentials, password: value })
                break;
        }
    }

    return (
        <div className="login-account-container">
            <h2 className="login-form-title">Hello!</h2>
            <form onSubmit={handleSubmit} className="login-account-form">
                <div className="form-content">
                    <div className="form-group">
                        <label htmlFor="usernameInput" className="login-form-label"><b>Username</b> <span className="error-message">{loginFailed && <i>- Login failed</i>}</span></label>
                        <input
                            type="text"
                            className="form-control login-form-input"
                            id="usernameInput"
                            value={credentials.username}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="passwordInput" className="login-form-label"><b>Password</b> <span className="error-message">{loginFailed && <i>- Login failed</i>}</span></label>
                        <input
                            type="password"
                            className="form-control login-form-input"
                            id="passwordInput"
                            value={credentials.password}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <button type="submit" className="btn btn-primary login-form-btn"><b>Log In</b></button>
                <Link to='/register' className="register-text">Register here!</Link>
            </form>
        </div>
    );
}

export default LoginForm;