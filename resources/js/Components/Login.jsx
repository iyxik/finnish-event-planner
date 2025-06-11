import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Login.css";

function Login({ onLogin, user, onLogout }) {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const res = await fetch("http://localhost:8000/login", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const errorData = await res.json();
                setMessage(
                    errorData.message ||
                        "Login failed. Please check your credentials."
                );
                return;
            }

            const userData = await res.json();
            setMessage("Login successful!");
            onLogin(userData);
        } catch (error) {
            console.error("Login error:", error);
            setMessage("An error occurred during login. Please try again.");
        }
    };

    if (user) {
        return (
            <div className="logged-in-message">
                {" "}
                <h2>You are already logged in!</h2>
                <p>Welcome back, {user.name || user.email}.</p>
                <button onClick={onLogout} className="logout-button">
                    Logout
                </button>
                <Link to="/" className="home-link">
                    Go to Home Page
                </Link>{" "}
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="login-form">
            {" "}
            <h2>Login</h2>
            <input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
            />
            <input
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
            />
            <button type="submit">Login</button>
            {message && (
                <p
                    className={`login-message ${
                        message.includes("successful") ? "success" : "error"
                    }`}
                >
                    {message}
                </p>
            )}
        </form>
    );
}

export default Login;
