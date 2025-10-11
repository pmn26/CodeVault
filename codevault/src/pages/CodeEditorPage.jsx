import React from "react";
import { Box, Container } from "@chakra-ui/react";
import CodeEditor from "../components/CodeEditor";
import '../assets/mainpage.css';
import '../assets/dashboard.css';

function CodeEditorPage() {
  return (
    <Box minH="100vh" bg="#0f0a19" color="gray.100" p={6}>
      <Container maxW="container.lg" centerContent>
        <Box
          bg="#1A1A2E"
          borderRadius="md"
          boxShadow="lg"
          p={4}
          width="100%"
          height="80vh"
          overflow="hidden"
          border="1px solid #444"
        >
          <CodeEditor />
        </Box>
      </Container>
    </Box>
  );
}

export default CodeEditorPage;
