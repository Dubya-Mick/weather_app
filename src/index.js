
const weatherFetcher = (() => {

    let currentCityWeatherData = {};
    const weatherDescription = document.getElementById('weather-description');
    const feelsLike = document.getElementById('feels-like');
    const wind = document.getElementById('wind');
    const precipChance = document.getElementById('precip-chance');
    const temp = document.getElementById('temperature');
    const cityTitle = document.getElementById('city-title');

    const searchForCity = () => {
        const chosenCity = document.getElementById('city-search').value;
        grabWeather(chosenCity);
    }

    const grabWeather = async (location) => {
        try {
            let rawWeatherData = await fetch(
                `http://api.weatherapi.com/v1/forecast.json?key=ec082002a81e415bae0115044210804&q=${location}`,
                {mode: 'cors'}
            )

            let weatherData = await rawWeatherData.json();
            console.log(weatherData);
            processWeatherData(weatherData);
            console.log(currentCityWeatherData);
            displayWeather();
        } catch (error) {
            console.log(error);

        }

    }
    const processWeatherData = (data) => {
        currentCityWeatherData.tempInC = data.current.temp_c.toFixed(0);
        currentCityWeatherData.tempInF = data.current.temp_f.toFixed(0);
        currentCityWeatherData.feelsLikeC = data.current.feelslike_c.toFixed(0);
        currentCityWeatherData.feelsLikeF = data.current.feelslike_f.toFixed(0);
        currentCityWeatherData.windKPH = data.current.wind_kph.toFixed(0);
        currentCityWeatherData.windMPH  = data.current.wind_mph.toFixed(0);
        currentCityWeatherData.chanceOfRain = data.forecast.forecastday[0].day.daily_chance_of_rain;
        currentCityWeatherData.chanceOfSnow = data.forecast.forecastday[0].day.daily_chance_of_snow;
        currentCityWeatherData.currentCondition = data.current.condition.text;
        currentCityWeatherData.dailyForecast = data.forecast.forecastday[0].day.condition.text;
        currentCityWeatherData.city = data.location.name;
        currentCityWeatherData.country = data.location.country;
        currentCityWeatherData.region = data.location.region;
        currentCityWeatherData.isDay = data.current.is_day;
    }

    const displayWeather = () => {
        temp.textContent = currentCityWeatherData.tempInC + '\u00B0';
        weatherDescription.textContent = currentCityWeatherData.currentCondition;
        feelsLike.textContent = 'Feels like: ' + currentCityWeatherData.feelsLikeC + '\u00B0';
        wind.textContent = 'Wind: ' + currentCityWeatherData.windKPH + ' kph';

        // change background image depending on night vs day and weather description
        const description = currentCityWeatherData.currentCondition;
        const clearRegex = /sunny|clear/gi;
        const partlyCloudyRegex = /partly/gi;
        const overcastRainSnowRegex = /cloudy|overcast|rain|drizzle|snow|ice|sleet|blizzard|fog/gi;
        if (currentCityWeatherData.isDay == 0 && clearRegex.test(description)) {
            document.documentElement.className = '';
            document.documentElement.classList.add('clear-night');
            document.body.style.color = 'white';
        } else if (currentCityWeatherData == 0 && overcastRainSnowRegex.test(description)) {
            document.documentElement.className = '';
            document.documentElement.classList.add('overcast-night');
            document.body.style.color = 'white';
        } else if (clearRegex.test(description)) {
            document.documentElement.className = '';
            document.documentElement.classList.add('clear-day');
            document.body.style.color = 'white';
        } else if (partlyCloudyRegex.test(description)) {
            document.documentElement.className = '';
            document.documentElement.classList.add('partly-cloudy');
            document.body.style.color = 'black';
        } else {
            document.documentElement.className = '';
            document.documentElement.classList.add('overcast-day');
            document.body.style.color = 'black';
        }
        
        // if city is in the US, display state name
        if (currentCityWeatherData.country == 'United States of America') {
            cityTitle.textContent = currentCityWeatherData.city + ', ' + currentCityWeatherData.region;
        } else {
            cityTitle.textContent = currentCityWeatherData.city + ', ' + currentCityWeatherData.country;
        }

        // if chance of snow is greater than/equal to 1, display chance of snow instead of rain
        if (parseInt(currentCityWeatherData.chanceOfSnow) >= 1) {
            precipChance.textContent = 'Chance of Snow: ' + currentCityWeatherData.chanceOfSnow + '%';
        } else {
            precipChance.textContent = 'Chance of Rain: ' + currentCityWeatherData.chanceOfRain + '%';
        }

    }

    const activateSearch = () => {
        document.getElementById('search-button').addEventListener('click', searchForCity);
    }

    return {
        activateSearch,
        grabWeather,
    }

})();
weatherFetcher.activateSearch();
weatherFetcher.grabWeather('Shanghai');
