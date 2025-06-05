import React, { useEffect, useState } from 'react';
import EventCard from '../Components/Events/EventCard';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import '../styles/Home.css';

function Home() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetch('/api/events')
            .then(res => res.json())
            .then(data => setEvents(data.slice(0, 4))); // show only first 4
    }, []);

    return (
        <div className="home-page">
            <Header />

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1>Discover and Enjoy <br />Local Events</h1>
                    <p>Explore exciting local events in your community. From BBQs to outdoor concerts, there’s something for everyone.</p>
                    <div className="hero-buttons">
                        <button className="explore-btn">Explore</button>
                        <button className="signup-btn">Sign up</button>
                    </div>
                </div>
                <div className="hero-image">
                    <img src="https://images.unsplash.com/photo-1507878866276-a947ef722fee" alt="Concert" />
                </div>
            </section>

            {/* Upcoming Events */}
            <section className="upcoming-events">
                <h2>Upcoming Events</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.</p>
                <div className="event-grid">
                    {events.map(event => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
                <div className="view-all-btn-container">
                    <a href="/events" className="view-all-btn">View all</a>
                </div>
            </section>

            <Footer />
        </div>
    );
}

export default Home;
