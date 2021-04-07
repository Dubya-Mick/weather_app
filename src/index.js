
const weatherFetcher = (() => {

    let currentCityWeatherData = null;

    const fetchCityWeather = async () => {
        try {
            const response = await fetch(
                'https://api.openweathermap.org/data/2.5/weather?q=London&&units=metric&appid=9d8a24e77d28fa3feb28720f79b0b549',
                {mode: 'cors'}
            );
            currentCityWeatherData = await response.json();
            
            console.log(currentCityWeatherData);
        } catch (error) {
            console.log(error);
            alert('No weather found for that city');
        }


    }

    return {
        fetchCityWeather
    }

})();

weatherFetcher.fetchCityWeather();