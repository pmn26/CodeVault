import React, { useState } from "react";
import logo from "../assets/CodeVault-icon.png";
import "../assets/loginandsignup.css";
import { useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { auth, provider, signInWithPopup } from "../firebase";
import axios from "axios";

function Login() {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [showPassword, setShowPassword] = useState(false);
const [status, setStatus] = useState("");
const [loading, setLoading] = useState(false);

const navigate = useNavigate();
const allValid = /\S+@\S+\.\S+/.test(email) && password.trim() !== "";

/* ===============================
    🔹 EMAIL / PASSWORD LOGIN
================================ */
const handleLogin = async () => {
    if (!allValid || loading) return;

    setStatus("");
    setLoading(true);

    try {
    const res = await axios.post(
        "http://localhost/CodeVault/codevault/codevault-backend/api/login.php",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
    );

    const data = res.data;

    /* 🚧 MAINTENANCE MODE (HIGHEST PRIORITY) */
    if (data.maintenance) {
        navigate("/maintenance", { replace: true });
        return;
    }

    if (!data.exists) {
        setStatus("❌ User not found. Please sign up first.");
        return;
    }

    if (!data.passwordValid) {
        setStatus("❌ Invalid password");
        return;
    }

    /* ✅ LOGIN SUCCESS */
    localStorage.setItem("user", JSON.stringify(data.user));
    setStatus("✅ Login successful!");

    if (data.user.role === "admin") {
        navigate("/admin", { replace: true });
    } else {
        navigate("/MainPage", { replace: true });
    }
    } catch (err) {
    console.error(err);
    setStatus("⚠️ Server error. Please try again.");
    } finally {
    setLoading(false);
    }
};

/* ===============================
    🔹 GOOGLE LOGIN
================================ */
const handleGoogleLogin = async () => {
    if (loading) return;

    setStatus("");
    setLoading(true);

    try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const res = await axios.post(
        "http://localhost/CodeVault/codevault/codevault-backend/api/login.php",
        { email: user.email },
        { headers: { "Content-Type": "application/json" } }
    );

    const data = res.data;

    /* 🚧 MAINTENANCE MODE (HIGHEST PRIORITY) */
    if (data.maintenance) {
        navigate("/maintenance", { replace: true });
        return;
    }

    if (!data.exists) {
        setStatus("❌ Google account not registered. Please sign up first.");
        return;
    }

    /* ✅ GOOGLE LOGIN SUCCESS */
    localStorage.setItem("user", JSON.stringify(data.user));
    setStatus("✅ Google login successful!");

    if (data.user.role === "admin") {
        navigate("/admin", { replace: true });
    } else {
        navigate("/MainPage", { replace: true });
    }
    } catch (error) {
    console.error(error);
    setStatus("⚠️ Google login failed");
    } finally {
    setLoading(false);
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

        {/* Google login */}
        <div className="SocialLogin">
        <button
            className="GoogleButton"
            onClick={handleGoogleLogin}
            disabled={loading}
        >
            <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google logo"
            className="GoogleLogo"
            />
            Continue with Google
        </button>
        </div>

        <div className="Divider">
        <span>Or, log in with your email</span>
        </div>

        <label className="Label">Email *</label>
        <input
        type="email"
        className="EmailInput"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        />

        <label className="Label">Password *</label>
        <div className="PasswordContainer">
        <input
            type={showPassword ? "text" : "password"}
            className="EmailInput"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
        disabled={!allValid || loading}
        onClick={handleLogin}
        >
        {loading ? "Logging in..." : "Log In"}
        </button>

        {status && <p className="StatusText">{status}</p>}
    </div>
    </div>
);
}

export default Login;
