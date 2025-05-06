"use client";

import { useEffect, useState } from 'react';
import { getWeatherData } from '../utils/weatherApi';

export default function Weather() {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('Paris');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWeatherData();
  }, [city]);

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      const data = await getWeatherData(city);
      setWeatherData(data);
      setError(null);
    } catch (err) {
      setError("Impossible de récupérer les données météo. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <input 
        type="text" 
        value={city} 
        onChange={handleCityChange} 
        placeholder="Entrez une ville"
      />
      {weatherData && (
        <div>
          <h2>{weatherData.name}</h2>
          <p>Température: {weatherData.main.temp}°C</p>
          <p>Description: {weatherData.weather[0].description}</p>
        </div>
      )}
    </div>
  );
}