import React, { useEffect, useState } from "react";

export default function AdminAccountSettings() {
  const API_BASE = "http://localhost/CodeVault/codevault/codevault-backend/api";

  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(false);

  /* 🔐 Reset password */
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetStep, setResetStep] = useState(1);
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  /* ===============================
     LOAD ADMIN (REAL DATA)
  =============================== */
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (!stored?.id) return;

    fetch(`${API_BASE}/get_user.php?user_id=${stored.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) return;

        const rawVerified = data.user.verified;
        const isVerified =
          rawVerified === 1 ||
          rawVerified === "1" ||
          rawVerified === true ||
          rawVerified === "true";

        setAdmin({
          ...data.user,
          verified: isVerified ? 1 : 0,
        });
      })
      .catch((err) => console.error(err));
  }, []);

  if (!admin) return <p>Loading admin profile...</p>;

  /* ===============================
     SEND RESET CODE
  =============================== */
  const sendResetCode = async () => {
    if (admin.verified !== 1) {
      alert("⚠️ Please verify your email first");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/send_reset_code.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: admin.email }),
      });

      const data = await res.json();
      if (data.success) {
        alert("✅ Reset code sent");
        setResetStep(2);
      } else {
        alert(data.message);
      }
    } catch {
      alert("⚠️ Failed to send reset code");
    }
  };

  /* ===============================
     RESET PASSWORD
  =============================== */
  const resetPassword = async () => {
    if (!newPassword.trim()) {
      alert("Password cannot be empty");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/reset_password.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: admin.email,
          code: resetCode,
          password: newPassword,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert("✅ Password reset successful");
        setShowResetModal(false);
        setResetStep(1);
        setResetCode("");
        setNewPassword("");
      } else {
        alert(data.message);
      }
    } catch {
      alert("⚠️ Reset failed");
    }
  };

  /* ===============================
     UI
  =============================== */
  return (
    <>
      <section className="hero">
        <h2 className="hero-title">Account Settings</h2>
        <p className="hero-sub">Manage your admin account and security.</p>
      </section>

      {/* PROFILE */}
      <div className="panel">
        <div className="panel-header">
          <h3 className="panel-title">Profile Information</h3>
        </div>

        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            className="form-input"
            value={admin.name}
            readOnly
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            className="form-input"
            value={admin.email}
            readOnly
          />
        </div>

        <div className="form-group">
          <label className="form-label">Verified</label>
          <input
            className="form-input"
            value={admin.verified === 1 ? "Yes ✅" : "No ⚠️"}
            readOnly
          />
        </div>
      </div>

      {/* PASSWORD */}
      <div className="panel">
        <div className="panel-header">
          <h3 className="panel-title">Change Password</h3>
        </div>

        {admin.verified === 1 ? (
          <button
            className="action-btn btn-success"
            onClick={() => setShowResetModal(true)}
          >
            Reset Password
          </button>
        ) : (
          <p className="text-warning">
            ⚠ Verify your email to reset password
          </p>
        )}
      </div>

      {/* RESET PASSWORD MODAL */}
      {showResetModal && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>Reset Password</h3>

            {resetStep === 1 && (
              <>
                <p>Send reset code to {admin.email}</p>
                <button onClick={sendResetCode}>Send Code</button>
              </>
            )}

            {resetStep === 2 && (
              <>
                <input
                  placeholder="Verification Code"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button onClick={resetPassword}>Reset Password</button>
              </>
            )}

            <button onClick={() => setShowResetModal(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}
