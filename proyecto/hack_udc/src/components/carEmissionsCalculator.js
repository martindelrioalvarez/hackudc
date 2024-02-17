import React, { useState, useEffect } from 'react';

const CarEmissionsCalculator = ({ from, to, onEmissionsCalculated }) => {
  const [emissions, setEmissions] = useState(0);
  const [fuelCost, setFuelCost] = useState(0);

  useEffect(() => {
    const calculateEmissionsAndCost = () => {
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

      // Suponiendo un precio estático de 1.5 euros por litro de gasolina y un consumo medio de 5L/100km
      const fuelConsumptionPerKm = 5 / 100; // 5 litros por cada 100 km en litros por km
      const pricePerLiter = 1.7; // Precio por litro de gasolina
      const fuelCostCalculated = distanceInKm * fuelConsumptionPerKm * pricePerLiter;
      setFuelCost(fuelCostCalculated);

      onEmissionsCalculated(emissionsCalculated, fuelCostCalculated); // Notificar al componente padre
    };

    const toRadians = (degrees) => {
      return degrees * (Math.PI / 180);
    };

    calculateEmissionsAndCost();
  }, [from, to, onEmissionsCalculated]);

  return (
    <div>
      <h3>Emisiones en coche:</h3>
      <p>Emisiones de CO2: {emissions.toFixed(2)} kg</p>
      <p>Coste de la gasolina: {fuelCost.toFixed(2)} EUR</p>
    </div>
  );
};

export default CarEmissionsCalculator;
