import React, { useState, useEffect } from "react";
import "../assets/settings.css";

function Settings() {
  const API_BASE = "http://localhost/CodeVault/codevault/codevault-backend/api";

  const [activeSection, setActiveSection] = useState("account");
  const [loggedUser, setLoggedUser] = useState(null);

  /* 🔐 Reset password */
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetStep, setResetStep] = useState(1);
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  /* 📧 Verification */
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyCode, setVerifyCode] = useState("");
  const [verifyMessage, setVerifyMessage] = useState("");
  const [cooldown, setCooldown] = useState(0);

  /* 📦 Subscription */
  const [planStatus, setPlanStatus] = useState("Free");

  /* 🆘 Support */
  const [supportSubject, setSupportSubject] = useState("");
  const [supportMessage, setSupportMessage] = useState("");
  const [supportStatus, setSupportStatus] = useState("");

  /* ===============================
     LOAD USER
  =============================== */
  const loadUserData = () => {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (!stored?.id) return;

    fetch(`${API_BASE}/get_user.php?user_id=${stored.id}`)
      .then(res => res.json())
      .then(data => {
        if (!data.success) return;

        const user = {
          ...data.user,
          verified: data.user.verified == 1 ? 1 : 0,
        };

        setLoggedUser(user);
        setPlanStatus(data.user.status || "Free");
        localStorage.setItem("user", JSON.stringify(user));
      })
      .catch(console.error);
  };

  useEffect(() => {
    loadUserData();
  }, []);

  /* ===============================
     SEND VERIFICATION EMAIL
  =============================== */
  const sendVerificationEmail = async () => {
    if (cooldown > 0 || !loggedUser?.email) return;

    try {
      const res = await fetch(`${API_BASE}/send_verification.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loggedUser.email }),
      });

      const data = await res.json();
      setVerifyMessage(data.message);

      if (data.success) {
        setShowVerifyModal(true);
        setCooldown(60);
      }
    } catch (err) {
      setVerifyMessage("❌ Failed to send email");
      console.error(err);
    }
  };

  useEffect(() => {
    if (cooldown === 0) return;
    const timer = setInterval(() => {
      setCooldown(c => (c > 0 ? c - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  /* ===============================
     VERIFY EMAIL CODE
  =============================== */
  const verifyEmailCode = async () => {
    if (!verifyCode.trim()) return;

    try {
      const res = await fetch(`${API_BASE}/verify_email.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loggedUser.email,
          code: verifyCode,
        }),
      });

      const data = await res.json();
      setVerifyMessage(data.message);

      if (data.success) {
        setShowVerifyModal(false);
        setVerifyCode("");
        loadUserData(); // refresh verified status
      }
    } catch (err) {
      setVerifyMessage("❌ Verification failed");
      console.error(err);
    }
  };

  /* ===============================
     RESET PASSWORD
  =============================== */
  const sendResetCode = async () => {
    const res = await fetch(`${API_BASE}/send_reset_code.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: loggedUser.email }),
    });

    const data = await res.json();
    if (data.success) setResetStep(2);
  };

  const resetPassword = async () => {
    const res = await fetch(`${API_BASE}/reset_password.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: loggedUser.email,
        code: resetCode,
        password: newPassword,
      }),
    });

    const data = await res.json();
    if (data.success) {
      setShowResetModal(false);
      setResetStep(1);
      setResetCode("");
      setNewPassword("");
    }
  };

  /* ===============================
     SUPPORT
  =============================== */
  const sendSupportMessage = async () => {
    if (!supportSubject.trim() || !supportMessage.trim()) {
      setSupportStatus("❌ Please fill in all fields");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/support_message.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loggedUser.email,
          subject: supportSubject,
          message: supportMessage,
        }),
      });

      const data = await res.json();
      setSupportStatus(data.message);

      if (data.success) {
        setSupportSubject("");
        setSupportMessage("");
      }
    } catch {
      setSupportStatus("❌ Failed to send message");
    }
  };

  if (!loggedUser) return <p>Loading...</p>;

  return (
    <div className="settings-container">
      <h1 className="settings-title">Settings</h1>

      <div className="settings-content">
        <div className="settings-menu">
          <button onClick={() => setActiveSection("account")}>Account</button>
          <button onClick={() => setActiveSection("subscription")}>Subscription</button>
          <button onClick={() => setActiveSection("support")}>Support</button>
        </div>

        <div className="settings-details">
          {activeSection === "account" && (
            <>
              <p>
                <strong>Verified:</strong>{" "}
                {loggedUser.verified === 1 ? "Yes ✅" : "No ⚠️"}
              </p>

              {loggedUser.verified === 0 && (
                <button
                  className="uniform-btn"
                  disabled={cooldown > 0}
                  onClick={sendVerificationEmail}
                >
                  {cooldown > 0 ? `Resend in ${cooldown}s` : "Verification Email"}
                </button>
              )}

              {loggedUser.verified === 1 && (
                <button className="uniform-btn" onClick={() => setShowResetModal(true)}>
                  Reset Password
                </button>
              )}

            </>
          )}

          {activeSection === "subscription" && (
            <>
              <p><strong>Current Plan:</strong> {planStatus}</p>
              <button className="uniform-btn" disabled>Upgrade Plan</button>
            </>
          )}

          {activeSection === "support" && (
            <>
              <input
                className="form-input"
                placeholder="Subject"
                value={supportSubject}
                onChange={e => setSupportSubject(e.target.value)}
              />
              <textarea
                className="form-textarea"
                placeholder="Describe your issue..."
                value={supportMessage}
                onChange={e => setSupportMessage(e.target.value)}
              />
              <button className="uniform-btn" onClick={sendSupportMessage}>
                Send Message
              </button>
              {supportStatus && <p>{supportStatus}</p>}
            </>
          )}
        </div>
      </div>

      {/* VERIFY MODAL */}
      {showVerifyModal && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>Email Verification</h3>
            <input
              placeholder="Verification Code"
              value={verifyCode}
              onChange={e => setVerifyCode(e.target.value)}
            />
            <button onClick={verifyEmailCode}>Verify</button>
            <p>{verifyMessage}</p>
            <button onClick={() => setShowVerifyModal(false)}>Close</button>
          </div>
        </div>
      )}

      {/* RESET MODAL */}
      {showResetModal && (
        <div className="popup-overlay">
          <div className="popup-box">
            {resetStep === 1 && <button onClick={sendResetCode}>Send Code</button>}
            {resetStep === 2 && (
              <>
                <input value={resetCode} onChange={e => setResetCode(e.target.value)} />
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                />
                <button onClick={resetPassword}>Reset</button>
              </>
            )}
            <button onClick={() => setShowResetModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;
