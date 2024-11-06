import { Router } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
  try {
    const { cityName } = req.body;
    console.log('Received cityName:', cityName);

    // TODO: GET weather data from city name
    const weatherData = await WeatherService.getWeatherForCity(cityName);
    console.log('Fetched weatherData:', weatherData);

    // TODO: save city to search history
    await HistoryService.addCity(cityName);

    res.status(200).json(weatherData);
  } catch (error) {
    console.error('Error retrieving weather data:', error);
    res.status(500).json({ message: 'Error retrieving weather data' });
  }
});

// TODO: GET search history
router.get('/history', async (_, res) => {  // Replaced 'req' with '_'
  try {
    const history = await HistoryService.getCities();
    res.status(200).json(history);
  } catch (error) {
    console.error('Error retrieving search history:', error);
    res.status(500).json({ message: 'Error retrieving search history' });
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await HistoryService.removeCity(id);
    res.status(200).json({ message: 'City deleted from search history' });
  } catch (error) {
    console.error('Error deleting city from search history:', error);
    res.status(500).json({ message: 'Error deleting city from search history' });
  }
});

export default router;
