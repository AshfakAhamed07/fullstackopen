import { useState, useEffect } from "react";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState("");

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
  };

  return (
    <div>
      <h1>Countries</h1>
      <label>
        Find countries:
        <input value={search} onChange={handleSearch} />
      </label>
      <ul>
        {countries
          .filter((country) =>
            country.name.common.toLowerCase().includes(search.toLowerCase()),
          )
          .map((country) => (
            <li key={country.cca3}>{country.name.common}</li>
          ))}
      </ul>
    </div>
  );
};

export default App;
