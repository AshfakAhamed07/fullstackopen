import { useState, useEffect } from "react";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);

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
