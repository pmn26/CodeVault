import React, { useState, useRef, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/CODEVAULT-LOGO.png";
import { FaBell, FaUserCircle, FaCog, FaSignOutAlt, FaBars } from "react-icons/fa";
import "../assets/dashboard.css";
import "../assets/mainpage.css";

function DashboardLayout() {
const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
const [showNotifications, setShowNotifications] = useState(false);
const [showProfileDropdown, setShowProfileDropdown] = useState(false);
const [activeTab, setActiveTab] = useState("general");

const notificationRef = useRef(null);
const profileRef = useRef(null);
const location = useLocation();
const navigate = useNavigate();

useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
}, []);

useEffect(() => {
    const handleClickOutside = (event) => {
    if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
    }
    if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
    }
    if (mobileMenuOpen && isMobile && !event.target.closest(".mobile-sidebar") && !event.target.closest(".top-nav")) {
        setMobileMenuOpen(false);
    }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
}, [mobileMenuOpen, isMobile]);

const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowProfileDropdown(false);
};

const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
    setShowNotifications(false);
};

const renderNotificationContent = () => {
    switch (activeTab) {
    case "general":
        return <p>No general notifications yet.</p>;
    case "mentions":
        return <p>No mentions yet.</p>;
    case "inbox":
        return <p>Your inbox is empty.</p>;
    case "archive":
        return <p>No archived messages.</p>;
    default:
        return <p>No notifications yet.</p>;
    }
};

const sidebarContent = (
    <div className="nav-buttons">
    <Link to="/mainpage">
        <button className={location.pathname === "/mainpage" ? "active" : ""}>Home</button>
    </Link>
    <Link to="/code-editor">
        <button className={location.pathname === "/code-editor" ? "active" : ""}>Compiler</button>
    </Link>
    <Link to="/folders">
        <button className={location.pathname === "/folders" ? "active" : ""}>My Projects</button>
    </Link>
    <Link to="/projects">
        <button className={location.pathname === "/projects" ? "active" : ""}>All Projects</button>
    </Link>
    </div>
);

return (
    <div className="app-container">
    {/* DESKTOP SIDEBAR */}
    {!isMobile && (
        <div className="sidebar open">
        <div className="sidebar-header" style={{ position: "relative" }}>
            <img src={logo} alt="CodeVault" className="logo-img" />
            {/* Notification Icon upper-right */}
            <div
            ref={notificationRef}
            style={{ position: "absolute", top: 0, right: 0, cursor: "pointer" }}
            >
            <FaBell size={22} onClick={toggleNotifications} />
            {showNotifications && (
                <div className="notification-dropdown" style={{ right: "-320px", top: "0px" }}>
                <h4>Notifications</h4>
                <div className="notification-tabs">
                    <button className={activeTab === "general" ? "active" : ""} onClick={() => setActiveTab("general")}>General</button>
                    <button className={activeTab === "mentions" ? "active" : ""} onClick={() => setActiveTab("mentions")}>Mentions</button>
                    <button className={activeTab === "inbox" ? "active" : ""} onClick={() => setActiveTab("inbox")}>Inbox</button>
                    <button className={activeTab === "archive" ? "active" : ""} onClick={() => setActiveTab("archive")}>Archive</button>
                </div>
                <div className="notification-content">{renderNotificationContent()}</div>
                </div>
            )}
            </div>
        </div>

        {sidebarContent}

        {/* Settings/Profile Icon bottom-right */}
        <div style={{ marginTop: "auto", display: "flex", justifyContent: "flex-end" }}>
            <div ref={profileRef} style={{ cursor: "pointer" }}>
            <FaCog size={22} onClick={toggleProfileDropdown} />
            {showProfileDropdown && (
                <div className="profile-dropdown" style={{ right: "50px", bottom: "40px" }}>
                <button className="profile-item" onClick={() => navigate("/settings")}>
                    <FaCog className="profile-icon" /> Settings
                </button>
                <button className="profile-item logout" onClick={() => navigate("/")}>
                    <FaSignOutAlt className="profile-icon" /> Logout
                </button>
                </div>
            )}
            </div>
        </div>
        </div>
    )}

    {/* MOBILE TOP NAV */}
{isMobile && (
<div className="top-nav">
    <div className="nav-left">
    <img src={logo} alt="CodeVault" className="logo-img" />
    </div>

    <div className="nav-right">
    <div className="icons">
        {/* Notifications */}
        <div className="notification-wrapper" ref={notificationRef}>
        <FaBell className="icon-btn" onClick={toggleNotifications} />
        {showNotifications && (
            <div className="notification-dropdown">
            <h4>Notifications</h4>
            <div className="notification-tabs">
                <button
                className={activeTab === "general" ? "active" : ""}
                onClick={() => setActiveTab("general")}
                >
                General
                </button>
                <button
                className={activeTab === "mentions" ? "active" : ""}
                onClick={() => setActiveTab("mentions")}
                >
                Mentions
                </button>
                <button
                className={activeTab === "inbox" ? "active" : ""}
                onClick={() => setActiveTab("inbox")}
                >
                Inbox
                </button>
                <button
                className={activeTab === "archive" ? "active" : ""}
                onClick={() => setActiveTab("archive")}
                >
                Archive
                </button>
            </div>
            <div className="notification-content">{renderNotificationContent()}</div>
            </div>
        )}
        </div>
    </div>
    </div>

    {/* Mobile Dropdown Menu */}
    {mobileMenuOpen && (
    <div className="mobile-dropdown-menu">
        {sidebarContent}
    </div>
    )}
</div>
)}

{isMobile && (
  <div className="bottom-nav">
    <Link to="/mainpage" className={`bottom-nav-item ${location.pathname === "/mainpage" ? "active" : ""}`}>
      <span className="material-icons">home</span>
      <p>Home</p>
    </Link>
    <Link to="/code-editor" className={`bottom-nav-item ${location.pathname === "/code-editor" ? "active" : ""}`}>
      <span className="material-icons">code</span>
      <p>Compiler</p>
    </Link>
    <Link to="/folders" className={`bottom-nav-item ${location.pathname === "/folders" ? "active" : ""}`}>
      <span className="material-icons">folder</span>
      <p>My Projects</p>
    </Link>
    <Link to="/projects" className={`bottom-nav-item ${location.pathname === "/projects" ? "active" : ""}`}>
      <span className="material-icons">apps</span>
      <p>All Projects</p>
    </Link>
  </div>
)}

    <div className={`main-content ${!isMobile && "shifted"}`}>
        <Outlet />
    </div>
    </div>
);
}

export default DashboardLayout;
