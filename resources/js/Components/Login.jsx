import React, { useState } from "react";
// If you decide to use Axios in the future, you would import it here:
// import axios from "axios";

function Login({ onLogin }) {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [message, setMessage] = useState(""); // For displaying success/error messages to the user

    // Handles changes in form inputs and updates the state
    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    // Handles form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior (page reload)
        setMessage(""); // Clear any previous messages when submitting

        try {
            // STEP 1: No need to fetch CSRF cookie if the login route is excluded from CSRF middleware.
            // If you were NOT excluding it from CSRF, you would keep the fetch for sanctum/csrf-cookie here.
            // await fetch("http://localhost:8000/sanctum/csrf-cookie", { credentials: "include" });

            // STEP 2: Send the login request to the correct endpoint
            // Changed from /api/login to /login as per your Laravel web.php route
            const res = await fetch("http://localhost:8000/login", {
                method: "POST",
                credentials: "include", // Essential for sending/receiving cookies (like session)
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            // Check if the response was NOT successful (e.g., 401 Unauthorized, 422 Unprocessable Entity)
            if (!res.ok) {
                // Attempt to parse the error response JSON
                const errorData = await res.json();
                setMessage(
                    errorData.message ||
                        "Login failed. Please check your credentials."
                );
                return; // Stop further execution if login failed
            }

            // STEP 3: Login was successful!
            // Assuming your Laravel AuthController's login method returns user data directly.
            // If it doesn't, and you still need a separate call to /user, keep that fetch.
            const userData = await res.json(); // Parse the successful login response

            setMessage("Login successful!");
            onLogin(userData); // Pass the user data to the parent component (e.g., App.js)
        } catch (error) {
            // This catches network errors or issues with JSON parsing if the server sends non-JSON
            console.error("Login error:", error);
            setMessage("An unexpected error occurred. Please try again later.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
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

            {/* Display messages to the user, with conditional styling */}
            {message && (
                <p
                    style={{
                        color: message.includes("successful") ? "green" : "red",
                    }}
                >
                    {message}
                </p>
            )}
        </form>
    );
}

export default Login;
