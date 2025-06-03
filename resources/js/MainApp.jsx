import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import '../css/MainApp.css';
import { MapContainer, TileLayer, CircleMarker, useMap } from 'react-leaflet';

function AutoCenter({ position }) {
    const map = useMap();
    useEffect(() => {
        if (position) {
            map.setView(position, 13);
        }
    }, [position, map]);
    return null;
}

function App() {
    const [events, setEvents] = useState([]);
    const [filterCity, setFilterCity] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [activeEvent, setActiveEvent] = useState(null);

    // For adding new event form inputs
    const [newEventData, setNewEventData] = useState({
        title: '',
        date: '',
        location: '',
        description: '',
        image_url: '',
    });

    // For per-card edit mode: store editing event ID and form data
    const [editingId, setEditingId] = useState(null);
    const [editingData, setEditingData] = useState({});

    // Fetch events on mount
    useEffect(() => {
        fetchEvents();
    }, []);

    async function fetchEvents() {
        const res = await fetch('/api/events');
        const data = await res.json();
        setEvents(data);
        if (data.length > 0) setActiveEvent(data[data.length - 1]);
    }

    // Handle inputs for new event form
    const handleNewInputChange = (e) => {
        setNewEventData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // Submit new event
    const handleNewEventSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch('/api/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newEventData),
        });
        if (res.ok) {
            setNewEventData({ title: '', date: '', location: '', description: '', image_url: '' });
            await fetchEvents();
        } else {
            alert('Failed to add event');
        }
    };

    // Start editing a card
    const startEditing = (event) => {
        setEditingId(event.id);
        setEditingData({
            title: event.title,
            date: event.date,
            location: event.location,
            description: event.description,
            image_url: event.image_url || '',
        });
    };

    // Cancel editing
    const cancelEditing = () => {
        setEditingId(null);
        setEditingData({});
    };

    // Handle inputs while editing a card
    const handleEditInputChange = (e) => {
        setEditingData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // Save edited card
    const saveEdit = async (id) => {
        const res = await fetch(`/api/events/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editingData),
        });
        if (res.ok) {
            setEditingId(null);
            setEditingData({});
            await fetchEvents();
        } else {
            alert('Failed to update event');
        }
    };

    // Delete event
    const deleteEvent = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        const res = await fetch(`/api/events/${id}`, { method: 'DELETE' });
        if (res.ok) {
            await fetchEvents();
        } else {
            alert('Failed to delete event');
        }
    };

    // Filter and sort events
    const filteredEvents = events
        .filter((event) => event.location.toLowerCase().includes(filterCity.toLowerCase()))
        .sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });

    // Map positions
    const defaultPosition = [20, 0];
    const activePosition =
        activeEvent?.weather?.coord
            ? [activeEvent.weather.coord.lat, activeEvent.weather.coord.lon]
            : null;

    return (
        <div className="app-container">
            <h1>Event Planner</h1>

            {/* Add New Event Form */}
            <form onSubmit={handleNewEventSubmit} className="event-form">
                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={newEventData.title}
                    onChange={handleNewInputChange}
                    required
                />
                <input
                    type="date"
                    name="date"
                    value={newEventData.date}
                    onChange={handleNewInputChange}
                    required
                />
                <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={newEventData.location}
                    onChange={handleNewInputChange}
                    required
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    value={newEventData.description}
                    onChange={handleNewInputChange}
                    required
                />
                <input
                    type="url"
                    name="image_url"
                    placeholder="Image URL (optional)"
                    value={newEventData.image_url}
                    onChange={handleNewInputChange}
                />
                <button type="submit">Add Event</button>
            </form>

            {/* Filter and Sort */}
            <div className="filter-sort">
                <label>
                    Filter by City:{' '}
                    <input
                        type="text"
                        value={filterCity}
                        onChange={(e) => setFilterCity(e.target.value)}
                        placeholder="Enter city"
                    />
                </label>

                <label>
                    Sort by Date:{' '}
                    <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </label>
            </div>

            {/* Event Cards */}
            <div className="event-list">
                {filteredEvents.map((event) => (
                    <div className="event-card" key={event.id}>
                        {editingId === event.id ? (
                            // EDIT MODE
                            <>
                                <input
                                    type="text"
                                    name="title"
                                    value={editingData.title}
                                    onChange={handleEditInputChange}
                                    required
                                />
                                <input
                                    type="date"
                                    name="date"
                                    value={editingData.date}
                                    onChange={handleEditInputChange}
                                    required
                                />
                                <input
                                    type="text"
                                    name="location"
                                    value={editingData.location}
                                    onChange={handleEditInputChange}
                                    required
                                />
                                <textarea
                                    name="description"
                                    value={editingData.description}
                                    onChange={handleEditInputChange}
                                    required
                                />
                                <input
                                    type="url"
                                    name="image_url"
                                    value={editingData.image_url}
                                    onChange={handleEditInputChange}
                                />
                                <div className="card-buttons">
                                    <button onClick={() => saveEdit(event.id)}>Save</button>
                                    <button onClick={cancelEditing}>Cancel</button>
                                </div>
                            </>
                        ) : (
                            // VIEW MODE
                            <>
                                <h2>{event.title}</h2>
                                <p><strong>Date:</strong> {event.date}</p>
                                <p><strong>Location:</strong> {event.location}</p>
                                <p>{event.description}</p>
                                {event.image_url && (
                                    <img src={event.image_url} alt={event.title} className="event-image" />
                                )}
                                {event.weather ? (
                                    <div className="weather-info">
                                        <p>Temp: {event.weather.temp} °C</p>
                                        <p>{event.weather.description}</p>
                                        <img
                                            src={`http://openweathermap.org/img/wn/${event.weather.icon}@2x.png`}
                                            alt={event.weather.description}
                                        />
                                    </div>
                                ) : (
                                    <p>No weather data available</p>
                                )}
                                <div className="card-buttons">
                                    <button onClick={() => startEditing(event)}>Edit</button>
                                    <button onClick={() => deleteEvent(event.id)}>Delete</button>
                                    <button onClick={() => setActiveEvent(event)}>Go to Map</button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>

            {/* Map */}
            <div className="map-wrapper">
                <MapContainer
                    center={activePosition || defaultPosition}
                    zoom={activePosition ? 13 : 2}
                    scrollWheelZoom={true}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        attribution="&copy; OpenStreetMap contributors"
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {activePosition && (
                        <>
                            <CircleMarker
                                center={activePosition}
                                pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 1 }}
                                radius={10}
                            />
                            <AutoCenter position={activePosition} />
                        </>
                    )}

                    <div className="map-info">
                        {activeEvent && (
                            <div>
                                <strong>{activeEvent.title}</strong>
                                <br />
                                Date: {activeEvent.date}
                                <br />
                                Location: {activeEvent.location}
                                <br />
                                {activeEvent.weather ? (
                                    <>
                                        Temp: {activeEvent.weather.temp} °C
                                        <br />
                                        {activeEvent.weather.description}
                                        <br />
                                        <img
                                            src={`http://openweathermap.org/img/wn/${activeEvent.weather.icon}@2x.png`}
                                            alt={activeEvent.weather.description}
                                        />
                                    </>
                                ) : (
                                    'No weather data'
                                )}
                            </div>
                        )}
                    </div>
                </MapContainer>
            </div>
        </div>
    );
}

export default App;
