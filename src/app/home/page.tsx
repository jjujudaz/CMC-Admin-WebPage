"use client";
import { getAuth, signOut } from "@firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import '../firebase/initialiseFirebase'


function Home() {
    const [username, setUsername] = useState<string>("");
    const router = useRouter();
    const handleLogout = async () => {
        const auth = getAuth();
        await signOut(auth);
        router.push("/");
    };

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUsername(user.displayName || user.email || "");
            } else {
                setUsername("");
            }
        });
        return () => unsubscribe();
    }, []);

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #f0fdfa 0%, #e0e7ff 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div
                style={{
                    background: "#fff",
                    borderRadius: "1.5rem",
                    boxShadow: "0 4px 32px rgba(0,0,0,0.10)",
                    padding: "2.5rem 2.5rem 2rem 2.5rem",
                    minWidth: 350,
                    maxWidth: 420,
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 24 }}>
                    <div
                        style={{
                            width: 72,
                            height: 72,
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginBottom: 12,
                            boxShadow: "0 2px 8px rgba(99,102,241,0.10)",
                        }}
                    >
                        <span style={{ color: "#fff", fontSize: 32, fontWeight: 700 }}>
                            {username ? username[0]?.toUpperCase() : "A"}
                        </span>
                    </div>
                    <h2 style={{ fontWeight: 700, fontSize: 24, color: "#1e293b", margin: 0 }}>Admin Dashboard</h2>
                    <p style={{ color: "#64748b", marginTop: 6, fontSize: 15, marginBottom: 0 }}>
                        Welcome, <span style={{ fontWeight: 600 }}>{username}</span>
                    </p>
                </div>
                <div style={{ width: "100%", marginBottom: 24 }}>
                    <h3 style={{ color: "#334155", fontWeight: 600, fontSize: 18, marginBottom: 12 }}>Admin Features</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <button
                            style={{
                                padding: "10px 0",
                                borderRadius: 8,
                                background: "linear-gradient(90deg, #6366f1 0%, #06b6d4 100%)",
                                color: "#fff",
                                fontWeight: 600,
                                fontSize: 16,
                                border: "none",
                                cursor: "pointer",
                                boxShadow: "0 2px 8px rgba(99,102,241,0.10)",
                                transition: "background 0.2s, box-shadow 0.2s",
                            }}
                            onClick={() => alert("Feature coming soon!")}
                        >
                            Manage Users
                        </button>
                        <button
                            style={{
                                padding: "10px 0",
                                borderRadius: 8,
                                background: "linear-gradient(90deg, #06b6d4 0%, #6366f1 100%)",
                                color: "#fff",
                                fontWeight: 600,
                                fontSize: 16,
                                border: "none",
                                cursor: "pointer",
                                boxShadow: "0 2px 8px rgba(6,182,212,0.10)",
                                transition: "background 0.2s, box-shadow 0.2s",
                            }}
                            onClick={() => alert("Feature coming soon!")}
                        >
                            View Reports
                        </button>
                        <button
                            style={{
                                padding: "10px 0",
                                borderRadius: 8,
                                background: "#f59e42",
                                color: "#fff",
                                fontWeight: 600,
                                fontSize: 16,
                                border: "none",
                                cursor: "pointer",
                                boxShadow: "0 2px 8px rgba(245,158,66,0.10)",
                                transition: "background 0.2s, box-shadow 0.2s",
                            }}
                            onClick={() => alert("Feature coming soon!")}
                        >
                            Settings
                        </button>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    style={{
                        marginTop: 8,
                        padding: "10px 0",
                        borderRadius: 8,
                        background: "#ef4444",
                        color: "#fff",
                        fontWeight: 600,
                        fontSize: 16,
                        border: "none",
                        cursor: "pointer",
                        width: "100%",
                        boxShadow: "0 2px 8px rgba(239,68,68,0.10)",
                        transition: "background 0.2s, box-shadow 0.2s",
                    }}
                >
                    Log Out
                </button>
            </div>
        </div>
    );
}

export default Home;