'use client'
import '../firebase/initialiseFirebase'
import { useEffect, useState } from "react";


function Users() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUsers() {
            setLoading(true);
            const res = await fetch("/api/list-users");
            if (res.ok) {
                const data = await res.json();
                setUsers(data.users);
            }
            setLoading(false);
        }
        fetchUsers();
    }, []);

    return (
        <div style={{ maxWidth: 600, margin: "40px auto", background: "red", borderRadius: 12, boxShadow: "0 2px 16px rgba(0,0,0,0.08)", padding: 32 }}>
            <h2 style={{ fontWeight: 700, fontSize: 24, marginBottom: 24 }}>All Users</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <ul>
                    {users.map((user) => (
                        <li key={user.uid} style={{ marginBottom: 12 }}>
                            <strong>{user.displayName || user.email}</strong> <br />
                            <span style={{ color: "#64748b" }}>{user.email}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Users;