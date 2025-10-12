import React, { useState, useRef, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/CODEVAULT-LOGO.png";
import { FaBell, FaUserCircle, FaCog, FaBars, FaSignOutAlt } from "react-icons/fa";
import "../assets/dashboard.css";
import "../assets/mainpage.css";

function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [activeTab, setActiveTab] = useState("general");

    const notificationRef = useRef(null);
    const profileRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
        setShowProfileDropdown(false);
    };
    const toggleProfileDropdown = () => {
        setShowProfileDropdown(!showProfileDropdown);
        setShowNotifications(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setShowProfileDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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

    return (
        <div className="app-container">
            {/* 🔹 Top Navigation Bar */}
            <div className={`top-nav ${sidebarOpen ? "hidden" : ""}`}>
                <div className="nav-left">
                    <FaBars className="menu-icon" onClick={toggleSidebar} />
                    <img src={logo} alt="CodeVault" className="logo-img" />
                </div>

                <div className="nav-right">
                    <div className="search-container">
                        <input type="text" placeholder="Search..." />
                    </div>

                    <div className="icons">
                        {/* 🔔 Notifications */}
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
                                    <div className="notification-content">
                                        {renderNotificationContent()}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 👤 Profile Dropdown */}
                        <div className="profile-wrapper" ref={profileRef}>
                            <FaUserCircle
                                className="icon-btn"
                                onClick={toggleProfileDropdown}
                            />
                            {showProfileDropdown && (
                                <div className="profile-dropdown">
                                    <button
                                        className="profile-item"
                                        onClick={() => {
                                            setShowProfileDropdown(false);
                                            navigate("/settings");
                                        }}
                                    >
                                        <FaCog className="profile-icon" /> Settings
                                    </button>

                                    <button
                                        className="profile-item logout"
                                        onClick={() => {
                                            setShowProfileDropdown(false);
                                            navigate("/login");
                                        }}
                                    >
                                        <FaSignOutAlt className="profile-icon" /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* 📁 Sidebar */}
            <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
                <div className="sidebar-header">
                    <div className="sidebar-toggle" onClick={toggleSidebar}>
                        <FaBars />
                    </div>
                    <img src={logo} alt="CodeVault" className="logo-img side" />
                </div>

                <div className="nav-buttons">
                    <Link to="/mainpage">
                        <button className={location.pathname === "/mainpage" ? "active" : ""}>
                            Home
                        </button>
                    </Link>
                    <Link to="/code-editor">
                        <button className={location.pathname === "/code-editor" ? "active" : ""}>
                            Compiler
                        </button>
                    </Link>
                    <Link to="/folders">
                        <button className={location.pathname === "/folders" ? "active" : ""}>
                            Folders
                        </button>
                    </Link>
                    <Link to="/projects">
                        <button className={location.pathname === "/projects" ? "active" : ""}>
                            Projects
                        </button>
                    </Link>
                </div>
            </div>

            {/* 🧠 Main Content */}
            <div className={`main-content ${sidebarOpen ? "shifted" : ""}`}>
                <Outlet />
            </div>
        </div>
    );
}

export default DashboardLayout;
