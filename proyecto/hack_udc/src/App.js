import React, { useState } from 'react';
import Mapa from './components/Mapa'; // Asegúrate de que la ruta sea correcta
import KiwiService from './components/kiwiService';
import CarEmissionsCalculator from './components/carEmisionsCalculator';

const fetchCoordinates = async (cityName) => {
  // Agregar la palabra 'aeropuerto' para enfocar la búsqueda en aeropuertos de la ciudad
  const searchTerm = `${encodeURIComponent(cityName)}`;
  const url = `https://nominatim.openstreetmap.org/search?q=${searchTerm}&format=json&limit=1`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching airport coordinates:", error);
    return null;
  }
};


function App() {
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [showMap, setShowMap] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fromCoords = await fetchCoordinates(fromCity);
    const toCoords = await fetchCoordinates(toCity);
    if (fromCoords && toCoords) {
      setFrom(fromCoords);
      setTo(toCoords);
      setShowMap(true); 
    } else {
      alert("No se pudieron encontrar las coordenadas de una o ambas ciudades.");
    }
  };

  const handleFromChange = (e) => {
    setFromCity(e.target.value);
  };

  const handleToChange = (e) => {
    setToCity(e.target.value);
  };

  return (
    <div className="App">
      <h1>My React App with OpenStreetMap</h1>
      <input
        type="text"
        placeholder="City of Start"
        value={fromCity}
        onChange={handleFromChange}
      />
      <input
        type="text"
        placeholder="City of End"
        value={toCity}
        onChange={handleToChange}
      />
      <button onClick={handleSubmit}>Enviar</button>
      {showMap && <Mapa from={from} to={to} />}
      {showMap && <KiwiService fromCity={fromCity} toCity={toCity} departureDate="2024-02-20" />}
      {showMap && <CarEmissionsCalculator from={from} to={to} />}
      
    </div>
  );
}

export default App;
