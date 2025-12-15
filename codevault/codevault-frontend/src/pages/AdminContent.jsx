import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import Modal from "../components/modal";
import "../assets/admin.css";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function AdminContent() {
const fileInputRef = useRef(null);

const [selectedFile, setSelectedFile] = useState(null);
const [files, setFiles] = useState([]);
const [sortKey, setSortKey] = useState("date_desc");
const [loading, setLoading] = useState(true);
const [uploading, setUploading] = useState(false);
const [deleting, setDeleting] = useState(false);

// Modal states
const [showUploadModal, setShowUploadModal] = useState(false);
const [showViewModal, setShowViewModal] = useState(false);
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [fileToView, setFileToView] = useState(null);
const [fileToDelete, setFileToDelete] = useState(null);

const sortOptions = [
    { label: "Date (Newest)", value: "date_desc" },
    { label: "Date (Oldest)", value: "date_asc" },
    { label: "Title (A-Z)", value: "title_asc" },
];

// =====================
// Fetch files
// =====================
const fetchFiles = async () => {
    setLoading(true);
    try {
    const res = await axios.get(
        "http://localhost/CodeVault/codevault/codevault-backend/api/get_all_files_admin.php",
        { withCredentials: true }
    );

    if (res.data.success) {
        setFiles(res.data.files || []);
    } else {
        alert(res.data.message || "Failed to load files");
    }
    } catch (err) {
    console.error(err);
    alert("Failed to load files");
    } finally {
    setLoading(false);
    }
};

useEffect(() => {
    fetchFiles();
}, []);

// =====================
// Sorting
// =====================
const sortedFiles = [...files].sort((a, b) => {
    const [key, order] = sortKey.split("_");

    if (key === "title") {
    const comp = (a.title || "").localeCompare(b.title || "");
    return order === "asc" ? comp : -comp;
    }

    if (key === "date") {
    const dA = new Date(a.date);
    const dB = new Date(b.date);
    const comp = dA - dB;
    return order === "asc" ? comp : -comp;
    }

    return 0;
});

// =====================
// Upload
// =====================
const handleUpload = async () => {
    if (!selectedFile) return alert("Select a file first");

    setUploading(true);
    try {
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("folder_id", 1);
    formData.append("user_id", 1);

    const res = await axios.post(
        "http://localhost/CodeVault/codevault/codevault-backend/api/upload.php",
        formData,
        { withCredentials: true }
    );

    if (res.data.success) {
        fetchFiles();
        setShowUploadModal(false);
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    } else {
        alert(res.data.message);
    }
    } catch (err) {
    console.error(err);
    alert("Upload failed");
    } finally {
    setUploading(false);
    }
};

// =====================
// View file (FIXED)
// =====================
const handleView = async (file) => {
    setFileToView({ ...file, content: null, error: null });
    setShowViewModal(true);

    // Images & binaries → use direct URL only
    if (isImageFile(file.title)) return;

    try {
    const res = await axios.get(
        `http://localhost/CodeVault/codevault/codevault-backend/api/get_file_content.php?file_id=${file.id}`,
        { withCredentials: true }
    );

    if (res.data?.success && res.data.content !== undefined) {
        setFileToView((prev) => ({
        ...prev,
        content: res.data.content,
        }));
    } else {
        throw new Error("Invalid response");
    }
    } catch (err) {
    console.error(err);
    setFileToView((prev) => ({
        ...prev,
        error: "Unable to load file content",
    }));
    }
};

// =====================
// Delete
// =====================
const confirmDelete = async () => {
    setDeleting(true);
    try {
    const res = await axios.post(
        "http://localhost/CodeVault/codevault/codevault-backend/api/delete_file_admin.php",
        { file_id: fileToDelete.id },
        { withCredentials: true }
    );

    if (res.data.success) {
        setFiles((prev) => prev.filter((f) => f.id !== fileToDelete.id));
        setShowDeleteModal(false);
        setFileToDelete(null);
    } else {
        alert(res.data.message);
    }
    } catch (err) {
    console.error(err);
    alert("Delete failed");
    } finally {
    setDeleting(false);
    }
};

// =====================
// Helpers
// =====================
const isImageFile = (name) => /\.(jpg|jpeg|png|gif|webp)$/i.test(name);
const isTextFile = (name) => /\.(js|jsx|ts|tsx|php|py|html|css|json|md|txt)$/i.test(name);

const getLanguage = (name) => {
    const ext = name.split(".").pop().toLowerCase();
    return (
    {
        js: "javascript",
        jsx: "jsx",
        ts: "typescript",
        tsx: "tsx",
        php: "php",
        py: "python",
        html: "html",
        css: "css",
        json: "json",
        md: "markdown",
    }[ext] || "text"
    );
};

return (
    <>
    <section className="hero">
        <h2 className="hero-title">Content Management</h2>
        <p className="hero-sub">Review, upload, and manage all uploaded code files.</p>
    </section>

    <div className="upload-section" style={{ textAlign: "right" }}>
        <button className="action-btn btn-primary" onClick={() => setShowUploadModal(true)}>
        + Upload New File
        </button>
    </div>

    <div className="panel">
        {loading ? (
        <p>Loading...</p>
        ) : (
        <table className="data-table">
            <thead>
            <tr>
                <th>ID</th>
                <th>Filename</th>
                <th>Uploader</th>
                <th>Date</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {sortedFiles.map((file) => (
                <tr key={file.id}>
                <td>#{file.id}</td>
                <td>{file.title}</td>
                <td>{file.author}</td>
                <td>{new Date(file.date).toLocaleString()}</td>
                <td>
                    <button className="action-btn btn-primary" onClick={() => handleView(file)}>
                    View
                    </button>
                    <button
                    className="action-btn btn-danger"
                    onClick={() => {
                        setFileToDelete(file);
                        setShowDeleteModal(true);
                    }}
                    >
                    Delete
                    </button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        )}
    </div>

    {/* View Modal */}
    <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)}>
        <h3 className="modal-header">Viewing {fileToView?.title}</h3>
        <div className="modal-body">
        {fileToView?.error ? (
            <p style={{ color: "red" }}>{fileToView.error}</p>
        ) : fileToView?.content && isTextFile(fileToView.title) ? (
            <SyntaxHighlighter
            language={getLanguage(fileToView.title)}
            style={oneDark}
            customStyle={{ maxHeight: 400, overflow: "auto" }}
            >
            {fileToView.content}
            </SyntaxHighlighter>
        ) : isImageFile(fileToView?.title) ? (
            <img src={fileToView.url} alt="preview" style={{ maxWidth: "100%" }} />
        ) : (
            <p>Loading...</p>
        )}
        </div>
    </Modal>

    {/* Upload Modal */}
    <Modal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)}>
        <h3 className="modal-header">Upload File</h3>
        <input type="file" ref={fileInputRef} onChange={(e) => setSelectedFile(e.target.files[0])} />
        <button className="action-btn" onClick={handleUpload} disabled={uploading}>
        Upload
        </button>
    </Modal>

    {/* Delete Modal */}
    <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <h3 className="modal-header">Confirm Delete</h3>
        <button className="action-btn btn-danger" onClick={confirmDelete} disabled={deleting}>
        Delete
        </button>
    </Modal>
    </>
);
}
