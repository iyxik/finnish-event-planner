import React, { useEffect, useState } from 'react';
import EventCard from '../Components/Events/EventCard';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { NavLink } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetch('/api/events')
            .then(res => res.json())
            .then(data => setEvents(data.slice(0, 3)));
    }, []);

    return (
        <div className="home-page">
            <Header />

            <section className="hero-section">
                <div className="hero-content">
                    <h1>Discover and Enjoy <br />Local Events</h1>
                    <p>Explore exciting local events in your community. From BBQs to outdoor concerts, there’s something for everyone.</p>
                    <div className="hero-button">
                        <NavLink to="/events" className="button-link">Discover Events</NavLink>
                    </div>
                </div>
                <div className="hero-image">
                    <img src="https://images.unsplash.com/photo-1583795484071-3c453e3a7c71?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"alt="Concert" />
                </div>
            </section>

            <section className="upcoming-events">
                <h2>Upcoming Events</h2>
                <p>You can find the latest upcoming events near you in this section</p>
                <div className="event-grid">
                    {events.map(event => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
                <div className="view-all">
                     <NavLink to="/events" className="view-all-btn">View All</NavLink>
                </div>
            </section>

            <Footer />
        </div>
    );
}

export default Home;
