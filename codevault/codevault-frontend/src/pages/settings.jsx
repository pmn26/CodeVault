import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/settings.css";

function Settings() {
  const [activeSection, setActiveSection] = useState("account");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loggedUser, setLoggedUser] = useState({ id: null, email: "", name: "", password: "", verified: 0 });
  const [planStatus, setPlanStatus] = useState("default"); // "default" or "premium"

  const [showVerifyPopup, setShowVerifyPopup] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [timer, setTimer] = useState(0);

  const navigate = useNavigate();
  const API_BASE = "http://localhost/CodeVault/codevault-backend/api";

  // --- Load user ---
  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user")) || { id: null };
    setLoggedUser(u);
    if (u.id) {
      fetch(`${API_BASE}/get_user.php?user_id=${u.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setLoggedUser(data.user);
            setUsername(data.user.name);
            setEmail(data.user.email);
            setPlanStatus(data.user.status);
          }
        })
        .catch(console.error);
    }
  }, []);

  // --- Send verification code ---
  const handleSendVerification = async () => {
    if (!loggedUser.email) return alert("No email found for this account.");
    setTimer(30); // cooldown for resending

    try {
      const res = await fetch(`${API_BASE}/send_verification.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loggedUser.email }),
      });
      const data = await res.json();
      if (data.success) {
        alert("✅ Verification code sent! Check your email.");
        console.log("Debug code (for testing):", data.debug_code);
      } else {
        alert("❌ " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Failed to send verification email.");
    }
  };

  // --- Timer countdown ---
  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // --- Verify email ---
  const handleVerifyCode = async () => {
    try {
      const res = await fetch(`${API_BASE}/verify_email.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loggedUser.email, code: verificationCode }),
      });
      const data = await res.json();
      if (data.success) {
        alert("✅ Email verified successfully!");
        setLoggedUser((prev) => ({ ...prev, verified: 1 }));
        setShowVerifyPopup(false);
      } else {
        alert("❌ " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Failed to verify email.");
    }
  };

  // --- Account update ---
  const handleAccountSubmit = async (e) => {
    e.preventDefault();
    if (!loggedUser.id) return;

    setLoading(true);
    setStatusMessage("");

    try {
      const res = await fetch(`${API_BASE}/update_user.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: loggedUser.id, name: username, email, password }),
      });
      const data = await res.json();
      setStatusMessage(data.message || (data.success ? "✅ Account updated!" : "❌ Failed to update."));
      if (data.success) setPassword("");
    } catch (err) {
      console.error(err);
      setStatusMessage("⚠️ Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // --- Feedback ---
  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!loggedUser.id) return;

    setLoading(true);
    setStatusMessage("");

    try {
      const res = await fetch(`${API_BASE}/submit_feedback.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: loggedUser.id, message: feedbackMessage }),
      });
      const data = await res.json();
      setStatusMessage(data.message || (data.success ? "✅ Message sent!" : "❌ Failed."));
      if (data.success) setFeedbackMessage("");
    } catch (err) {
      console.error(err);
      setStatusMessage("⚠️ Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // --- Render content ---
  const renderContent = () => {
    switch (activeSection) {
      case "account":
        return (
          <div className="settings-section">
            <h2>Account Management</h2>
            <p>Update your username, email, or password.</p>

            {loggedUser.email && (
              <div className="user-info-box">
                <p className="email-line">
                  <strong>Email:</strong> {loggedUser.email}
                  {!loggedUser.verified && (
                    <span className="verify-warning" onClick={() => setShowVerifyPopup(true)}>
                      ⚠ Verify your email
                    </span>
                  )}
                </p>
                <p>
                  <strong>Password:</strong>{" "}
                  <span className="masked-password">{showPassword ? loggedUser.password || "••••••••" : "••••••••"}</span>
                  <button type="button" className="password-toggle" onClick={() => setShowPassword((s) => !s)}>
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </p>
              </div>
            )}

            <form className="settings-form" onSubmit={handleAccountSubmit}>
              <label>
                Username:
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
              </label>
              <label>
                Email:
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </label>
              <label>
                Password:
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </label>
              <button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </button>
              {statusMessage && <p className="status-message">{statusMessage}</p>}
            </form>

            {/* Verification Popup */}
            {showVerifyPopup && (
              <div className="popup-overlay">
                <div className="popup-box">
                  <h3>Verify Your Email</h3>
                  <p>Enter the code sent to your email.</p>
                  <input
                    type="text"
                    placeholder="Enter verification code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                  />
                  <div className="popup-buttons">
                    <button onClick={handleVerifyCode}>Verify</button>
                    <button onClick={handleSendVerification} disabled={timer > 0}>
                      {timer > 0 ? `Resend in ${timer}s` : "Send Verification Code"}
                    </button>
                    <button onClick={() => setShowVerifyPopup(false)}>Close</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case "subscription":
        return (
          <div className="settings-section">
            <h2>Subscription & Billing</h2>
            <div className="subscription-info">
              <p>
                <strong>Current Plan:</strong> {planStatus === "premium" ? "🌟 Premium Plan" : "Free Plan"}
              </p>
              <p>
                <strong>Next Billing Date:</strong> {planStatus === "premium" ? "Next month" : "N/A"}
              </p>
              {planStatus !== "premium" && (
                <button className="uniform-btn" onClick={() => navigate("/billing")}>Upgrade to Premium</button>
              )}
            </div>
          </div>
        );

      case "privacy":
        return (
          <div className="settings-section">
            <h2>Privacy Settings</h2>
            <form className="settings-form">
              <label><input type="checkbox" /> Allow others to see my profile</label>
              <label><input type="checkbox" /> Enable two-factor authentication</label>
              <label><input type="checkbox" /> Receive security alerts</label>
              <button type="button" className="uniform-btn">Save Preferences</button>
            </form>
          </div>
        );

      case "support":
        return (
          <div className="settings-section">
            <h2>Support & Feedback</h2>
            <form className="settings-form" onSubmit={handleFeedbackSubmit}>
              <label>
                Message:
                <textarea rows="4" value={feedbackMessage} onChange={(e) => setFeedbackMessage(e.target.value)} required />
              </label>
              <button type="submit" disabled={loading} className="uniform-btn">
                {loading ? "Sending..." : "Send Message"}
              </button>
              {statusMessage && <p className="status-message">{statusMessage}</p>}
            </form>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="settings-container">
      <h1 className="settings-title">Settings</h1>
      <div className="settings-content">
        <div className="settings-menu">
          <button className={activeSection === "account" ? "active" : ""} onClick={() => setActiveSection("account")}>Account Management</button>
          <button className={activeSection === "subscription" ? "active" : ""} onClick={() => setActiveSection("subscription")}>Subscription & Billing</button>
          <button className={activeSection === "privacy" ? "active" : ""} onClick={() => setActiveSection("privacy")}>Privacy Settings</button>
          <button className={activeSection === "support" ? "active" : ""} onClick={() => setActiveSection("support")}>Support & Feedback</button>
          <button onClick={() => navigate("/admin")}>Admin Panel</button>
        </div>

        <div className="settings-details">{renderContent()}</div>
      </div>
    </div>
  );
}

export default Settings;
