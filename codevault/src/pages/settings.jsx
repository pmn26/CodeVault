import React, { useState } from "react";
import "../assets/settings.css";

function Settings() {
  const [activeSection, setActiveSection] = useState("account");

  const renderContent = () => {
    switch (activeSection) {
      case "account":
        return (
          <div className="settings-section">
            <h2>Account Management</h2>
            <p>Update your username, email address, or password.</p>
            <form className="settings-form">
              <label>
                Username:
                <input type="text" placeholder="Enter new username" />
              </label>
              <label>
                Email:
                <input type="email" placeholder="Enter new email" />
              </label>
              <label>
                Password:
                <input type="password" placeholder="Enter new password" />
              </label>
              <button type="button">Save Changes</button>
            </form>
          </div>
        );

      case "subscription":
        return (
          <div className="settings-section">
            <h2>Subscription & Billing</h2>
            <p>Manage your current plan, billing information, and invoices.</p>
            <div className="subscription-info">
              <p><strong>Current Plan:</strong> Free Plan</p>
              <p><strong>Next Billing Date:</strong> N/A</p>
              <button>Upgrade Plan</button>
              <button>View Billing History</button>
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
              <button type="button">Save Preferences</button>
            </form>
          </div>
        );

      case "support":
        return (
          <div className="settings-section">
            <h2>Support & Feedback</h2>
            <p>Need help? Contact us or send feedback about your experience.</p>
            <form className="settings-form">
              <label>
                Message:
                <textarea placeholder="Describe your issue or feedback..." rows="4" />
              </label>
              <button type="button">Send Message</button>
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
        </div>

        <div className="settings-details">{renderContent()}</div>
      </div>
    </div>
  );
}

export default Settings;
