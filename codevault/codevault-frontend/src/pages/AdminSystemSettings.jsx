import React from "react";

export default function AdminSystemSettings() {
  const handleSave = (section) => {
    alert(`${section} settings saved successfully!`);
  };

  return (
    <>
      <section className="hero">
        <h2 className="hero-title">System Settings</h2>
        <p className="hero-sub">Configure platform settings, security, and system preferences.</p>
      </section>

      <div className="panel">
        <div className="panel-header">
          <h3 className="panel-title">General Settings</h3>
        </div>
        <div className="form-group">
          <label className="form-label">Platform Name</label>
          <input type="text" className="form-input" defaultValue="CodeVault" />
        </div>
        <div className="form-group">
          <label className="form-label">Platform Description</label>
          <textarea className="form-textarea" defaultValue="A secure platform for code collaboration"></textarea>
        </div>
        <div className="form-group">
          <label className="form-label">Maintenance Mode</label>
          <select className="form-select">
            <option>Disabled</option>
            <option>Enabled</option>
          </select>
        </div>
        <button className="action-btn btn-success" onClick={() => handleSave("General")}>
          Save Changes
        </button>
      </div>

      <div className="panel">
        <div className="panel-header">
          <h3 className="panel-title">Security Settings</h3>
        </div>
        <div className="form-group">
          <label className="form-label">Two-Factor Authentication</label>
          <select className="form-select">
            <option>Optional</option>
            <option>Required</option>
            <option>Disabled</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Password Policy</label>
          <select className="form-select">
            <option>Strong (12+ characters, mixed case, numbers, symbols)</option>
            <option>Medium (8+ characters, mixed case, numbers)</option>
            <option>Basic (6+ characters)</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Session Timeout (minutes)</label>
          <input type="number" className="form-input" defaultValue="30" />
        </div>
        <button className="action-btn btn-success" onClick={() => handleSave("Security")}>
          Save Changes
        </button>
      </div>

      <div className="panel">
        <div className="panel-header">
          <h3 className="panel-title">Email Settings</h3>
        </div>
        <div className="form-group">
          <label className="form-label">SMTP Server</label>
          <input type="text" className="form-input" defaultValue="smtp.example.com" />
        </div>
        <div className="form-group">
          <label className="form-label">SMTP Port</label>
          <input type="number" className="form-input" defaultValue="587" />
        </div>
        <div className="form-group">
          <label className="form-label">From Email</label>
          <input type="email" className="form-input" defaultValue="noreply@codevault.com" />
        </div>
        <button className="action-btn btn-success" onClick={() => handleSave("Email")}>
          Save Changes
        </button>
      </div>
    </>
  );
}