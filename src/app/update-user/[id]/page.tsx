"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/app/supabase/createClient";

type UserForm = {
    name: string;
    email: string;
    bio: string;
    dob: string;
    type: string;
};

const UpdateUserPage = () => {
    const router = useRouter();
    const { id } = useParams(); // get user.id

    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<UserForm>({
        name: "",
        email: "",
        bio: "",
        dob: "",
        type: "",
    });
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

    const availableSkills = [
        "Network Security",
        "Cloud Security",
        "Penetration Testing",
        "Incident Response",
        "Cryptography",
        "Malware Analysis",
        "Threat Intelligence",
        "Container Security",
        "Application Security",
        "Risk Management",
        "Ethical Hacking",
        "IoT Security",
        "Linux Administration",
        "Secure Software Development",
    ];

    // Load user info when page opens
    useEffect(() => {
        const fetchUser = async () => {
            if (!id) return;
            setLoading(true);

            try {
                // Fetch user record from users table
                const { data: userData, error: userError } = await supabase
                    .from("users")
                    .select("*")
                    .eq("id", id)
                    .single();

                if (userError) throw userError;
                if (!userData) throw new Error("User not found");

                setUser({
                    name: userData.name || "",
                    email: userData.email || "",
                    bio: userData.bio || "",
                    dob: userData.DOB || "",
                    type: userData.user_type || "",
                });

                // Fetch skills from mentors or mentees
                const targetTable =
                    userData.user_type === "Mentor"
                        ? "mentors"
                        : userData.user_type === "Mentee"
                            ? "mentees"
                            : null;

                if (targetTable) {
                    const { data: skillsData, error: skillsError } = await supabase
                        .from(targetTable)
                        .select("skills")
                        .eq("user_id", userData.auth_user_id)
                        .single();

                    if (skillsError && skillsError.code !== "PGRST116") throw skillsError; // ignore the "no rows" error
                    if (skillsData && skillsData.skills) {
                        setSelectedSkills(skillsData.skills);
                    }
                }
            } catch (err) {
                console.error("Error loading user:", err);
                alert("Failed to load user data.");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id]);

    // Function to toggle skills
    const toggleSkill = (skill: string) => {
        setSelectedSkills((prev) =>
            prev.includes(skill)
                ? prev.filter((s) => s !== skill)
                : [...prev, skill]
        );
    };

    // Handle input changes
    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    // Update the user in Supabase database
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Update main user data
            const { error: updateError } = await supabase
                .from("users")
                .update({
                    name: user.name,
                    email: user.email,
                    bio: user.bio || null,
                    DOB: user.dob || null,
                    user_type: user.type,
                })
                .eq("id", id);

            if (updateError) throw updateError;

            // Get auth_user_id to update skills table
            const { data: userData } = await supabase
                .from("users")
                .select("auth_user_id")
                .eq("id", id)
                .single();

            const authId = userData?.auth_user_id;
            if (!authId) throw new Error("Could not find auth_user_id");

            // Determine mentor/mentee table
            const targetTable =
                user.type === "Mentor"
                    ? "mentors"
                    : user.type === "Mentee"
                        ? "mentees"
                        : null;

            if (!targetTable) throw new Error("Invalid user type");

            // Update and insert skills
            const { data: existingSkills } = await supabase
                .from(targetTable)
                .select("user_id")
                .eq("user_id", authId)
                .maybeSingle();

            if (existingSkills) {
                await supabase
                    .from(targetTable)
                    .update({ skills: selectedSkills })
                    .eq("user_id", authId);
            } else {
                await supabase
                    .from(targetTable)
                    .insert([{ user_id: authId, skills: selectedSkills }]);
            }

            alert("User updated successfully!");
            router.push("/viewusers");
        } catch (err) {
            console.error("Error updating user:", err);
            alert("Error updating user data.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-page">
            <button onClick={() => router.push("/viewusers")} className="back-btn">
                Back
            </button>
            <div className="create-user-form-card">
                <h1 className="form-title">Update User Details</h1>
                {loading ? (
                    <p style={{ color: "black" }}>Loading user data...</p>
                ) : (
                    <form className="create-user-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Name *</label>
                            <input
                                id="name"
                                className="form-input"
                                type="text"
                                name="name"
                                value={user.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email *</label>
                            <input
                                id="email"
                                className="form-input"
                                type="email"
                                name="email"
                                value={user.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="bio">Bio</label>
                            <textarea
                                id="bio"
                                className="form-input form-textarea"
                                name="bio"
                                value={user.bio}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="dob">Date of Birth</label>
                            <input
                                id="dob"
                                className="form-input"
                                type="date"
                                name="dob"
                                value={user.dob}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Skills</label>
                            <div className="skills-container">
                                {availableSkills.map((skill) => (
                                    <button
                                        key={skill}
                                        type="button"
                                        className={`skill-btn ${
                                            selectedSkills.includes(skill) ? "selected" : ""
                                        }`}
                                        onClick={() => toggleSkill(skill)}
                                    >
                                        {skill}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="type">User Type *</label>
                            <select
                                id="type"
                                className="form-input"
                                name="type"
                                value={user.type}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select user type...</option>
                                <option value="Mentee">Student</option>
                                <option value="Mentor">Tutor</option>
                            </select>
                        </div>

                        <button type="submit" className="btn primary" disabled={loading}>
                            {loading ? "Updating..." : "Update User"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default UpdateUserPage;
