import React from 'react';

function EventForm({ newEventData, handleNewInputChange, handleNewEventSubmit }) {
    return (
        <form onSubmit={handleNewEventSubmit} className="event-form">
            <input type="text" name="title" placeholder="Title" value={newEventData.title} onChange={handleNewInputChange} required />
            <input type="date" name="date" value={newEventData.date} onChange={handleNewInputChange} required />
            <input type="text" name="location" placeholder="Location" value={newEventData.location} onChange={handleNewInputChange} required />
            <textarea name="description" placeholder="Description" value={newEventData.description} onChange={handleNewInputChange} required />
            <input type="url" name="image_url" placeholder="Image URL (optional)" value={newEventData.image_url} onChange={handleNewInputChange} />
            <button type="submit">Add Event</button>
        </form>
    );
}

export default EventForm;
