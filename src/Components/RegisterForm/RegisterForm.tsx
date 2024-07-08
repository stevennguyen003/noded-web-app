import "./index.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import * as userClient from "../../Clients/userClient";
import { User } from "../../Clients/userClient";
import { useNavigate } from "react-router";
import { useState } from "react";
import { Link } from "react-router-dom";

function RegisterForm() {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState<User>({
        _id: "",
        username: "",
        password: "",
        firstName: "",
        lastName: "",
    });
    const [registerFailed, setRegisterFailed] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await userClient.signup(credentials);
            console.log("User registered:", response);
            navigate("/home");
        } catch (error) {
            console.error("Error creating user:", error);
            setRegisterFailed(true);
        }
    }

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
                        <label htmlFor="firstNameInput"><b>FIRST NAME</b></label>
                        <input
                            type="text"
                            className="form-control"
                            id="firstNameInput"
                            value={credentials.firstName}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastNameInput"><b>LAST NAME</b></label>
                        <input
                            type="text"
                            className="form-control"
                            id="lastNameInput"
                            value={credentials.lastName}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="usernameInput"><b>USERNAME</b> <span className="error-message">{registerFailed && <i>- User already exists</i>}</span></label>
                        <input
                            type="text"
                            className="form-control"
                            id="usernameInput"
                            value={credentials.username}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="passwordInput"><b>PASSWORD</b></label>
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