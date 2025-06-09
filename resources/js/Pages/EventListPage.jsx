import React, { useEffect, useState } from "react";
import Filters from "../Components/Events/Filters";
import EventList from "../Components/Events/EventList";
import MapView from "../Components/Map/MapView";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

const EventListPage = () => {
    const [events, setEvents] = useState([]);
    const [filterCity, setFilterCity] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");
    const [activeEvent, setActiveEvent] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editingData, setEditingData] = useState({});

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

    const activePosition = activeEvent?.weather?.coord
        ? [activeEvent.weather.coord.lat, activeEvent.weather.coord.lon]
        : null;
    return (
        <>
            <Header />
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
                        setEditingData({ ...event });
                    }}
                    cancelEditing={() => {
                        setEditingId(null);
                        setEditingData({});
                    }}
                    handleEditInputChange={(e) =>
                        setEditingData((prev) => ({
                            ...prev,
                            [e.target.name]: e.target.value,
                        }))
                    }
                    saveEdit={async (id) => {
                        const res = await fetch(`/api/events/${id}`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(editingData),
                        });
                        if (res.ok) {
                            setEditingId(null);
                            await fetchEvents();
                        }
                    }}
                    deleteEvent={async (id) => {
                        if (confirm("Are you sure?")) {
                            const res = await fetch(`/api/events/${id}`, {
                                method: "DELETE",
                            });
                            if (res.ok) fetchEvents();
                        }
                    }}
                    setActiveEvent={setActiveEvent}
                />
                <MapView
                    activePosition={activePosition}
                    activeEvent={activeEvent}
                />
            </div>
            <Footer />
        </>
    );
};

export default EventListPage;
