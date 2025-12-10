import React, { useEffect, useState } from "react";
import axios from "axios";
import "../assets/admin.css";

export default function AdminUsers() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const filters = ["All", "Admin", "User"];

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        "http://localhost/CodeVault/codevault/codevault-backend/api/get_users.php"
      );
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users
  const filteredUsers = users.filter((user) => {
    if (activeFilter === "All") return true;
    return user.role.toLowerCase() === activeFilter.toLowerCase();
  });

  // Action handlers
  const handleEdit = (userId) => alert(`Edit user ${userId}`);
  const handleDelete = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      alert(`User ${userId} deleted`);
    }
  };

  const handleAddNewUser = () => alert("Only admin can add users.");

  const handleFilterChange = (event) => setActiveFilter(event.target.value);

  return (
    <>
      <section className="hero">
        <h2 className="hero-title">User Management</h2>
        <p className="hero-sub">
          View and manage all registered users on the platform.
        </p>
      </section>

      <div
        className="action-bar"
        style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}
      >
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
                minWidth: "150px",
              }}
            >
              {filters.map((filter) => (
                <option key={filter} value={filter}>
                  {filter} (
                  {users.filter((u) =>
                    filter === "All" ? true : u.role.toLowerCase() === filter.toLowerCase()
                  ).length}
                  )
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <p style={{ textAlign: "center", padding: "20px" }}>Loading users...</p>
        ) : filteredUsers.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>#{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        user.role === "admin" ? "approved" : "pending"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td>{new Date(user.created_at).toLocaleString()}</td>

                  <td>
                    <button
                      className="action-btn btn-primary"
                      onClick={() => handleEdit(user.id)}
                    >
                      Edit
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
          <div
            style={{
              padding: "20px",
              textAlign: "center",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            No users found for filter: <strong>{activeFilter}</strong>
          </div>
        )}
      </div>
    </>
  );
}
