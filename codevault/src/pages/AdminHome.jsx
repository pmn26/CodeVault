import React from "react";

const AdminHome = () => {
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
          <h3 className="panel-title">Recent Activity</h3>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Action</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Precious Chloe Magpale</td>
              <td>Uploaded document</td>
              <td>2024-12-06 10:30 AM</td>
              <td>
                <span className="status-badge pending">Pending</span>
              </td>
            </tr>
            <tr>
              <td>Paula Mitchel Ng</td>
              <td>Profile updated</td>
              <td>2024-12-06 09:15 AM</td>
              <td>
                <span className="status-badge active">Completed</span>
              </td>
            </tr>
            <tr>
              <td>Chloe Paula</td>
              <td>New submission</td>
              <td>2024-12-05 04:20 PM</td>
              <td>
                <span className="status-badge active">Approved</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </React.Fragment>
  );
};

export default AdminHome;
