import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// TODO: Define a City class with name and id properties
class City {
    constructor(name) {
        this.id = uuidv4();
        this.name = name;
    }
}
// TODO: Complete the HistoryService class
class HistoryService {
    // TODO: Define a read method that reads from the searchHistory.json file
    async read() {
        const filePath = path.join(__dirname, '../../shared/searchHistory.json');
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    }
    // TODO: Define a write method that writes the updated cities array to the searchHistory.json file

    // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
    async getCities() {
        return this.read();
    }
    // TODO: Define an addCity method that adds a city to the searchHistory.json file
    async addCity(cityName) {
        const cities = await this.read();
        const newCity = new City(cityName);
        cities.push(newCity);
        await this.write(cities);
    }
    // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
    async removeCity(id) {
        const cities = await this.read();
        const updatedCities = cities.filter((city) => city.id !== id);
        await this.write(updatedCities);
    }
}
export default new HistoryService();

