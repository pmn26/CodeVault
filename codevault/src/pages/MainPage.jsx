import React from 'react';
import { FaFolder } from 'react-icons/fa';
import '../assets/mainpage.css';
import '../assets/dashboard.css';

function MainPage() {
  return (
    <>
    <div className="main-page">
      <div className="upload-card">
        <h3>Lorem Ipsum</h3>
        <p>Lorem ipsum Lorem ipsum Lorem ipsum</p>
        <button className="Main-Buttons upgrade">Upgrade</button>
      </div>

      <div className="folder-actions">
        <button className="Main-Buttons">Create Folder</button>
        <button className="Main-Buttons">Upload Files</button>
      </div>

      <div className="folders-projects">
        <div className="folder-container">
          <div className="folder-icon"><FaFolder size={50} /></div>
          <p>No folders!</p>
          <small>use the “Create” button</small>
        </div>

        <div className="project-container">
          <div className="project-icon"><FaFolder size={50} /></div>
          <p>No projects!</p>
          <small>use the “Upload” button</small>
        </div>
      </div>
      </div>
    </>
  );
}

export default MainPage;
