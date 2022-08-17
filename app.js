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
    searcher.writeHistory();
};

const processOption = async (option, searcher) => {
    switch (option) {
        case 1:
            const input = await readInput('Ciudad: ');
            const suggestedCities = await searcher.searchCity(input);
            const selectedCityId = await selectCity(suggestedCities);
            if (selectedCityId === 0) return;
            const selectedCity = suggestedCities.find(
                (city) => city.id === selectedCityId
            );
            searcher.addHistory(selectedCity.name);
            const cityWeather = await searcher.getWeatherByCoordinates(
                selectedCity.lon,
                selectedCity.lat
            );
            printCityData(selectedCity, cityWeather);
            break;
        case 2:
            searcher.history
                .map((cityName) => capitalizeString(cityName))
                .forEach((cityName, i) => {
                    const colorIndex = `${++i}`.green;
                    console.log(`${colorIndex}. ${cityName}`);
                });
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

const capitalizeString = (text = '') => {
    let words = text.split(' ');
    return words
        .map((word) => word[0].toUpperCase() + word.substring(1))
        .join(' ');
};

main();
