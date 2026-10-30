import { useState, useEffect } from "react";

const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

const App = () => {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState("");

  useEffect(() => {
    const getCountries = async () => {
      try {
        const response = await fetch(
          "https://studies.cs.helsinki.fi/restcountries/api/all",
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setCountries(data);
      } catch (err) {
        console.log(err);
      }
    };
    getCountries();
  }, []);

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setSelectedCountry(null);
  };

  const matchedCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(search.toLowerCase()),
  );

  const countryToDisplay =
    selectedCountry ||
    (matchedCountries.length === 1 ? matchedCountries[0] : null);

  const capital = countryToDisplay?.capital?.[0];

  useEffect(() => {
    if (!countryToDisplay?.latlng) {
      setWeather(null);
      setWeatherError("");
      return;
    }

    const [latitude, longitude] = countryToDisplay.latlng;
    let ignore = false;

    const getWeather = async () => {
      setWeather(null);
      setWeatherError("");

      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`,
        );

        if (!response.ok) {
          throw new Error(`Weather API error: ${response.status}`);
        }

        const data = await response.json();

        if (!ignore) {
          setWeather(data);
        }
      } catch (err) {
        if (!ignore) {
          console.error(err);
          setWeatherError(err.message);
        }
      }
    };

    getWeather();

    return () => {
      ignore = true;
    };
  }, [countryToDisplay?.latlng?.[0], countryToDisplay?.latlng?.[1]]);

  const renderCountryDetails = () => {
    if (!countryToDisplay) {
      return null;
    }

    return (
      <div>
        <h2>{countryToDisplay.name.common}</h2>
        <div>
          Capital:{" "}
          {countryToDisplay.capital ? countryToDisplay.capital[0] : "N/A"}
        </div>
        <div>Area: {countryToDisplay.area}</div>

        <h3>languages:</h3>
        <ul>
          {Object.values(countryToDisplay.languages || {}).map((lang) => (
            <li key={lang}>{lang}</li>
          ))}
        </ul>

        <img
          src={countryToDisplay.flags.png}
          alt={`Flag of ${countryToDisplay.name.common}`}
          style={{
            width: "150px",
            marginTop: "10px",
            border: "1px solid #ccc",
          }}
        />
        {weatherError && <p>Unable to load weather: {weatherError}</p>}
        {weather && (
          <div>
            <h3>Weather in {capital || countryToDisplay.name.common}</h3>
            <p>Temperature: {weather.main.temp} °C</p>
            <p>Conditions: {weather.weather[0].description}</p>
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
            />
            <p>Wind speed: {weather.wind?.speed ?? "N/A"} m/s</p>
          </div>
        )}
      </div>
    );
  };

  const renderCountries = () => {
    if (search === "") {
      return null;
    }
    if (matchedCountries.length > 10) {
      return <p>Too many matches, specify another filter</p>;
    }

    if (matchedCountries.length === 1) {
      return null;
    }

    if (matchedCountries.length === 0) {
      return <p>No matching countries found</p>;
    }

    return (
      <ul>
        {matchedCountries.map((country) => (
          <li key={country.cca3}>
            {country.name.common}{" "}
            <button onClick={() => setSelectedCountry(country)}>Show</button>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div>
      <label style={{ display: "block", marginBottom: "20px" }}>
        Find countries: <input value={search} onChange={handleSearch} />
      </label>

      {renderCountries()}
      {renderCountryDetails()}
    </div>
  );
};

export default App;
