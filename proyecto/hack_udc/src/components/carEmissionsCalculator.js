import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CarEmissionsCalculator = ({ from, to, onEmissionsCalculated }) => {
  const [emissions, setEmissions] = useState(0);

  useEffect(() => {
    const fetchRouteAndCalculateEmissions = async () => {
      const hereApiKey = 'C2m9y5mTC7gVdbUhX6LOGvz34yc6gk8P7hSM3974TU4';
      const fromCoord = `${from.lat},${from.lng}`;
      const toCoord = `${to.lat},${to.lng}`;
      const url = `https://router.hereapi.com/v8/routes?transportMode=car&origin=${fromCoord}&destination=${toCoord}&return=summary&apiKey=${hereApiKey}`;

      try {
        const response = await axios.get(url);
        const distanceInKm = response.data.routes[0].sections[0].summary.length / 1000;
        const emissionsCalculated = (distanceInKm * 120) / 1000;
        setEmissions(emissionsCalculated);
        onEmissionsCalculated(emissionsCalculated); // Notificar al componente padre
      } catch (error) {
        console.error('Error fetching route from Here API:', error);
        setEmissions(0);
      }
    };

    fetchRouteAndCalculateEmissions();
  }, [from, to, onEmissionsCalculated]);

  return (
    <div>
      <h3>Emisiones en coche:</h3>
      <p>Emisiones de CO2: {emissions.toFixed(2)} kg</p>
    </div>
  );
};

export default CarEmissionsCalculator;
