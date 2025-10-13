import React, { useState, useRef } from "react";

const UploadFiles = ({ onUpload, onCancel }) => {
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file) {
      onUpload(file);
      setFile(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  return (
    <form className="modal-content" onSubmit={handleSubmit}>
      <div className="modal-header">Upload File</div>
      <div className="modal-body">
        <div
          className={`drop-zone ${dragOver ? "dragover" : ""}`}
          onClick={() => inputRef.current.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {file ? file.name : "Drag files here or click to select"}
          <input
            type="file"
            ref={inputRef}
            style={{ display: "none" }}
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
      </div>
      <div className="modal-footer">
        <button type="button" className="cancel-btn" onClick={onCancel}>Cancel</button>
        <button type="submit" className="action-btn" disabled={!file}>Upload</button>
      </div>
    </form>
  );
};

export default UploadFiles;
