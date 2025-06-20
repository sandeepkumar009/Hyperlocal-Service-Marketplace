import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [role, setRole] = useState("user");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/api/register", { name, email, phoneNumber, role, password });
            navigate("/login");
        } catch (error) {
            setErr("Register failed!")
        }
    };

    return (
        <form onSubmit={handleRegister} className="max-w-sm mx-auto my-10">
            <div className="mb-3">
                <label className="block mb-1">Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full border px-2 py-1"
                />
            </div>
            <div className="mb-3">
                <label className="block mb-1">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full border px-2 py-1"
                />
            </div>
            <div className="mb-3">
                <label className="block mb-1">Phone Number</label>
                <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    className="w-full border px-2 py-1"
                />
            </div>
            <div className="mb-3">
                <label className="block mb-1">Role</label>

                <select onChange={(e) => setRole(e.target.value)} name="role" id="role" className="w-full border px-2 py-1">
                    <option value="user">User</option>
                    <option value="provider">Provider</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
            <div className="mb-3">
                <label className="block mb-1">Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full border px-2 py-1"
                />
            </div>
            <button type="submit" className="border px-4 py-1">
                Register
            </button>
        </form>
    )
}

export default Register;
