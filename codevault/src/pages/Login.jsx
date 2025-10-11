import React, { useState } from "react";
import logo from "../assets/CodeVault-icon.png";
import "../assets/loginandsignup.css";
import { useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";


function Login() {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [showPassword, setShowPassword] = useState(false);
const navigate = useNavigate();

const handleEmailChange = (e) => {
    setEmail(e.target.value);
};

const handlePasswordChange = (e) => {
    setPassword(e.target.value);
};

const allValid = /\S+@\S+\.\S+/.test(email) && password.trim() !== "";

const handleLogin = () => {
    if (allValid) {
    console.log("Logging in with", { email, password });
    navigate("/MainPage");
    }
};

return (
    <div className="LoginContainer">
    <div className="LoginCard">
        <img src={logo} alt="Logo" className="LoginLogo" />
        <h2 className="LoginTitle">Welcome Back</h2>
        <p className="LoginSubtext">
        Don’t have an account? <a href="/Signup">Sign up</a>
        </p>

        <div className="Divider">
        <span>Or, log in with your email</span>
        </div>

        <label className="Label">Email *</label>
        <input
        type="email"
        className="EmailInput"
        placeholder="Enter your email"
        value={email}
        onChange={handleEmailChange}
        />

        <div className="PasswordContainer">
                    <input
                        type={showPassword ? "text" : "password"}
                        className="EmailInput"
                        placeholder="Enter your password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                    <span
                        className="EyeIcon"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                    </span>
                    </div>

        <button
        className={`GetStarted ${allValid ? "active" : ""}`}
        disabled={!allValid}
        onClick={handleLogin}
        >
        Log In
        </button>
    </div>
    </div>
);
}

export default Login;
