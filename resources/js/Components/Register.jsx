import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Register.css";

function Register({ user, onLogout, onRegisterSuccess }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });
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
            const res = await fetch("http://localhost:8000/register", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                const data = await res.json();
                setMessage(data.message || "Registration successful!");

                onRegisterSuccess(data);
            } else {
                const errorData = await res.json();
                setMessage(errorData.message || "Registration failed.");
                if (errorData.errors) {
                    const errorMessages = Object.values(errorData.errors)
                        .flat()
                        .join(" ");
                    setMessage((prev) => prev + " " + errorMessages);
                }
            }
        } catch (error) {
            console.error("Registration error:", error);
            setMessage("An error occurred during registration. Try again.");
        }
    };

    if (user) {
        return (
            <div className="logged-in-message">
                <h2>You are already logged in!</h2>
                <p>Welcome back, {user.name || user.email}.</p>
                <button onClick={onLogout} className="logout-button">
                    Logout
                </button>
                <Link to="/" className="home-link">
                    Go to Home Page
                </Link>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="register-form">
            <h2>Register</h2>
            <input
                name="name"
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
            />
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
            <input
                name="password_confirmation"
                type="password"
                placeholder="Confirm Password"
                value={formData.password_confirmation}
                onChange={handleChange}
                required
            />

            <button type="submit">Register</button>

            {message && (
                <p
                    className={`register-message ${
                        message.includes("successful") ? "success" : "error"
                    }`}
                >
                    {message}
                </p>
            )}
        </form>
    );
}

export default Register;
