import React from "react";
import "../styles/Header.css";
import { Link } from "react-router-dom";
import { NavLink } from 'react-router-dom';
import ThemeToggle from "./ThemeToggle";

const Header = () => {
    return (
        <>
            <header className="header">
                <div className="header-left">
                    {/* <span className="logo-icon">🤍</span> */}
                    <Link to="/" className="logo-text">
                        Eventori.fi
                    </Link>
                </div>

                <div className="header-center">
                    <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Home</NavLink>
                    <NavLink to="/events" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>All Events</NavLink>
                    <NavLink to="/events/new" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Add Event</NavLink>
                    <ThemeToggle/>
                </div>
            </header>
        </>
    );
};

export default Header;
