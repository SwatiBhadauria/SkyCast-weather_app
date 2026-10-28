
const form = document.getElementById("search-form");
const input = document.getElementById("city-input");
const message = document.getElementById("message");
const weather = document.getElementById("weather");
const weatherTypes = {
    0: ["Clear sky", "☀️"],
    1: ["Mainly clear", "🌤️"],
    2: ["Partly cloudy", "⛅"],
    3: ["Overcast", "☁️"],
    45: ["Foggy", "🌫️"],
    48: ["Depositing rime fog", "🌫️"],
    51: ["Light drizzle", "🌦️"],
    53: ["Moderate drizzle", "🌦️"],
    55: ["Dense drizzle", "🌧️"],
    61: ["Slight rain", "🌧️"],
    63: ["Moderate rain", "🌧️"],
    65: ["Heavy rain", "🌧️"],
    71: ["Slight snowfall", "🌨️"],
    73: ["Moderate snowfall", "❄️"],
    75: ["Heavy snowfall", "❄️"],
    80: ["Rain showers", "🌦️"],
    81: ["Moderate rain showers", "🌧️"],
    82: ["Violent rain showers", "⛈️"],
    95: ["Thunderstorm", "⛈️"],
    96: ["Thunderstorm with hail", "⛈️"],
    99: ["Thunderstorm with heavy hail", "⛈️"]
};

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const city = input.value.trim();

    if (!city) return;

    message.textContent = "Loading weather...";
    weather.hidden = true;

    try {
        const geoUrl =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

        const geoResponse = await fetch(geoUrl);

        if (!geoResponse.ok) {
            throw new Error("Could not search for this city.");
        }

        const geoData = await geoResponse.json();
        const place = geoData.results?.[0];

        if (!place) {
            throw new Error("City not found. Try another city.");
        }

        const weatherUrl =
            `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&timezone=auto`;

        const weatherResponse = await fetch(weatherUrl);

        if (!weatherResponse.ok) {
            throw new Error("Could not retrieve weather data.");
        }

        const data = await weatherResponse.json();
        const current = data.current;

        const [description, icon] =
            weatherTypes[current.weather_code] || ["Unknown conditions", "🌍"];

        document.getElementById("city-name").textContent =
            `${place.name}, ${place.country}`;

        document.getElementById("weather-icon").textContent =
            current.is_day ? icon : "🌙";

        document.getElementById("temperature").textContent =
            `${Math.round(current.temperature_2m)}°C`;

        document.getElementById("condition").textContent =
            description;

        document.getElementById("feels-like").textContent =
            `${Math.round(current.apparent_temperature)}°C`;

        document.getElementById("humidity").textContent =
            `${current.relative_humidity_2m}%`;

        document.getElementById("wind").textContent =
            `${current.wind_speed_10m} km/h`;

        weather.hidden = false;
        message.textContent = "Weather updated successfully.";
    } catch (error) {
        message.textContent =
            error.message || "Something went wrong. Please try again.";
    }
});
