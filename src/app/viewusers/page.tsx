"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/app/supabase/createClient";
import { useRouter } from "next/navigation";

type User = {
    id: number;
    name: string;
    bio: string;
    dob: string | null;
    type: "student" | "tutor";
    acc_status?: string;
};

const Page = () => {
    const [students, setStudents] = useState<User[]>([]);
    const [tutors, setTutors] = useState<User[]>([]);
    const router = useRouter();

    useEffect(() => {
        fetchUsers();
    }, []);

    async function fetchUsers() {
        try {
            const { data, error } = await supabase
                .from("users")
                .select("id, name, bio, DOB, user_type, acc_status")
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
            }));

            const studentsList = mappedData.filter((user: User) => user.type === "student");
            const tutorsList = mappedData.filter((user: User) => user.type === "tutor");

            setStudents(studentsList);
            setTutors(tutorsList);
        } catch (error) {
            console.error("Supabase fetch error:", error);
            setStudents([]);
            setTutors([]);
        }
    }

    async function suspendUser(id: number) {
        const { error } = await supabase
            .from("users")
            .update({ acc_status: "suspended" })
            .eq("id", id);

        if (error) {
            console.error("Failed to suspend user:", error.message);
            alert("Failed to suspend user: " + error.message);
        } else {
            fetchUsers();
        }
    }

    async function deleteUser(id: number) {
        const { error } = await supabase
            .from("users")
            .delete()
            .eq("id", id);

        if (error) {
            console.error("Failed to delete user:", error.message);
            alert("Failed to delete user: " + error.message);
        } else {
            setStudents((prev) => prev.filter((user) => user.id !== id));
            setTutors((prev) => prev.filter((user) => user.id !== id));
        }
    }

    return (
        <div className="create-page" style={{ display: "flex", gap: 32 }}>
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
                <h3 style={{ color: "#334155", fontWeight: 700, marginBottom: 12 }}>Actions</h3>
                <button
                    style={{
                        padding: "10px 18px",
                        borderRadius: 8,
                        background: "linear-gradient(90deg, #6366f1 0%, #06b6d4 100%)",
                        color: "#fff",
                        fontWeight: 600,
                        fontSize: 15,
                        border: "none",
                        cursor: "pointer",
                        marginBottom: 8,
                        width: "100%"
                    }}
                    onClick={() => router.push('/create-user')}
                >
                    Create User
                </button>
                
            </div>

            {/* Main content */}
            <div style={{ flex: 1 }}>
                <div className="table-card">
                    <h2 style={{ marginBottom: "1rem", color: "#1e293b" }}>Students</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Bio</th>
                                <th>DOB</th>
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
                    <h2 style={{ marginBottom: "1rem", color: "#1e293b" }}>Tutors</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Bio</th>
                                <th>DOB</th>
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