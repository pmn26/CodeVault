import React, { useEffect, useState } from "react";
import axios from "axios";
import "../assets/admin.css";

const AdminHome = () => {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecentUploads = async () => {
    try {
      const response = await axios.get(
        "http://localhost/CodeVault/codevault/codevault-backend/api/recent_uploads.php"
      );
      setUploads(response.data);
    } catch (error) {
      console.error("Error fetching recent uploads:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentUploads();
    const interval = setInterval(fetchRecentUploads, 10000); // auto-refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <React.Fragment>
      <section className="hero">
        <h2 className="hero-title">Welcome, Admin</h2>
        <p className="hero-sub">
          Manage accounts, review uploads, and keep the platform secure.
        </p>
      </section>

      <div className="panel">
        <div className="panel-header">
          <h3 className="panel-title">Recent File Uploads</h3>
        </div>

        {loading ? (
          <p>Loading recent uploads...</p>
        ) : uploads.length === 0 ? (
          <p>No recent uploads found.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>File Name</th>
                <th>Date Uploaded</th>
              </tr>
            </thead>
            <tbody>
              {uploads.map((file) => (
                <tr key={file.id}>
                  <td>{file.uploaded_by}</td>
                  <td>{file.filename}</td>
                  <td>{new Date(file.uploaded_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </React.Fragment>
  );
};

export default AdminHome;
