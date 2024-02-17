import React, { useState, useEffect } from 'react';
import Mapa from './components/Mapa';
import './App.css';
import useFetchCoordinatesForCities from './hooks/useFetchCoordinates'
import TravelDetailsForm from './components/TravelDetailsForm';
import TravelerInfo from './components/TravelerInfo';
import CarIcon from './icons/car-svgrepo-com (1).svg'
import HojaIcon from './icons/leaf-circle-svgrepo-com.svg';
import AvionIcon from './icons/plane-svgrepo-com (1).svg';
import DineroIcon from './icons/money-bag-svgrepo-com.svg';

function App() {
  const [fromCities, setFromCities] = useState(['']);
  const [toCity, setToCity] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [emissionsData, setEmissionsData] = useState([]);
  const [flightCO2Emissions, setFlightCO2Emissions] = useState([]);
  const [carFuelCosts, setCarFuelCosts] = useState([]);
  const [flightCosts, setFlightCosts] = useState([]);

  // Utilizar el custom hook para obtener las coordenadas
  const coordinates = useFetchCoordinatesForCities(showMap, fromCities, toCity);

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

  const handleEmissionsCalculated = (index, emissions, fuelCost) => {
    setEmissionsData(prevEmissionsData => {
      const newEmissionsData = [...prevEmissionsData];
      newEmissionsData[index] = emissions;
      return newEmissionsData;
    });
  
    setCarFuelCosts(prevCarFuelCosts => {
      const newCarFuelCosts = [...prevCarFuelCosts];
      newCarFuelCosts[index] = fuelCost;
      return newCarFuelCosts;
    });
  };
  
  const handleFlightDataCalculated = (index, emissions, cost) => {
    setFlightCO2Emissions(prevFlightCO2Emissions => {
      const newFlightCO2Emissions = [...prevFlightCO2Emissions];
      newFlightCO2Emissions[index] = emissions;
      return newFlightCO2Emissions;
    });
  
    setFlightCosts(prevFlightCosts => {
      const newFlightCosts = [...prevFlightCosts];
      newFlightCosts[index] = cost;
      return newFlightCosts;
    });
  };

  const renderIcon = (icon, altText) => (
    <img src={icon} className="icon" alt={altText} />
  );

  const renderGreenTick = (carEmissions, flightEmissions) => {
    if (carEmissions === 0 || flightEmissions === 0) return null;
    
    return carEmissions < flightEmissions ? (
      <span>{renderIcon(CarIcon, "Car Icon")}{renderIcon(HojaIcon, "Hoja Icon")}</span>
    ) : flightEmissions < carEmissions ? (
      <span>{renderIcon(AvionIcon, "Avion Icon")}{renderIcon(HojaIcon, "Hoja Icon")}</span>
    ) : null;
  };

  const renderCostComparisonIcon = (carCost, flightCost) => {
    if (!carCost || !flightCost || carCost === 0 || flightCost === 0) return null;
    
    const icon = carCost < flightCost ? CarIcon : AvionIcon;
    return (
      <span>{renderIcon(icon, `${carCost < flightCost ? 'Car' : 'Avion'} Icon`)}{renderIcon(DineroIcon, "Dinero Icon")}</span>
    );
  };

  return (
    <div className="App">
      <header>
        <h1>My Ecofriendly Traveler</h1>
      </header>
      <main>
        <TravelDetailsForm 
          fromCities={fromCities} 
          handleFromCityChange={handleFromCityChange} 
          toCity={toCity} 
          setToCity={setToCity} 
          departureDate={departureDate} 
          setDepartureDate={setDepartureDate} 
          incrementFromCity={incrementFromCity} 
          decrementFromCity={decrementFromCity} 
          handleSubmit={handleSubmit} 
        />
        {showMap && coordinates.to && (
          <Mapa from={coordinates.from} to={coordinates.to} />
        )}
        {showMap && coordinates.from.length > 0 && coordinates.to && (
          fromCities.map((city, index) => (
            <TravelerInfo 
              key={index} 
              index={index} 
              city={city} 
              toCity={toCity} 
              departureDate={departureDate} 
              coordinates={coordinates} 
              handleEmissionsCalculated={handleEmissionsCalculated} 
              handleFlightDataCalculated={handleFlightDataCalculated} 
              emissionsData={emissionsData} 
              flightCO2Emissions={flightCO2Emissions} 
              carFuelCosts={carFuelCosts} 
              flightCosts={flightCosts} 
              renderGreenTick={renderGreenTick} 
              renderCostComparisonIcon={renderCostComparisonIcon}
            />
          ))
        )}
      </main>
    </div>
  );
};

export default App;
