import React from "react";
import "../../styles/EventCard.css";
import { Link } from "react-router-dom";

function EventCard({ event, editingId, editingData, handleEditInputChange }) {
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
                </>
            ) : (
                <>
                    <div className="event-header">
                        <h2>{event.title}</h2>
                    {event.weather ? (
                        <div className="weather-wrapper">
                            <img
                                src={`http://openweathermap.org/img/wn/${event.weather.icon}@4x.png`}
                                alt={event.weather.description}
                                className="weather-icon"
                                tabIndex={0}
                            />
                            <div className="weather-popup" role="tooltip">
                                <p className="temp">{event.weather.temp} °C</p>
                                <p className="desc">
                                    {event.weather.description}
                                </p>
                                <p className="humidity">
                                    Humidity: {event.weather.humidity}%
                                </p>
                                <p className="wind">
                                    Wind: {event.weather.wind_speed} m/s
                                </p>
                            </div>
                        </div>
                    ) : (
                        <p className="no-weather">No weather data available</p>
                    )}
                    </div>

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
