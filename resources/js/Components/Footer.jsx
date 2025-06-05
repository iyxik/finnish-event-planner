import React from "react";
import "../styles/Footer.css";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-left">
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
                <a href="#">Contact</a>
            </div>
            <div className="footer-right">
                <p>Eventori.fi © 2025 - All Rights Reserved</p>
            </div>
        </footer>
    );
};

export default Footer;
