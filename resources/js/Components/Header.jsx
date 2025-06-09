import React from "react";
import "../styles/Header.css";
import { Link, NavLink, useNavigate } from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("access_token");

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        navigate("/login");
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
                {!token ? (
                    <>
                        <NavLink to="/register" className="nav-link">
                            Register
                        </NavLink>
                        <NavLink to="/login" className="nav-link">
                            Login
                        </NavLink>
                    </>
                ) : (
                    <button className="logout-button" onClick={handleLogout}>
                        Logout
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;
