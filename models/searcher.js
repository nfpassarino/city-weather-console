const fs = require('fs');
const axios = require('axios');

class Searcher {
    history = [];
    pathFile = './db/database.json';
    constructor() {
        this.readHistory();
    }
    get paramsMapbox() {
        return {
            access_token: process.env.MAPBOX_KEY,
            proximity: 'ip',
            types: 'place,postcode,address',
            language: 'es',
            limit: 5,
        };
    }
    get paramsOpenWeather() {
        return {
            appid: process.env.OPENWEATHER_KEY,
            units: 'metric',
            lang: 'es',
        };
    }
    async searchCity(text = '') {
        //TODO limpiar text
        try {
            const mapboxWS = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${text}.json`,
                params: this.paramsMapbox,
            });
            const response = await mapboxWS.get();
            return response.data.features.map((city) => ({
                id: city.id,
                name: city.place_name_es,
                lon: city.center[0],
                lat: city.center[1],
            }));
        } catch (error) {
            return [];
        }
    }
    async getWeatherByCoordinates(lon = '', lat = '') {
        try {
            const openWeatherWS = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: { ...this.paramsOpenWeather, lon, lat },
            });
            const response = await openWeatherWS.get();
            const { weather, main } = response.data;
            return {
                description: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp,
            };
        } catch (error) {
            return {};
        }
    }
    addHistory(city = '') {
        if (!this.history.includes(city.toLocaleLowerCase())) {
            this.history.unshift(city.toLocaleLowerCase());
        }
    }
    writeHistory() {
        const payload = {
            history: this.history,
        };
        fs.writeFileSync(this.pathFile, JSON.stringify(payload));
    }
    readHistory() {
        if (fs.existsSync(this.pathFile)) {
            const data = fs.readFileSync(this.pathFile, { enconding: 'utf-8' });
            this.history = JSON.parse(data).history;
        }
    }
}

module.exports = Searcher;
