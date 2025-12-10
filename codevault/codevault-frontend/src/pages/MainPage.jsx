import { FaFolder, FaFileAlt } from "react-icons/fa";
import "../assets/DashboardLayout.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import Modal from "../components/modal";
import CreateFolder from "../components/CreateFolder";
import UploadFiles from "../components/UploadFiles";
import axios from "axios";

function MainPage() {
  const navigate = useNavigate(); 
  const [isCreateFolderOpen, setCreateFolderOpen] = useState(false);
  const [isUploadOpen, setUploadOpen] = useState(false);
  const [folders, setFolders] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const API_BASE = "http://localhost/CodeVault/codevault/codevault-backend/api";

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      const res = await axios.get(`${API_BASE}/get_folders.php?user_id=${user.id}`);
      if (res.data.success) setFolders(res.data.folders);
    } catch (err) {
      console.error("Failed to fetch folders", err);
    }
  };

  const handleFolderCreate = async (name) => {
    if (!name.trim()) return alert("Please enter a folder name.");
    if (!user) return alert("User not logged in");

    try {
      const res = await axios.post(
        `${API_BASE}/create_folder.php`,
        { name, user_id: user.id },
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.success) {
        setFolders([...folders, { id: res.data.id || folders.length + 1, name }]);
        setCreateFolderOpen(false);
      } else alert("Error creating folder: " + res.data.message);
    } catch (err) {
      console.error(err);
      alert("Server error creating folder");
    }
  };

  // Upload file and redirect to folder page
  const handleFileUpload = async (file, folderId) => {
    if (!folderId) return alert("Please select a folder to upload to");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder_id", folderId);
    formData.append("user_id", user.id);

    try {
      const res = await axios.post(`${API_BASE}/upload_file.php`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res.data.success) {
        alert(`File "${res.data.filename}" uploaded successfully!`);
        setUploadOpen(false);
        navigate(`/folders/${folderId}`); // redirect to folder page
      } else alert(res.data.message);
    } catch (err) {
      console.error(err);
      alert("File upload failed");
    }
  };

  return (
    <>
      {/* Modals */}
      <Modal isOpen={isCreateFolderOpen} onClose={() => setCreateFolderOpen(false)}>
        <CreateFolder onSubmit={handleFolderCreate} />
      </Modal>
      <Modal isOpen={isUploadOpen} onClose={() => setUploadOpen(false)}>
        <UploadFiles onUpload={handleFileUpload} folders={folders} />
      </Modal>

      {/* Hero */}
      <div className="hero">
        <h1 className="hero-title">Welcome Back!</h1>
        <p className="hero-sub">Manage your folders, upload files, and explore your projects.</p>
      </div>

      {/* Quick actions */}
      <div className="quick-actions">
        <button className="action-card primary" onClick={() => setCreateFolderOpen(true)}>
          <FaFolder size={32} /> <span>Create Folder</span>
        </button>
        <button className="action-card secondary" onClick={() => setUploadOpen(true)}>
          <FaFileAlt size={32} /> <span>Upload Files</span>
        </button>
      </div>

      {/* Folder list */}
      <div className="content-section">
        <h2>My Folders</h2>
        <div className="items-grid">
          {folders.map(folder => (
            <div key={folder.id} className="item-card" onClick={() => navigate(`/folders/${folder.id}`)}>
              <FaFolder size={32} />
              <p>{folder.name}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default MainPage;
