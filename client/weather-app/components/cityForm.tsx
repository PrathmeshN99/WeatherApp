// CityForm.tsx

import React, { useState, ChangeEvent } from "react";

interface WeatherResponse {
  weather: Record<string, string>;
  error?: string;
}

const CityForm: React.FC = () => {
  const [cityInput, setCityInput] = useState<string>("");
  const [result, setResult] = useState<JSX.Element | null>(null);

  const getWeather = async () => {
    try {
      const response = await fetch(
        "https://weather-server-eosin.vercel.app/getWeather",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cities: cityInput.split(",").map((city) => city.trim()),
          }),
        }
      );

      const data: WeatherResponse = await response.json();

      if (response.ok) {
        const weatherResults = data.weather;
        const resultHTML = Object.keys(weatherResults).map((city) => (
          <p key={city}>{`${city}: ${weatherResults[city]}`}</p>
        ));
        setResult(<div>{resultHTML}</div>);
      } else {
        setResult(<p>Error: {data.error}</p>);
      }
    } catch (error) {
      console.error("Error fetching weather data");
      setResult(<p>Internal Server Error</p>);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCityInput(e.target.value);
  };

  return (
    <div>
      <h1>City Weather Form</h1>
      <label htmlFor="cityInput">Enter city names (comma-separated):</label>
      <input
        type="text"
        id="cityInput"
        placeholder="e.g., toronto, mumbai, london"
        value={cityInput}
        onChange={handleChange}
      />
      <button onClick={getWeather}>Get Weather</button>
      <div id="result">{result}</div>
    </div>
  );
};

export default CityForm;
