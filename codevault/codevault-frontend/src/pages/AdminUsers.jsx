import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "../components/modal";
import "../assets/admin.css";
// Uncomment these for syntax highlighting
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function AdminUsers() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [editUser, setEditUser] = useState({
    id: "",
    name: "",
    email: "",
    role: "",
  });

  // Updated states for folder/file viewing
  const [showFoldersModal, setShowFoldersModal] = useState(false);
  const [folders, setFolders] = useState([]);
  const [expandedFolders, setExpandedFolders] = useState({}); // Tracks which folders are expanded
  const [fileDetails, setFileDetails] = useState(null); // Holds details of selected file

  const storedUser = JSON.parse(localStorage.getItem("user")) || {};
  const userRole = storedUser.role || "user";

  const filters = ["All", "Admin", "User"];

  const fetchUsers = async () => {
    setLoading(true);
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

  const filteredUsers = users.filter((user) => {
    if (activeFilter === "All") return true;
    return user.role.toLowerCase() === activeFilter.toLowerCase();
  });

  const handleAddNewUser = () => {
    if (userRole === "admin") setShowAddModal(true);
    else alert("Only admin can add users.");
  };

  const handleSaveUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      alert("All fields are required.");
      return;
    }
    try {
      const res = await axios.post(
        "http://localhost/CodeVault/codevault/codevault-backend/api/add_user.php",
        newUser,
        { withCredentials: true }
      );
      if (res.data.success) {
        alert("User added successfully!");
        setShowAddModal(false);
        setNewUser({ name: "", email: "", password: "", role: "user" });
        fetchUsers();
      } else alert(res.data.message || "Failed to add user.");
    } catch (err) {
      console.error("Error adding user:", err);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditUser({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
    setShowEditModal(true);
  };

  const handleUpdateUser = async () => {
    try {
      const res = await axios.post(
        "http://localhost/CodeVault/codevault/codevault-backend/api/edit_user.php",
        editUser,
        { withCredentials: true }
      );
      if (res.data.success) {
        alert("User updated successfully!");
        setShowEditModal(false);
        fetchUsers();
      } else alert(res.data.message || "Failed to update user.");
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await axios.post(
        "http://localhost/CodeVault/codevault/codevault-backend/api/delete_user.php",
        { id: userId },
        { withCredentials: true }
      );
      if (res.data.success) fetchUsers();
      else alert(res.data.message || "Failed to delete user.");
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const handleFilterChange = (e) => setActiveFilter(e.target.value);

  const handleViewFolders = async (user) => {
    console.log("Fetching folders for user:", user.id);
    setSelectedUser(user);
    setFileDetails(null); // Reset file details when opening folders
    setExpandedFolders({}); // Reset expansions
    try {
      const res = await axios.get(
        `http://localhost/CodeVault/codevault/codevault-backend/api/get_folders.php?user_id=${user.id}`,
        { withCredentials: true }
      );
      console.log("API Response:", res.data);
      if (res.data.success) {
        setFolders(res.data.folders);
        setShowFoldersModal(true);
      } else {
        alert(res.data.message || "Failed to load folders.");
      }
    } catch (err) {
      console.error("Error fetching folders:", err);
      alert("Failed to load folders.");
    }
  };

  // Toggle folder expansion and fetch files if not already loaded
  const handleToggleFolder = async (folder) => {
    const isExpanded = expandedFolders[folder.id];
    setExpandedFolders((prev) => ({
      ...prev,
      [folder.id]: !isExpanded,
    }));
    setFileDetails(null); // Hide file details when toggling folders

    if (!isExpanded && !folder.files) {
      // Fetch files only if not already fetched
      try {
        const res = await axios.get(
          `http://localhost/CodeVault/codevault/codevault-backend/api/get_files.php?user_id=${selectedUser.id}&folder_id=${folder.id}`,
          { withCredentials: true }
        );
        if (res.data.success) {
          setFolders((prevFolders) =>
            prevFolders.map((f) =>
              f.id === folder.id ? { ...f, files: res.data.files } : f
            )
          );
        } else {
          alert(res.data.message || "Failed to load files.");
        }
      } catch (err) {
        console.error("Error fetching files:", err);
        alert("Failed to load files.");
      }
    }
  };

  // Fetch and display file details/content
  const handleViewFileDetails = async (file) => {
    setFileDetails(file); // Show details for this file
    // Attempt to fetch content for overview
    try {
      const res = await axios.get(file.url, { responseType: 'text' }); // Fetch as text
      setFileDetails((prev) => ({ ...prev, content: res.data }));
    } catch (err) {
      console.error("Error fetching file content:", err);
      setFileDetails((prev) => ({ ...prev, content: null, error: "Unable to load content (may be binary or access-restricted)." }));
    }
  };

  // Toggle file details: open if different file, close if same
  const handleFileClick = (file) => {
    if (fileDetails && fileDetails.id === file.id) {
      setFileDetails(null); // Close if the same file is clicked again
    } else {
      handleViewFileDetails(file); // Open details for the new file
    }
  };

  // Helper to determine if file is text/code
  const isTextFile = (filename) => /\.(js|jsx|ts|tsx|php|py|html|css|txt|md|json)$/i.test(filename);

  // Helper to get language for syntax highlighting
  const getLanguage = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    switch (ext) {
      case 'js': return 'javascript';
      case 'jsx': return 'jsx';
      case 'ts': return 'typescript';
      case 'tsx': return 'tsx';
      case 'php': return 'php';
      case 'py': return 'python';
      case 'html': return 'html';
      case 'css': return 'css';
      case 'json': return 'json';
      case 'md': return 'markdown';
      case 'txt': return 'text';
      default: return 'text';
    }
  };

  return (
    <>
      <section className="hero">
        <h2 className="hero-title">User Management</h2>
        <p className="hero-sub">View and manage all registered users on the platform.</p>
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
              style={{ appearance: "none", padding: "8px 24px 8px 12px" }}
            >
              {filters.map((filter) => (
                <option key={filter} value={filter}>
                  {filter} ({users.filter((u) => filter === "All" ? true : u.role.toLowerCase() === filter.toLowerCase()).length})
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
                <th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>#{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`status-badge ${user.role === "admin" ? "approved" : "pending"}`}>{user.role}</span>
                  </td>
                  <td>{new Date(user.created_at).toLocaleString()}</td>
                  <td>
                    <button className="action-btn btn-primary" onClick={() => handleViewFolders(user)}>View Folders</button>
                    <button className="action-btn btn-primary" onClick={() => handleEdit(user)}>Edit</button>
                    <button className="action-btn btn-danger" onClick={() => handleDelete(user.id)}>Delete</button>
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

      {/* Add Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
        <h3 className="modal-header">Add New User</h3>
        <div className="modal-body">
          <input type="text" placeholder="Full Name" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
          <input type="email" placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
          <input type="password" placeholder="Password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
          <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="modal-footer">
          <button className="cancel-btn" onClick={() => setShowAddModal(false)}>Cancel</button>
          <button className="action-btn" onClick={handleSaveUser}>Save</button>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)}>
        <h3 className="modal-header">Edit User</h3>
        <div className="modal-body">
          <input type="text" value={editUser.name} onChange={(e) => setEditUser({ ...editUser, name: e.target.value })} />
          <input type="email" value={editUser.email} onChange={(e) => setEditUser({ ...editUser, email: e.target.value })} />
          <select value={editUser.role} onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="modal-footer">
          <button className="cancel-btn" onClick={() => setShowEditModal(false)}>Cancel</button>
          <button className="action-btn" onClick={handleUpdateUser}>Update</button>
        </div>
      </Modal>

      {/* Folders Modal (Now with Expandable Folders and Inline File Details) */}
      <Modal isOpen={showFoldersModal} onClose={() => setShowFoldersModal(false)}>
        <h3 className="modal-header">Folders for {selectedUser?.name}</h3>
        <div className="modal-body">
          {folders.length > 0 ? (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {folders.map((folder) => (
                <li key={folder.id} style={{ marginBottom: "10px" }}>
                  <button
                    className="action-btn btn-primary"
                    onClick={() => handleToggleFolder(folder)}
                    style={{ width: "100%", textAlign: "left" }}
                  >
                    {expandedFolders[folder.id] ? "▼" : "▶"} {folder.name}
                  </button>
                  {expandedFolders[folder.id] && folder.files && (
                    <ul style={{ listStyle: "none", paddingLeft: "20px", marginTop: "10px" }}>
                      {folder.files.map((file) => (
                        <li key={file.id} style={{ marginBottom: "5px" }}>
                          <button
                            className="action-btn btn-primary"
                            onClick={() => handleFileClick(file)}
                            style={{ fontSize: "14px" }}
                          >
                            {file.filename}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No folders found.</p>
          )}
          {/* File Details Section */}
          {fileDetails && (
            <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}>
              <h4>File Details: {fileDetails.filename}</h4>
              <p><strong>Type:</strong> {fileDetails.type || "N/A"}</p>
              <p><strong>Size:</strong> {fileDetails.size ? `${fileDetails.size} bytes` : "N/A"}</p>
              <p><strong>Uploaded:</strong> {fileDetails.uploaded_at ? new Date(fileDetails.uploaded_at).toLocaleString() : "N/A"}</p>
              <h5>Content Overview:</h5>
              {fileDetails.error ? (
                <p style={{ color: "red" }}>{fileDetails.error}</p>
              ) : fileDetails.content ? (
                isTextFile(fileDetails.filename) ? (
                  <SyntaxHighlighter
                    language={getLanguage(fileDetails.filename)}
                    style={oneDark}
                    customStyle={{
                      backgroundColor: "#2d3748",
                      padding: "10px",
                      borderRadius: "5px",
                      overflow: "auto",
                      maxHeight: "300px",
                      fontSize: "14px"
                    }}
                  >
                    {fileDetails.content}
                  </SyntaxHighlighter>
                ) : (
                  <p>This is a binary file (e.g., image). <a href={fileDetails.url} target="_blank" rel="noopener noreferrer" style={{ color: "#3182ce" }}>Download/View</a></p>
                )
              ) : (
                <p>Loading content...</p>
              )}
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="cancel-btn" onClick={() => setShowFoldersModal(false)}>Close</button>
        </div>
      </Modal>
    </>
  );
}
