import { useEffect, useState } from "react";
import weatherService from "../services/weather";

const CountryInfo = ({ countryData }) => {
    const [weatherData, setWeatherData] = useState();

    useEffect(() => {
        weatherService
            .getCityWeather(countryData[0].capital)
            .then((data) => setWeatherData(data));
    }, []);

    return countryData.map((country) => {
        return (
            <div key={country.area}>
                <h1>{country.name.common}</h1>
                <p>Capital {country.capital}</p>
                <p>Area {country.area}</p>
                <h2>Languages:</h2>
                <ul>
                    {Object.entries(country.languages).map(([key, value]) => {
                        return <li key={key}>{value}</li>;
                    })}
                </ul>
                <img src={country.flags.png} alt="" />
                <h3>Weather in {country.capital}</h3>
                {weatherData && (
                    <>
                        <p>
                            temperature{" "}
                            {(300 - weatherData.main.temp).toFixed(2)} Celcius
                        </p>
                        <img
                            src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`}
                            alt=""
                            width="10%"
                        />
                        <p>wind {weatherData.wind.speed} m/s</p>
                    </>
                )}
            </div>
        );
    });
};

export default CountryInfo;
