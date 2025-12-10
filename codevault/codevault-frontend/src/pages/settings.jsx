import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/settings.css";

function Settings() {
  const [activeSection, setActiveSection] = useState("account");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loggedUser, setLoggedUser] = useState({ id: null, email: "", name: "", password: "" });

  const navigate = useNavigate();

  // --- Load user from sessionStorage/localStorage ---
  const readUserFromStorage = () => {
    try {
      const keys = ["user", "authUser", "currentUser"];
      for (const key of keys) {
        const raw = localStorage.getItem(key) || sessionStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && parsed.id) return parsed;
        }
      }
      return { id: null, email: "", name: "", password: "" };
    } catch {
      return { id: null, email: "", name: "", password: "" };
    }
  };

  useEffect(() => {
    const u = readUserFromStorage();
    setLoggedUser(u);

    // Fetch latest user data from backend
    if (u.id) {
      fetch(`http://localhost/CodeVault/codevault-backend/api/get_user.php?user_id=${u.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setLoggedUser(data.user);
            setUsername(data.user.name);
            setEmail(data.user.email);
          }
        })
        .catch(console.error);
    }
  }, []);

  // --- Handle Account Update ---
  const handleAccountSubmit = async (e) => {
    e.preventDefault();
    if (!loggedUser.id) return;

    setLoading(true);
    setStatus("");

    try {
      const res = await fetch("http://localhost/CodeVault/codevault-backend/api/update_user.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: loggedUser.id,
          name: username,
          email,
          password,
        }),
      });
      const data = await res.json();
      setStatus(data.message || (data.success ? "✅ Account updated!" : "❌ Failed to update."));
      if (data.success) {
        setPassword(""); // clear password field after update
      }
    } catch (err) {
      console.error(err);
      setStatus("⚠️ Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // --- Handle Feedback Submission ---
  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!loggedUser.id) return;

    setLoading(true);
    setStatus("");

    try {
      const res = await fetch("http://localhost/CodeVault/codevault-backend/api/submit_feedback.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: loggedUser.id, message: feedbackMessage }),
      });
      const data = await res.json();
      setStatus(data.message || (data.success ? "✅ Message sent!" : "❌ Failed."));
      if (data.success) setFeedbackMessage("");
    } catch (err) {
      console.error(err);
      setStatus("⚠️ Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // --- Render Section Content ---
  const renderContent = () => {
    switch (activeSection) {
      case "account":
        return (
          <div className="settings-section">
            <h2>Account Management</h2>
            <p>Update your username, email address, or password.</p>

            {loggedUser.email && (
              <div className="user-info-box">
                <p><strong>Email:</strong> {loggedUser.email}</p>
                <p>
                  <strong>Password:</strong>{" "}
                  <span className="masked-password">
                    {showPassword ? loggedUser.password || "••••••••" : "••••••••"}
                  </span>
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
              <button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Changes"}</button>
              {status && <p className="status-message">{status}</p>}
            </form>
          </div>
        );

      case "subscription":
        return (
          <div className="settings-section">
            <h2>Subscription & Billing</h2>
            <p>Manage your plan or upgrade.</p>
            <div className="subscription-info">
              <p><strong>Current Plan:</strong> Free Plan</p>
              <p><strong>Next Billing Date:</strong> N/A</p>
              <button className="uniform-btn" onClick={() => navigate("/billing")}>Upgrade Plan</button>
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
              {status && <p className="status-message">{status}</p>}
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
          <button className={activeSection === "admin" ? "active" : ""} onClick={() => navigate("/admin")}>Admin Panel</button>
        </div>

        <div className="settings-details">{renderContent()}</div>
      </div>
    </div>
  );
}

export default Settings;
