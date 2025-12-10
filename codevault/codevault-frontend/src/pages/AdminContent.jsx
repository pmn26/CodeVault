import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import "../assets/admin.css";

export default function AdminContent() {
const fileInputRef = useRef(null);
const [selectedFile, setSelectedFile] = useState(null);
const [files, setFiles] = useState([]);
const [sortKey, setSortKey] = useState("date_desc");
const [loading, setLoading] = useState(true);

// Sorting options
const sortOptions = [
    { label: "Date (Newest)", value: "date_desc" },
    { label: "Date (Oldest)", value: "date_asc" },
    { label: "Title (A-Z)", value: "title_asc" },
];

// Fetch uploaded files from backend
const fetchFiles = async () => {
    try {
    const res = await axios.get(
        "http://localhost/CodeVault/codevault/codevault-backend/api/get_all_files_admin.php"
    );
    setFiles(res.data.files || []);
    } catch (err) {
    console.error("Error fetching files:", err);
    } finally {
    setLoading(false);
    }
};

useEffect(() => {
    fetchFiles();
}, []);

// Handle sorting
const sortedFiles = [...files].sort((a, b) => {
    const [key, order] = sortKey.split("_");

    if (key === "title") {
    const comparison = a.title.localeCompare(b.title);
    return order === "asc" ? comparison : -comparison;
    }

    if (key === "date") {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    const comparison = dateA.getTime() - dateB.getTime();
    return order === "asc" ? comparison : -comparison;
    }

    return 0;
});

// File upload handlers
const handleFileUploadClick = () => {
    fileInputRef.current.click();
};

const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
    setSelectedFile(file);
    alert(`File selected: ${file.name}. (Upload feature coming soon!)`);
    }
};

const handleSortChange = (event) => {
    setSortKey(event.target.value);
};

return (
    <>
    <section className="hero">
        <h2 className="hero-title">Content Management</h2>
        <p className="hero-sub">
        Review and manage all uploaded files on the platform.
        </p>
    </section>

    {/* Upload Button */}
    <div
        className="upload-section"
        style={{
        display: "flex",
        justifyContent: "flex-end",
        marginBottom: "20px",
        }}
    >
        <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
        />
        <button
        className="action-btn btn-primary"
        onClick={handleFileUploadClick}
        >
        + Upload New File
        </button>
    </div>

    <div className="panel">
        <div
        className="panel-header"
        style={{ justifyContent: "space-between", alignItems: "center" }}
        >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <h3 className="panel-title">Content Library</h3>

            {/* Sort Dropdown */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
                style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "rgba(255,255,255,0.7)",
                }}
            >
                Sort:
            </span>
            <select
                value={sortKey}
                onChange={handleSortChange}
                className="action-btn btn-primary"
                style={{
                appearance: "none",
                padding: "8px 24px 8px 12px",
                background:
                    "rgba(102, 126, 234, 0.3) url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23a8b3ff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\") no-repeat right 10px center",
                backgroundSize: "12px",
                cursor: "pointer",
                fontSize: "14px",
                minWidth: "160px",
                }}
            >
                {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
                ))}
            </select>
            </div>
        </div>
        </div>

        {/* Table */}
        {loading ? (
        <p style={{ padding: "20px", textAlign: "center" }}>
            Loading uploaded files...
        </p>
        ) : sortedFiles.length === 0 ? (
        <p style={{ padding: "20px", textAlign: "center" }}>
            No uploaded files found.
        </p>
        ) : (
        <div className="table-responsive-wrapper">
            <table className="data-table">
            <thead>
                <tr>
                <th>ID</th>
                <th>Filename</th>
                <th>Uploader</th>
                <th>File Path</th>
                <th>Date Uploaded</th>
                <th>Actions</th>
                </tr>
            </thead>

            <tbody>
                {sortedFiles.map((file) => (
                <tr key={file.id}>
                    <td>#{file.id}</td>
                    <td>{file.title}</td>
                    <td>{file.author}</td>
                    <td>
                    <span
                        style={{
                        fontSize: "13px",
                        color: "rgba(255,255,255,0.7)",
                        }}
                    >
                        {file.location}
                    </span>
                    </td>
                    <td>{new Date(file.date).toLocaleString()}</td>
                    <td>
                    <button
                        className="action-btn btn-primary"
                        onClick={() => window.open(file.url, "_blank")}
                    >
                        View
                    </button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        )}
    </div>
    </>
);
}
