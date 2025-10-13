import { FaFolder } from "react-icons/fa";
import "../assets/mainpage.css";
import "../assets/dashboard.css";
import React, { useState } from "react";
import Modal from "../components/modal";
import CreateFolder from "../components/CreateFolder";
import UploadFiles from "../components/UploadFiles";

function MainPage() {

  const [isCreateFolderOpen, setCreateFolderOpen] = useState(false);
  const [isUploadOpen, setUploadOpen] = useState(false);

  const handleFolderCreate = (name) => {
    console.log("Folder created:", name);
    setCreateFolderOpen(false); // close modal
  };

  const handleFileUpload = (file) => {
    console.log("File uploaded:", file.name);
    setUploadOpen(false); // close modal
  };

  return (
    <div className="main-page">

      

      {/* Modals */}
      <Modal isOpen={isCreateFolderOpen} onClose={() => setCreateFolderOpen(false)}>
        <CreateFolder onSubmit={handleFolderCreate} />
      </Modal>

      <Modal isOpen={isUploadOpen} onClose={() => setUploadOpen(false)}>
        <UploadFiles onUpload={handleFileUpload} />
      </Modal>

      {/* Upload Card */}
      <div className="upload-card">
        <h3>Lorem Ipsum</h3>
        <p>Lorem ipsum Lorem ipsum Lorem ipsumDSFSDF</p>
        <a href="/billing#annual" target="_blank" rel="noopener noreferrer">
          <button className="Main-Buttons upgrade">Upgrade</button>
        </a>
      </div>

      {/* Folder Actions */}
      <div className="folder-actions">
        <button className="Main-Buttons" onClick={() => setCreateFolderOpen(true)}>
          Create Folder
        </button>
        <button className="Main-Buttons" onClick={() => setUploadOpen(true)}>
          Upload Files
        </button>
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
