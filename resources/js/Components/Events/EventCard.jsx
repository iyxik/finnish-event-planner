import React from "react";
import { Link } from "react-router-dom";
import "../../styles/EventCard.css";

function EventCard({
    event,
    editingId,
    editingData,
    startEditing,
    cancelEditing,
    handleEditInputChange,
    saveEdit,
    deleteEvent,
    setActiveEvent,
}) {
    const isEditing = editingId === event.id;

    return (
        <div className="eventCard">
            {isEditing ? (
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
                <>
                    <h2>{event.title}</h2>
                    <p>
                        <strong>📅 Date:</strong> {event.date}
                    </p>
                    <p>
                        <strong>📍 Location:</strong> {event.location}
                    </p>
                    <p>{event.description}</p>
                    {event.image_url && (
                        <img
                            src={event.image_url}
                            alt={event.title}
                            className="event-image"
                        />
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
                        <Link
                            to={`/events/${event.id}`}
                            className="view-details-link"
                        >
                            View Details
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}

export default EventCard;
