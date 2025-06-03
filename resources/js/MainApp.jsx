import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
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
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        location: '',
        description: '',
        image_url: '',
    });
    const [activeEvent, setActiveEvent] = useState(null);

    useEffect(() => {
        fetch('/api/events')
            .then((res) => res.json())
            .then((data) => {
                setEvents(data);
                if (data.length > 0) {
                    setActiveEvent(data[data.length - 1]);
                } else {
                    setActiveEvent(null);
                }
            })
            .catch(console.error);
    }, []);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch('/api/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        if (res.ok) {
            const updatedEvents = await fetch('/api/events').then((res) => res.json());
            setEvents(updatedEvents);
            if (updatedEvents.length > 0) {
                setActiveEvent(updatedEvents[updatedEvents.length - 1]);
            }
            setFormData({
                title: '',
                date: '',
                location: '',
                description: '',
                image_url: '',
            });
        } else {
            let errorMessage = 'Failed to create event';
            try {
                const text = await res.text();
                const errorData = JSON.parse(text);
                if (errorData && typeof errorData === 'object') {
                    errorMessage = Object.values(errorData).flat().join('\n');
                }
            } catch (err) {
                console.error('Error parsing response:', err);
            }
            alert(errorMessage);
        }
    };

    const deleteEvent = async (id) => {
        if (!window.confirm('Are you sure?')) return;

        const res = await fetch(`/api/events/${id}`, { method: 'DELETE' });

        if (res.ok) {
            const filtered = events.filter((event) => event.id !== id);
            setEvents(filtered);
            if (filtered.length > 0) {
                setActiveEvent(filtered[filtered.length - 1]);
            } else {
                setActiveEvent(null);
            }
        } else {
            alert('Failed to delete event');
        }
    };

    const defaultPosition = [20, 0];

    const activePosition =
        activeEvent && activeEvent.weather && activeEvent.weather.coord
            ? [activeEvent.weather.coord.lat, activeEvent.weather.coord.lon]
            : null;

    return (
        <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ flex: '1' }}>
                <h1>Event Planner</h1>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="title"
                        placeholder="Title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="location"
                        placeholder="Location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                    />
                    <textarea
                        name="description"
                        placeholder="Description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="url"
                        name="image_url"
                        placeholder="Image URL (optional)"
                        value={formData.image_url}
                        onChange={handleChange}
                    />
                    <button type="submit">Add Event</button>
                </form>

                <ul>
                    {events.map((event) => (
                        <li key={event.id}>
                            <strong>{event.title}</strong> ({event.date}) - {event.location}
                            <br />
                            {event.description}
                            <br />
                            {event.image_url && (
                                <img src={event.image_url} alt={event.title} width="50" />
                            )}
                            <br />
                            {event.weather && typeof event.weather.temp !== 'undefined' ? (
                                <p>
                                    Temperature: {event.weather.temp} °C
                                    <br />
                                    Description: {event.weather.description}
                                    <br />
                                    <img
                                        src={`http://openweathermap.org/img/wn/${event.weather.icon}@2x.png`}
                                        alt={event.weather.description}
                                    />
                                </p>
                            ) : (
                                <p>No weather data available</p>
                            )}
                            <button onClick={() => deleteEvent(event.id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            </div>

            <div style={{ flex: '1', height: '600px' }}>
                <h2>Event Map</h2>
                <MapContainer
                    center={activePosition || defaultPosition}
                    zoom={activePosition ? 13 : 2}
                    scrollWheelZoom={true}
                    style={{ height: '100%', width: '100%', position: 'relative' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {activePosition && (
                        <CircleMarker
                            center={activePosition}
                            pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 1 }}
                            radius={10}
                        />
                    )}

                    {activePosition && <AutoCenter position={activePosition} />}

                    {/* Info box design */}
                    <div
                        style={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            background: 'white',
                            padding: '10px',
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                            zIndex: 1000,
                            width: '250px',
                        }}
                    >
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
                                            style={{ width: '40px' }}
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