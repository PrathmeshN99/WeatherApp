import express from "express";
const app = express();
const port = 3000;

app.use(express.json());

app.post("/getWeather", async (req, res) => {
  try {
    const cities = req.body.cities;
    const apiKey = "8746dd933ade9132a5c31e03e5df455c";
    const units = "metric"; // You can change this to 'imperial' or 'standard' based on your preference

    const weatherPromises = cities.map(async (city) => {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch weather data for ${city}`);
      }

      const data = await response.json();
      const temperature = data.main.temp;
      return { [city]: `${temperature}°C` };
    });

    const weatherResults = await Promise.all(weatherPromises);

    const result = {
      weather: Object.assign({}, ...weatherResults),
    };

    res.json(result);
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
