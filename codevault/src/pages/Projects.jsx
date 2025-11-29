import React, { useState } from "react";
import "../assets/projects.css";
import { FaFileCode } from "react-icons/fa";

function Projects() {
  const [selected, setSelected] = useState(null);
  const [languageFilter, setLanguageFilter] = useState("All");

  const projects = [
    {
      name: "MidtermFinalsCalculator.java",
      language: "Java",
      code: `public class MidtermFinalsCalculator {
    public static void main(String[] args) {
        double midterm = 85.5;
        double finals = 90.0;
        double average = (midterm + finals) / 2;
        System.out.println("Final Average: " + average);
    }
}`,
    },
    {
      name: "SimpleArray.py",
      language: "Python",
      code: `numbers = [10, 20, 30, 40, 50]
print("Numbers:", numbers)
print("Average:", sum(numbers) / len(numbers))`,
    },
    {
      name: "DisplayText.html",
      language: "HTML",
      code: `<!DOCTYPE html>
<html>
  <body>
    <h1>Hello, this is a simple HTML file!</h1>
  </body>
</html>`,
    },
    {
      name: "ArrayAverage.js",
      language: "JavaScript",
      code: `const numbers = [10, 20, 30, 40, 50];
const avg = numbers.reduce((a,b)=>a+b,0) / numbers.length;
console.log("Average:", avg);`,
    },
    {
      name: "HelloWorld.php",
      language: "PHP",
      code: `<?php
echo "Hello, world!";
?>`,
    },
    {
      name: "Calculator.cs",
      language: "C#",
      code: `using System;

class Calculator {
    static void Main() {
        int a = 5, b = 7;
        Console.WriteLine("Sum: " + (a + b));
    }
}`,
    },
    {
      name: "Greeting.ts",
      language: "TypeScript",
      code: `const greet = (name: string): string => {
  return "Hello, " + name + "!";
};
console.log(greet("World"));`,
    },
  ];

  // Filter logic
  const filteredProjects =
    languageFilter === "All"
      ? projects
      : projects.filter((p) => p.language === languageFilter);

  // Download handler
  const handleDownload = (filename, code) => {
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
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
            <p>{project.name}</p>
            {selected === i && (
              <>
                <pre className="code-box">{project.code}</pre>
                <button
                  className="download-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(project.name, project.code);
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
