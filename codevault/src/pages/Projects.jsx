import React from "react";
import "../assets/projects.css";
import { FaEllipsisV, FaFileAlt } from "react-icons/fa";

function Projects() {
  const projects = []; // empty state 

  return (
    <div className="projects-page">
      {/* ================= HEADER ================= */}
      <div className="projects-header">
        <h2>All Projects</h2>
        <div className="projects-controls">
          <button className="upload-btn">Upload</button>
          <FaEllipsisV className="menu-icon" />
        </div>
      </div>

      {/* ================= EMPTY  ================= */}
      {projects.length === 0 ? (
        <div className="empty-state">
          <FaFileAlt className="empty-project-icon" />
          <h3 className="empty-title">No projects yet!</h3>
          <p className="empty-subtitle">
            Use the <b>"Upload"</b> button.
          </p>
        </div>
      ) : (
        /* ================= PROJECT GRID ================= */
        <div className="projects-grid">
          {projects.map((project, index) => (
            <div key={index} className="project-item">
              <FaFileAlt className="project-icon" />
              <p>{project.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Projects;
