"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// 🌦️ Weather descriptions and icons (Open-Meteo weather codes)
const weatherDetails: Record<
  number,
  { icon: string; text: string }
> = {
  0: { icon: "☀️", text: "Clear sky" },
  1: { icon: "🌤️", text: "Mainly clear" },
  2: { icon: "⛅", text: "Partly cloudy" },
  3: { icon: "☁️", text: "Overcast" },
  45: { icon: "🌫️", text: "Fog" },
  48: { icon: "🌫️", text: "Depositing rime fog" },
  51: { icon: "🌦️", text: "Light drizzle" },
  61: { icon: "🌧️", text: "Rain" },
  71: { icon: "❄️", text: "Snow" },
  80: { icon: "🌦️", text: "Rain showers" },
  95: { icon: "⛈️", text: "Thunderstorm" },
};

export default function WeatherPage() {
  const [weather, setWeather] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [unit, setUnit] = useState<"C" | "F">("C");

  // 🔁 Convert Celsius ↔ Fahrenheit
  const convertTemp = (temp: number, target: "C" | "F") =>
    target === "F" ? (temp * 9) / 5 + 32 : ((temp - 32) * 5) / 9;

  // 🕒 Format local time nicely
  const formatDateTime = (time: string) => {
    try {
      const date = new Date(time);
      return date.toLocaleString(undefined, {
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
        day: "numeric",
        month: "short",
      });
    } catch {
      return "";
    }
  };

  useEffect(() => {
    document.title = "Weather - NewsI";
  }, []);

  // 🌍 Fetch weather
  useEffect(() => {
    async function loadWeather() {
      try {
        const res = await fetch("/api/weather");
        const data = await res.json();
        setWeather(data.data || []);
      } catch (err) {
        console.error("Weather fetch failed:", err);
      } finally {
        setLoading(false);
      }
    }
    loadWeather();
  }, []);

  // 🌡️ Toggle °C ↔ °F
  const handleToggle = () => {
    const nextUnit = unit === "C" ? "F" : "C";
    const updated = weather.map((w) =>
      w.temperature
        ? {
            ...w,
            temperature: parseFloat(convertTemp(w.temperature, nextUnit).toFixed(1)),
          }
        : w
    );
    setUnit(nextUnit);
    setWeather(updated);
  };

  if (loading)
    return (
      <p className="text-center text-gray-600 mt-10">
        Loading weather data...
      </p>
    );

  // 🗂️ Group cities by region
  const grouped = weather.reduce((acc: Record<string, any[]>, city) => {
    if (!acc[city.region]) acc[city.region] = [];
    acc[city.region].push(city);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-10 px-4 flex flex-col items-center">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-6 text-gray-800"
      >
        🌍 Global Weather Overview
      </motion.h1>

      {/* 🔘 Unit Toggle */}
      <motion.button
        onClick={handleToggle}
        whileTap={{ scale: 0.9 }}
        className="mb-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full shadow-md transition"
      >
        Show in °{unit === "C" ? "F" : "C"}
      </motion.button>

      {/* 🌎 Regions */}
      <div className="w-full max-w-6xl space-y-10">
        {Object.entries(grouped).map(([region, cities]) => (
          <motion.div
            key={region}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Region Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-grow border-t border-gray-300" />
              <h2 className="text-xl font-semibold text-gray-800">{region}</h2>
              <div className="flex-grow border-t border-gray-300" />
            </div>

            {/* City Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {cities.map((city, i) => {
                const detail = weatherDetails[city.weathercode] || {
                  icon: "🌤️",
                  text: "Fair weather",
                };
                return (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.03 }}
                    className="bg-white rounded-2xl shadow-md p-5 flex flex-col items-center text-center"
                  >
                    <span className="text-4xl mb-2">{detail.icon}</span>
                    <h3 className="text-lg font-semibold text-gray-700">
                      {city.name}
                    </h3>
                    <p className="text-gray-500 text-sm">{region}</p>
                    <p className="mt-3 text-2xl font-bold text-blue-600">
                      {city.temperature !== null
                        ? `${city.temperature}°${unit}`
                        : "--"}
                    </p>
                    <p className="text-gray-600 text-sm mt-1">{detail.text}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {city.time ? formatDateTime(city.time) : ""}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
