import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

function AutoCenter({ position }) {
    const map = useMap();

    useEffect(() => {
        if (position) {
            map.setView(position, 13);
        }
    }, [position, map]);

    return null;
}

export default AutoCenter;
