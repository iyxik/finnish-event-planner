import React, { useState } from "react";

function Register() {
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

    // --- CRITICAL CHANGE HERE ---
    // This function must decode the cookie value because the browser
    // might URL-encode it when storing it.
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            const cookieValue = parts.pop().split(";").shift();
            // Decode the value that was stored by the browser
            return decodeURIComponent(cookieValue);
        }
        return null;
    }
    // --- END CRITICAL CHANGE ---

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // 1. Fetch CSRF cookie: This sets the XSRF-TOKEN cookie in your browser.
            await fetch("http://localhost:8000/sanctum/csrf-cookie", {
                credentials: "include",
            });

            // 2. Retrieve the XSRF-TOKEN from the browser's cookies.
            //    getCookie() now returns the correctly URL-decoded token.
            const csrfToken = getCookie("XSRF-TOKEN");
            console.log("CSRF token after fetch (from getCookie):", csrfToken); // Inspect this output!

            // 3. Send the registration request with the X-XSRF-TOKEN header.
            const res = await fetch("http://localhost:8000/register", {
                method: "POST",
                credentials: "include", // Important to send cookies!
                headers: {
                    "Content-Type": "application/json",
                    // The X-XSRF-TOKEN header must be the URL-decoded value.
                    // Since getCookie() now handles the decoding, we pass it directly.
                    "X-XSRF-TOKEN": csrfToken || "",
                },
                body: JSON.stringify(formData),
            });

            // --- Error Handling (improved) ---
            // If response is not ok, parse the error response as text first
            // to avoid SyntaxError if it's HTML, then try JSON.
            if (!res.ok) {
                // If 419, it's a CSRF error, Laravel returns HTML
                if (res.status === 419) {
                    setMessage(
                        "Registration failed: CSRF token mismatch. Please try again."
                    );
                } else {
                    // For other errors, try to parse as JSON for specific messages
                    const errorText = await res.text();
                    try {
                        const data = JSON.parse(errorText);
                        if (res.status === 422 && data.errors) {
                            const errorMessages = Object.values(data.errors)
                                .flat()
                                .join(" ");
                            setMessage(`Registration failed: ${errorMessages}`);
                        } else {
                            setMessage(
                                data.message ||
                                    `Registration failed: ${errorText}`
                            );
                        }
                    } catch (jsonError) {
                        // If it's not valid JSON, show generic error with raw text
                        setMessage(`Registration failed: ${errorText}`);
                    }
                }
            } else {
                // If response is OK, parse as JSON
                const data = await res.json();
                setMessage("Registration successful! You can now login.");
                setFormData({
                    name: "",
                    email: "",
                    password: "",
                    password_confirmation: "",
                });
            }
        } catch (error) {
            console.error("Fetch error:", error);
            setMessage("An error occurred. Try again.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
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

            {message && <p>{message}</p>}
        </form>
    );
}

export default Register;
