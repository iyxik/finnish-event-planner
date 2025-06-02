import React from "react";
import styles from "./Footer.module.css";

const Footer = ({ appName }) => {
    return (
        <div className={styles.footer}>
            <p> {appName} © 2025 - All Rights Reserved </p>
        </div>
    );
};

export default Footer;
