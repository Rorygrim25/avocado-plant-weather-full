
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function PlantWeatherApp() {
  const [status, setStatus] = useState("Loading...");
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    fetchWeather();
  }, []);

  async function fetchWeather() {
    try {
      const res = await axios.get("/api/plant-status");
      setWeather(res.data.weather);
      setStatus(res.data.status);
    } catch (err) {
      console.error(err);
      setStatus("Error fetching weather");
    }
  }

  return (
    <main style={{ fontFamily: "Arial", textAlign: "center", padding: "2rem" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Avocado Plant Status 🌱</h1>
      <div style={{ border: "1px solid #ccc", borderRadius: "10px", padding: "1rem", maxWidth: "400px", margin: "0 auto" }}>
        <p style={{ fontSize: "1.2rem" }}>
          Today, your plant should be:
          <span style={{ display: "block", marginTop: "0.5rem", fontWeight: "bold", fontSize: "2rem", color: status === "Outside" ? "green" : "red" }}>{status}</span>
        </p>
        {weather && (
          <div style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#555" }}>
            <p>Temp: {weather.temp}°C</p>
            <p>Wind: {weather.wind} km/h</p>
            <p>Rain: {weather.rain ? `${weather.rain} mm` : "None"}</p>
            <p>Min temp tonight: {weather.temp_min}°C</p>
          </div>
        )}
      </div>
    </main>
  );
}
