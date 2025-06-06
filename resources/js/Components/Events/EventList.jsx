import React from 'react';
import EventCard from './EventCard';
import "../../styles/EventList.css";

function EventList(props) {
    return (
        <div className="eventList">
            {props.events.map((event) => (
                <EventCard
                    key={event.id}
                    event={event}
                    {...props}
                />
            ))}
        </div>
        
    );
}

export default EventList;
