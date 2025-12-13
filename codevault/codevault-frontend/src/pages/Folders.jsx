import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaFolder, FaFileAlt, FaTimes, FaEllipsisV } from "react-icons/fa";
import axios from "axios";
import UploadFiles from "../components/UploadFiles";
import "../assets/folders.css";

function FoldersPage() {
  const navigate = useNavigate();
  const { folderId: paramFolderId } = useParams();
  const folderId = paramFolderId ? parseInt(paramFolderId) : null;

  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [showFolderPopup, setShowFolderPopup] = useState(false);
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [editFolderName, setEditFolderName] = useState("");
  const [newFolderName, setNewFolderName] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const API_BASE = "http://localhost/CodeVault/codevault/codevault-backend/api";

  useEffect(() => { fetchFolders(); }, []);
  useEffect(() => { if (folderId) fetchFiles(folderId); }, [folderId]);

  const fetchFolders = async () => {
    try {
      const res = await axios.get(`${API_BASE}/get_folders.php?user_id=${user.id}`);
      if (res.data.success) setFolders(res.data.folders);
    } catch (err) { console.error(err); }
  };

  const fetchFiles = async (folderId) => {
    try {
      const res = await axios.get(`${API_BASE}/get_files.php`, { params: { folder_id: folderId, user_id: user.id } });
      setFiles(res.data.success ? res.data.files : []);
    } catch (err) { console.error(err); setFiles([]); }
  };

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return alert("Enter folder name");
    try {
      const res = await axios.post(`${API_BASE}/create_folder.php`, { name: newFolderName, user_id: user.id }, { headers: { "Content-Type": "application/json" } });
      if (res.data.success) { fetchFolders(); setNewFolderName(""); setShowFolderPopup(false); }
      else alert(res.data.message);
    } catch (err) { console.error(err); alert("Failed to create folder"); }
  };

  const handleEditFolder = async (id, newName) => {
    try {
      const res = await axios.post(`${API_BASE}/edit_folder.php`, { id, name: newName }, { headers: { "Content-Type": "application/json" } });
      if (res.data.success) setFolders(folders.map(f => f.id === id ? { ...f, name: newName } : f));
      else alert(res.data.message);
    } catch (err) { console.error(err); alert("Failed to edit folder"); }
  };

  const handleDeleteFolder = async (id) => {
    if (!window.confirm("Are you sure you want to delete this folder?")) return;
    try {
      const res = await axios.post(`${API_BASE}/delete_folder.php`, { id }, { headers: { "Content-Type": "application/json" } });
      if (res.data.success) setFolders(folders.filter(f => f.id !== id));
      else alert(res.data.message);
    } catch (err) { console.error(err); alert("Failed to delete folder"); }
  };

  const handleFileUpload = async (file, uploadFolderId) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder_id", uploadFolderId);
    formData.append("user_id", user.id);
    try {
      const res = await axios.post(`${API_BASE}/upload_file.php`, formData, { headers: { "Content-Type": "multipart/form-data" } });
      if (res.data.success) { alert(`File uploaded: ${res.data.filename}`); if (folderId) fetchFiles(folderId); setShowUploadPopup(false); }
      else alert(res.data.message);
    } catch (err) { console.error(err); alert("File upload failed"); }
  };

  return (
    <div className="folders-page">
      <div className="folders-header">
        <h2>My Projects</h2>
        <div className="folders-controls">
          <button className="create-btn" onClick={() => { setSelectedFolder(null); setShowFolderPopup(true); }}>New Folder</button>
          <button className="create-btn" onClick={() => setShowUploadPopup(true)}>Upload File</button>
        </div>
      </div>

      {/* Folders Grid */}
      <div className="folders-grid">
        {folders.map(folder => (
          <div key={folder.id} className="folder-item">
            <div className="folder-menu">
              <FaEllipsisV
                size={16}
                onClick={(e) => { e.stopPropagation(); setSelectedFolder(folder); setEditFolderName(folder.name); setShowFolderPopup(true); }}
              />
            </div>
            <div className="folder-main" onClick={() => navigate(`/folders/${folder.id}/${encodeURIComponent(folder.name)}`)}>
              <FaFolder className="folder-icon" />
              <p>{folder.name}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Files Grid */}
      {folderId && (
        <div className="files-section">
          <h3>Files</h3>
          {files.length === 0 ? <p>No files in this folder yet</p> :
            <div className="folders-grid">
              {files.map(file => (
                <div key={file.id} className="folder-item">
                  <FaFileAlt className="folder-icon" />
                  <a href={file.url} target="_blank" rel="noreferrer">{file.filename}</a>
                </div>
              ))}
            </div>
          }
        </div>
      )}

      {/* Folder Popup Modal */}
      {showFolderPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <button className="close-btn" onClick={() => setShowFolderPopup(false)}><FaTimes /></button>
            {selectedFolder ? (
              <>
                <h3>Edit Folder</h3>
                <input type="text" value={editFolderName} onChange={e => setEditFolderName(e.target.value)} placeholder="Folder name" />
                <div className="popup-buttons">
                  <button className="save-btn" onClick={() => { if (!editFolderName.trim()) return alert("Folder name cannot be empty"); handleEditFolder(selectedFolder.id, editFolderName.trim()); setShowFolderPopup(false); }}>Save</button>
                  <button className="delete-btn" onClick={() => { handleDeleteFolder(selectedFolder.id); setShowFolderPopup(false); }}>Delete</button>
                </div>
              </>
            ) : (
              <>
                <h3>Create Folder</h3>
                <form onSubmit={handleCreateFolder}>
                  <input type="text" placeholder="Folder name" value={newFolderName} onChange={e => setNewFolderName(e.target.value)} />
                  <button type="submit" className="create-folder-btn">Create</button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Upload File Popup */}
      {showUploadPopup && (
        <div className="popup-overlay">
          <UploadFiles
            onUpload={handleFileUpload}
            onClose={() => setShowUploadPopup(false)}
            folders={folders}
            currentFolderId={folderId}
          />
        </div>
      )}
    </div>
  );
}

export default FoldersPage;
