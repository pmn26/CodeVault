import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaFileAlt, FaUpload, FaTimes, FaDownload, FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import "../assets/foldercontent.css";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

function FolderContent() {
  const { folderId, name } = useParams();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeFile, setActiveFile] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const fileInputRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const API_BASE = "http://localhost/CodeVault/codevault/codevault-backend/api";

  const fetchFiles = async () => {
    if (!user?.id || !folderId) return;
    try {
      const res = await axios.get(`${API_BASE}/get_files.php`, {
        params: { folder_id: folderId, user_id: user.id },
      });
      if (res.data.success) setFiles(res.data.files);
      else setFiles([]);
    } catch (err) {
      console.error(err);
      setFiles([]);
    }
  };

  useEffect(() => {
    if (folderId) fetchFiles();
  }, [folderId]);

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return alert("Please select a file.");

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("folder_id", folderId);
    formData.append("user_id", user.id);

    try {
      const res = await axios.post(`${API_BASE}/upload_file.php`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) {
        alert(`File uploaded: ${res.data.filename}`);
        setSelectedFile(null);
        setShowUploadPopup(false);
        fetchFiles();
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error(err);
      alert("File upload failed");
    }
  };

  const handleDownload = (file) => {
    const link = document.createElement("a");
    link.href = file.url;
    link.download = file.filename;
    link.click();
  };

  const openFilePopup = async (file) => {
    setActiveFile(file);
    setFileContent("");

    try {
      const res = await axios.get(`${API_BASE}/get_file_content.php`, {
        params: { file_id: file.id },
      });
      if (res.data.success) setFileContent(res.data.content);
      else setFileContent("// Unable to load file content.");
    } catch (err) {
      console.error(err);
      setFileContent("// Error loading file content.");
    }
  };

  return (
    <div className="folder-page">
      <div className="folders-header">
        <h2 className="folder-header">
          <FaArrowLeft
            style={{ cursor: "pointer", marginRight: "10px" }}
            onClick={() => navigate("/folders")}
          />
          {name || "Folder"}
        </h2>
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
            <p>Use the <strong>Upload File</strong> button to add one.</p>
          </div>
        ) : (
          files.map((file) => (
            <div
              key={file.id}
              className="folder-item"
              onClick={() => openFilePopup(file)}
            >
              <FaFileAlt className="folder-icon" />
              <p>{file.filename}</p>
            </div>
          ))
        )}
      </div>

      {/* Upload Popup */}
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
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
              {selectedFile && <p>📄 {selectedFile.name}</p>}
              <button type="submit" className="create-folder-btn">Upload</button>
            </form>
          </div>
        </div>
      )}

      {/* File Content Popup */}
      {activeFile && (
        <div className="popup-overlay" onClick={() => setActiveFile(null)}>
          <div className="popup-box file-content-popup" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setActiveFile(null)}>
              <FaTimes />
            </button>

            <div className="file-content-container">
              <div className="code-section">
                <SyntaxHighlighter
                  language="javascript"
                  style={vscDarkPlus}
                  showLineNumbers
                  wrapLines
                  customStyle={{
                    fontSize: "16px",
                    height: "500px",
                    overflowY: "auto",
                    pointerEvents: "none"
                  }}
                >
                  {fileContent || "// No content available"}
                </SyntaxHighlighter>
                <div className="overlay-block" />
              </div>

              <div className="file-info-section">
                <h3>{activeFile.filename}</h3>
                <p><strong>Uploaded by:</strong> {activeFile.uploader_name}</p>
                <p><strong>Uploaded at:</strong> {new Date(activeFile.uploaded_at).toLocaleString()}</p>
                {activeFile.description && (
                  <p><strong>Description:</strong> {activeFile.description}</p>
                )}
                <button className="action-btn" onClick={() => handleDownload(activeFile)}>
                  <FaDownload style={{ marginRight: "5px" }} /> Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FolderContent;
