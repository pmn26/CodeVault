import React, { useState } from "react";
import "../assets/admin.css";
import { FaUsers, FaCheck, FaTrash, FaShieldAlt, FaFileAlt } from "react-icons/fa";

const mockUsers = [
  { id: 1, name: "Precious Chloe Magpale", status: "active", email: "chloe@example.com", joinDate: "2024-01-15" },
  { id: 2, name: "Paula Mitchel Ng", status: "blocked", email: "paula@example.com", joinDate: "2024-02-20" },
  { id: 3, name: "Chloe Paula", status: "active", email: "chpau@example.com", joinDate: "2024-03-10" },
];

const mockUploads = {
  1: [
    { id: 101, filename: "document1.pdf", approved: false, size: "120KB", uploadDate: "2024-11-20" },
    { id: 102, filename: "picture.jpg", approved: true, size: "450KB", uploadDate: "2024-11-18" }
  ],
  2: [
    { id: 103, filename: "id_card.png", approved: false, size: "80KB", uploadDate: "2024-11-15" }
  ],
  3: []
};

// SVG Icons as components
const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3 5h14a1 1 0 010 2H3a1 1 0 110-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2z"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/>
  </svg>
);

const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
  </svg>
);

const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
  </svg>
);

const CodeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"/>
  </svg>
);

const FolderIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/>
  </svg>
);

const FolderOpenIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1H8a3 3 0 00-3 3v1.5a1.5 1.5 0 01-3 0V6z"/>
    <path d="M6 12a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2H2h2a2 2 0 002-2v-2z"/>
  </svg>
);

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"/>
  </svg>
);

const LogoutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 4.414l-4.293 4.293a1 1 0 01-1.414 0L4 7.414 5.414 6l3.293 3.293L13 5l1 1.414z"/>
    <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3h-2V4H4v12h11v-2h2v3a1 1 0 01-1 1H4a1 1 0 01-1-1V3z"/>
    <path fillRule="evenodd" d="M11 10a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"/>
  </svg>
);

const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
  </svg>
);

const FileIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"/>
  </svg>
);

export default function AdminPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState("users");

  const handleApproveFile = async (userId, fileId) => {
    try {

      console.log(`Approving file ${fileId} for user ${userId}`);
      alert(`File approved successfully!`);
    } catch (error) {
      console.error("Error approving file:", error);
      alert("Failed to approve file");
    }
  };

  const handleDeleteFile = async (userId, fileId) => {
    if (!confirm("Are you sure you want to delete this file?")) return;
    
    try {
      console.log(`Deleting file ${fileId} for user ${userId}`);
      alert(`File deleted successfully!`);
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("Failed to delete file");
    }
  };

  const handleToggleWhitelist = async (userId, currentStatus) => {
    const action = currentStatus === "active" ? "block" : "unblock";
    if (!confirm(`Are you sure you want to ${action} this user?`)) return;
    
    try {
      console.log(`${action}ing user ${userId}`);
      alert(`User ${action}ed successfully!`);
    } catch (error) {
      console.error("Error updating whitelist:", error);
      alert("Failed to update user status");
    }
  };

  const handleNavigate = (path) => {
    console.log(`Navigating to: ${path}`);
    setActiveTab(path);
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      console.log("Logging out...");
      alert("Logged out successfully");
    }
  };

  return (
    <div className="admin-app">
      {/* TOP NAV */}
      <header className="admin-topnav">
        <div className="top-left">
          <button
            className="hamburger"
            aria-label="toggle sidebar"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
          <h1 className="brand">Dashboard</h1>
        </div>

        <div className="top-actions">
          <span className="admin-badge">Admin</span>
        </div>
      </header>

      {/* SIDEBAR */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-inner">
          <div className="brand-mini">
            {sidebarOpen ? "CodeVault" : "CV"}
          </div>

          <nav className="side-nav">
            <button 
              className={`side-btn ${activeTab === "home" ? "active" : ""}`}
              onClick={() => handleNavigate("home")}
              title="Home"
            >
              <HomeIcon />
              {sidebarOpen && <span>Home</span>}
            </button>

            <button 
              className={`side-btn ${activeTab === "users" ? "active" : ""}`}
              onClick={() => handleNavigate("users")}
              title="Users"
            >
              <UsersIcon />
              {sidebarOpen && <span>Users</span>}
            </button>
    
            
            <button 
              className={`side-btn ${activeTab === "content" ? "active" : ""}`}
              onClick={() => handleNavigate("Content")}
              title="Content"
            >
              <CodeIcon />
              {sidebarOpen && <span>Content</span>}
            </button>
            
            <button 
              className={`side-btn ${activeTab === "System Settings" ? "active" : ""}`}
              onClick={() => handleNavigate("System Settings")}
              title="System Settings"
            >
              <FolderIcon />
              {sidebarOpen && <span>System Settings</span>}
            </button>
            
            <button 
              className={`side-btn ${activeTab === "analytics" ? "active" : ""}`}
              onClick={() => handleNavigate("Analytics")}
              title="Analytics"
            >
              <FolderOpenIcon />
              {sidebarOpen && <span>Analytics</span>}
            </button>
          </nav>

          <div className="sidebar-bottom">
            <button 
              className="settings-btn"
              onClick={() => handleNavigate("settings")}
              title="Settings"
            >
              <SettingsIcon />
              {sidebarOpen && <span>Settings</span>}
            </button>
            
            <button 
              className="logout-btn"
              onClick={handleLogout}
              title="Logout"
            >
              <LogoutIcon />
              {sidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className={`admin-main ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
        <section className="hero">
          <h2 className="hero-title">Welcome, Admin</h2>
          <p className="hero-sub">Manage accounts, review uploads, and keep the platform secure.</p>
          <button className="admin-user-btn">Back to User</button>
        </section>

        <div className="grid">
          <div className="left-col">
            <div className="panel users-panel">
              <div className="panel-header">
                <h3 className="panel-title">User List</h3>
                <span className="panel-count">{mockUsers.length}</span>
              </div>

              <div className="admin-user-list">
                {mockUsers.map(user => (
                  <div
                    key={user.id}
                    className={`admin-user-card ${selectedUser && selectedUser.id === user.id ? "selected" : ""}`}
                    onClick={() => setSelectedUser(user)}
                  >
                    <div className="user-icon"><UsersIcon /></div>
                    <div className="user-meta">
                      <div className="user-name">{user.name}</div>
                      <div className="user-sub">Member since 2024</div>
                    </div>

                    <div className="status-wrap">
                      <span className={`status-badge ${user.status}`}>{user.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="right-col">
            <div className="panel files-panel">
              <div className="panel-header">
                <h3 className="panel-title">Uploads</h3>
                <span className="panel-sub">Recent files</span>
              </div>

              {selectedUser ? (
                <div className="user-files-container">
                  <h4 className="files-for">Files uploaded by <strong>{selectedUser.name}</strong></h4>

                  {mockUploads[selectedUser.id].length === 0 ? (
                    <p className="empty-message">No uploads yet.</p>
                  ) : (
                    <div className="files-list">
                      {mockUploads[selectedUser.id].map(file => (
                        <div key={file.id} className="file-item">
                          <div className="file-left">
                            <FileIcon />
                            <div className="file-info">
                              <div className="file-name">{file.filename}</div>
                              <div className="file-meta">{file.size} • {file.uploadDate}</div>
                            </div>
                          </div>

                          <div className="file-actions">
                            {!file.approved && (
                              <button 
                                className="action-btn approve" 
                                title="Approve"
                                onClick={() => handleApproveFile(selectedUser.id, file.id)}
                              >
                                <CheckIcon />
                              </button>
                            )}
                            {file.approved && (
                              <span className="approved-badge">Approved</span>
                            )}

                            <button 
                              className="action-btn delete" 
                              title="Delete"
                              onClick={() => handleDeleteFile(selectedUser.id, file.id)}
                            >
                              <TrashIcon />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="whitelist-row">
                    <button 
                      className="whitelist-btn"
                      onClick={() => handleToggleWhitelist(selectedUser.id, selectedUser.status)}
                    >
                      <ShieldIcon />
                      <span>
                        {selectedUser.status === "active" ? "Whitelist User" : "Remove from Whitelist"}
                      </span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon"><UsersIcon /></div>
                  <p className="empty-message">Select a user from the left to see uploads and actions.</p>
                </div>
              )}
            </div>
            
          </div>
        </div>
      </main>
          </div>
  );
}