import React from "react";
import "../styles/Footer.css";

const Footer = ({ appName }) => {
    return (
        <div className="footer">
            <p> {appName} © 2025 - All Rights Reserved </p>
        </div>
    );
};

export default Footer;
