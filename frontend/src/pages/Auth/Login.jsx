import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");
    const navigate = useNavigate();
    
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/api/login", { email, password });
            const { token, user } = res.data;
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            
            login(user, token);

            if(user.role === "user")
                navigate("/userDashboard");
            else if(user.role === "admin")
                navigate("/adminDashboard");
            else
                navigate("/providerDashboard");
        } catch (error) {
            setErr("Login failed!")
        }
    };

    return (
        <form onSubmit={handleLogin} className="max-w-sm mx-auto my-10">
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
                Login
            </button>
        </form>
    );
};

export default Login;
