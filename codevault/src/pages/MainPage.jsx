import { FaFolder } from "react-icons/fa";
import "../assets/mainpage.css";
import "../assets/dashboard.css";
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

  // Handle new folder creation
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

  //Handle file upload
  const handleFileUpload = (file) => {
    console.log("File uploaded:", file.name);
    alert(`File "${file.name}" uploaded successfully!`);
    setUploadOpen(false);
  };

  // Handle folder click → navigate to /folder/:name
  const handleFolderClick = (folderName) => {
    navigate(`/folders/${encodeURIComponent(folderName)}`);
  };

  // Handle project click → navigate to /folder/:name (reuse FolderContent)
  const handleProjectClick = (projectName) => {
    navigate(`/folders/${encodeURIComponent(projectName)}`);
  };

  return (
    <div className="main-page">
      {/*Create Folder Modal */}
      <Modal isOpen={isCreateFolderOpen} onClose={() => setCreateFolderOpen(false)}>
        <CreateFolder onSubmit={handleFolderCreate} />
      </Modal>

      {/*Upload Files Modal */}
      <Modal isOpen={isUploadOpen} onClose={() => setUploadOpen(false)}>
        <UploadFiles onUpload={handleFileUpload} />
      </Modal>

      {/*Welcome / Upload Section */}
      <div className="upload-card">
        <h3>Welcome Back!</h3>
        <p>
          Manage your folders, upload files, and explore your projects with ease.
        </p>
        <a href="/billing#annual" target="_blank" rel="noopener noreferrer">
          <button className="Main-Buttons upgrade">Upgrade</button>
        </a>
      </div>

      {/*Folder & Upload Buttons */}
      <div className="folder-actions">
        <button className="Main-Buttons" onClick={() => setCreateFolderOpen(true)}>
          Create Folder
        </button>
        <button className="Main-Buttons" onClick={() => setUploadOpen(true)}>
          Upload Files
        </button>
      </div>

      {/*Folder + Project Section */}
      <div className="content-section">
        {/* Folders */}
        <div className="folders-area">
          <h4>My Folders</h4>
          <div className="folder-grid">
            {folders.map((folder, index) => (
              <div
                key={index}
                className="folder-card"
                onClick={() => handleFolderClick(folder.name)} 
                title={`Open ${folder.name}`}
              >
                <FaFolder size={40} className="folder-icon" />
                <p>{folder.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Projects */}
        <div className="projects-area">
          <h4>My Projects</h4>
          <div className="project-grid">
            {projects.map((project, index) => (
              <div
                key={index}
                className="project-card"
                onClick={() => handleProjectClick(project.name)} 
                title={`Open ${project.name}`}
              >
                <p>{project.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
