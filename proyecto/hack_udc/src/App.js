import React, { useState, useEffect } from 'react';
import Mapa from './components/Mapa';
import KiwiService from './components/kiwiService';
import CarEmissionsCalculator from './components/carEmissionsCalculator';
import './App.css';

const fetchCoordinates = async (cityName) => {
  const searchTerm = `${encodeURIComponent(cityName)} aeropuerto`;
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
  const [fromCities, setFromCities] = useState(['']);
  const [toCity, setToCity] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [coordinates, setCoordinates] = useState({ from: [], to: null });
  const [emissionsData, setEmissionsData] = useState([]);
  const [flightCO2Emissions, setFlightCO2Emissions] = useState([]);

  useEffect(() => {
    const fetchCoordinatesForFromCities = async () => {
      const fromCoordsPromises = fromCities.map(city => fetchCoordinates(city));
      const fromCoords = await Promise.all(fromCoordsPromises);
      const toCoords = await fetchCoordinates(toCity);

      setCoordinates({ from: fromCoords.filter(coord => coord !== null), to: toCoords });
    };

    if (showMap && toCity) {
      fetchCoordinatesForFromCities();
    }
  }, [showMap, fromCities, toCity]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowMap(true);
  };

  const handleFromCityChange = (index, value) => {
    const newFromCities = [...fromCities];
    newFromCities[index] = value;
    setFromCities(newFromCities);
  };

  const incrementFromCity = () => {
    setFromCities([...fromCities, '']);
  };

  const decrementFromCity = () => {
    if (fromCities.length > 1) {
      setFromCities(fromCities.slice(0, -1));
    }
  };

  const handleEmissionsCalculated = (index, emissions) => {
    let newEmissionsData = [...emissionsData];
    newEmissionsData[index] = emissions;
    setEmissionsData(newEmissionsData);
    //console.log('car emissions: ' + emissions);
  };

  const handleFlightCO2Calculated = (index, co2Emission) => {
    let newFlightCO2Emissions = [...flightCO2Emissions];
    newFlightCO2Emissions[index] = co2Emission;
    setFlightCO2Emissions(newFlightCO2Emissions);
    //console.log('plane emissions: ' + co2Emission);
  };

  const renderGreenTick = (carEmissions, flightEmissions) => {
    if (carEmissions === 0 || flightEmissions === 0) {
      return null; // No muestra ningún icono si alguna de las emisiones es 0
    }
    
    if (carEmissions < flightEmissions) {
      return <span>🚗✅</span>;
    } else if (flightEmissions < carEmissions) {
      return <span>✈️✅</span>;
    }
    return null; // Podría decidir no mostrar nada si las emisiones son iguales
  };

  return (
    <div className="App">
      <header>
        <h1>My Ecofriendly Traveler</h1>
      </header>
      <main>
        <form onSubmit={handleSubmit}>
          <fieldset>
            <legend>Detalles del Viaje</legend>
            {fromCities.map((city, index) => (
              <label key={index}>
                Ciudad de Partida {index + 1}:
                <input
                  type="text"
                  placeholder="Ciudad de inicio"
                  value={city}
                  onChange={(e) => handleFromCityChange(index, e.target.value)}
                />
              </label>
            ))}
            <label>
              Ciudad de Destino:
              <input
                type="text"
                placeholder="Ciudad de destino"
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
              />
            </label>
            <label htmlFor="departure-date">Fecha de Salida:</label>
            <input
              type="date"
              id="departure-date"
              name="departure-date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              required
            />
          </fieldset>
          <div className="trip-counter">
            <button type="button" onClick={decrementFromCity}>-</button>
            <span> Número de Viajeros: {fromCities.length} </span>
            <button type="button" onClick={incrementFromCity}>+</button>
          </div>
          <button type="submit">Enviar</button>
        </form>
        {showMap && coordinates.to && (
          <Mapa from={coordinates.from} to={coordinates.to} />
        )}
        {showMap && coordinates.from.length > 0 && coordinates.to && (
          fromCities.map((city, index) => (
            <div key={index} className="traveler-info-container">
              <h2 className="traveler-title">Viajero {index + 1}</h2>
              <div className="traveler-row">
                <KiwiService
                  fromCity={city}
                  toCity={toCity}
                  departureDate={departureDate}
                  onCO2Calculated={(co2Emission) => handleFlightCO2Calculated(index, co2Emission)}
                />
                <CarEmissionsCalculator
                  from={coordinates.from[index]}
                  to={coordinates.to}
                  onEmissionsCalculated={(emissions) => handleEmissionsCalculated(index, emissions)}
                />
                <div>
                  {emissionsData[index] !== undefined && flightCO2Emissions[index] !== undefined ?
                  renderGreenTick(emissionsData[index], flightCO2Emissions[index]) : null}
              </div>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}

export default App;
