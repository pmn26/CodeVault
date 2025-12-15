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
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpEmail, setOtpEmail] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const data = {
        data: [
          {
            email: user.email,
            name: user.displayName,
            password: null,
            auth_provider: "google"
          }
        ],
        verifyNow: false
      };

      const res = await axios.post(
        "http://localhost/CodeVault/codevault/codevault-backend/api/register.php",
        data,
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.success) {
        setStatus("✅ Google account registered");
        navigate("/Login");
      } else {
        setStatus(res.data.message || "❌ Registration failed");
      }
    } catch (error) {
      console.error("Google Sign-In Error:", error);
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

  const handleGetStartedClick = () => {
    if (!allValid) return;
    setShowConfirmModal(true);
  };

  const handleSignup = async (verifyNow) => {
    setShowConfirmModal(false);
    setLoading(true);
    setStatus("");

    const data = { data: [{ email, name, password }], verifyNow };

    try {
      const res = await axios.post(
        "http://localhost/CodeVault/codevault/codevault-backend/api/register.php",
        data,
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.success) {
        if (verifyNow) {
          setOtpEmail(email);
          setShowOtpModal(true);
          setStatus("✅ OTP sent! Please check your Gmail.");
        } else {
          setStatus("✅ Account created! You can verify your email later.");
          navigate("/Login");
        }
      } else {
        setStatus(res.data.message || "❌ Failed to register user");
      }
    } catch (error) {
      setStatus(
        error.response?.data?.message || "⚠️ Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.trim().length !== 6) {
      setStatus("⚠️ Please enter the 6-digit OTP");
      return;
    }

    setLoading(true);
    setStatus("");

    try {
      const res = await axios.post(
        "http://localhost/CodeVault/codevault/codevault-backend/api/verify_otp.php",
        { email: otpEmail, code: otp },
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.success) {
        setStatus("✅ Email verified! Registration complete.");
        setShowOtpModal(false);
        navigate("/Login");
      } else {
        setStatus(res.data.message || "❌ Invalid OTP");
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
          onClick={handleGetStartedClick}
        >
          {loading ? "Submitting..." : "Get Started"}
        </button>

        {status && <p className="StatusText">{status}</p>}
      </div>

      {showConfirmModal && (
        <div className="OtpModal">
          <div className="OtpContent">
            <h3>Verify your email</h3>
            <p>Do you want to verify your email now or later?</p>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button onClick={() => handleSignup(true)}>Verify Now</button>
              <button onClick={() => handleSignup(false)}>Verify Later</button>
            </div>
            <button onClick={() => setShowConfirmModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      {showOtpModal && (
        <div className="OtpModal">
          <div className="OtpContent">
            <h3>Enter OTP</h3>
            <p>We sent a 6-digit code to {otpEmail}</p>
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="OtpInput"
            />
            <button onClick={handleVerifyOtp} disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
            <button onClick={() => setShowOtpModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Signup;
