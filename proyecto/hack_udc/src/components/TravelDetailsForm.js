
function TravelDetailsForm({ fromCities, handleFromCityChange, toCity, setToCity, departureDate, setDepartureDate, incrementFromCity, decrementFromCity, handleSubmit }) {
  return (
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
  );
}


export default TravelDetailsForm;
