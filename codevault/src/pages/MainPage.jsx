import { FaFolder, FaFileAlt } from "react-icons/fa";
import "../assets/DashboardLayout.css"; // Use the new scoped CSS file
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import Modal from "../components/modal";
import CreateFolder from "../components/CreateFolder";
import UploadFiles from "../components/UploadFiles";

function MainPage() {
  const navigate = useNavigate(); 
  const [isCreateFolderOpen, setCreateFolderOpen] = useState(false);
  const [isUploadOpen, setUploadOpen] = useState(false);
  
  const [folders, setFolders] = useState([
    { name: "Python" },
    { name: "Java" },
    { name: "HTML" },
    { name: "C#" },
  ]);

  const [projects, setProjects] = useState([
    { name: "Ordering App" },
    { name: "BMI Calculator" },
  ]);

  const handleFolderCreate = (name) => {
    if (!name.trim()) {
      alert("Please enter a folder name.");
      return;
    }
    if (folders.some((f) => f.name.toLowerCase() === name.toLowerCase())) {
      alert("A folder with that name already exists.");
      return;
    }
    setFolders([...folders, { name }]);
    setCreateFolderOpen(false);
  };

  const handleFileUpload = (file) => {
    console.log("File uploaded:", file.name);
    alert(`File "${file.name}" uploaded successfully!`);
    setUploadOpen(false);
  };

  const handleFolderClick = (folderName) => {
    navigate(`/folders/${encodeURIComponent(folderName)}`);
  };

  const handleProjectClick = (projectName) => {
    navigate(`/folders/${encodeURIComponent(projectName)}`);
  };

  return (
    <>
      {/* Modals */}
      <Modal isOpen={isCreateFolderOpen} onClose={() => setCreateFolderOpen(false)}>
        <CreateFolder onSubmit={handleFolderCreate} />
      </Modal>

      <Modal isOpen={isUploadOpen} onClose={() => setUploadOpen(false)}>
        <UploadFiles onUpload={handleFileUpload} />
      </Modal>

      {/* Hero Welcome Section */}
      <div className="hero">
        <h1 className="hero-title">Welcome Back!</h1>
        <p className="hero-sub">Manage your folders, upload files, and explore your projects with ease.</p>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button className="action-card primary" onClick={() => setCreateFolderOpen(true)}>
          <FaFolder size={32} />
          <span>Create Folder</span>
        </button>
        <button className="action-card secondary" onClick={() => setUploadOpen(true)}>
          <FaFileAlt size={32} />
          <span>Upload Files</span>
        </button>
        <a href="/billing#annual" target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none'}}>
          <button className="action-card upgrade">
            <span style={{fontSize: '32px'}}>⚡</span>
            <span>Upgrade Plan</span>
          </button>
        </a>
      </div>

      {/* Folders Section */}
      <div className="content-section">
        <div className="section-header">
          <h2 className="section-title">My Folders</h2>
        </div>
        <div className="items-grid">
          {folders.map((folder, index) => (
            <div
              key={index}
              className="item-card"
              onClick={() => handleFolderClick(folder.name)} 
            >
              <div className="item-icon-wrapper">
                <FaFolder size={32} />
              </div>
              <p className="item-name">{folder.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Projects Section */}
      <div className="content-section">
        <div className="section-header">
          <h2 className="section-title">My Projects</h2>
        </div>
        <div className="items-grid">
          {projects.map((project, index) => (
            <div
              key={index}
              className="item-card project"
              onClick={() => handleProjectClick(project.name)} 
            >
              <div className="item-icon-wrapper project">
                <FaFileAlt size={28} />
              </div>
              <p className="item-name">{project.name}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default MainPage;