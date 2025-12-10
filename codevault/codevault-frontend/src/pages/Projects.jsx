import React, { useState, useEffect } from "react";
import "../assets/projects.css";
import { FaFileCode } from "react-icons/fa";
import axios from "axios";

function Projects() {
  const [selected, setSelected] = useState(null);
  const [languageFilter, setLanguageFilter] = useState("All");
  const [projects, setProjects] = useState([]);

  // Fetch files from backend
  useEffect(() => {
    axios
      .get("http://localhost/CodeVault/codevault/codevault-backend/api/get_all_files.php")
      .then((res) => {
        if (res.data.success) {
          setProjects(res.data.files);
        } else {
          console.error("Error fetching files:", res.data.message);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  // Filter logic
  const filteredProjects =
    languageFilter === "All"
      ? projects
      : projects.filter((p) => p.language === languageFilter);

  // Download handler
  const handleDownload = (filename, url) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
  };

  return (
    <div className="projects-page">
      <div className="projects-header">
        <h2>All Projects</h2>

        <select
          className="language-dropdown"
          value={languageFilter}
          onChange={(e) => setLanguageFilter(e.target.value)}
        >
          <option value="All">All Languages</option>
          <option value="Java">Java</option>
          <option value="JavaScript">JavaScript</option>
          <option value="TypeScript">TypeScript</option>
          <option value="Python">Python</option>
          <option value="HTML">HTML</option>
          <option value="PHP">PHP</option>
          <option value="C#">C#</option>
        </select>
      </div>

      <div className="projects-grid">
        {filteredProjects.map((project, i) => (
          <div
            key={i}
            className="project-item"
            onClick={() => setSelected(selected === i ? null : i)}
          >
            <FaFileCode className="project-icon" />
            <p>{project.filename}</p>
            <p className="uploader">By: {project.uploader_name}</p>
            {selected === i && (
              <>
                <pre className="code-box">{project.code || "Preview not available"}</pre>
                <button
                  className="download-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(project.filename, project.url);
                  }}
                >
                  Download
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Projects;
