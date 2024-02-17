import React, { useState, useEffect } from 'react';
import axios from 'axios';

const KiwiService = ({ fromCity, toCity, departureDate, onCO2Calculated }) => {
  const [bestFlight, setBestFlight] = useState(null);
  const [error, setError] = useState('');

  // Aquí, usarías tu clave de API para Kiwi.com
  const API_KEY = 'qasjX8vBu3zuCBk8pE1PKBJS0R0VhZ79';
  const KIWI_ENDPOINT = 'https://api.skypicker.com';
  const API_KEY_AMA = 'fWTmPHPVFtwAZBCuWl9H2OH0FqEr3gF3';
  const API_SECRET = '2sW0pvXKXAyASKHT';
  const AMADEUS_ENDPOINT = 'https://test.api.amadeus.com/v1/security/oauth2/token';
  
  const getAccessToken = async () => {
    const params = new URLSearchParams();
    params.append('client_id', API_KEY_AMA);
    params.append('client_secret', API_SECRET);
    params.append('grant_type', 'client_credentials');

    try {
      const response = await axios.post(AMADEUS_ENDPOINT, params);
      return response.data.access_token;
    } catch (error) {
      console.error('Error obteniendo el token de acceso de Amadeus', error);
      setError('Error obteniendo el token de acceso de Amadeus');
      return null;
    }
  };

  // Función para buscar el código IATA de una ciudad
  const fetchAirportCode = async (cityName) => {
    try {
      const response = await axios.get(`${KIWI_ENDPOINT}/locations`, {
        params: {
          term: cityName,
          locale: 'es-ES', // O el código de idioma de tu preferencia
          location_types: 'airport',
          limit: 1,
          active_only: true,
          apikey: API_KEY,
        },
      });

      if (response.data.locations.length > 0) {
        // Suponiendo que la respuesta incluye una lista de ubicaciones,
        // y tomamos el primer aeropuerto de la lista
        return response.data.locations[0].id; // Asegúrate de que este es el campo correcto para el código IATA
      } else {
        console.error('No se encontraron aeropuertos para la ciudad dada');
        return null;
      }
    } catch (error) {
      console.error('Error buscando el código del aeropuerto:', error);
      setError('Error buscando el código del aeropuerto');
      return null;
    }
  };
  // Función auxiliar para convertir la duración ISO 8601 a horas totales
  function convertDurationToHours(duration) {
    const match = duration.match(/PT(\d+H)?(\d+M)?/);
    const hours = parseInt(match[1], 10) || 0;
    const minutes = parseInt(match[2], 10) || 0;
    return hours + minutes / 60;
  }

  // Función para calcular la estimación de CO2
  function estimateCO2(duration) {
    const hours = convertDurationToHours(duration);
    const distance = hours * 900; // Asumiendo una velocidad de crucero de 900 km/h
    const co2PerKmPerPassenger = 90; // Gramos de CO2 por km por pasajero
    const co2Emission = distance * co2PerKmPerPassenger / 1000; // Convertir a kg
    return co2Emission.toFixed(2); // Retornar el resultado con dos decimales
  }
  const searchFlights = async () => {
    const accessToken = await getAccessToken();
    const fromCityCode = await fetchAirportCode(fromCity);
    const toCityCode = await fetchAirportCode(toCity);
    if (!accessToken || !fromCityCode || !toCityCode) {
      return;
    }

    try {
      const response = await axios.get('https://test.api.amadeus.com/v2/shopping/flight-offers', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          originLocationCode: fromCityCode,
          destinationLocationCode: toCityCode,
          departureDate: departureDate,
          adults: '1',
        },
      });

      if (response.data && response.data.data && response.data.data.length > 0) {
        // Calcular la emisión de CO2 para cada vuelo y encontrar el vuelo con la menor emisión.
        const flightsWithCO2 = response.data.data.map(flight => ({
          ...flight,
          co2Emission: flight.itineraries.flat().reduce((acc, itinerary) => acc + itinerary.segments.reduce((accSeg, segment) => accSeg + parseFloat(estimateCO2(segment.duration)), 0), 0)
        }));

        const bestFlight = flightsWithCO2.reduce((prev, current) => (prev.co2Emission < current.co2Emission ? prev : current));

        setBestFlight(bestFlight);
        onCO2Calculated(bestFlight.co2Emission, bestFlight.price.total);
      } else {
        setBestFlight(null);
      }
    } catch (error) {
      console.error('Error buscando vuelos con Amadeus', error);
      setError('Error buscando vuelos con Amadeus');
    }
  };

  useEffect(() => {
    if (fromCity && toCity && departureDate) {
      searchFlights();
    }
  }, [fromCity, toCity, departureDate]);

  return (
    <div>
      {error && <p>{error}</p>}
      {!error && bestFlight && (
        <div>
          <h2>Mejor vuelo (menor emisión de CO2):</h2>
          {bestFlight.itineraries.map((itinerary, index) => (
            <div key={index}>
              {itinerary.segments.map((segment, segmentIndex) => (
                <div key={segmentIndex}>
                  <p>Salida: {segment.departure.iataCode} Terminal: {segment.departure.terminal}, Hora: {segment.departure.at}</p>
                  <p>Llegada: {segment.arrival.iataCode} Terminal: {segment.arrival.terminal || 'N/A'}, Hora: {segment.arrival.at}</p>
                  <p>Estimación de CO2: {estimateCO2(segment.duration)} kg por pasajero</p>
                </div>
              ))}
            </div>
          ))}
          <p>Precio total: {bestFlight.price.total} {bestFlight.price.currency}</p>
        </div>
      )}
    </div>
  );
};

export default KiwiService;