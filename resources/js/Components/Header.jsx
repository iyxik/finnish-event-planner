import React from 'react'
import styles from "./Header.module.css";

const Header = () => {
  return (
    <>
    <div className={styles.header}>
    <div className={styles.logo}>Eventora.fi</div>
        <nav className={styles.nav}>
            <a href="#event">Events</a>
            <a href="#form">Add Event</a>
            <a href="#about">About Us</a>
        </nav>
    </div>
</>
  )
}

export default Header