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
  const [accountStatus, setAccountStatus] = useState("");

  const [loggedUser, setLoggedUser] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const readUserFromStorage = () => {
    try {
      const possibleKeys = [
        "userEmail",
        "userPassword",
        "email",
        "password",
        "loggedEmail",
        "loggedPassword",
        "user",
        "authUser",
        "currentUser",
      ];

      for (const key of ["user", "authUser", "currentUser"]) {
        const raw = localStorage.getItem(key) || sessionStorage.getItem(key);
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            if (parsed && (parsed.email || parsed.password)) {
              console.log("Settings: found parsed user from key:", key, parsed);
              return {
                email: parsed.email || "",
                password: parsed.password || "",
              };
            }
          } catch (e) {}
        }
      }

      let foundEmail = "";
      let foundPassword = "";
      for (const key of possibleKeys) {
        const valLocal = localStorage.getItem(key);
        const valSession = sessionStorage.getItem(key);
        const val = valLocal ?? valSession;
        if (!val) continue;

        if (key.toLowerCase().includes("email") || val.includes("@")) {
          if (!foundEmail) foundEmail = val;
        } else if (key.toLowerCase().includes("password")) {
          if (!foundPassword) foundPassword = val;
        } else if (!foundEmail && val.includes("@")) {
          foundEmail = val;
        }
      }

      return { email: foundEmail, password: foundPassword };
    } catch (err) {
      console.error("Settings: error reading storage", err);
      return { email: "", password: "" };
    }
  };

  useEffect(() => {
    const u = readUserFromStorage();
    console.log("Settings: readUserFromStorage ->", u);
    if (u.email || u.password) setLoggedUser(u);

    const onStorage = (e) => {
      if (!e) return;
      console.log("Settings: storage event", e.key, e.newValue);
      const updated = readUserFromStorage();
      setLoggedUser(updated);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleAccountSubmit = async (e) => {
    e.preventDefault();
    setAccountStatus("Saving...");
    setLoading(true);

    const data = {
      data: [
        {
          username: username,
          email: email,
          password: password,
        },
      ],
    };

    try {
      const res = await fetch("https://sheetdb.io/api/v1/xdx46pt340y4f", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setAccountStatus("✅ Account details saved successfully!");
        setUsername("");
        setEmail("");
        setPassword("");
      } else {
        setAccountStatus("❌ Failed to save account details. Try again.");
      }
    } catch (error) {
      console.error("⚠️ Error saving account:", error);
      setAccountStatus("⚠️ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    const data = {
      data: [{ message: feedbackMessage }],
    };

    try {
      const res = await fetch("https://sheetdb.io/api/v1/cm9mq6bl5i784", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus("✅ Message sent successfully!");
        setFeedbackMessage("");
      } else {
        setStatus("❌ Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("⚠️ Error sending feedback:", error);
      setStatus("⚠️ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case "account":
        return (
          <div className="settings-section">
            <h2>Account Management</h2>
            <p>Update your username, email address, or password.</p>

            {(loggedUser.email || loggedUser.password) && (
              <div className="user-info-box">
                <p>
                  <strong>Logged in Email:</strong>{" "}
                  {loggedUser.email || <em>Not available</em>}
                </p>
                <p>
                  <strong>Password:</strong>{" "}
                  {loggedUser.password ? (
                    <>
                      <span className="masked-password">
                        {showPassword ? loggedUser.password : "••••••••"}
                      </span>
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword((s) => !s)}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </>
                  ) : (
                    <em>Not available</em>
                  )}
                </p>
              </div>
            )}

            <form className="settings-form" onSubmit={handleAccountSubmit}>
              <label>
                Username:
                <input
                  type="text"
                  placeholder="Enter new username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  placeholder="Enter new email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
              <label>
                Password:
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>
              <button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </button>
              {accountStatus && <p className="status-message">{accountStatus}</p>}
            </form>
          </div>
        );

      case "subscription":
        return (
          <div className="settings-section">
            <h2>Subscription & Billing</h2>
            <p>Manage your current plan and upgrade to premium.</p>
            <div className="subscription-info">
              <p>
                <strong>Current Plan:</strong> Free Plan
              </p>
              <p>
                <strong>Next Billing Date:</strong> N/A
              </p>
              <button
                type="button"
                className="uniform-btn"
                onClick={() => navigate("/billing")}
              >
                Upgrade Plan
              </button>
            </div>
          </div>
        );

      case "privacy":
        return (
          <div className="settings-section">
            <h2>Privacy Settings</h2>
            <p>Manage your data, privacy preferences, and security options.</p>
            <form className="settings-form">
              <label>
                <input type="checkbox" /> Allow others to see my profile
              </label>
              <label>
                <input type="checkbox" /> Enable two-factor authentication
              </label>
              <label>
                <input type="checkbox" /> Receive security alerts
              </label>
              <button type="button" className="uniform-btn">
                Save Preferences
              </button>
            </form>
          </div>
        );

      case "support":
        return (
          <div className="settings-section">
            <h2>Support & Feedback</h2>
            <p>Need help? Send us your message or feedback.</p>
            <form className="settings-form" onSubmit={handleFeedbackSubmit}>
              <label>
                Message:
                <textarea
                  placeholder="Describe your issue or feedback..."
                  rows="4"
                  value={feedbackMessage}
                  onChange={(e) => setFeedbackMessage(e.target.value)}
                  required
                />
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
          <button
            className={activeSection === "account" ? "active" : ""}
            onClick={() => setActiveSection("account")}
          >
            Account Management
          </button>
          <button
            className={activeSection === "subscription" ? "active" : ""}
            onClick={() => setActiveSection("subscription")}
          >
            Subscription & Billing
          </button>
          <button
            className={activeSection === "privacy" ? "active" : ""}
            onClick={() => setActiveSection("privacy")}
          >
            Privacy Settings
          </button>
          <button
            className={activeSection === "support" ? "active" : ""}
            onClick={() => setActiveSection("support")}
          >
            Support & Feedback
          </button>

          {/* ⭐ NEW ADMIN BUTTON ⭐ */}
          <button
            className={activeSection === "admin" ? "active" : ""}
            onClick={() => navigate("/admin")}
          >
            Admin Panel
          </button>
        </div>

        <div className="settings-details">{renderContent()}</div>
      </div>
    </div>
  );
}

export default Settings;
