import axios from "axios";
const api = import.meta.env.VITE_OPEN_WEATHER_API;

const getCityWeather = (city) => {
    const req = axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api}`
    );
    return req.then((res) => res.data);
};

export default {
    getCityWeather,
};
