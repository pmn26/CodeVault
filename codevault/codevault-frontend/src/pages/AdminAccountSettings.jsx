import React from "react";

export default function AdminAccountSettings() {
  const handleUpdateProfile = () => {
    alert("Profile updated successfully!");
  };

  const handleChangePassword = () => {
    alert("Password changed successfully!");
  };

  const handleSavePreferences = () => {
    alert("Preferences saved successfully!");
  };

  return (
    <>
      <section className="hero">
        <h2 className="hero-title">Account Settings</h2>
        <p className="hero-sub">Manage your admin account and preferences.</p>
      </section>

      <div className="panel">
        <div className="panel-header">
          <h3 className="panel-title">Profile Information</h3>
        </div>
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input type="text" className="form-input" defaultValue="Admin User" />
        </div>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input type="email" className="form-input" defaultValue="admin@codevault.com" />
        </div>
        <div className="form-group">
          <label className="form-label">Phone Number</label>
          <input type="tel" className="form-input" defaultValue="+1 234 567 8900" />
        </div>
        <button className="action-btn btn-success" onClick={handleUpdateProfile}>
          Update Profile
        </button>
      </div>

      <div className="panel">
        <div className="panel-header">
          <h3 className="panel-title">Change Password</h3>
        </div>
        <div className="form-group">
          <label className="form-label">Current Password</label>
          <input type="password" className="form-input" placeholder="Enter current password" />
        </div>
        <div className="form-group">
          <label className="form-label">New Password</label>
          <input type="password" className="form-input" placeholder="Enter new password" />
        </div>
        <div className="form-group">
          <label className="form-label">Confirm New Password</label>
          <input type="password" className="form-input" placeholder="Confirm new password" />
        </div>
        <button className="action-btn btn-success" onClick={handleChangePassword}>
          Change Password
        </button>
      </div>

      <div className="panel">
        <div className="panel-header">
          <h3 className="panel-title">Notification Preferences</h3>
        </div>
        <div className="form-group">
          <label className="form-label">Email Notifications</label>
          <select className="form-select">
            <option>All notifications</option>
            <option>Important only</option>
            <option>None</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Desktop Notifications</label>
          <select className="form-select">
            <option>Enabled</option>
            <option>Disabled</option>
          </select>
        </div>
        <button className="action-btn btn-success" onClick={handleSavePreferences}>
          Save Preferences
        </button>
      </div>
    </>
  );
}