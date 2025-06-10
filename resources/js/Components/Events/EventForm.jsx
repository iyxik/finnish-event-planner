import React from 'react';
import { FiCalendar, FiMapPin, FiLink, FiPlus} from 'react-icons/fi';
import { MdEvent } from "react-icons/md";
import { BiCommentDetail } from "react-icons/bi";

function EventForm({ newEventData, handleNewInputChange, handleNewEventSubmit }) {
    return (
        <div className="event-form-page">
            <h1>Add New Event</h1>
            <p>Fill the form below to create a new event</p>
            
            <form onSubmit={handleNewEventSubmit} className="event-form">
                <div className="form-group">
                    <input 
                        type="text" 
                        name="title" 
                        placeholder=" "
                        value={newEventData.title} 
                        onChange={handleNewInputChange} 
                        required 
                    />
                    <label><MdEvent style={{ marginRight: '6px' }}/>Event Title</label>
                </div>

                <div className="form-group">
                    <textarea 
                        name="description" 
                        placeholder=" "
                        value={newEventData.description} 
                        onChange={handleNewInputChange} 
                        required 
                    />
                    <label><BiCommentDetail style={{ marginRight: '6px' }} />Description</label>
                </div>

                <div className="form-group">
                    <input 
                        type="date" 
                        name="date" 
                        placeholder=" "
                        value={newEventData.date} 
                        onChange={handleNewInputChange} 
                        required 
                    />
                    <label><FiCalendar style={{ marginRight: '8px' }} />Event Date</label>
                </div>

                <div className="form-group">
                    <input 
                        type="text" 
                        name="location" 
                        placeholder=" "
                        value={newEventData.location} 
                        onChange={handleNewInputChange} 
                        required 
                    />
                    <label><FiMapPin style={{ marginRight: '8px' }} />Location</label>
                </div>

                <div className="form-group">
                    <input 
                        type="url" 
                        name="image_url" 
                        placeholder=" "
                        value={newEventData.image_url} 
                        onChange={handleNewInputChange} 
                    />
                    <label><FiLink style={{ marginRight: '8px' }} />Image URL (optional)</label>
                </div>

                <button type="submit">
                    <FiPlus />
                    Create Event
                </button>
            </form>
        </div>
    );
}

export default EventForm;