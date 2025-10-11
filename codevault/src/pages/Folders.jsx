import React from "react";
import "../assets/folders.css";
import { FaEllipsisV } from "react-icons/fa";

function FoldersPage() {
const folders = [
    { name: "Java" },
    { name: "Python" },
    { name: "C#" },
    { name: "HTML" },
    { name: "Javascript" },
    { name: "Typescript" },
    { name: "PHP" },
];

return (
    <div className="folders-page">
    <div className="folders-header">
        <h2>My Folders</h2>
        <div className="folders-controls">
        <button className="create-btn">Create</button>
        <FaEllipsisV className="menu-icon" />
        </div>
    </div>

    <div className="folders-grid">
        {folders.map((folder, index) => (
        <div key={index} className="folder-item">
            <i className="bi bi-folder-fill folder-icon"></i>
            <p>{folder.name}</p>
        </div>
        ))}
    </div>
    </div>
);
}

export default FoldersPage;
