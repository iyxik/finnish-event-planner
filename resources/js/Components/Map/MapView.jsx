import React from 'react';
import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet';
import AutoCenter from './AutoCenter';

function MapView({ activePosition, activeEvent }) {
    const defaultPosition = [20, 0];

    return (
        <div className="map-wrapper">
            <MapContainer
                center={activePosition || defaultPosition}
                zoom={activePosition ? 13 : 2}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {activePosition && (
                    <>
                        <CircleMarker center={activePosition} pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 1 }} radius={10} />
                        <AutoCenter position={activePosition} />
                    </>
                )}
            </MapContainer>

            {activeEvent && (
                <div className="map-info">
                    <strong>{activeEvent.title}</strong>
                    <br />
                    Date: {activeEvent.date}
                    <br />
                    Location: {activeEvent.location}
                    <br />
                    {activeEvent.weather ? (
                        <>
                            Temp: {activeEvent.weather.temp} °C
                            <br />
                            {activeEvent.weather.description}
                            <br />
                            <img
                                src={`http://openweathermap.org/img/wn/${activeEvent.weather.icon}@2x.png`}
                                alt={activeEvent.weather.description}
                            />
                        </>
                    ) : (
                        'No weather data'
                    )}
                </div>
            )}
        </div>
    );
}

export default MapView;
