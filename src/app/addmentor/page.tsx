"use client";
import { useState } from "react";
import { supabase } from "@/app/supabase/createClient";
import { useRouter } from "next/navigation";

const Page = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [mentor, setMentor] = useState({
        name: "",
        email: "",
        bio: "",
        skills: "",
        specialization_roles: "",
        experience_level: "",
        location: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setMentor({
            ...mentor,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            // convert skills and specialisation into array
            const skillsArray = mentor.skills
                ? mentor.skills.split(",").map((s) => s.trim()).filter(s => s.length > 0)
                : [];
            const specialisationArray = mentor.specialization_roles
                ? mentor.specialization_roles.split(",").map((r) => r.trim()).filter(r => r.length > 0)
                : [];

            const insertData = {
                name: mentor.name,
                email: mentor.email,
                bio: mentor.bio || null,
                skills: skillsArray,
                specialization_roles: specialisationArray,
                experience_level: mentor.experience_level || null,
                location: mentor.location || null,
            };

            console.log("Inserting data:", insertData);

            const { data, error } = await supabase
                .from("mentors")
                .insert([insertData]);

            if (error) {
                console.error("Supabase error details:", error);
                alert(`Failed to add Mentor: ${error.message}\nCode: ${error.code}\nDetails: ${error.details}`);
            } else {
                console.log("Success! Inserted data:", data);
                alert("Mentor created successfully!");

                setMentor({
                    name: "",
                    email:"",
                    bio: "",
                    skills: "",
                    specialization_roles: "",
                    experience_level: "",
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
                    value={mentor.name}
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
                    value={mentor.email}
                    onChange={handleChange}
                    placeholder="sample@email.com"
                    required
                />

                <label htmlFor="bio">Bio</label>
                <textarea
                    id="bio"
                    className="form-input form-textarea"
                    name="bio"
                    value={mentor.bio}
                    onChange={handleChange}
                    placeholder="Enter Bio"
                />

                <label htmlFor="skills">Skills (comma separated)</label>
                <input
                    id="skills"
                    className="form-input"
                    type="text"
                    name="skills"
                    value={mentor.skills}
                    onChange={handleChange}
                    placeholder="Enter user Skills"
                />

                <label htmlFor="specialization_roles">Area of Specialisation (comma separated)</label>
                <input
                    id="specialization_roles"
                    className="form-input"
                    type="text"
                    name="specialization_roles"
                    value={mentor.specialization_roles}
                    onChange={handleChange}
                    placeholder="Enter area of specialization"
                />

                <label htmlFor="experience_level">Experience Level</label>
                <select
                    id="experience_level"
                    className="form-input"
                    name="experience_level"
                    value={mentor.experience_level}
                    onChange={handleChange}
                >
                    <option value="">Select Experience Level...</option>
                    <option value="Mid-level">Mid-level</option>
                    <option value="Senior">Senior</option>
                    <option value="Expert">Expert</option>
                    <option value="Principal">Principal</option>
                    <option value="Executive">Executive</option>
                </select>

                <label htmlFor="location">Location</label>
                <input
                    id="location"
                    className="form-input"
                    type="text"
                    name="location"
                    value={mentor.location}
                    onChange={handleChange}
                    placeholder="Current Location..."
                />

                <button type="submit" className="btn primary" disabled={loading}>
                    {loading ? "Creating..." : "Create Mentor"}
                </button>
            </form>
        </div>
    );
};

export default Page;