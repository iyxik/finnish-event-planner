import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import Home from "./Pages/Home";
import EventListPage from "./Pages/EventListPage";
import FormPage from "./Pages/FormPage";
import SingleEvent from "./Pages/SingleEvent";
import Register from "./Components/Register";
import Login from "./Components/Login";

import "./styles/MainApp.css";

function MainApp() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const handleLoginSuccess = (userData) => {
        setUser(userData.user);
        navigate("/");
    };

    const handleRegisterSuccess = (userData) => {
        setUser(userData.user);
        navigate("/");
    };

    const handleLogout = async () => {
        try {
            await fetch("http://localhost:8000/logout", {
                method: "POST",
                credentials: "include",
            });
            localStorage.removeItem("access_token");
            setUser(null);
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
            <Header user={user} onLogout={handleLogout} />
            <main className="app-content">
                <Routes>
                    <Route path="/" element={<Home user={user} />} />
                    <Route path="/events" element={<EventListPage />} />
                    <Route
                        path="/events/new"
                        element={<FormPage user={user} />}
                    />
                    <Route
                        path="/events/:id"
                        element={<SingleEvent user={user} />}
                    />
                    <Route
                        path="/events/:id/edit"
                        element={<FormPage user={user} />}
                    />
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

export default MainApp;
