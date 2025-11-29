import React, { useState } from "react";

function CreateFolder({ onSubmit }) {
  const [folderName, setFolderName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(folderName);
    setFolderName("");
  };

  return (
    <div className="popup-box">
      <h3>Create New Folder</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter folder name"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
        />
        <button type="submit" className="create-folder-btn">
          Create Folder
        </button>
      </form>
    </div>
  );
}

export default CreateFolder;
