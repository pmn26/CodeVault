import { useRef, useState } from "react";
import { Box, HStack, VStack, useBreakpointValue } from "@chakra-ui/react";
import { Editor } from "@monaco-editor/react";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS } from "../constants";
import Output from "./Output";

const CodeEditor = () => {
  const editorRef = useRef();
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("javascript");

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const onSelect = (language) => {
    setLanguage(language);
    setValue(CODE_SNIPPETS[language]);
  };

  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box>
      {isMobile ? (
        <VStack spacing={4} align="stretch" w="100%">
          <Box w="100%">
            <LanguageSelector language={language} onSelect={onSelect} />
            <Editor
              options={{
                minimap: { enabled: false },
              }}
              height="45vh"
              theme="vs-dark"
              language={language}
              defaultValue={CODE_SNIPPETS[language]}
              onMount={onMount}
              value={value}
              onChange={(value) => setValue(value)}
            />
          </Box>
          <Box w="100%">
            <Output editorRef={editorRef} language={language} />
          </Box>
        </VStack>
      ) : (
        <HStack spacing={4} align="start">
          <Box w="50%">
            <LanguageSelector language={language} onSelect={onSelect} />
            <Editor
              options={{
                minimap: { enabled: false },
              }}
              height="75vh"
              theme="vs-dark"
              language={language}
              defaultValue={CODE_SNIPPETS[language]}
              onMount={onMount}
              value={value}
              onChange={(value) => setValue(value)}
            />
          </Box>
          <Output editorRef={editorRef} language={language} />
        </HStack>
      )}
    </Box>
  );
};

export default CodeEditor;
