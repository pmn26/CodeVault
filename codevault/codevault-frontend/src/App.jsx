import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme.js";

import ProtectedRoute from "./components/ProtectedRoute";
import MaintenanceGuard from "./components/MaintenanceGuard";

// Public Pages
import Home from "./pages/LandingPage.jsx";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import Billing from "./pages/Billing.jsx";
import Review from "./pages/Review.jsx";
import Maintenance from "./pages/maintenance.jsx";

// User Pages
import MainPage from "./pages/MainPage";
import CodeEditorPage from "./pages/CodeEditorPage";
import DashboardLayout from "./components/DashboardLayout.jsx";
import FoldersPage from "./pages/Folders.jsx";
import Projects from "./pages/Projects";
import UserProfile from "./pages/UserProfile.jsx";
import Settings from "./pages/settings.jsx";
import FolderContent from "./pages/FolderContent.jsx";

// Admin Pages
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
      {/* 🚧 GLOBAL MAINTENANCE GUARD */}
      <MaintenanceGuard>
        <Routes>

          {/* ================= PUBLIC ROUTES ================= */}
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/review" element={<Review />} />
          <Route path="/maintenance" element={<Maintenance />} />

          {/* ================= USER PROTECTED ROUTES ================= */}
          <Route element={<ProtectedRoute />}>
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
              <Route path="/folders/:folderId/:name" element={<FolderContent />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/userprofile" element={<UserProfile />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>

          {/* ================= ADMIN PROTECTED ROUTES ================= */}
          <Route element={<ProtectedRoute allowAdmin />}>
            <Route path="/admin" element={<Admin />}>
              <Route index element={<AdminHome />} />
              <Route path="home" element={<AdminHome />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="content" element={<AdminContent />} />
              <Route path="system-settings" element={<AdminSystemSettings />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="settings" element={<AdminAccountSettings />} />
            </Route>
          </Route>

        </Routes>
      </MaintenanceGuard>
    </Router>
  );
}

export default App;
