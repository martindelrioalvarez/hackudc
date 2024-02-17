import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet-routing-machine';

const Mapa = ({ from, to }) => {
  useEffect(() => {
    let map = L.map('map').setView([to.lat, to.lng], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Agregar marcador para el destino ('to')
    L.marker([to.lat, to.lng]).addTo(map)
      .bindPopup('Destino: ' + to.lat + ', ' + to.lng)
      .openPopup();

    // Asegurarse de que 'from' es un arreglo y tiene elementos
    if (Array.isArray(from) && from.length > 0) {
      from.forEach(fromCoord => {
        if (fromCoord && !isNaN(fromCoord.lat) && !isNaN(fromCoord.lng)) {
          // Agregar marcador para este punto de partida
          L.marker([fromCoord.lat, fromCoord.lng]).addTo(map)
            .bindPopup('Partida: ' + fromCoord.lat + ', ' + fromCoord.lng)
            .openPopup();
          
          L.polyline([
            [fromCoord.lat, fromCoord.lng],
            [to.lat, to.lng]
          ], {
            color: 'red', // Puedes cambiar el color de la línea aquí
            weight: 4, // Puedes cambiar el grosor de la línea aquí
            opacity: 0.5 // Puedes cambiar la opacidad de la línea aquí
          }).addTo(map);

          // Calcular y mostrar la ruta en coche

        }
      });

      // Centrar el mapa para mostrar todos los marcadores y rutas
      let group = new L.featureGroup([L.marker([to.lat, to.lng])].concat(from.map(fromCoord => L.marker([fromCoord.lat, fromCoord.lng]))));
      map.fitBounds(group.getBounds().pad(0.5)); // Ajustar el zoom para incluir todos los marcadores con un poco de padding
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
