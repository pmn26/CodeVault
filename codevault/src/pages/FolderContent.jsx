import React, { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaFileAlt, FaUpload, FaTimes, FaDownload } from "react-icons/fa";
import "../assets/foldercontent.css";

function FolderContent() {
  const { name } = useParams();
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [showDownloadPopup, setShowDownloadPopup] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    const fileURL = URL.createObjectURL(selectedFile);
    const newFile = {
      name: selectedFile.name,
      url: fileURL,
    };

    setFiles((prev) => [...prev, newFile]);
    setSelectedFile(null);
    setShowUploadPopup(false);
  };

  const handleFileClick = (file) => {
    setSelectedFile(file);
    setShowDownloadPopup(true);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = selectedFile.url;
    link.download = selectedFile.name;
    link.click();
  };

  return (
    <div className="folder-page">
      {/* Header */}
      <div className="folders-header">
        <h2 onClick={() => navigate("/folders")}>{name || "Folder"}</h2>

        <div className="folders-controls">
          <button className="create-btn" onClick={() => setShowUploadPopup(true)}>
            <FaUpload style={{ marginRight: "8px" }} />
            Upload File
          </button>
        </div>
      </div>

      <div className="folders-grid">
        {files.length === 0 ? (
          <div className="empty-section">
            <FaFileAlt className="empty-icon" />
            <h3>No files yet!</h3>
            <p>
              Use the <strong>“Upload File”</strong> button to add one.
            </p>
          </div>
        ) : (
          files.map((file, index) => (
            <div
              key={index}
              className="folder-item"
              title="Click to view"
              onClick={() => handleFileClick(file)}
            >
              <FaFileAlt className="folder-icon" />
              <p>{file.name}</p>
            </div>
          ))
        )}
      </div>

      {showUploadPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <button className="close-btn" onClick={() => setShowUploadPopup(false)}>
              <FaTimes />
            </button>
            <h3>Upload File</h3>
            <form onSubmit={handleUploadSubmit}>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="file-input"
              />
              {selectedFile && selectedFile instanceof File && (
                <p className="file-preview">📄 {selectedFile.name}</p>
              )}
              <button type="submit" className="create-folder-btn">
                Upload
              </button>
            </form>
          </div>
        </div>
      )}

      {showDownloadPopup && selectedFile && (
        <div className="popup-overlay">
          <div className="popup-box">
            <button className="close-btn" onClick={() => setShowDownloadPopup(false)}>
              <FaTimes />
            </button>
            <h3>Download File</h3>
            <p className="file-preview">📄 {selectedFile.name}</p>
            <button className="download-btn" onClick={handleDownload}>
              <FaDownload style={{ marginRight: "8px" }} />
              Download
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FolderContent;
