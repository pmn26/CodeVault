import React, { useEffect, useState } from "react";
import axios from "axios";
import "../assets/admin.css";

export default function RecentUploads() {
const [uploads, setUploads] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
    const fetchUploads = async () => {
    try {
        const res = await axios.get(
        "http://localhost/CodeVault/codevault/codevault-backend/api/recent_uploads.php"
        );
        setUploads(res.data);
    } catch (err) {
        console.error(err);
        setError("Failed to fetch recent uploads.");
    } finally {
        setLoading(false);
    }
    };

    fetchUploads();
}, []);
}
