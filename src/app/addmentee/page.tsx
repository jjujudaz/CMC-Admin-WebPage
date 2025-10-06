"use client";
import { useState } from "react";
import { supabase } from "@/app/supabase/createClient";
import { useRouter } from "next/navigation";

const Page = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [mentee, setMentee] = useState({
        name: "",
        email: "",
        bio: "",
        skills: "",
        target_roles: "",
        study_level: "",
        location: "",
    });

    const handleChange = (e: any) => {
        setMentee({
            ...mentee,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        try {
            // to convert skills and target_roles into array
            const skillsArray = mentee.skills
                ? mentee.skills.split(",").map((s) => s.trim()).filter(s => s.length > 0)
                : [];
            const rolesArray = mentee.target_roles
                ? mentee.target_roles.split(",").map((r) => r.trim()).filter(r => r.length > 0)
                : [];

            const insertData = {
                name: mentee.name,
                email: mentee.email,
                bio: mentee.bio || null,
                skills: skillsArray,
                target_roles: rolesArray,
                study_level: mentee.study_level || null,
                location: mentee.location || null,
            };

            console.log("Inserting data:", insertData);

            const { data, error } = await supabase
                .from("mentees")
                .insert([insertData]);

            if (error) {
                console.error("Supabase error details:", error);
                alert(`Failed to add mentee: ${error.message}\nCode: ${error.code}\nDetails: ${error.details}`);
            } else {
                console.log("Success! Inserted data:", data);
                alert("Mentee created successfully!");

                setMentee({
                    name: "",
                    email:"",
                    bio: "",
                    skills: "",
                    target_roles: "",
                    study_level: "",
                    location: "",
                });

                router.push("/viewusers");
            }
        } catch (error) {
            console.error("Unexpected error:", error);
            alert(`Unexpected error: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-page">
            <button onClick={() => router.push('/viewusers')} className="go-back-btn">
                Go Back
            </button>

            <form className="create-mentee-form" onSubmit={handleSubmit}>
                <h2 className="form-title">Create New Mentee</h2>

                <label htmlFor="name">Name *</label>
                <input
                    id="name"
                    className="form-input"
                    type="text"
                    name="name"
                    value={mentee.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    required
                />

                <label htmlFor="email">Email *</label>
                <input
                    id="email"
                    className="form-input"
                    type="text"
                    name="email"
                    value={mentee.email}
                    onChange={handleChange}
                    placeholder="sample@email.com"
                    required
                />

                <label htmlFor="bio">Bio</label>
                <textarea
                    id="bio"
                    className="form-input form-textarea"
                    name="bio"
                    value={mentee.bio}
                    onChange={handleChange}
                    placeholder="Enter Bio"
                />

                <label htmlFor="skills">Skills (comma separated)</label>
                <input
                    id="skills"
                    className="form-input"
                    type="text"
                    name="skills"
                    value={mentee.skills}
                    onChange={handleChange}
                    placeholder="Enter user Skills"
                />

                <label htmlFor="target_roles">Target Roles (comma separated)</label>
                <input
                    id="target_roles"
                    className="form-input"
                    type="text"
                    name="target_roles"
                    value={mentee.target_roles}
                    onChange={handleChange}
                    placeholder="Enter user target occupations"
                />

                <label htmlFor="current_level">Study Level</label>
                <select
                    id="study_level"
                    className="form-input"
                    name="study_level"
                    value={mentee.study_level}
                    onChange={handleChange}
                >
                    <option value="">Select a Study level...</option>
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Postgraduate">Postgraduate</option>
                    <option value="Bootcamp">Bootcamp</option>
                    <option value="Self-taught">Self-taught</option>
                    <option value="Professional Development">Professional Development</option>
                    <option value="Other">Other</option>
                </select>

                <label htmlFor="location">Location</label>
                <input
                    id="location"
                    className="form-input"
                    type="text"
                    name="location"
                    value={mentee.location}
                    onChange={handleChange}
                    placeholder="Current Location..."
                />

                <button type="submit" className="btn primary" disabled={loading}>
                    {loading ? "Creating..." : "Create Mentee"}
                </button>
            </form>
        </div>
    );
};

export default Page;