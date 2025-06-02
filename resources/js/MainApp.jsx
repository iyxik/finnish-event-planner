import React, { useState, useEffect } from 'react';
import Footer from './Components/Footer';
import Header from './Components/Header';

function App() {
    const [events, setEvents] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        location: '',
        description: '',
        image_url: '',
    });

    useEffect(() => {
        fetch('/api/events')
            .then(res => res.json())
            .then(setEvents)
            .catch(console.error);
    }, []);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch('/api/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        if (res.ok) {
            const newEvent = await res.json();
            setEvents(prev => [...prev, newEvent]);
            setFormData({ title: '', date: '', location: '', description: '', image_url: '' });
        } else {
            let errorMessage = 'Failed to create event';
            try {
                const text = await res.text();
                console.log('Error response text:', text);

                // Try parsing JSON from text if possible
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
            setEvents(prev => prev.filter(event => event.id !== id));
        } else {
            alert('Failed to delete event');
        }
    };

    return (
        <div>
            <Header/>
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
                {events.map(event => (
                    <li key={event.id}>
                        <strong>{event.title}</strong> ({event.date}) - {event.location}<br />
                        {event.description}<br />
                        {event.image_url && <img src={event.image_url} alt={event.title} width="100" />}<br />
                        <button onClick={() => deleteEvent(event.id)}>Delete</button>
                    </li>
                ))}
            </ul>
            <Footer appName="Eventora.fi"/>
        </div>
    );
}

export default App;

