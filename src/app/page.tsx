'use client'
import Image from "next/image";
import styles from "./page.module.css";
import './firebase/initialiseFirebase'

import { getAuth, signInWithEmailAndPassword } from "@firebase/auth";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const router = useRouter();
  const auth = getAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // setMessage("Login successful!");
  router.push('/home')


    } catch (error) {
      setMessage(`Login failed: ${error.message}`);
    }
  };

  useEffect(() => {
    // Optional: check if user is already logged in
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setMessage(`Logged in as ${user.email}`);
  router.push('/home')
      } else {
        setMessage("");
      }
    });
    return () => unsubscribe();
  }, [auth]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%)",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "1.25rem",
          boxShadow: "0 4px 32px rgba(0,0,0,0.10)",
          padding: "2.5rem 2rem 2rem 2rem",
          minWidth: 340,
          maxWidth: 380,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Image src="/globe.svg" alt="Logo" width={48} height={48} style={{ marginBottom: 12 }} />
        <h1 style={{ fontWeight: 700, fontSize: 28, marginBottom: 8, color: "#1e293b" }}>Sign in</h1>
        <p style={{ color: "#64748b", marginBottom: 24, fontSize: 15 }}>Welcome back! Please enter your details.</p>
        <form
          onSubmit={handleLogin}
          style={{ width: "100%", display: "flex", flexDirection: "column", gap: 18 }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label htmlFor="email" style={{ fontWeight: 500, color: "#334155", marginBottom: 2 }}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                border: "1px solid #cbd5e1",
                color: '#000',
                fontSize: 15,
                outline: "none",
                marginBottom: 2,
                background: "#f8fafc",
                transition: "border 0.2s",
              }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label htmlFor="password" style={{ fontWeight: 500, color: "#334155", marginBottom: 2 }}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                border: "1px solid #cbd5e1",
                fontSize: 15,
                outline: "none",
                color: '#000',
                marginBottom: 2,
                background: "#f8fafc",
                transition: "border 0.2s",
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              marginTop: 10,
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
          >
            Log In
          </button>
        </form>
        {message && (
          <p
            style={{
              marginTop: 18,
              color: message.startsWith("Login successful") ? "#059669" : "#dc2626",
              background: message.startsWith("Login successful") ? "#f0fdf4" : "#fef2f2",
              borderRadius: 6,
              padding: "8px 12px",
              fontSize: 15,
              width: "100%",
              textAlign: "center",
              fontWeight: 500,
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
