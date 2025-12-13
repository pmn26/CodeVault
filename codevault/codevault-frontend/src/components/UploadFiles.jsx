import React, { useState } from "react";
import { FaUpload, FaTimes } from "react-icons/fa";

function UploadFiles({ onUpload, onClose, folders = [], currentFolderId = null }) {
  const [file, setFile] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState(currentFolderId || "");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file");

    // Determine folder ID
    const folderIdToUse = currentFolderId ? currentFolderId : selectedFolder;
    if (!folderIdToUse) return alert("Please select a folder");

    onUpload(file, folderIdToUse);
    setFile(null);
  };

  return (
    <div className="popup-box upload-popup">
      <button className="close-btn" onClick={onClose}><FaTimes /></button>
      <h3>Upload File</h3>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />

        {file && <p>📄 {file.name}</p>}

        {/* Show folder dropdown only if not inside a folder */}
        {!currentFolderId && (
          <select value={selectedFolder} onChange={(e) => setSelectedFolder(e.target.value)}>
            <option value="">-- Select Folder --</option>
            {folders.map(folder => (
              <option key={folder.id} value={folder.id}>{folder.name}</option>
            ))}
          </select>
        )}

        <button type="submit"><FaUpload /> Upload</button>
      </form>
    </div>
  );
}

export default UploadFiles;
