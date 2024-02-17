import React, { useState, useEffect } from 'react';

const CarEmissionsCalculator = ({ from, to, onEmissionsCalculated }) => {
  const [emissions, setEmissions] = useState(0);

  useEffect(() => {
    const calculateEmissions = () => {
      const radiusOfEarthInKm = 6371; // Radio de la Tierra en kilómetros
      const deltaLatRadians = toRadians(to.lat - from.lat);
      const deltaLonRadians = toRadians(to.lng - from.lng);
      const a =
        Math.sin(deltaLatRadians / 2) * Math.sin(deltaLatRadians / 2) +
        Math.cos(toRadians(from.lat)) * Math.cos(toRadians(to.lat)) *
        Math.sin(deltaLonRadians / 2) * Math.sin(deltaLonRadians / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distanceInKm = radiusOfEarthInKm * c;

      // Suponiendo 120g CO2 por km, convertimos a kg para la distancia total
      const emissionsCalculated = (distanceInKm * 120) / 1000;
      setEmissions(emissionsCalculated);
      onEmissionsCalculated(emissionsCalculated); // Notificar al componente padre
    };

    const toRadians = (degrees) => {
      return degrees * (Math.PI / 180);
    };

    calculateEmissions();
  }, [from, to, onEmissionsCalculated]);

  return (
    <div>
      <h3>Emisiones en coche:</h3>
      <p>Emisiones de CO2: {emissions.toFixed(2)} kg</p>
    </div>
  );
};

export default CarEmissionsCalculator;
