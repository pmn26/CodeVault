import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme.js";

import Home from "./pages/LandingPage.jsx";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import MainPage from "./pages/MainPage";
import CodeEditorPage from "./pages/CodeEditorPage";
import DashboardLayout from "./components/DashboardLayout.jsx";
import FoldersPage from "./pages/Folders.jsx";
import Projects from "./pages/Projects";
import UserProfile from "./pages/UserProfile.jsx";
import Settings from "./pages/Settings.jsx";
import Billing from "./pages/Billing.jsx";
import Review from "./pages/Review.jsx";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/review" element={<Review />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Dashboard Layout Routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/mainpage" element={<MainPage />} />
          <Route
            path="/code-editor"
            element={
              <ChakraProvider theme={theme}>
                <CodeEditorPage />
              </ChakraProvider>
            }
          />
          <Route path="/folders" element={<FoldersPage />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/userprofile" element={<UserProfile />} />
          <Route path="/settings" element={<Settings />} /> {/* ✅ Added here */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
