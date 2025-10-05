"use client";
// Marks file as a client-side component

import { useState, useEffect } from "react";
import { supabase } from "@/app/supabase/createClient";
import { useRouter } from "next/navigation";

// Define a TypeScript type for a User object
type User = {
    id: number;
    name: string;
    bio: string;
    dob: string | null;
    type: "student" | "tutor";
    acc_status?: string;
    skills?: string;
};

const Page = () => {
    // State variables for lists of students and tutors
    const [students, setStudents] = useState<User[]>([]);
    const [tutors, setTutors] = useState<User[]>([]);
    const router = useRouter();

    // Runs once when the component mounts to fetch all users
    useEffect(() => {
        fetchUsers();
    }, []);

    // Function to fetch the users from Supabase
    async function fetchUsers() {
        try {
            // Query the "users" table and select specific columns
            const { data, error } = await supabase
                .from("users")
                .select("id, name, bio, DOB, user_type, acc_status, mentors(skills), mentees(skills)")
                .order("id", { ascending: true });

            if (error) {
                console.error("Error fetching users:", error.message);
                setStudents([]);
                setTutors([]);
                return;
            }

            // Map the fetched data to match the expected property names
            const mappedData = (data ?? []).map((user: any) => ({
                id: user.id,
                name: user.name,
                bio: user.bio,
                dob: user.DOB,
                type: user.user_type,
                acc_status: user.acc_status,
                skills:
                    user.user_type?.toLowerCase() === "mentor"
                        ? user.mentors?.skills
                        : user.mentees?.skills,
            }));

            // Separate users into Mentee and Mentor based on their type
            const studentsList = mappedData.filter((user: User) => user.type === "Mentee");
            const tutorsList = mappedData.filter((user: User) => user.type === "Mentor");

            // Update the state variables
            setStudents(studentsList);
            setTutors(tutorsList);
        } catch (error) {
            console.error("Supabase fetch error:", error);
            setStudents([]);
            setTutors([]);
        }
    }

    // Function to suspend a user (sets acc_status to "suspended")
    async function suspendUser(id: number) {
        const { error } = await supabase
            .from("users")
            .update({ acc_status: "suspended" })
            .eq("id", id);

        if (error) {
            console.error("Failed to suspend user:", error.message);
            alert("Failed to suspend user: " + error.message);
        } else {
            fetchUsers(); // Refreshes the table after update
        }
    }

    // Function to permanently delete a user
    async function deleteUser(id: number) {
        const { error } = await supabase
            .from("users")
            .delete()
            .eq("id", id);

        if (error) {
            console.error("Failed to delete user:", error.message);
            alert("Failed to delete user: " + error.message);
        } else {
            // update UI without full re-fetch
            setStudents((prev) => prev.filter((user) => user.id !== id));
            setTutors((prev) => prev.filter((user) => user.id !== id));
        }
    }

    return (
        <div className="create-page" style={{ display: "flex", gap: 32 }}>
                <button onClick={() => router.push('/home')} className="back-btn">
                    Back
                </button>

            {/* Side panel for create actions */}
            <div style={{
                minWidth: 180,
                background: "#f8fafc",
                borderRadius: 12,
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                padding: "24px 18px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 18,
                height: "fit-content"
            }}>

                <h3 style={{ color: "#334155", fontWeight: 700, marginBottom: 12 }}>Create Action</h3>
                <button className="btn primary" onClick={() => router.push('/create-user')}>
                    Create User
                </button>
                
            </div>

            {/* Main content */}
            <div style={{ flex: 1 }}>
                <div className="table-card">
                    <h2 style={{ marginBottom: "1rem", color: "#1e293b" }}>Students Table</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Bio</th>
                                <th>DOB</th>
                                <th>Skills</th>
                                <th>Suspend</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.name || "-"}</td>
                                    <td>{user.bio || "-"}</td>
                                    <td>{user.dob || "-"}</td>
                                    <td>
                                        {user.skills && user.skills.length > 0 ? (
                                            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                                                {user.skills.map((skill, i) => (
                                                    <span
                                                        key={i}
                                                        style={{
                                                            background: "#e0f2fe",
                                                            color: "#0369a1",
                                                            padding: "3px 8px",
                                                            borderRadius: "6px",
                                                            fontSize: "0.85rem",
                                                        }}
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            "-"
                                        )}
                                    </td>
                                    <td>
                                        <button
                                            style={{
                                                padding: "6px 14px",
                                                borderRadius: 6,
                                                background: user.acc_status === "suspended" ? "#d1d5db" : "#f59e42",
                                                color: "#fff",
                                                fontWeight: 600,
                                                border: "none",
                                                cursor: user.acc_status === "suspended" ? "not-allowed" : "pointer",
                                                marginRight: 8,
                                            }}
                                            onClick={() => suspendUser(user.id)}
                                            disabled={user.acc_status === "suspended"}
                                        >
                                            {user.acc_status === "suspended" ? "Suspended" : "Suspend"}
                                        </button>
                                    </td>
                                    <td>
                                        <button
                                            style={{
                                                padding: "6px 14px",
                                                borderRadius: 6,
                                                background: "#ef4444",
                                                color: "#fff",
                                                fontWeight: 600,
                                                border: "none",
                                                cursor: "pointer",
                                            }}
                                            onClick={() => {
                                                if (window.confirm("Are you sure you want to delete this user?")) {
                                                    deleteUser(user.id);
                                                }
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="table-card" style={{ marginTop: 32 }}>
                    <h2 style={{ marginBottom: "1rem", color: "#1e293b" }}>Tutors Table</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Bio</th>
                                <th>DOB</th>
                                <th>Skills</th>
                                <th>Suspend</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tutors.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.name || "-"}</td>
                                    <td>{user.bio || "-"}</td>
                                    <td>{user.dob || "-"}</td>
                                    <td>
                                        {user.skills && user.skills.length > 0 ? (
                                            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                                                {user.skills.map((skill, i) => (
                                                    <span
                                                        key={i}
                                                        style={{
                                                            background: "#e0f2fe",
                                                            color: "#0369a1",
                                                            padding: "3px 8px",
                                                            borderRadius: "6px",
                                                            fontSize: "0.85rem",
                                                        }}
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            "-"
                                        )}
                                    </td>
                                    <td>
                                        <button
                                            style={{
                                                padding: "6px 14px",
                                                borderRadius: 6,
                                                background: user.acc_status === "suspended" ? "#d1d5db" : "#f59e42",
                                                color: "#fff",
                                                fontWeight: 600,
                                                border: "none",
                                                cursor: user.acc_status === "suspended" ? "not-allowed" : "pointer",
                                                marginRight: 8,
                                            }}
                                            onClick={() => suspendUser(user.id)}
                                            disabled={user.acc_status === "suspended"}
                                        >
                                            {user.acc_status === "suspended" ? "Suspended" : "Suspend"}
                                        </button>
                                    </td>
                                    <td>
                                        <button
                                            style={{
                                                padding: "6px 14px",
                                                borderRadius: 6,
                                                background: "#ef4444",
                                                color: "#fff",
                                                fontWeight: 600,
                                                border: "none",
                                                cursor: "pointer",
                                            }}
                                            onClick={() => {
                                                if (window.confirm("Are you sure you want to delete this user?")) {
                                                    deleteUser(user.id);
                                                }
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Page;