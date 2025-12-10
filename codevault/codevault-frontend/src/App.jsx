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
import Settings from "./pages/settings.jsx";
import Billing from "./pages/Billing.jsx";
import Review from "./pages/Review.jsx";
import FolderContent from "./pages/FolderContent.jsx";

// Admin Components
import Admin from "./pages/Admin.jsx";
import AdminHome from "./pages/AdminHome.jsx";
import AdminUsers from "./pages/AdminUsers.jsx";
import AdminContent from "./pages/AdminContent.jsx";
import AdminSystemSettings from "./pages/AdminSystemSettings.jsx";
import AdminAnalytics from "./pages/AdminAnalytics.jsx";
import AdminAccountSettings from "./pages/AdminAccountSettings.jsx";

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

        {/* Admin Routes - Nested under /admin */}
        <Route path="/admin" element={<Admin />}>
          <Route index element={<AdminHome />} />
          <Route path="home" element={<AdminHome />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="content" element={<AdminContent />} />
          <Route path="system-settings" element={<AdminSystemSettings />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="settings" element={<AdminAccountSettings />} />
        </Route>

        {/* Dashboard Routes (for regular users) - ALL USE DashboardLayout */}
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
          <Route path="/folders/:folderId" element={<FolderContent />} />

          <Route path="/projects" element={<Projects />} />
          <Route path="/userprofile" element={<UserProfile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;