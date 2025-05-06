const API_KEY = process.env.NEXT_PUBLIC_WEATHER_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export async function getWeatherData(city) {
  try {
    const response = await fetch(`${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric&lang=fr`);
    if (!response.ok) {
      throw new Error('Données météo non trouvées');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération des données météo:", error);
    throw error;
  }
}

export async function getWeatherForecast(city) {
  try {
    const response = await fetch(`${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=fr`);
    if (!response.ok) {
      throw new Error('Prévisions météo non trouvées');
    }
    const data = await response.json();
    return processForecastData(data);
  } catch (error) {
    console.error("Erreur lors de la récupération des prévisions météo:", error);
    throw error;
  }
}

function processForecastData(data) {
  const dailyForecasts = [];
  const today = new Date().setHours(0, 0, 0, 0);
  
  for (let i = 0; i < data.list.length; i += 8) {
    const forecast = data.list[i];
    const forecastDate = new Date(forecast.dt * 1000);
    
    if (forecastDate.setHours(0, 0, 0, 0) > today) {
      dailyForecasts.push({
        date: forecastDate,
        temp: forecast.main.temp,
        weather: forecast.weather[0]
      });
    }
    
    if (dailyForecasts.length === 5) break;
  }
  
  return dailyForecasts;
}

export async function getHourlyForecast(city) {
  try {
    const response = await fetch(`${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=fr`);
    if (!response.ok) {
      throw new Error('Prévisions horaires non trouvées');
    }
    const data = await response.json();
    return processHourlyData(data);
  } catch (error) {
    console.error("Erreur lors de la récupération des prévisions horaires:", error);
    throw error;
  }
}

function processHourlyData(data) {
  const now = new Date();
  const hourlyForecasts = data.list
    .filter(item => new Date(item.dt * 1000) > now)
    .slice(0, 5)
    .map(item => ({
      dt: item.dt,
      temp: item.main.temp,
      weather: item.weather[0]
    }));
  
  return hourlyForecasts;
}
