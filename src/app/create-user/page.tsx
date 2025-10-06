"use client";
import { useState } from "react";
import { supabase } from "@/app/supabase/createClient";
import { useRouter } from "next/navigation";

type UserForm = {
    name: string;
    email: string;
    bio: string;
    dob: string;
    type: string;
};

const Page = () => {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);

    // Define objects to hold form values. Empty values to begin with
    const [user, setUser] = useState<UserForm>({
        name: "",
        email: "",
        bio: "",
        dob: "",
        type: "",
    });

    // List of skills a user can select from
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

    // Track selected skills
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

    // Handle selecting/deselecting skills
    const toggleSkill = (skill: string) => {
        setSelectedSkills((prev) =>
            prev.includes(skill)
                ? prev.filter((s) => s !== skill)
                : [...prev, skill]
        );
    };

    // Handles updates to any form field dynamically
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value,
        });
    };

    // Handles form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Create a Supabase Auth user uses a temporary password (since the user is not real)
            const tempPassword = Math.random().toString(36).slice(-8); // auto-generate 8-char password

            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: user.email,
                password: tempPassword,
            });

            if (authError) throw authError;
            if (!authData?.user) throw new Error("Auth user was not created");

            const authUserId = authData.user.id; // the UUID to link everything

            // Insert into the users table
            const {  error: userError } = await supabase
                .from("users")
                .insert([
                    {
                        auth_user_id: authUserId, // link to Supabase Auth
                        name: user.name,
                        email: user.email,
                        bio: user.bio || null,
                        DOB: user.dob || null,
                        user_type: user.type,
                        acc_status: "active",
                    },
                ])
                .select()
                .single();

            if (userError) throw userError;
            // Determine which table to insert into
            const targetTable =
                user.type === "Mentor"
                    ? "mentors"
                    : user.type === "Mentee"
                        ? "mentees"
                        : null;

            if (!targetTable) throw new Error("Invalid user type selected");

            // If skills are selected, insert them into mentor/mentee table
            if (selectedSkills.length > 0) {
                const { error: skillsError } = await supabase
                    .from(targetTable)
                    .insert([
                        {
                            user_id: authUserId, // FK from users table
                            skills: selectedSkills, // insert the full array, not individual strings
                        },
                    ]);

                if (skillsError) throw skillsError;
            }

            alert("User and skills created successfully!");
            setUser({
                name: "",
                email: "",
                bio: "",
                dob: "",
                type: "",
            });
            setSelectedSkills([]);
            router.push("/viewusers");
        } catch (err: unknown) {
            // Narrow unknown to retrieve a safe error message without using `any`
            let message = "An unknown error occurred";
            if (err instanceof Error) message = err.message;
            else if (typeof err === "object" && err !== null && "message" in err) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                message = (err as any).message ?? message;
            }

            console.error("Error creating user:", err);
            alert(`Error: ${message}`);
        } finally {
            setLoading(false);
        }

    };

    return (
        <div className="create-page">
            <button onClick={() => router.push('/viewusers')} className="back-btn">
                Back
            </button>
            <div className="create-user-form-card">
                <h1 className="form-title">Create a New User</h1>
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
                    placeholder="Full Name"
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
                    placeholder="sample@email.com"
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
                    placeholder="Enter Bio"
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
                    {loading ? "Creating..." : "Create User"}
                </button>
            </form>
            </div>
        </div>
    );
};

export default Page;