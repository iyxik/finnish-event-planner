import React from "react";
import { FiCalendar, FiMapPin, FiLink, FiPlus } from "react-icons/fi";
import { MdEvent } from "react-icons/md";
import { BiCommentDetail } from "react-icons/bi";

// Update prop names to be generic for both add and edit
function EventForm({ eventData, handleInputChange, handleSubmit }) {
    return (
        <div className="event-form-page">
            <p>Fill the form below to create a new event</p>

            <form onSubmit={handleSubmit} className="event-form">
                <div className="form-group">
                    <input
                        type="text"
                        name="title"
                        placeholder=" "
                        // Ensure value is always a string
                        value={eventData.title || ""}
                        onChange={handleInputChange}
                        required
                    />
                    <label>
                        <MdEvent style={{ marginRight: "6px" }} />
                        Event Title
                    </label>
                </div>

                <div className="form-group">
                    <textarea
                        name="description"
                        placeholder=" "
                        // Ensure value is always a string
                        value={eventData.description || ""}
                        onChange={handleInputChange}
                        required
                    />
                    <label>
                        <BiCommentDetail style={{ marginRight: "6px" }} />
                        Description
                    </label>
                </div>

                <div className="form-group">
                    <input
                        type="date"
                        name="date"
                        placeholder=" "
                        // Ensure value is always a string
                        value={eventData.date || ""}
                        onChange={handleInputChange}
                        required
                    />
                    <label>
                        <FiCalendar style={{ marginRight: "8px" }} />
                        Event Date
                    </label>
                </div>

                <div className="form-group">
                    <input
                        type="text"
                        name="location"
                        placeholder=" "
                        // Ensure value is always a string
                        value={eventData.location || ""}
                        onChange={handleInputChange}
                        required
                    />
                    <label>
                        <FiMapPin style={{ marginRight: "8px" }} />
                        Location
                    </label>
                </div>

                <div className="form-group">
                    <input
                        type="url"
                        name="image_url"
                        placeholder=" "
                        // THIS IS THE MOST LIKELY CULPRIT! Ensure value is always a string.
                        value={eventData.image_url || ""}
                        onChange={handleInputChange}
                    />
                    <label>
                        <FiLink style={{ marginRight: "8px" }} />
                        Image URL (optional)
                    </label>
                </div>

                <button type="submit">
                    <FiPlus />
                    Save Event
                </button>
            </form>
        </div>
    );
}

export default EventForm;
