/*
import React, { useState, useEffect } from "react";

export function Labels() {
    const [labels, setLabels] = useState([]);

    useEffect(() => {
        const fetchLabels = async () => {
            try {
                const res = await fetch("http://localhost:3880/api/v1/labels/", {
                    headers: {
                        Accept: "application/json",
                        ContentType: "application/json",
                        Authorization: "Basic YWRtaW46ZGlja2VyZWxjaA==",
                    },
                });
                const json = await res.json();
                setLabels(json.labels || []);
            } catch (error) {
                console.error("Error fetching labels:", error);
            }
        };

        fetchLabels();
    }, []);

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            {labels.length === 0 ? (
                <p>No labels found.</p>
            ) : (
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    {labels.map((label) => (
                        <button
                            key={label}
                            style={{
                                padding: "8px 16px",
                                border: "1px solid #007bff",
                                borderRadius: "5px",
                                backgroundColor: "#f0f8ff",
                                cursor: "pointer",
                            }}
                            onClick={() => alert(`You clicked: ${label}`)}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}*/

import React, { useState, useEffect } from "react";

export function Labels() {
    const [labels, setLabels] = useState([]);
    const [token, setToken] = useState(""); // store JWT
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    // Login to get explicit JWT
    const handleLogin = async () => {
        setError("");
        try {
            const res = await fetch("http://localhost:3880/api/v1/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
            if (!res.ok) throw new Error("Invalid credentials");
            const data = await res.json();
            setToken(data.token); // save JWT
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        if (!token) return; // don't fetch if no token

        const fetchLabels = async () => {
            try {
                const res = await fetch("http://localhost:3880/api/v1/labels/", {
                    headers: {
                        Accept: "application/json",
                        ContentType: "application/json",
                        Authorization: `Bearer ${token}`, // use JWT
                    },
                });
                const json = await res.json();
                setLabels(json.labels || []);
            } catch (error) {
                console.error("Error fetching labels:", error);
            }
        };

        fetchLabels();
    }, [token]);

    if (!token) {
        // show login form if not logged in
        return (
            <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
                <h2>Login to Access Labels</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "300px" }}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{ padding: "8px" }}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ padding: "8px" }}
                    />
                    <button onClick={handleLogin} style={{ padding: "10px", cursor: "pointer" }}>
                        Login
                    </button>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                </div>
            </div>
        );
    }

    // show labels if logged in
    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            {labels.length === 0 ? (
                <p>No labels found.</p>
            ) : (
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    {labels.map((label) => (
                        <button
                            key={label}
                            style={{
                                padding: "8px 16px",
                                border: "1px solid #007bff",
                                borderRadius: "5px",
                                backgroundColor: "#f0f8ff",
                                cursor: "pointer",
                            }}
                            onClick={() => alert(`You clicked: ${label}`)}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
