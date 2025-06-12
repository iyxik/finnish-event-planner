import React, { useEffect, useState } from "react";
import Filters from "../Components/Events/Filters";
import EventList from "../Components/Events/EventList";

const EventListPage = () => {
    const [events, setEvents] = useState([]);
    const [filterCity, setFilterCity] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");
    const [editingId, setEditingId] = useState(null);
    const [editingData, setEditingData] = useState({});
    // NEW STATE: To hold the original full event data when editing starts
    const [originalEventData, setOriginalEventData] = useState(null);
    const [filterDate, setFilterDate] = useState("");

    useEffect(() => {
        fetchEvents();
    }, []);

    async function fetchEvents() {
        const res = await fetch("/api/events");
        const data = await res.json();
        setEvents(data);
    }

    const filteredEvents = events
        .filter((event) =>
            event.location.toLowerCase().includes(filterCity.toLowerCase())
        )
        .filter((event) => {
            if (!filterDate) return true;
            return (
                new Date(event.date).toDateString() ===
                new Date(filterDate).toDateString()
            );
        })
        .sort((a, b) =>
            sortOrder === "asc"
                ? new Date(a.date) - new Date(b.date)
                : new Date(b.date) - new Date(a.date)
        );
    return (
        <div className="event-list-page">
            <div className="filter-wrapper">
                <Filters
                    filterCity={filterCity}
                    setFilterCity={setFilterCity}
                    sortOrder={sortOrder}
                    setSortOrder={setSortOrder}
                    filterDate={filterDate}
                    setFilterDate={setFilterDate}
                />
            </div>
            <div className="eventList">
                <EventList
                    events={filteredEvents}
                    editingId={editingId}
                    editingData={editingData}
                    startEditing={(event) => {
                        setEditingId(event.id);
                        setEditingData({
                            // Initialize editingData with editable fields
                            title: event.title,
                            description: event.description,
                            date: event.date,
                            location: event.location,
                            image_url: event.image_url,
                        });
                        // IMPORTANT: Store the complete original event data here
                        setOriginalEventData(event);
                    }}
                    cancelEditing={() => {
                        setEditingId(null);
                        setEditingData({});
                        // Clear original event data on cancel
                        setOriginalEventData(null);
                    }}
                    handleEditInputChange={(e) =>
                        setEditingData((prev) => ({
                            ...prev,
                            [e.target.name]: e.target.value,
                        }))
                    }
                    saveEdit={async (id) => {
                        // MERGE ORIGINAL DATA WITH EDITED DATA BEFORE SENDING
                        const dataToSend = {
                            ...originalEventData, // Start with the full original event data (includes weather)
                            ...editingData, // Overwrite with changes from the form
                        };

                        const res = await fetch(`/api/events/${id}`, {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                                Accept: "application/json", // Good practice to explicitly ask for JSON
                            },
                            body: JSON.stringify(dataToSend), // Send the merged data
                            credentials: "include",
                        });
                        if (res.ok) {
                            setEditingId(null);
                            setEditingData({});
                            setOriginalEventData(null); // Clear original event data after successful save
                            await fetchEvents(); // Re-fetch all events to get the updated list
                        } else {
                            console.error(
                                "Failed to save edit:",
                                res.status,
                                await res.text()
                            );
                            alert(
                                "Failed to save event. Please check console for details."
                            );
                        }
                    }}
                    deleteEvent={async (id) => {
                        if (confirm("Are you sure?")) {
                            const res = await fetch(`/api/events/${id}`, {
                                method: "DELETE",
                                credentials: "include",
                            });
                            if (res.ok) fetchEvents();
                        }
                    }}
                />
                {filteredEvents.length === 0 && (
                    <div className="no-events">
                        <p className="no-events-message">
                            There are no events on this day.
                        </p>
                        <button
                            className="reset-filters-button"
                            onClick={() => {
                                setFilterCity("");
                                setFilterDate("");
                                setSortOrder("asc");
                            }}
                        >
                            Back to All Events
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventListPage;
