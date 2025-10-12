import React from "react";
import { FaFolder } from "react-icons/fa";
import "../assets/mainpage.css";
import "../assets/dashboard.css";

function MainPage() {
  return (
    <div className="main-page">
      {/* Upload Card */}
      <div className="upload-card">
        <h3>Lorem Ipsum</h3>
        <p>Lorem ipsum Lorem ipsum Lorem ipsumDSFSDF</p>
        <button className="Main-Buttons upgrade">Upgrade</button>
      </div>

      {/* Folder Actions */}
      <div className="folder-actions">
        <button className="Main-Buttons">Create Folder</button>
        <button className="Main-Buttons">Upload Files</button>
      </div>

      {/* Folder + Project Grid */}
      <div className="content-section">
        <div className="folders-area">
          <h4>My folders</h4>
          <div className="folder-grid">
            <div className="folder-card">
              <FaFolder size={40} className="folder-icon" />
              <p>Python</p>
            </div>
            <div className="folder-card">
              <FaFolder size={40} className="folder-icon" />
              <p>Java</p>
            </div>
            <div className="folder-card">
              <FaFolder size={40} className="folder-icon" />
              <p>HTML</p>
            </div>
            <div className="folder-card">
              <FaFolder size={40} className="folder-icon" />
              <p>C#</p>
            </div>
          </div>
        </div>

        <div className="projects-area">
          <h4>My projects</h4>
          <div className="project-grid">
            <div className="project-card">
              <p>Ordering App</p>
            </div>
            <div className="project-card">
              <p>BMI Calculator</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
