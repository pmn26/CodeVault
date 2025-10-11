import React from "react";
import { Box } from "@chakra-ui/react";
import CodeEditor from "../components/CodeEditor";
function CodeEditorPage() {
return (
    <Box minH="100vh" bg="#0f0a19" color="gray.500" p={6}>
    <CodeEditor />
    </Box>
);
}

export default CodeEditorPage;
