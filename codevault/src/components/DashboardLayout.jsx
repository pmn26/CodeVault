import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import logo from "../assets/CODEVAULT-LOGO.png";
import { FaBell, FaUserCircle, FaHeadphones, FaCog, FaBars } from "react-icons/fa";
import "../assets/dashboard.css";
import "../assets/mainpage.css";

function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const location = useLocation();

    return (
        <div className="app-container">
            {/* Top Navigation */}
            <div className={`top-nav ${sidebarOpen ? "hidden" : ""}`}>
                <div className="nav-left">
                    <FaBars className="menu-icon" onClick={toggleSidebar} />
                    <img src={logo} alt="CodeVault" className="logo-img" />
                </div>
                <div className="nav-center"></div>
                <div className="nav-right">
                    <div className="search-container">
                        <input type="text" placeholder="Search..." />
                    </div>
                    <div className="nav-right icons">
                        <FaBell />
                        <FaUserCircle />
                    </div>
                </div>
            </div>

            {/* Sidebar */}
            <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
                <div className="sidebar-header">
                    <div className="sidebar-toggle" onClick={toggleSidebar}>
                        <FaBars />
                    </div>
                    <img src={logo} alt="CodeVault" className="logo-img side" />
                </div>
                <div className="nav-buttons">
                    <Link to="/mainpage">
                        <button className={location.pathname === "/mainpage" ? "active" : ""}>Home</button>
                    </Link>
                    <Link to="/code-editor">
                        <button className={location.pathname === "/code-editor" ? "active" : ""}>Compiler</button>
                    </Link>
                    <Link to="/folders">
                        <button className={location.pathname === "/folders" ? "active" : ""}>Folders</button>
                    </Link>
                </div>
                <div className="sidebar-bottom">
                    <button><FaHeadphones /> Support</button>
                    <button><FaCog /> Settings</button>
                </div>
            </div>

            {/* Main Content */}
            <div className={`main-content ${sidebarOpen ? "shifted" : ""}`}>
                <Outlet />
            </div>
        </div>
    );
}

export default DashboardLayout;