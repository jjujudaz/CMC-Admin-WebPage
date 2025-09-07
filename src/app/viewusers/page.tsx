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
    study_level: string;
    location: string;
};

type Mentor = {
    mentorid: number;
    name: string;
    bio: string;
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
        <div className="create-page">

        <button onClick={() => router.push('/home')} className="go-back-btn">
                Go Back
            </button>

            <button className="add-mentee-btn" onClick={() => router.push('/addmentee')}>
                Create Mentee
            </button>
            <button className="add-mentor-btn" onClick={() => router.push('/addmentor')}
            >
                Create Mentor
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
                        <th>Study Level</th>
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
                            <td>{mentee.study_level || "-"}</td>
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
                        <th>Bio</th>
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
                            <td>{mentor.bio || "-"}</td>
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
