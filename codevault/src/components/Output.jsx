import { useState } from "react";
import { Box, Button, Text, useToast } from "@chakra-ui/react";
import { executeCode } from "../api";

const Output = ({ editorRef, language }) => {
const toast = useToast();
const [output, setOutput] = useState(null);
const [isLoading, setIsLoading] = useState(false);
const [isError, setIsError] = useState(false);

const LANGUAGE_API_MAP = {
    javascript: "javascript",
    typescript: "typescript",
    python: "python3",
    java: "java",
    csharp: "csharp",
    php: "php",
    cpp: "cpp20",  
};

const runCode = async () => {
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) return;

    if (language === "html" || language === "css") {
    setOutput([`Preview available below:`]);
    setIsError(false);
    return;
    }

    try {
    setIsLoading(true);
    const apiLanguage = LANGUAGE_API_MAP[language] || language;

    const { run: result } = await executeCode(apiLanguage, sourceCode);

    setOutput(result.output ? result.output.split("\n") : []);
    setIsError(!!result.stderr);
    } catch (error) {
    toast({
        title: "An error occurred.",
        description: error.message || "Unable to run code",
        status: "error",
        duration: 6000,
    });
    } finally {
    setIsLoading(false);
    }
};

return (
    <Box w="50%">
    <Text mb={2} fontSize="lg">
        Output
    </Text>
    <Button
        variant="outline"
        colorScheme="green"
        mb={4}
        isLoading={isLoading}
        onClick={runCode}
    >
        Run Code
    </Button>

    <Box
        height="75vh"
        p={2}
        color={isError ? "red.400" : ""}
        border="1px solid"
        borderRadius={4}
        borderColor={isError ? "red.500" : "#333"}
    >
        {language === "html" || language === "css" ? (
        <iframe
            srcDoc={editorRef.current.getValue()}
            style={{ width: "100%", height: "100%", border: "none" }}
            title="HTML/CSS Preview"
        />
        ) : output ? (
        output.map((line, i) => <Text key={i}>{line}</Text>)
        ) : (
        'Click "Run Code" to see the output here'
        )}
    </Box>
    </Box>
);
};

export default Output;
