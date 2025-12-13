import React, { useState, useEffect } from "react";
import "../assets/projects.css";
import { FaFileCode, FaTimes, FaDownload } from "react-icons/fa";
import axios from "axios";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [languageFilter, setLanguageFilter] = useState("All");
  const [activeProject, setActiveProject] = useState(null);
  const [fileContent, setFileContent] = useState("");

  const API_BASE = "http://localhost/CodeVault/codevault/codevault-backend/api";

  // Fetch all projects
  useEffect(() => {
    axios
      .get(`${API_BASE}/get_all_files.php`)
      .then((res) => {
        if (res.data.success) setProjects(res.data.files);
        else setProjects([]);
      })
      .catch((err) => console.error(err));
  }, []);

  const filteredProjects =
    languageFilter === "All"
      ? projects
      : projects.filter((p) => p.language === languageFilter);

  const openProjectPopup = async (project) => {
    setActiveProject(project);
    setFileContent("");
    try {
      const res = await axios.get(`${API_BASE}/get_file_content.php`, {
        params: { file_id: project.id },
      });
      if (res.data.success) setFileContent(res.data.content);
      else setFileContent("// Unable to load file content.");
    } catch (err) {
      console.error(err);
      setFileContent("// Error loading file content.");
    }
  };

  const handleDownload = (file) => {
    const link = document.createElement("a");
    link.href = file.url;
    link.download = file.filename;
    link.click();
  };

  return (
    <div className="folder-page">
      <div className="folders-header">
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

      <div className="folders-grid">
        {filteredProjects.length === 0 ? (
          <div className="empty-section">
            <FaFileCode className="empty-icon" />
            <h3>No projects found!</h3>
            <p>Projects will appear here once uploaded.</p>
          </div>
        ) : (
          filteredProjects.map((project) => (
            <div
              key={project.id}
              className="folder-item"
              onClick={() => openProjectPopup(project)}
            >
              <FaFileCode className="folder-icon" />
              <p>{project.filename}</p>
              <p className="uploader">By: {project.uploader_name}</p>
            </div>
          ))
        )}
      </div>

      {/* Project Content Popup */}
      {activeProject && (
        <div
          className="popup-overlay"
          onClick={() => setActiveProject(null)}
        >
          <div
            className="popup-box file-content-popup"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-btn"
              onClick={() => setActiveProject(null)}
            >
              <FaTimes />
            </button>

            <div className="file-content-container">
              <div className="code-section">
                <SyntaxHighlighter
  language={(() => {
    switch ((activeProject.language || "").toLowerCase()) {
      case "c#":
        return "csharp";
      case "html":
        return "html";
      case "javascript":
        return "javascript";
      case "typescript":
        return "typescript";
      case "python":
        return "python";
      case "php":
        return "php";
      case "java":
        return "java";
      case "css":
        return "css";
      default:
        return "javascript"; // fallback
    }
  })()}
  style={vscDarkPlus}
  showLineNumbers
  wrapLines
  customStyle={{
    fontSize: "16px",
    height: "500px",
    overflowY: "auto",
    borderRadius: "8px",
    backgroundColor: "#1a1a4a",
    padding: "15px",
  }}
>
  {fileContent || "// Preview not available"}
</SyntaxHighlighter>

              </div>

              <div className="file-info-section">
                <h3>{activeProject.filename}</h3>
                <p>
                  <strong>By:</strong> {activeProject.uploader_name}
                </p>
                <p>
                  <strong>Uploaded at:</strong>{" "}
                  {new Date(activeProject.uploaded_at).toLocaleString()}
                </p>
                {activeProject.description && (
                  <p>
                    <strong>Description:</strong> {activeProject.description}
                  </p>
                )}
                <button
                  className="action-btn"
                  onClick={() => handleDownload(activeProject)}
                >
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

export default Projects;
