import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { FaHome, FaCode, FaProjectDiagram, FaListAlt, FaCog, FaSignOutAlt } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";

function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getActiveNav = () => {
    const path = location.pathname;
    if (path === "/mainpage") return "home";
    if (path.includes("/code-editor")) return "compiler";
    if (path.includes("/projects")) return "myprojects";
    if (path.includes("/folders")) return "folders";
    return "home";
  };

  const activeNav = getActiveNav();

  return (
    <div className="user-app">
      {/* Top Navigation Bar */}
      <div className="user-topnav">
        <div className="top-left">
          <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <GiHamburgerMenu size={20} />
          </button>
          <div className="brand">CodeVault</div>
        </div>
        <div className="user-badge">User</div>
      </div>

      {/* Sidebar - Desktop */}
      {!isMobile && (
        <div className={`user-sidebar ${!sidebarOpen ? 'closed' : ''}`}>
          <div className="sidebar-inner">
            <div className="brand-mini">CodeVault</div>
            
            <nav className="side-nav">
              <button 
                className={`side-btn ${activeNav === 'home' ? 'active' : ''}`}
                onClick={() => navigate('/mainpage')}
              >
                <FaHome size={20} />
                <span>Home</span>
              </button>
              <button 
                className={`side-btn ${activeNav === 'compiler' ? 'active' : ''}`}
                onClick={() => navigate('/code-editor')}
              >
                <FaCode size={20} />
                <span>Compiler</span>
              </button>
              <button 
                className={`side-btn ${activeNav === 'myprojects' ? 'active' : ''}`}
                onClick={() => navigate('/projects')}
              >
                <FaProjectDiagram size={20} />
                <span>My Projects</span>
              </button>
              <button 
                className={`side-btn ${activeNav === 'folders' ? 'active' : ''}`}
                onClick={() => navigate('/folders')}
              >
                <FaListAlt size={20} />
                <span>All Folders</span>
              </button>
            </nav>

            <div className="sidebar-bottom">
              <button className="settings-btn" onClick={() => navigate('/settings')}>
                <FaCog size={20} />
                <span>Settings</span>
              </button>
              <button className="logout-btn" onClick={() => navigate('/login')}>
                <FaSignOutAlt size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <div className="mobile-bottom-nav">
          <button 
            className={`mobile-nav-item ${activeNav === 'home' ? 'active' : ''}`}
            onClick={() => navigate('/mainpage')}
          >
            <FaHome size={22} />
            <span>Home</span>
          </button>
          <button 
            className={`mobile-nav-item ${activeNav === 'compiler' ? 'active' : ''}`}
            onClick={() => navigate('/code-editor')}
          >
            <FaCode size={22} />
            <span>Compiler</span>
          </button>
          <button 
            className={`mobile-nav-item ${activeNav === 'myprojects' ? 'active' : ''}`}
            onClick={() => navigate('/projects')}
          >
            <FaProjectDiagram size={22} />
            <span>Projects</span>
          </button>
          <button 
            className={`mobile-nav-item ${activeNav === 'folders' ? 'active' : ''}`}
            onClick={() => navigate('/folders')}
          >
            <FaListAlt size={22} />
            <span>Folders</span>
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <div className={`user-main ${!sidebarOpen && !isMobile ? 'sidebar-closed' : ''}`}>
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;