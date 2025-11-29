import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/folders.css";
import { FaFolder, FaTimes } from "react-icons/fa";

function FoldersPage() {
  const navigate = useNavigate();

  const [folders, setFolders] = useState([
    { name: "Java" },
    { name: "Python" },
    { name: "HTML" },
    { name: "C#" },
  ]);

  const [showPopup, setShowPopup] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  // Create folder when form is submitted
  const handleCreateFolder = (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) {
      alert("Please enter a folder name.");
      return;
    }
    if (folders.some((f) => f.name.toLowerCase() === newFolderName.toLowerCase())) {
      alert("A folder with that name already exists.");
      return;
    }

    setFolders([...folders, { name: newFolderName }]);
    setNewFolderName("");
    setShowPopup(false);
  };

  return (
    <div className="folders-page">
      <div className="folders-header">
        <h2>My Projects</h2>
        <div className="folders-controls">
          <button className="create-btn" onClick={() => setShowPopup(true)}>
            New Folder
          </button>
        </div>
      </div>

      <div className="folders-grid">
        {folders.map((folder, index) => (
          <div
            key={index}
            className="folder-item"
            onClick={() => navigate(`/folders/${folder.name.toLowerCase()}`)}
          >
            <FaFolder className="folder-icon" />
            <p>{folder.name}</p>
          </div>
        ))}
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <button className="close-btn" onClick={() => setShowPopup(false)}>
              <FaTimes />
            </button>
            <h3>Create New Folder</h3>
            <form onSubmit={handleCreateFolder}>
              <input
                type="text"
                placeholder="Enter folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
              />
              <button type="submit" className="create-folder-btn">
                Create Folder
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default FoldersPage;
