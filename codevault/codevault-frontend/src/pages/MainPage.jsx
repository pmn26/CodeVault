import { FaFolder, FaFileAlt, FaEllipsisV } from "react-icons/fa";
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
  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [editFolderName, setEditFolderName] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const API_BASE = "http://localhost/CodeVault/codevault/codevault-backend/api";

  // =====================
  // Helpers
  // =====================
  const slugify = (text) =>
    text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

  // =====================
  // Fetch folders
  // =====================
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

  // =====================
  // Create folder
  // =====================
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
        setFolders([...folders, { id: res.data.id, name }]);
        setCreateFolderOpen(false);
      } else alert(res.data.message);
    } catch (err) {
      console.error(err);
      alert("Server error creating folder");
    }
  };

  // =====================
  // Edit folder
  // =====================
  const handleEditFolder = async (id, newName) => {
    try {
      const res = await axios.post(
        `${API_BASE}/edit_folder.php`,
        { id, name: newName },
        { headers: { "Content-Type": "application/json" } }
      );
      if (res.data.success) {
        setFolders(folders.map((f) => (f.id === id ? { ...f, name: newName } : f)));
      } else alert(res.data.message);
    } catch (err) {
      console.error(err);
      alert("Failed to edit folder");
    }
  };

  // =====================
  // Delete folder
  // =====================
  const handleDeleteFolder = async (id) => {
    if (!window.confirm("Are you sure you want to delete this folder?")) return;

    try {
      const res = await axios.post(
        `${API_BASE}/delete_folder.php`,
        { id },
        { headers: { "Content-Type": "application/json" } }
      );
      if (res.data.success) {
        setFolders(folders.filter((f) => f.id !== id));
      } else alert(res.data.message);
    } catch (err) {
      console.error(err);
      alert("Failed to delete folder");
    }
  };

  // =====================
  // Upload file
  // =====================
  const handleFileUpload = async (file, folderId) => {
    if (!folderId) return alert("Please select a folder");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder_id", folderId);
    formData.append("user_id", user.id);

    try {
      const res = await axios.post(`${API_BASE}/upload_file.php`, formData);
      if (res.data.success) {
        setUploadOpen(false);
        const folder = folders.find((f) => f.id === folderId);
        navigate(`/folders/${folderId}/${slugify(folder.name)}`);
      } else alert(res.data.message);
    } catch (err) {
      console.error(err);
      alert("File upload failed");
    }
  };

  return (
    <>
      {/* Create Folder Modal */}
      <Modal isOpen={isCreateFolderOpen} onClose={() => setCreateFolderOpen(false)}>
        <CreateFolder onSubmit={handleFolderCreate} />
      </Modal>

      {/* Upload File Modal */}
      <Modal isOpen={isUploadOpen} onClose={() => setUploadOpen(false)}>
        <UploadFiles onUpload={handleFileUpload} folders={folders} />
      </Modal>

      {/* Folder Edit/Delete Modal */}
      <Modal isOpen={folderModalOpen} onClose={() => setFolderModalOpen(false)}>
        {selectedFolder && (
          <div className="folder-action-modal">
            <h3>Edit Folder</h3>
            <input
              type="text"
              value={editFolderName}
              onChange={(e) => setEditFolderName(e.target.value)}
            />
            <div className="modal-buttons">
              <button
                className="save-btn"
                onClick={() => {
                  handleEditFolder(selectedFolder.id, editFolderName.trim());
                  setFolderModalOpen(false);
                }}
              >
                Save
              </button>
              <button
                className="delete-btn"
                onClick={() => {
                  handleDeleteFolder(selectedFolder.id);
                  setFolderModalOpen(false);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        )}
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
          {folders.map((folder) => (
            <div key={folder.id} className="item-card">
              <div className="folder-menu">
                <FaEllipsisV
                  size={18}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFolder(folder);
                    setEditFolderName(folder.name);
                    setFolderModalOpen(true);
                  }}
                />
              </div>

              <div
                className="folder-main"
                onClick={() => navigate(`/folders/${folder.id}/${slugify(folder.name)}`)}
              >
                <FaFolder size={32} />
                <p>{folder.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default MainPage;
