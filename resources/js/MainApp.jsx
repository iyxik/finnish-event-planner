// src/App.jsx

import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Header from "./Components/Header"; // <--- Make sure this import points to your updated Header.jsx
import Footer from "./Components/Footer";
// Import your page/component components
import Home from "./Pages/Home";
import EventListPage from "./Pages/EventListPage";
import FormPage from "./Pages/FormPage";
// import SingleEvent from "./Components/SingleEvent"; // Adjust path if necessary
import Register from "./Components/Register";
import Login from "./Components/Login";

import "./styles/MainApp.css";

function App() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const handleLoginSuccess = (userData) => {
        console.log("Login successful! User data:", userData);
        setUser(userData.user);
        navigate("/"); // Redirect to home page after login
    };

    const handleRegisterSuccess = (userData) => {
        console.log("Registration successful! User data:", userData);
        setUser(userData.user);
        navigate("/"); // Redirect to home page after registration
    };

    const handleLogout = async () => {
        try {
            await fetch("http://localhost:8000/logout", {
                method: "POST",
                credentials: "include",
            });
            localStorage.removeItem("access_token"); // Clear localStorage token if you're using it
            setUser(null);
            console.log("Logged out successfully!");
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
            localStorage.removeItem("access_token");
            setUser(null);
            navigate("/login");
            alert(
                "Logout failed on server, but you have been logged out locally."
            );
        }
    };

    return (
        <div className="app-layout">
            {/* RENDER THE HEADER HERE, PASSING USER AND ONLOGOUT PROPS */}
            <Header user={user} onLogout={handleLogout} />
            <main className="app-content">
                <Routes>
                    <Route path="/" element={<Home user={user} />} />
                    <Route path="/events" element={<EventListPage />} />
                    <Route path="/events/new" element={<FormPage />} />
                    {/* <Route path="/events/:id" element={<SingleEvent />} /> */}
                    <Route
                        path="/register"
                        element={
                            <Register
                                user={user}
                                onLogout={handleLogout}
                                onRegisterSuccess={handleRegisterSuccess}
                            />
                        }
                    />
                    <Route
                        path="/login"
                        element={
                            <Login
                                onLogin={handleLoginSuccess}
                                user={user}
                                onLogout={handleLogout}
                            />
                        }
                    />
                </Routes>
            </main>
            <Footer />
        </div>
    );
}

export default App;
