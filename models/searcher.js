const axios = require('axios');

class Searcher {
    history = [];
    constructor() {
        // TODO leer db si existe
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
}

module.exports = Searcher;
