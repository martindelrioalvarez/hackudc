import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Map = () => {
  useEffect(() => {
    // Inicializar el mapa
    const map = L.map('map').setView([51.505, -0.09], 13);

    // Agregar la capa de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
  }, []);

  return <div id="map" style={{ height: '500px', width: '100%' }}></div>;
};

export default Map;
