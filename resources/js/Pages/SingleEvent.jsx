import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const SingleEvent = ({ idFromLaravel }) => {
    const [event, setEvent] = useState(null);
    const id = idFromLaravel ?? useParams().id;

    useEffect(() => {
        fetch(`/api/events/${id}`)
            .then((res) => res.json())
            .then((data) => setEvent(data));
    }, [id]);

    if (!event) return <p>Loading...</p>;

    return (
        <div className="single-event">
            <h1>{event.title}</h1>
            <p>
                {event.date} - {event.location}
            </p>
            <p>{event.description}</p>
            {event.image_url && <img src={event.image_url} alt={event.title} />}
        </div>
    );
};
export default SingleEvent;
