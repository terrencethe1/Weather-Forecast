import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
class Weather {
  constructor(
    public city: string,
    public date: string,
    public icon: string,
    public iconDescription: string,
    public tempF: number,
    public windSpeed: number,
    public humidity: number
  ) {}
}

// TODO: Complete the WeatherService class
class WeatherService {
  private baseURL: string;
  private apiKey: string;

  constructor() {
    this.baseURL = 'https://api.openweathermap.org';
    this.apiKey = process.env.API_KEY || '';
  }

  // TODO: Create fetchLocationData method to retrieve coordinates based on city name
  private async fetchLocationData(query: string): Promise<Coordinates> {
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
  private destructureLocationData(locationData: Coordinates): Coordinates {
    return {
      lat: locationData.lat,
      lon: locationData.lon,
    };
  }

  // TODO: Build the weather query URL for retrieving forecast
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/3.0/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial&appid=${this.apiKey}`;
  }

  // TODO: Fetch weather data using buildWeatherQuery for URL
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const url = this.buildWeatherQuery(coordinates);
    const response = await axios.get(url);
    return response.data;
  }

  // TODO: Parse current weather data
  private parseCurrentWeather(response: any, city: string): Weather {
    const { temp, humidity, wind_speed: windSpeed } = response.current;
    const { description, icon } = response.current.weather[0];
    const tempF = Math.round(temp);

    return new Weather(
      city,
      this.formatDate(response.current.dt),
      icon,
      description,
      tempF,
      windSpeed,
      humidity
    );
  }

// TODO: Build an array of forecast objects for upcoming days
private buildForecastArray(daily: any[], city: string): Weather[] {
  
  return daily.slice(1, 6).map((day: any) => {
    const { day: temp } = day.temp;
    const { description, icon } = day.weather[0];
    const tempF = Math.round(temp);
    const { wind_speed: windSpeed, humidity } = day;

    return new Weather(
      city,
      this.formatDate(day.dt),
      icon,
      description,
      tempF,
      windSpeed,
      humidity
    );
  });
}





  
     

  // Format Unix timestamp to 'MM-DD-YYYY'
private formatDate(unixTimestamp: number): string {
  const date = new Date(unixTimestamp * 1000);
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}-${day}-${year}`;
}

  // TODO: Complete getWeatherForCity method to retrieve weather for a city
  async getWeatherForCity(city: string): Promise<Weather[]> {
    const coordinates = await this.fetchAndDestructureLocationData(city);
    const weatherData = await this.fetchWeatherData(coordinates);

    const currentWeather = this.parseCurrentWeather(weatherData, city);
    const forecast = this.buildForecastArray(weatherData.daily.slice(1), city);

    return [currentWeather, ...forecast];
  }

  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(city: string): Promise<Coordinates> {
    const locationData = await this.fetchLocationData(city);
    return this.destructureLocationData(locationData);
  }
}

export default new WeatherService();
