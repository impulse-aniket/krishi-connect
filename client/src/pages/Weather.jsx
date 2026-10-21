
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const weatherDescriptions = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  71: "Slight snowfall",
  73: "Moderate snowfall",
  75: "Heavy snowfall",
  80: "Rain showers",
  81: "Moderate rain showers",
  82: "Heavy rain showers",
  95: "Thunderstorm",
  96: "Thunderstorm with hail",
  99: "Severe thunderstorm with hail",
};

function Weather() {
  const navigate = useNavigate();

  const [location, setLocation] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (event) => {
    event.preventDefault();

    if (!location.trim()) {
      setError("Please enter a city or location.");
      return;
    }

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const geocodingUrl =
        "https://geocoding-api.open-meteo.com/v1/search?" +
        new URLSearchParams({
          name: location.trim(),
          count: "1",
          language: "en",
          format: "json",
        });

      const locationResponse = await fetch(geocodingUrl);

      if (!locationResponse.ok) {
        throw new Error("Unable to search for this location.");
      }

      const locationData = await locationResponse.json();
      const place = locationData.results?.[0];

      if (!place) {
        throw new Error("Location not found. Try another city.");
      }

      const weatherUrl =
        "https://api.open-meteo.com/v1/forecast?" +
        new URLSearchParams({
          latitude: String(place.latitude),
          longitude: String(place.longitude),
          current:
            "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m",
          timezone: "auto",
        });

      const weatherResponse = await fetch(weatherUrl);

      if (!weatherResponse.ok) {
        throw new Error("Unable to retrieve current weather.");
      }

      const weatherData = await weatherResponse.json();
      const current = weatherData.current;

      if (!current) {
        throw new Error("Weather data is unavailable.");
      }

      setWeather({
        location: [
          place.name,
          place.admin1,
          place.country,
        ]
          .filter(Boolean)
          .filter((value, index, values) => values.indexOf(value) === index)
          .join(", "),
        temperature: current.temperature_2m,
        feelsLike: current.apparent_temperature,
        humidity: current.relative_humidity_2m,
        windSpeed: current.wind_speed_10m,
        precipitation: current.precipitation,
        condition:
          weatherDescriptions[current.weather_code] ||
          "Weather condition unavailable",
        isDay: current.is_day === 1,
        time: current.time,
        latitude: place.latitude,
        longitude: place.longitude,
      });
    } catch (err) {
      setError(
        err.message ||
          "Unable to fetch weather. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const weatherCards = weather
    ? [
        ["Temperature", `${weather.temperature}°C`],
        ["Feels Like", `${weather.feelsLike}°C`],
        ["Humidity", `${weather.humidity}%`],
        ["Wind Speed", `${weather.windSpeed} km/h`],
        ["Precipitation", `${weather.precipitation} mm`],
        ["Condition", weather.condition],
      ]
    : [];

  return (
    <div className="min-h-screen bg-green-50">
      <nav className="bg-green-700 text-white px-6 py-4 shadow-md">
        <div className="max-w-5xl mx-auto flex justify-between items-center gap-4">
          <h1
            onClick={() => navigate("/dashboard")}
            className="text-2xl font-bold cursor-pointer"
          >
            Krishi-Connect
          </h1>

          <button
            onClick={() => navigate("/dashboard")}
            className="bg-white text-green-700 px-4 py-2 rounded-lg font-semibold"
          >
            Dashboard
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <section className="bg-white rounded-2xl shadow-md p-6 md:p-8">
          <h2 className="text-3xl font-bold text-green-700">
            Weather Information
          </h2>

          <p className="text-gray-600 mt-2 mb-6">
            Check current weather conditions for agricultural planning.
          </p>

          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-3 mb-6"
          >
            <input
              type="text"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="Enter a city, e.g. Nashik"
              className="flex-1 min-w-0 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white px-6 py-3 rounded-lg font-semibold"
            >
              {loading ? "Loading..." : "Check Weather"}
            </button>
          </form>

          {error && (
            <div
              role="alert"
              className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-lg mb-6"
            >
              {error}
            </div>
          )}

          {weather && (
            <div>
              <div className="bg-green-700 text-white rounded-xl p-6 mb-5">
                <p className="text-green-100">Current weather for</p>
                <h3 className="text-2xl font-bold mt-1">
                  {weather.location}
                </h3>

                <p className="text-5xl font-bold mt-5">
                  {weather.temperature}°C
                </p>

                <p className="text-lg mt-2">
                  {weather.condition}
                </p>

                <p className="text-sm text-green-100 mt-3">
                  {weather.isDay ? "Daytime" : "Nighttime"} · Local time:{" "}
                  {new Date(weather.time).toLocaleString()}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {weatherCards.map(([label, value]) => (
                  <div
                    key={label}
                    className="bg-green-50 border border-green-100 rounded-xl p-5"
                  >
                    <p className="text-gray-500">{label}</p>
                    <p className="text-xl font-bold text-gray-800 mt-2">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              <p className="text-xs text-gray-500 mt-5">
                Weather data provided by Open-Meteo. Conditions may vary
                from the actual conditions at your farm.
              </p>
            </div>
          )}

          {!weather && !loading && !error && (
            <div className="bg-green-50 rounded-xl p-8 text-center text-gray-600">
              Enter a location above to retrieve current weather.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Weather;
