import { useState, useEffect } from 'react';

export default function useEvents() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        const res = await fetch('/api/events');
        const data = await res.json();
        setEvents(data);
        setLoading(false);
    };

    return { events, fetchEvents, loading };
}
