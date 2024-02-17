import KiwiService from './kiwiService';
import CarEmissionsCalculator from './carEmissionsCalculator';
function TravelerInfo({ index, city, toCity, departureDate, coordinates, handleEmissionsCalculated, handleFlightDataCalculated, emissionsData, flightCO2Emissions, carFuelCosts, flightCosts, renderGreenTick, renderCostComparisonIcon }) {
  return (
      <div key={index} className="traveler-info-container">
          <h2 className="traveler-title">Viajero {index + 1}</h2>
          <div className="traveler-row">
              <KiwiService
                  fromCity={city}
                  toCity={toCity}
                  departureDate={departureDate}
                  onCO2Calculated={(co2Emission, cost) => handleFlightDataCalculated(index, co2Emission, cost)}
              />
              <CarEmissionsCalculator
                  from={coordinates.from[index]}
                  to={coordinates.to}
                  onEmissionsCalculated={(emissions, cost) => handleEmissionsCalculated(index, emissions, cost)}
              />
              <div>
                  {emissionsData[index] !== undefined && flightCO2Emissions[index] !== undefined ?
                  renderGreenTick(emissionsData[index], flightCO2Emissions[index]) : null}
              </div>
              <div>
                  {renderCostComparisonIcon(carFuelCosts[index], flightCosts[index])}
              </div>
          </div>
      </div>
  );
}


export default TravelerInfo;