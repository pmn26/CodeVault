import axios from "axios";
import { LANGUAGE_VERSIONS } from "./constants";

const API = axios.create({
baseURL: "https://emkc.org/api/v2/piston",
});

export const executeCode = async (language, sourceCode) => {

if (language === "html" || language === "css") {
    throw new Error("HTML/CSS cannot be executed on this API.");
}

const LANGUAGE_API_MAP = {
    javascript: { language: "javascript", version: LANGUAGE_VERSIONS.javascript },
    typescript: { language: "typescript", version: LANGUAGE_VERSIONS.typescript },
    python: { language: "python", version: LANGUAGE_VERSIONS.python },
    java: { language: "java", version: LANGUAGE_VERSIONS.java },
    csharp: { language: "csharp", version: LANGUAGE_VERSIONS.csharp },
    php: { language: "php", version: LANGUAGE_VERSIONS.php },
};

const langConfig = LANGUAGE_API_MAP[language];
if (!langConfig) throw new Error(`Unsupported language: ${language}`);

const response = await API.post("/execute", {
    language: langConfig.language,
    version: langConfig.version,
    files: [{ content: sourceCode }],
});

return response.data;
};
