import React from "react";

export default function Maintenance() {
return (
    <div
    style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0f172a",
        color: "#ffffff",
        textAlign: "center",
        padding: "20px",
    }}
    >
    <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>
        🚧 Maintenance Mode
    </h1>
    <p style={{ fontSize: "1.2rem", maxWidth: "500px" }}>
        CodeVault is currently undergoing maintenance.
        <br />
        Please check back later.
    </p>
    </div>
);
}
