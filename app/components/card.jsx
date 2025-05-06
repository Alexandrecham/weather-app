"use client";

import { useEffect, useState } from 'react';
import { Carousel } from 'react-bootstrap';
import { getHourlyForecast, getWeatherForecast } from '../utils/weatherApi';
import './Card.css';

function Card({ city }) {
  const [forecastData, setForecastData] = useState(null);
  const [hourlyData, setHourlyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchForecastData();
  }, [city]);

  const fetchForecastData = async () => {
    try {
      setLoading(true);
      const dailyData = await getWeatherForecast(city);
      const hourlyData = await getHourlyForecast(city);
      setForecastData(dailyData);
      setHourlyData(hourlyData);
      setError(null);
    } catch (err) {
      setError("Impossible de récupérer les prévisions météo.");
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (weatherId) => {
    if (weatherId >= 200 && weatherId < 300) return "orage.png";
    if (weatherId >= 300 && weatherId < 500) return "/icons/drizzle.png";
    if (weatherId >= 500 && weatherId < 600) return "rainy.png";
    if (weatherId >= 600 && weatherId < 700) return "snowy.png";
    if (weatherId >= 700 && weatherId < 800) return "ventos.png";
    if (weatherId === 800) return "sunny.png";
    return "nuso.png";
  };

  const formatDate = (date) => {
    const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    return dayNames[new Date(date).getDay()];
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;
  if (!forecastData || !hourlyData) return null;

  return (
    <div className="carousel-container">
      <Carousel indicators={true}>
        <Carousel.Item>
          <div className="d-flex justify-content-around align-items-center carousel-content">
            {forecastData.slice(0, 5).map((forecast, index) => (
              <div key={index} className="forecast-item">
                <p className="day">{index === 0 ? "Demain" : formatDate(forecast.date)}</p>
                <img src={getWeatherIcon(forecast.weather.id)} alt={forecast.weather.description} className="weather-icon" />
                <p className="temp"><strong>{Math.round(forecast.temp)}°C</strong></p>
              </div>
            ))}
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div className="d-flex justify-content-around align-items-center carousel-content">
            {hourlyData.slice(0, 5).map((hour, index) => (
              <div key={index} className="forecast-item">
                <p className="day">{new Date(hour.dt * 1000).getHours()}:00</p>
                <img src={getWeatherIcon(hour.weather.id)} alt={hour.weather.description} className="weather-icon" />
                <p className="temp"><strong>{Math.round(hour.temp)}°C</strong></p>
              </div>
            ))}
          </div>
        </Carousel.Item>
      </Carousel>
    </div>
  );
}

export default Card;
