import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import "../assets/admin.css";

const MenuIcon = () => (<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M3 5h14a1 1 0 010 2H3a1 1 0 110-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2z"/></svg>);
const CloseIcon = () => (<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/></svg>);
const HomeIcon = () => (<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/></svg>);
const UsersIcon = () => (<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/></svg>);
const CodeIcon = () => (<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"/></svg>);
const FolderIcon = () => (<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/></svg>);
const ChartIcon = () => (<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/></svg>);
const SettingsIcon = () => (<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"/></svg>);
const LogoutIcon = () => (<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3h-2V4H4v12h11v-2h2v3a1 1 0 01-1 1H4a1 1 0 01-1-1V3z"/><path fillRule="evenodd" d="M11 10a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"/></svg>);

export default function Admin() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      navigate("/login");
    }
  };

  return (
    <div className="admin-app">
      <header className="admin-topnav">
        <div className="top-left">
          <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
          <h1 className="brand">Dashboard</h1>
        </div>
        <div className="top-actions">
          <span className="admin-badge">Admin</span>
        </div>
      </header>

      <aside className={`admin-sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-inner">
          <div className="brand-mini">{sidebarOpen ? "CodeVault" : "CV"}</div>
          <nav className="side-nav">
            <button className={`side-btn ${isActive("/admin/home") ? "active" : ""}`} onClick={() => navigate("/admin/home")}>
              <HomeIcon /> {sidebarOpen && <span>Home</span>}
            </button>
            <button className={`side-btn ${isActive("/admin/users") ? "active" : ""}`} onClick={() => navigate("/admin/users")}>
              <UsersIcon /> {sidebarOpen && <span>Users</span>}
            </button>
            <button className={`side-btn ${isActive("/admin/content") ? "active" : ""}`} onClick={() => navigate("/admin/content")}>
              <CodeIcon /> {sidebarOpen && <span>Content</span>}
            </button>
            <button className={`side-btn ${isActive("/admin/system-settings") ? "active" : ""}`} onClick={() => navigate("/admin/system-settings")}>
              <FolderIcon /> {sidebarOpen && <span>System Settings</span>}
            </button>
            <button className={`side-btn ${isActive("/admin/analytics") ? "active" : ""}`} onClick={() => navigate("/admin/analytics")}>
              <ChartIcon /> {sidebarOpen && <span>Analytics</span>}
            </button>
          </nav>

          <div className="sidebar-bottom">
            <button className="settings-btn" onClick={() => navigate("/admin/settings")}>
              <SettingsIcon /> {sidebarOpen && <span>Settings</span>}
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              <LogoutIcon /> {sidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      <main className={`admin-main ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
        <Outlet />
      </main>
    </div>
  );
}
