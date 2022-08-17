require('dotenv').config();
const {
    selectMenu,
    continueToNext,
    readInput,
    selectCity,
} = require('./helpers/inquirer');
const Searcher = require('./models/searcher');

const main = async () => {
    console.clear();
    let option = null;
    const searcher = new Searcher();
    while (option !== 0) {
        option = await selectMenu();
        await processOption(option, searcher);
        await continueToNext();
    }
};

const processOption = async (option, searcher) => {
    switch (option) {
        case 1:
            const input = await readInput('Ciudad: ');
            const suggestedCities = await searcher.searchCity(input);
            const selectedCityId = await selectCity(suggestedCities);
            const selectedCity = suggestedCities.find(
                (city) => city.id === selectedCityId
            );
            const cityWeather = await searcher.getWeatherByCoordinates(
                selectedCity.lon,
                selectedCity.lat
            );
            printCityData(selectedCity, cityWeather);
            break;
        case 2:
            // mostrar historial
            break;
    }
};

const printCityData = (selectedCity = {}, cityWeather = {}) => {
    console.log('\nInformación de la ciudad\n'.green);
    console.log('Ciudad:'.green, selectedCity.name);
    console.log('Latitud:'.green, selectedCity.lat);
    console.log('Longitud:'.green, selectedCity.lon);
    console.log('Temperatura:'.green, cityWeather.temp, '°C');
    console.log('Mínima:'.green, cityWeather.min, '°C');
    console.log('Máxima:'.green, cityWeather.max, '°C');
    console.log('¿Cómo esta el clima?'.green, cityWeather.description);
};

main();
