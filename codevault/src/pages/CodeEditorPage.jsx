import React from "react";
import { Box } from "@chakra-ui/react";
import CodeEditor from "../components/CodeEditor";

function CodeEditorPage() {
  return (
    <Box
      minH="100vh"
      bg="#010120"
      color="gray.500"
      px={{ base: 4, md: 6 }}
      pt={{ base: "80px", md: "20px" }}  
      pb={{ base: "80px", md: "20px" }} 
    >
      <CodeEditor />
    </Box>
  );
}

export default CodeEditorPage;
