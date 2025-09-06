"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/app/supabase/createClient";
import { useRouter } from "next/navigation";


type Mentee = {
    menteeid: number;
    name: string;
    bio: string;
    skills: string[];
    target_roles: string[];
    current_level: string;
    location: string;
};

type Mentor = {
    mentorid: number;
    name: string;
    skills: string;
    specialization_roles: string[];
    experience_level: string;
    location: string;
};

const Page = () => {
    const [mentees, setMentees] = useState<Mentee[]>([]);
    const [mentors, setMentors] = useState<Mentor[]>([]);
    const router = useRouter();

    useEffect(() => {
        fetchMentees();
        fetchMentors();
    }, []);

    async function fetchMentees() {
        try {
            const { data, error } = await supabase
                .from("mentees")
                .select("*")
                .order("menteeid", { ascending: true });

            if (error) {
                console.error("Error fetching Mentees:", error.message);
                setMentees([]);
                return;
            }

            setMentees(data ?? []);
        } catch (error) {
            console.error("Supabase fetch error:", error);
            setMentees([]);
        }
    }

    async function fetchMentors() {
        try {
            const { data, error } = await supabase
                .from("mentors")
                .select("*")
                .order("mentorid", { ascending: true });

            if (error) {
                console.error("Error fetching Mentors:", error.message);
                setMentors([]);
                return;
            }

            setMentors(data ?? []);
        } catch (error) {
            console.error("Supabase fetch error:", error);
            setMentors([]);
        }
    }

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #f0fdfa 0%, #e0e7ff 100%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "2rem 1rem",
            }}
        >
            <button
                onClick={() => router.back()} // goes back to previous page
                style={{
                    position: "absolute",
                    top: "1.5rem",
                    left: "1.5rem",
                    padding: "0.75rem 1.5rem",
                    borderRadius: "0.75rem",
                    border: "none",
                    background: "#9ca3af",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "1rem",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(99,102,241,0.2)",
                    transition: "background 0.2s, box-shadow 0.2s",
                }}
            >
                Go Back
            </button>
            <button
                onClick={() => alert("ill work on it tommorrow")}
                style={{
                    position: "absolute",
                    top: "1.5rem",
                    right: "1.5rem",
                    padding: "0.75rem 1.5rem",
                    borderRadius: "0.75rem",
                    border: "none",
                    background: "linear-gradient(90deg, #6366f1 0%, #06b6d4 100%)",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    cursor: "pointer",
                    boxShadow: "0 3px 12px rgba(99,102,241,0.2)",
                    transition: "background 0.2s, box-shadow 0.2s",
                }}
            >
                Add User
            </button>

            <div className="table-card">
                <h2 style={{ marginBottom: "1rem", color: "#1e293b" }}>Registered Mentees:</h2>
                <table>
                    <thead>
                    <tr>
                        <th>Mentee ID</th>
                        <th>Name</th>
                        <th>Bio</th>
                        <th>Skills</th>
                        <th>Target Roles</th>
                        <th>Current Level</th>
                        <th>Location</th>
                    </tr>
                    </thead>
                    <tbody>
                    {mentees.map((mentee) => (
                        <tr key={mentee.menteeid}>
                            <td>{mentee.menteeid}</td>
                            <td>{mentee.name|| "-"}</td>
                            <td>{mentee.bio || "-"}</td>
                            <td>{mentee.skills?.join(", ")  || "-"}</td>
                            <td>{mentee.target_roles?.join(", ")  || "-"}</td>
                            <td>{mentee.current_level || "-"}</td>
                            <td>{mentee.location || "-"}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Mentors Table */}
            <div className="table-card">
                <h2 style={{ marginBottom: "1rem", color: "#1e293b" }}>Registered Mentors:</h2>
                <table>
                    <thead>
                    <tr>
                        <th>Mentor ID</th>
                        <th>Name</th>
                        <th>Specialisation</th>
                        <th>Experience Level</th>
                        <th>Location</th>
                    </tr>
                    </thead>
                    <tbody>
                    {mentors.map((mentor) => (
                        <tr key={mentor.mentorid}>
                            <td>{mentor.mentorid}</td>
                            <td>{mentor.name|| "-"}</td>
                            <td>{mentor.specialization_roles?.join(", ")   || "-"}</td>
                            <td>{mentor.experience_level || "-"}</td>
                            <td>{mentor.location || "-"}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Page;
