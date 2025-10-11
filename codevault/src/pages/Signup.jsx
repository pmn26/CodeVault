import React, { useState } from "react";
import logo from "../assets/CodeVault-icon.png";
import "../assets/loginandsignup.css";
import { useNavigate } from "react-router-dom"; 
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

function Login() {
const [email, setEmail] = useState("");
const [name, setName] = useState("");
const [password, setPassword] = useState("");
const [agreement, setAgreement] = useState(false);
const [showFields, setShowFields] = useState(false);
const [showPassword, setShowPassword] = useState(false);

const navigate = useNavigate();

const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    if (/\S+@\S+\.\S+/.test(value)) {
    setShowFields(true);
    } else {
    setShowFields(false);
    setName("");
    setPassword("");
    setAgreement(false);
    }
};

const handlePasswordChange = (e) => setPassword(e.target.value);

const handleCheckboxChange = (e) => setAgreement(e.target.checked);

const allValid =
    /\S+@\S+\.\S+/.test(email) &&
    name.trim() !== "" &&
    password.trim() !== "" &&
    agreement;

const handleLogin = () => {
    if (allValid) {
    console.log("Logging in with:", { email, name, password });
    navigate("/MainPage");
    }
};

return (
    <div className="LoginContainer">
    <div className="LoginCard">
        <img src={logo} alt="Logo" className="LoginLogo" />
        <h2 className="LoginTitle">Create an account</h2>
        <p className="LoginSubtext">
        Already have an account? <a href="/login">Log in</a>
        </p>

        <div className="Divider">
        <span>Or, sign up with your email</span>
        </div>

        {/* Email field */}
        <label className="Label">Work email *</label>
        <input
        type="email"
        className="EmailInput"
        placeholder="codevaultG7@gmail.com"
        value={email}
        onChange={handleEmailChange}
        />

        {/* Conditional fields */}
        {showFields && (
        <>
            <label className="Label">Full Name *</label>
            <input
            type="text"
            className="EmailInput"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            />

            <label className="Label">Password *</label>
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

            <div className="AgreementCheckbox">
            <input
                type="checkbox"
                id="agreement"
                checked={agreement}
                onChange={handleCheckboxChange}
            />
            <label htmlFor="agreement">
                I agree to CodeVault’s{" "}
                <a href="#">terms of service</a> and{" "}
                <a href="#">privacy policy</a>.
            </label>
            </div>
        </>
        )}

        <button
        className={`GetStarted ${allValid ? "active" : ""}`}
        disabled={!allValid}
        onClick={handleLogin}
        >
        Get Started
        </button>
    </div>
    </div>
);
}

export default Login;
