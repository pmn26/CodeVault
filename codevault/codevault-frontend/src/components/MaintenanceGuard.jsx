import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

export default function MaintenanceGuard({ children }) {
const [blocked, setBlocked] = useState(null);

useEffect(() => {
    axios
    .get("http://localhost/CodeVault/codevault/codevault-backend/api/check_maintenance.php")
    .then((res) => {
        const user = JSON.parse(localStorage.getItem("user"));

        // Admins bypass maintenance
        if (res.data.maintenance && user?.role !== "admin") {
        setBlocked(true);
        } else {
        setBlocked(false);
        }
    })
    .catch(() => setBlocked(false));
}, []);

if (blocked === null) return null; // ⛔ prevents flicker
if (blocked) return <Navigate to="/maintenance" replace />;

return children;
}
