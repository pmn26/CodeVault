import React, { useState } from "react";

function UploadFiles({ onUpload }) {
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }
    onUpload(file);
    setFile(null);
  };

  return (
    <div className="popup-box">
      <h3>Upload Files</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ marginBottom: "15px", width: "100%" }}
        />
        <button type="submit" className="create-folder-btn">
          Upload
        </button>
      </form>
    </div>
  );
}

export default UploadFiles;
