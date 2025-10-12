import React from "react";
import "../assets/folders.css";
import { FaEllipsisV } from "react-icons/fa";
import { BiFolder } from "react-icons/bi";

function FoldersPage() {
  const folders = []; 

  return (
    <div className="folders-page">
      <div className="folders-header">
        <h2>My Folders</h2>
        <div className="folders-controls">
          <button className="create-btn">Create</button>
          <FaEllipsisV className="menu-icon" />
        </div>
      </div>

      {folders.length === 0 ? (
        <div className="empty-state">
          <BiFolder className="empty-folder-icon" />
          <h3>No folders!</h3>
          <p>use the <b>“Create”</b> button</p>
        </div>
      ) : (
        <div className="folders-grid">
          {folders.map((folder, index) => (
            <div key={index} className="folder-item">
              <BiFolder className="folder-icon" />
              <p>{folder.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FoldersPage;
