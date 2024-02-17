// src/hooks/useFetchCoordinatesForCities.js
import { useEffect, useState } from 'react';
import { fetchCoordinates } from '../utils/api';

const useFetchCoordinatesForCities = (showMap, fromCities, toCity) => {
  const [coordinates, setCoordinates] = useState({ from: [], to: null });

  useEffect(() => {
    const fetchCoords = async () => {
      const fromCoordsPromises = fromCities.map(city => fetchCoordinates(city));
      const fromCoords = await Promise.all(fromCoordsPromises);
      const toCoords = await fetchCoordinates(toCity);

      setCoordinates({
        from: fromCoords.filter(coord => coord !== null),
        to: toCoords
      });
    };

    if (showMap && toCity) {
      fetchCoords();
    }
  }, [showMap, fromCities, toCity]);

  return coordinates;
};

export default useFetchCoordinatesForCities;
