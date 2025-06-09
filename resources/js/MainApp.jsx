import React, { useState } from "react"; // Import useState
import { Routes, Route, useNavigate } from "react-router-dom"; // Import useNavigate
import Home from "./Pages/Home";
import EventListPage from "./Pages/EventListPage";
import FormPage from "./Pages/FormPage";
import SingleEvent from "./Pages/SingleEvent";
import Register from "./Components/Register";
import Login from "./Components/Login";
import "./styles/MainApp.css";

function App() {
    // State to store authenticated user data
    // Initialize with null, or potentially try to get from local storage if persisting login
    const [user, setUser] = useState(null);

    // useNavigate hook for programmatic navigation
    const navigate = useNavigate();

    // Function to handle successful login from the Login component
    const handleLoginSuccess = (userData) => {
        console.log("Login successful! User data:", userData);
        setUser(userData); // Set the user state in App component
        navigate("/"); // Redirect to the main page after login
    };

    // You might also want a logout function here, e.g.:
    // const handleLogout = () => {
    //     setUser(null); // Clear user state
    //     // Optionally, make an API call to clear backend session
    //     // axios.post('/logout', { credentials: 'include' });
    //     navigate('/login'); // Redirect to login page after logout
    // };

    return (
        <>
            {/* You might want a Navbar/Header here that shows login/logout based on 'user' state */}
            {/* <Navbar user={user} onLogout={handleLogout} /> */}

            <Routes>
                <Route path="/" element={<Home user={user} />} />{" "}
                {/* Pass user to Home if needed */}
                <Route path="/events" element={<EventListPage />} />
                <Route path="/events/new" element={<FormPage />} />
                <Route path="/events/:id" element={<SingleEvent />} />
                {/* Register Route: Does not need onLogin prop directly */}
                <Route path="/register" element={<Register />} />
                {/* Login Route:
                    - If user is already logged in, redirect them away from the login page.
                    - Otherwise, render the Login component and pass the handleLoginSuccess function.
                    */}
                <Route
                    path="/login"
                    element={
                        user ? <Home /> : <Login onLogin={handleLoginSuccess} />
                    }
                />
            </Routes>
        </>
    );
}

export default App;
