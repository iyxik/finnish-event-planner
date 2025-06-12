import React, { useEffect, useState } from "react";
import Filters from "../Components/Events/Filters";
import EventList from "../Components/Events/EventList";

const EventListPage = () => {
    const [events, setEvents] = useState([]);
    const [filterCity, setFilterCity] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");
    const [activeEvent, setActiveEvent] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editingData, setEditingData] = useState({});
    // NEW STATE: To hold the original full event data when editing starts
    const [originalEventData, setOriginalEventData] = useState(null);

    useEffect(() => {
        fetchEvents();
    }, []);

    async function fetchEvents() {
        const res = await fetch("/api/events");
        const data = await res.json();
        setEvents(data);
        if (data.length > 0) setActiveEvent(data[data.length - 1]);
    }

    const filteredEvents = events
        .filter((event) =>
            event.location.toLowerCase().includes(filterCity.toLowerCase())
        )
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    // You had activePosition here, but it wasn't used in your provided return JSX.
    // Keeping it for completeness but uncommenting the MapView would use it.
    // const activePosition = activeEvent?.weather?.coord
    //     ? [activeEvent.weather.coord.lat, activeEvent.weather.coord.lon]
    //     : null;

    return (
        <>
            <div className="event-list-page">
                <Filters
                    filterCity={filterCity}
                    setFilterCity={setFilterCity}
                    sortOrder={sortOrder}
                    setSortOrder={setSortOrder}
                />
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

                            if (res.ok) {
                                fetchEvents();
                            } else {
                                console.error(
                                    "Failed to delete event:",
                                    res.status,
                                    await res.text()
                                );
                                alert(
                                    "Failed to delete event. Please check console for details."
                                );
                            }
                        }
                    }}
                    setActiveEvent={setActiveEvent}
                />
            </div>
        </>
    );
};

export default EventListPage;
