import React, { useState } from "react";

const CreateFolder = ({ onSubmit, onCancel }) => {
  const [folderName, setFolderName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(folderName);
    setFolderName("");
  };

  return (
    <form className="modal-content" onSubmit={handleSubmit}>
      <div className="modal-header">Create Folder</div>
      <div className="modal-body">
        <input
          type="text"
          placeholder="Folder name"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          required
        />
      </div>
      <div className="modal-footer">
        <button type="button" className="cancel-btn" onClick={onCancel}>Cancel</button>
        <button type="submit" className="action-btn">Create</button>
      </div>
    </form>
  );
};

export default CreateFolder;
