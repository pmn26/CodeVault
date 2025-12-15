import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ allowAdmin = false }) {
const user = JSON.parse(localStorage.getItem("user"));

// Not logged in
if (!user) {
    return <Navigate to="/login" replace />;
}

// Admin route protection
if (allowAdmin && user.role !== "admin") {
    return <Navigate to="/mainpage" replace />;
}

return <Outlet />;
}

export default ProtectedRoute;
