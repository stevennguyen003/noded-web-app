import "./index.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import * as userClient from "../../Clients/userClient";
import { User } from "../../Clients/userClient";
import { useNavigate } from "react-router";
import { useState } from "react";

function CreateAccountForm() {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState<User>({
        _id: "",
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        email: "",
        role: ""
    });
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await userClient.signin(credentials);
            console.log("User signed in:", response);
            navigate("/Home");
        } catch (error) {
            console.error("Error signing in:", error);
            setErrorMessage("Unable to sign in.");
        }
    }

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
        <div className="create-account-container">
            <h1 className="login-form-title">Welcome back!</h1>
            <form onSubmit={handleSubmit} className="create-account-form">
                <div className="form-content">
                    <div className="form-group">
                        <label htmlFor="usernameInput"><b>Username*</b></label>
                        <input
                            type="text"
                            className="form-control"
                            id="usernameInput"
                            placeholder="Enter your username"
                            value={credentials.username}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="passwordInput"><b>Password*</b></label>
                        <input
                            type="password"
                            className="form-control"
                            id="passwordInput"
                            placeholder="Enter your password"
                            value={credentials.password}
                            onChange={handleInputChange}
                        />
                    </div>
                    {errorMessage && (
                        <div className="error-message">{errorMessage}</div>
                    )}
                </div>
                <button type="submit" className="btn btn-primary"><b>Submit</b></button>
            </form>
        </div>
    );
}

export default CreateAccountForm;