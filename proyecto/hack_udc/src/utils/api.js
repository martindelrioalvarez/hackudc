// src/utils/api.js
export const fetchCoordinates = async (cityName) => {
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
    console.error("Error fetching coordinates:", error);
    return null;
  }
};
