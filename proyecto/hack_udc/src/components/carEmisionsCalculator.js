import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CarEmissionsCalculator = ({ from, to }) => {
  const [emissions, setEmissions] = useState(0);

  useEffect(() => {
    const fetchRouteAndCalculateEmissions = async () => {
      const hereApiKey = 'C2m9y5mTC7gVdbUhX6LOGvz34yc6gk8P7hSM3974TU4';
      const fromCoord = `${from.lat},${from.lng}`;
      const toCoord = `${to.lat},${to.lng}`;
      const url = `https://router.hereapi.com/v8/routes?transportMode=car&origin=${fromCoord}&destination=${toCoord}&return=summary&apiKey=${hereApiKey}`;

      try {
        const response = await axios.get(url);
        // La API de Here devuelve la distancia en metros, convertimos a kilómetros
        const distanceInKm = response.data.routes[0].sections[0].summary.length / 1000;
        // Suponiendo 120g CO2 por km, convertimos a kg para la distancia total
        const emissions = (distanceInKm * 120) / 1000;
        setEmissions(emissions);
      } catch (error) {
        console.error('Error fetching route from Here API:', error);
        setEmissions(0); // Resetear emisiones en caso de error
      }
    };

    fetchRouteAndCalculateEmissions();
  }, [from, to]);

  return (
    <div>
      <h3>Emisiones en coche:</h3>
      <p>Emisiones de CO2: {emissions.toFixed(2)} kg</p>
    </div>
  );
};

export default CarEmissionsCalculator;
