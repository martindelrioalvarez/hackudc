import React, { useEffect } from 'react';
import L from 'leaflet';

const Mapa = ({ from, to }) => {
  useEffect(() => {
    let map = null;

    if (from && to && !isNaN(from.lat) && !isNaN(from.lng) && !isNaN(to.lat) && !isNaN(to.lng)) {
      map = L.map('map').setView([from.lat, from.lng], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Agregar marcadores para 'from' y 'to'
      L.marker([from.lat, from.lng]).addTo(map)
        .bindPopup('From: ' + from.lat + ', ' + from.lng)
        .openPopup();

      L.marker([to.lat, to.lng]).addTo(map)
        .bindPopup('To: ' + to.lat + ', ' + to.lng)
        .openPopup();
      
      // Dibujar una línea recta entre 'from' y 'to'
      L.polyline([
        [from.lat, from.lng],
        [to.lat, to.lng]
      ], {
        color: 'red', // Puedes cambiar el color de la línea aquí
        weight: 4, // Puedes cambiar el grosor de la línea aquí
        opacity: 0.5 // Puedes cambiar la opacidad de la línea aquí
      }).addTo(map);
      
      // Centrar el mapa para que muestre ambos marcadores
      map.fitBounds([
        [from.lat, from.lng],
        [to.lat, to.lng]
      ]);
    }

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [from, to]);

  return <div id="map" style={{ height: '500px', width: '100%' }}></div>;
};

export default Mapa;
