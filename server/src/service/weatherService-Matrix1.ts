import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();
// TODO: Define a class for the Weather object
class Weather {
    constructor(city, date, icon, iconDescription, tempF, windSpeed, humidity) {
        this.city = city;
        this.date = date;
        this.icon = icon;
        this.iconDescription = iconDescription;
        this.tempF = tempF;
        this.windSpeed = windSpeed;
        this.humidity = humidity;
    }
}
// TODO: Complete the WeatherService class
class WeatherService {
    constructor() {
        this.baseURL = 'https://api.openweathermap.org';
        this.apiKey = process.env.API_KEY || '';
    }
    // TODO: Create fetchLocationData method to retrieve coordinates based on city name
    async fetchLocationData(query) {
        const response = await axios.get(`${this.baseURL}/geo/1.0/direct`, {
            params: {
                q: query,
                limit: 1,
                appid: this.apiKey,
            },
        });
        const data = response.data[0];
        return { lat: data.lat, lon: data.lon };
    }
    // TODO: Create method to destructure location data
    destructureLocationData(locationData) {
        return {
            lat: locationData.lat,
            lon: locationData.lon,
        };
    }
    // TODO: Build the weather query URL for retrieving forecast
    buildWeatherQuery(coordinates) {
        return `${this.baseURL}/data/3.0/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial&appid=${this.apiKey}`;
    }
    // TODO: Fetch weather data using buildWeatherQuery for URL
    async fetchWeatherData(coordinates) {
        const url = this.buildWeatherQuery(coordinates);
        const response = await axios.get(url);
        return response.data;
    }
    // TODO: Parse current weather data
    parseCurrentWeather(response, city) {
        const { temp, humidity, wind_speed: windSpeed } = response.current;
        const { description, icon } = response.current.weather[0];
        const tempF = Math.round(temp);
        return new Weather(city, this.formatDate(response.current.dt), icon, description, tempF, windSpeed, humidity);
    }
    // TODO: Build an array of forecast objects for upcoming days
    buildForecastArray(daily, city) {
        // Limit to 5 days of forecast
        return daily.slice(1, 6).map((day) => {
            const { day: temp } = day.temp;
            const { description, icon } = day.weather[0];
            const tempF = Math.round(temp);
            const { wind_speed: windSpeed, humidity } = day;
            return new Weather(city, this.formatDate(day.dt), icon, description, tempF, windSpeed, humidity);
        });
    }
    // Format Unix timestamp to 'DD-MM-YYYY'
    formatDate(unixTimestamp) {
        const date = new Date(unixTimestamp * 1000);
        return date.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
    // TODO: Complete getWeatherForCity method to retrieve weather for a city
    async getWeatherForCity(city) {
        const coordinates = await this.fetchAndDestructureLocationData(city);
        const weatherData = await this.fetchWeatherData(coordinates);
        const currentWeather = this.parseCurrentWeather(weatherData, city);
        const forecast = this.buildForecastArray(weatherData.daily.slice(1), city);
        return [currentWeather, ...forecast];
    }
    // TODO: Create fetchAndDestructureLocationData method
    async fetchAndDestructureLocationData(city) {
        const locationData = await this.fetchLocationData(city);
        return this.destructureLocationData(locationData);
    }
}
export default new WeatherService();


