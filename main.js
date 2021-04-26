/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
const weatherFetcher = (() => {
  const currentCityWeatherData = {};
  let farenheit = false;
  const weatherDescription = document.getElementById('weather-description');
  const feelsLike = document.getElementById('feels-like');
  const wind = document.getElementById('wind');
  const precipChance = document.getElementById('precip-chance');
  const temp = document.getElementById('temperature');
  const cityTitle = document.getElementById('city-title');
  const loadingSpinner = document.querySelector('.spinner');

  const searchForCity = () => {
    const chosenCity = document.getElementById('city-search').value;
    grabWeather(chosenCity);
  };

  const grabUserWeather = async () => {
    try {
      loadingSpinner.style.display = 'block';
      const rawLocationData = await fetch('https://ipapi.co/json/',
        { mode: 'cors' });
      const locationData = await rawLocationData.json();
      const cityAndCountry = `${locationData.city}, ${locationData.country_name}`;
      grabWeather(cityAndCountry);
    } catch {
      displayErrorToast('Sorry, no weather data found based on your location. Please try a city in the search bar.');
    }
  };

  const grabWeather = async (location) => {
    try {
      loadingSpinner.style.display = 'block';
      const rawWeatherData = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=ec082002a81e415bae0115044210804&days=7&q=${location}`,
        { mode: 'cors' },
      );
      const weatherData = await rawWeatherData.json();
      processWeatherData(weatherData);
      loadingSpinner.style.display = 'none';
      displayWeather();
    } catch {
      loadingSpinner.style.display = 'none';
      displayErrorToast('Sorry, no weather data found. Try another search.');
    }
  };

  const processWeatherData = (data) => {
    // add properties to currentCityWeatherData object containing only the info we need
    currentCityWeatherData.tempInC = data.current.temp_c.toFixed(0);
    currentCityWeatherData.tempInF = data.current.temp_f.toFixed(0);
    currentCityWeatherData.feelsLikeC = data.current.feelslike_c.toFixed(0);
    currentCityWeatherData.feelsLikeF = data.current.feelslike_f.toFixed(0);
    currentCityWeatherData.windKPH = data.current.wind_kph.toFixed(0);
    currentCityWeatherData.windMPH = data.current.wind_mph.toFixed(0);
    currentCityWeatherData.chanceOfRain = data.forecast.forecastday[0].day.daily_chance_of_rain;
    currentCityWeatherData.chanceOfSnow = data.forecast.forecastday[0].day.daily_chance_of_snow;
    currentCityWeatherData.currentCondition = data.current.condition.text;
    currentCityWeatherData.dailyForecast = data.forecast.forecastday[0].day.condition.text;
    currentCityWeatherData.city = data.location.name;
    currentCityWeatherData.country = data.location.country;
    currentCityWeatherData.region = data.location.region;
    currentCityWeatherData.isDay = data.current.is_day;
  };

  const displayWeather = () => {
    temp.textContent = `${currentCityWeatherData.tempInC}\u00B0`;
    weatherDescription.textContent = currentCityWeatherData.currentCondition;
    feelsLike.textContent = `Feels like: ${currentCityWeatherData.feelsLikeC}\u00B0`;
    wind.textContent = `Wind: ${currentCityWeatherData.windKPH} kph`;

    // change background image depending on night vs day and weather description
    const description = currentCityWeatherData.currentCondition;
    const clearRegex = /sunny|clear/gi;
    const partlyCloudyRegex = /partly/gi;
    const overcastRainSnowRegex = /cloudy|overcast|rain|drizzle|snow|ice|sleet|blizzard|fog/gi;
    if (currentCityWeatherData.isDay === 0 && clearRegex.test(description)) {
      document.documentElement.style.setProperty('--image-url', 'url(../dist/images/clear-night-sky.jpeg)');
      document.body.style.color = 'white';
    } else if (currentCityWeatherData === 0 && overcastRainSnowRegex.test(description)) {
      document.documentElement.style.setProperty('--image-url', 'url(../dist/images/clouds-night.jpeg)');
      document.body.style.color = 'white';
    } else if (clearRegex.test(description)) {
      document.documentElement.style.setProperty('--image-url', 'url(../dist/images/clear-day.jpeg)');
      document.body.style.color = 'white';
    } else if (partlyCloudyRegex.test(description)) {
      document.documentElement.style.setProperty('--image-url', 'url(../dist/images/partly-cloudy-day.jpeg)');
      document.body.style.color = 'black';
    } else {
      document.documentElement.style.setProperty('--image-url', 'url(../dist/images/overcast-day.jpeg)');
      document.body.style.color = 'black';
    }

    // if city is in the US, display state name
    if (currentCityWeatherData.country === 'United States of America') {
      cityTitle.textContent = `${currentCityWeatherData.city}, ${currentCityWeatherData.region}`;
    } else {
      cityTitle.textContent = `${currentCityWeatherData.city}, ${currentCityWeatherData.country}`;
    }

    // if chance of snow is greater than/equal to 1, display chance of snow instead of rain
    if (parseInt(currentCityWeatherData.chanceOfSnow) > parseInt(currentCityWeatherData.chanceOfRain)) {
      precipChance.textContent = `Chance of Snow: ${currentCityWeatherData.chanceOfSnow}%`;
    } else {
      precipChance.textContent = `Chance of Rain: ${currentCityWeatherData.chanceOfRain}%`;
    }
  };

  const toggleTempUnits = () => {
    const f = document.getElementById('f');
    const c = document.getElementById('c');
    if (farenheit) {
      temp.textContent = `${currentCityWeatherData.tempInC}\u00B0`;
      feelsLike.textContent = `Feels like: ${currentCityWeatherData.feelsLikeC}\u00B0`;
      f.classList.toggle('faded');
      c.classList.toggle('faded');
      farenheit = false;
    } else {
      temp.textContent = `${currentCityWeatherData.tempInF}\u00B0`;
      feelsLike.textContent = `Feels like: ${currentCityWeatherData.feelsLikeF}\u00B0`;
      f.classList.toggle('faded');
      c.classList.toggle('faded');
      farenheit = true;
    }
  };

  const displayErrorToast = (errorMessage) => {
    const toast = document.querySelector('.toast');
    toast.textContent = errorMessage;
    toast.classList.add('show-toast');
    setTimeout(() => toast.classList.remove('show-toast'), 3000);
  };

  const activateSearch = () => {
    document.getElementById('search-button').addEventListener('click', searchForCity);
  };

  const activateTempToggle = () => {
    document.getElementById('unit-button').addEventListener('click', toggleTempUnits);
  };

  const init = () => {
    activateSearch();
    activateTempToggle();
    grabUserWeather();
  };

  return {
    init,
  };
})();
weatherFetcher.init();

/******/ })()
;
//# sourceMappingURL=main.js.map