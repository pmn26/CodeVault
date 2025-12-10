import React, { useState } from "react";
import logo from "../assets/CodeVault-icon.png";
import "../assets/loginandsignup.css";
import { useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { auth, provider, signInWithPopup } from "../firebase";
import axios from "axios";

function Signup() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [agreement, setAgreement] = useState(false);
  const [showFields, setShowFields] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // 🔹 Google login + backend integration
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const data = {
        data: [
          { email: user.email, name: user.displayName, password: "google_placeholder" },
        ],
      };

      // Send Google user to PHP backend
      const res = await axios.post(
        "http://localhost/CodeVault/codevault/codevault-backend/api/register.php",
        data,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("✅ Google backend response:", res.data);
      setStatus(res.data.message);
      navigate("/Login");
    } catch (error) {
      console.error("❌ Google Sign-In Error:", error);
      setStatus("⚠️ Google login failed");
    }
  };

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

  const allValid =
    /\S+@\S+\.\S+/.test(email) &&
    name.trim() !== "" &&
    password.trim() !== "" &&
    agreement;

  // 🔹 Email/password registration
  const handleSignup = async () => {
    if (!allValid) return;

    setLoading(true);
    setStatus("");

    const data = {
      data: [{ email, name, password }],
    };

    try {
      const res = await axios.post(
        "http://localhost/CodeVault/codevault/codevault-backend/api/register.php",
        data,
        { headers: { "Content-Type": "application/json" } }
      );

      const message = res.data.message;

      if (message === "User registered successfully") {
        setStatus("✅ Signup successful!");
        navigate("/Login");
      } else {
        setStatus(message || "❌ Failed to register user");
      }
    } catch (error) {
      setStatus(
        error.response?.data?.message || "⚠️ Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
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

        {/* Google login */}
        <div className="SocialLogin">
          <button className="GoogleButton" onClick={handleGoogleLogin}>
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google logo"
              className="GoogleLogo"
            />
            Continue with Google
          </button>
        </div>

        <div className="Divider">
          <span>Or, sign up with your email</span>
        </div>

        <label className="Label">Work email *</label>
        <input
          type="email"
          className="EmailInput"
          placeholder="codevaultG7@gmail.com"
          value={email}
          onChange={handleEmailChange}
        />

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
                onChange={(e) => setPassword(e.target.value)}
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
                onChange={(e) => setAgreement(e.target.checked)}
              />
              <label htmlFor="agreement">
                I agree to CodeVault’s <a href="#">terms of service</a> and{" "}
                <a href="#">privacy policy</a>.
              </label>
            </div>
          </>
        )}

        <button
          className={`GetStarted ${allValid ? "active" : ""}`}
          disabled={!allValid || loading}
          onClick={handleSignup}
        >
          {loading ? "Submitting..." : "Get Started"}
        </button>

        {status && <p className="StatusText">{status}</p>}
      </div>
    </div>
  );
}

export default Signup;
