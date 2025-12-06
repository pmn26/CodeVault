import React, { useState } from "react";

export default function AdminUsers() {
  const [activeFilter, setActiveFilter] = useState("All");

  const allUsers = [
    { id: 1, name: "Precious Chloe Magpale", email: "chloe@example.com", status: "active", joined: "2024-01-15", subscription: "Premium" },
    { id: 2, name: "Paula Mitchel Ng", email: "paula@example.com", status: "blocked", joined: "2024-02-20", subscription: "None" },
    { id: 3, name: "Chloe Paula", email: "chpau@example.com", status: "active", joined: "2024-03-10", subscription: "Basic" },
    { id: 4, name: "John Doe", email: "john@example.com", status: "active", joined: "2024-04-05", subscription: "Premium" },
    { id: 5, name: "Jane Smith", email: "jane@example.com", status: "active", joined: "2024-05-12", subscription: "None" }
  ];

  const filters = ["All", "Active", "Blocked", "Premium", "Basic", "None"];

  const filteredUsers = allUsers.filter(user => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Active" || activeFilter === "Blocked") {
      return user.status.toLowerCase() === activeFilter.toLowerCase();
    }
    return user.subscription === activeFilter;
  });

  const handleEdit = (userId) => {
    alert(`Edit user ${userId}`);
  };

  const handleDelete = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      alert(`User ${userId} deleted`);
    }
  };

  const handleToggleStatus = (userId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "blocked" : "active";
    alert(`User ${userId} status changed to ${newStatus}`);
  };

  const handleAddNewUser = () => {
    alert("Navigating to user creation form...");
  };

  const getSubscriptionBadgeClass = (subscriptionStatus) => {
    switch (subscriptionStatus) {
      case "Premium":
        return "status-badge approved";
      case "Basic":
        return "status-badge pending";
      case "None":
      default:
        return "status-badge blocked";
    }
  };

  const handleFilterChange = (event) => {
    setActiveFilter(event.target.value);
  };

  return (
    <>
      <section className="hero">
        <h2 className="hero-title">User Management</h2>
        <p className="hero-sub">
          View, edit, and manage all user accounts on the platform, including subscription status.
        </p>
      </section>

      <div className="action-bar" style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
        <button className="action-btn btn-primary" onClick={handleAddNewUser}>
          + Add New User
        </button>
      </div>

      <div className="panel">
        <div className="panel-header" style={{ alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <h3 className="panel-title">All Users</h3>

            <select
              value={activeFilter}
              onChange={handleFilterChange}
              className="action-btn btn-primary"
              style={{
                appearance: "none",
                padding: "8px 24px 8px 12px",
                background:
                  "rgba(102, 126, 234, 0.3) url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23a8b3ff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\") no-repeat right 10px center",
                backgroundSize: "12px",
                cursor: "pointer",
                fontSize: "14px",
                minWidth: "150px"
              }}
            >
              {filters.map(filter => (
                <option
                  key={filter}
                  value={filter}
                >
                  {filter} (
                    {allUsers.filter(u =>
                      filter === "All"
                        ? true
                        : filter === "Active" || filter === "Blocked"
                        ? u.status === filter.toLowerCase()
                        : u.subscription === filter
                    ).length}
                  )
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredUsers.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>User Status</th>
                <th>Subscription</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>#{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`status-badge ${user.status}`}>
                      {user.status}
                    </span>
                  </td>

                  <td>
                    <span className={getSubscriptionBadgeClass(user.subscription)}>
                      {user.subscription}
                    </span>
                  </td>

                  <td>{user.joined}</td>

                  <td>
                    <button
                      className="action-btn btn-primary"
                      onClick={() => handleEdit(user.id)}
                    >
                      Edit
                    </button>

                    <button
                      className="action-btn btn-success"
                      onClick={() => handleToggleStatus(user.id, user.status)}
                    >
                      {user.status === "active" ? "Block" : "Unblock"}
                    </button>

                    <button
                      className="action-btn btn-danger"
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ padding: "20px", textAlign: "center", color: "rgba(255,255,255,0.6)" }}>
            No users found for filter: <strong>{activeFilter}</strong>
          </div>
        )}
      </div>
    </>
  );
}
