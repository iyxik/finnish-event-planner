// src/Components/Header.jsx

import React from "react";
import "../styles/Header.css";
import { Link, NavLink } from "react-router-dom"; // Removed useNavigate, as it's not needed here

// Accept user and onLogout as props from App.jsx
const Header = ({ user, onLogout }) => {
    // We no longer need to manage navigate or token directly here,
    // as the user state and logout logic are managed by App.jsx and passed down.
    // const navigate = useNavigate();
    // const token = localStorage.getItem("access_token");

    // This function will now call the onLogout prop received from App.jsx
    const handleLogoutClick = () => {
        onLogout(); // This will trigger the logout logic in App.jsx
    };

    return (
        <header className="header">
            <div className="header-left">
                <Link to="/" className="logo-text">
                    Eventori.fi
                </Link>
            </div>

            <div className="header-center">
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        isActive ? "nav-link active" : "nav-link"
                    }
                >
                    Home
                </NavLink>
                <NavLink
                    to="/events"
                    className={({ isActive }) =>
                        isActive ? "nav-link active" : "nav-link"
                    }
                >
                    All Events
                </NavLink>
                <NavLink
                    to="/events/new"
                    className={({ isActive }) =>
                        isActive ? "nav-link active" : "nav-link"
                    }
                >
                    Add Event
                </NavLink>
            </div>

            <div className="header-right">
                {/* Conditional rendering based on the 'user' prop */}
                {!user ? ( // If 'user' is null (not logged in)
                    <>
                        <NavLink to="/register" className="nav-link">
                            Register
                        </NavLink>
                        <NavLink to="/login" className="nav-link">
                            Login
                        </NavLink>
                    </>
                ) : (
                    // If 'user' is not null (logged in)
                    <>
                        <span className="welcome-text">
                            Welcome, {user.name || user.email}!{" "}
                            {/* Display user's name or email */}
                        </span>
                        <button
                            className="logout-button"
                            onClick={handleLogoutClick}
                        >
                            Logout
                        </button>
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;
