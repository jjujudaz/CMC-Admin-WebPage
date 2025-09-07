"use client";
import { useState } from "react";
import { supabase } from "@/app/supabase/createClient";
import { useRouter } from "next/navigation";

const Page = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [user, setUser] = useState({
        name: "",
        email: "",
        bio: "",
        dob: "",
        type: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const insertData = {
                name: user.name,
                email: user.email,
                bio: user.bio || null,
                DOB: user.dob || null,
                user_type: user.type,
                acc_status: "active",
            };

            const { data, error } = await supabase
                .from("users")
                .insert([insertData]);

            if (error) {
                console.error("Supabase error details:", error);
                alert(`Failed to add user: ${error.message}\nCode: ${error.code}\nDetails: ${error.details}`);
            } else {
                alert("User created successfully!");
                setUser({
                    name: "",
                    email: "",
                    bio: "",
                    dob: "",
                    type: "",
                });
                router.push("/viewusers");
            }
        } catch (err: any) {
            console.error("Unexpected error:", err);
            alert(`Unexpected error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-page">
            
            <form className="create-user-form" onSubmit={handleSubmit}>

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

                <label htmlFor="bio">Bio</label>
                <textarea
                    id="bio"
                    className="form-input form-textarea"
                    name="bio"
                    value={user.bio}
                    onChange={handleChange}
                    placeholder="Enter Bio"
                />

                <label htmlFor="dob">Date of Birth</label>
                <input
                    id="dob"
                    className="form-input"
                    type="date"
                    name="dob"
                    value={user.dob}
                    onChange={handleChange}
                />

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
                    <option value="student">Student</option>
                    <option value="tutor">Tutor</option>
                </select>

                <button type="submit" className="btn primary" disabled={loading}>
                    {loading ? "Creating..." : "Create User"}
                </button>
            </form>
        </div>
    );
};

export default Page;