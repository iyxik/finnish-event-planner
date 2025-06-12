import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useParams and useNavigate
import EventForm from "../Components/Events/EventForm";
import "../styles/FormPage.css";

const FormPage = () => {
    const { id } = useParams(); // Get the 'id' parameter from the URL
    const navigate = useNavigate(); // Hook for navigation
    const backendUrl = import.meta.env.VITE_APP_BACKEND_URL; // Your backend URL

    // State to hold the event data for the form
    // This will be initialized to empty for new events,
    // or populated with existing data for editing.
    const [eventData, setEventData] = useState({
        title: "",
        date: "",
        location: "",
        description: "",
        image_url: "",
    });

    // State to track if we are in editing mode
    const [isEditing, setIsEditing] = useState(false);

    // useEffect to fetch event data if 'id' is present (i.e., we are in edit mode)
    useEffect(() => {
        if (id) {
            // If an ID exists in the URL, we're in edit mode
            setIsEditing(true);
            fetchEventForEdit(id);
        } else {
            // No ID, so we're adding a new event
            setIsEditing(false);
            // Reset form for new event creation
            setEventData({
                title: "",
                date: "",
                location: "",
                description: "",
                image_url: "",
            });
        }
    }, [id]); // Rerun this effect whenever the 'id' in the URL changes

    // Function to fetch existing event data for editing
    const fetchEventForEdit = async (eventId) => {
        try {
            const res = await fetch(`${backendUrl}/api/events/${eventId}`);
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            setEventData(data); // Populate form with fetched data
        } catch (error) {
            console.error("Error fetching event for edit:", error);
            alert("Failed to load event for editing. Please try again.");
            navigate("/events"); // Redirect if event not found or error
        }
    };

    // Handler for all input changes
    const handleInputChange = (e) => {
        setEventData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    // Handler for form submission (will now handle both POST and PUT)
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Determine API URL and HTTP method based on whether we are editing or adding
        const url = isEditing
            ? `${backendUrl}/api/events/${id}`
            : `${backendUrl}/api/events`;
        const method = isEditing ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(eventData),
                credentials: "include", // Important for sending cookies/CSRF token
            });

            if (res.ok) {
                alert(
                    `Event ${isEditing ? "updated" : "created"} successfully!`
                );
                navigate("/events"); // Redirect to the event list page after success
            } else {
                const errorText = await res.text();
                console.error(
                    `Failed to ${isEditing ? "update" : "create"} event:`,
                    res.status,
                    errorText
                );
                alert(
                    `Failed to ${
                        isEditing ? "update" : "create"
                    } event. Please check console for details.`
                );
            }
        } catch (error) {
            console.error("Network or submission error:", error);
            alert("An error occurred during submission. Please try again.");
        }
    };

    return (
        <div className="form-background">
            <h1 className="form-title">
                {isEditing ? "Edit Event" : "Add New Event"}
            </h1>
            <EventForm
                eventData={eventData} // Pass the eventData state
                handleInputChange={handleInputChange} // Pass the generic input handler
                handleSubmit={handleSubmit} // Pass the generic submit handler
            />
        </div>
    );
};

export default FormPage;
