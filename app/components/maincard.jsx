"use client";

import { useEffect, useState } from 'react';
import { getWeatherData } from '../utils/weatherApi';
import Card from './Card';

const Maincard = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [city, setCity] = useState('Paris');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchWeatherData();
    }, []);

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

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            fetchWeatherData();
        }
    };

    const formatDate = (date) => {
        return new Date(date * 1000).toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="weather-app">
            <header className="app-header">
                <input 
                    type="text" 
                    className="search-box" 
                    placeholder="Rechercher une ville..." 
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    onKeyPress={handleSearch}
                />
            </header>
            <main className="app-main">
                {loading && <div className="loading">Chargement...</div>}
                {error && <div className="error">{error}</div>}
                {weatherData && (
                    <div className="weather-info">
                        <section className="location">
                            <h2 className="city">{weatherData.name}, {weatherData.sys.country}</h2>
                            <p className="date">{formatDate(weatherData.dt)}</p>
                        </section>
                        <div className="current-weather">
                            <div className="temp">{Math.round(weatherData.main.temp)}<span>°C</span></div>
                            <div className="weather-description">{weatherData.weather[0].description}</div>
                            <div className="hi-low">{Math.round(weatherData.main.temp_min)}°C / {Math.round(weatherData.main.temp_max)}°C</div>
                        </div>
                    </div>
                )}
            </main>
            <Card city={city} />
        </div>
    );
};

export default Maincard;

