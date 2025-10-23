"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import WeatherCard from "@/components/cards/WeatherCard";

export default function WeatherSection() {
  const [weather, setWeather] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [unit, setUnit] = useState<"C" | "F">("C");

  // 🔁 Convert Celsius ↔ Fahrenheit
  const convertTemp = (temp: number, target: "C" | "F") =>
    target === "F" ? (temp * 9) / 5 + 32 : ((temp - 32) * 5) / 9;

  // 🌍 Fetch weather data from API
  useEffect(() => {
    async function loadWeather() {
      try {
        const res = await fetch("/api/weather");
        const data = await res.json();
        if (data.success) {
          setWeather(data.data || []);
        } else {
          console.error("Weather API failed:", data.error);
        }
      } catch (err) {
        console.error("Weather fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadWeather();
  }, []);

  // 🌡️ Handle toggle between °C and °F
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
    return <p className="text-center text-gray-600 mt-5">Loading weather data...</p>;

  // 🗂️ Group cities by region
  const grouped = weather.reduce((acc: Record<string, any[]>, city) => {
    if (!acc[city.region]) acc[city.region] = [];
    acc[city.region].push(city);
    return acc;
  }, {});

  return (
    <div className="flex flex-col items-center mt-6 w-full px-4">
      {/* 🔘 Toggle Button */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <button
          onClick={handleToggle}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-medium transition-all duration-200"
        >
          Show in °{unit === "C" ? "F" : "C"}
        </button>
      </motion.div>

      {/* 🌍 Grouped Weather Sections */}
      <div className="space-y-10 w-full max-w-6xl">
        {Object.entries(grouped).map(([region, cities]) => (
          <motion.div
            key={region}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            {/* Region Header */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-grow border-t border-gray-300" />
              <h2 className="text-xl font-semibold text-gray-800">{region}</h2>
              <div className="flex-grow border-t border-gray-300" />
            </div>

            {/* Weather Cards */}
            <div className="flex flex-wrap justify-center gap-4">
              {cities.map((w, idx) => (
                <WeatherCard key={idx} {...w} />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
