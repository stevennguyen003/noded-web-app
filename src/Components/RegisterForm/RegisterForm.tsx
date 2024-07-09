import "./index.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import * as userClient from "../../Clients/userClient";
import { User } from "../../Clients/userClient";
import { useNavigate } from "react-router";
import { useState } from "react";
import { Link } from "react-router-dom";

// Component for the login form displayed on the landing page
function RegisterForm() {
    const navigate = useNavigate();
    // Represents the inputted credentials as a User object
    const [credentials, setCredentials] = useState<User>({
        _id: "",
        username: "",
        password: "",
        firstName: "",
        lastName: "",
    });
    // State to handle register success
    const [registerFailed, setRegisterFailed] = useState(false);
    // State to handle empty fields error
    const [fieldErrors, setFieldErrors] = useState({
        firstName: false,
        lastName: false,
        username: false,
        password: false
    });
    // Used on form submit, executes signup call
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newFieldErrors = {
            firstName: !credentials.firstName,
            lastName: !credentials.lastName,
            username: !credentials.username,
            password: !credentials.password
        };
        setFieldErrors(newFieldErrors);
        // Handle empty field error
        if (Object.values(newFieldErrors).some(error => error)) { return; }
        try {
            const response = await userClient.signup(credentials);
            console.log("User registered:", response);
            navigate("/home");
        } catch (error) {
            console.error("Error creating user:", error);
            setRegisterFailed(true);
        }
    }
    // Handles changing states for all input fields
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        switch (id) {
            case "firstNameInput":
                setCredentials({ ...credentials, firstName: value })
                break;
            case "lastNameInput":
                setCredentials({ ...credentials, lastName: value })
                break;
            case "usernameInput":
                setCredentials({ ...credentials, username: value })
                break;
            case "passwordInput":
                setCredentials({ ...credentials, password: value })
                break;
        }
    }

    return (
        <div className="create-account-container">
            <h2 className="create-form-title">Create an account</h2>
            <form onSubmit={handleSubmit} className="create-account-form">
                <div className="form-content">
                    <div className="form-group">
                        <label htmlFor="firstNameInput"><b>FIRST NAME</b>
                            {fieldErrors.firstName && <span className="error-message"><i> - This field is required</i></span>}
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="firstNameInput"
                            value={credentials.firstName}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="lastNameInput"><b>LAST NAME</b>
                            {fieldErrors.lastName && <span className="error-message"><i> - This field is required</i></span>}
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="lastNameInput"
                            value={credentials.lastName}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="usernameInput"><b>USERNAME</b>
                            {fieldErrors.username && <span className="error-message"><i> - This field is required</i></span>}
                            {registerFailed && <span className="error-message"><i> - User already exists</i></span>}
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="usernameInput"
                            value={credentials.username}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="passwordInput"><b>PASSWORD</b>
                            {fieldErrors.password && <span className="error-message"><i> - This field is required</i></span>}
                        </label>
                        <input
                            type="password"
                            className="form-control"
                            id="passwordInput"
                            value={credentials.password}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <button type="submit" className="btn btn-primary"><b>Register</b></button>
                <Link to='/' className="register-text">Have an account?</Link>
            </form>
        </div>
    );
}
export default RegisterForm;