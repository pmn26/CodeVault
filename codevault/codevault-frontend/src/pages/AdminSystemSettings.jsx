import React, { useEffect, useState } from "react";

export default function AdminSystemSettings() {
  const [maintenanceMode, setMaintenanceMode] = useState("Disabled");
  const [loading, setLoading] = useState(false);

  /* ===============================
    LOAD CURRENT SETTING
  ================================ */
  useEffect(() => {
    fetch("http://localhost/CodeVault/codevault/codevault-backend/api/get_system_settings.php", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMaintenanceMode(
            data.maintenance_mode === 1 ? "Enabled" : "Disabled"
          );
        }
      })
      .catch(() => {
        alert("Failed to load system settings");
      });
  }, []);

  /* ===============================
    SAVE MAINTENANCE MODE
  ================================ */
  const handleSave = async () => {
    setLoading(true);

    const response = await fetch(
      "http://localhost/CodeVault/codevault/codevault-backend/api/update_maintenance_mode.php",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          maintenance_mode: maintenanceMode === "Enabled" ? 1 : 0,
        }),
      }
    );

    const data = await response.json();
    setLoading(false);

    if (data.success) {
      alert("Maintenance mode updated successfully!");
    } else {
      alert(data.message || "Failed to update maintenance mode");
    }
  };

  return (
    <>
      <section className="hero">
        <h2 className="hero-title">System Settings</h2>
        <p className="hero-sub">
          Control critical system-wide configuration.
        </p>
      </section>

      <div className="panel">
        <div className="panel-header">
          <h3 className="panel-title">Maintenance Mode</h3>
        </div>

        <div className="form-group">
          <label className="form-label">System Status</label>
          <select
            className="form-select"
            value={maintenanceMode}
            onChange={(e) => setMaintenanceMode(e.target.value)}
          >
            <option value="Disabled">Disabled</option>
            <option value="Enabled">Enabled</option>
          </select>
        </div>

        <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>
          When enabled, normal users will be blocked from accessing the system.
          Admins will still have access.
        </p>

        <button
          className="action-btn btn-success"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </>
  );
}
