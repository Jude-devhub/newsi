"use client";

import { motion } from "framer-motion";

// 🧭 Convert Open-Meteo weather codes to text & icon
function getWeatherDescription(code: number) {
  const map: Record<number, { text: string; icon: string }> = {
    0: { text: "Clear sky", icon: "☀️" },
    1: { text: "Mainly clear", icon: "🌤" },
    2: { text: "Partly cloudy", icon: "⛅" },
    3: { text: "Overcast", icon: "☁️" },
    45: { text: "Foggy", icon: "🌫" },
    48: { text: "Depositing rime fog", icon: "🌫" },
    51: { text: "Light drizzle", icon: "🌦" },
    53: { text: "Moderate drizzle", icon: "🌧" },
    55: { text: "Dense drizzle", icon: "🌧" },
    61: { text: "Slight rain", icon: "🌦" },
    63: { text: "Moderate rain", icon: "🌧" },
    65: { text: "Heavy rain", icon: "🌧️" },
    66: { text: "Light freezing rain", icon: "🌨" },
    67: { text: "Heavy freezing rain", icon: "🌨️" },
    71: { text: "Slight snow", icon: "🌨" },
    73: { text: "Moderate snow", icon: "❄️" },
    75: { text: "Heavy snow", icon: "❄️" },
    77: { text: "Snow grains", icon: "🌨" },
    80: { text: "Slight rain showers", icon: "🌦" },
    81: { text: "Moderate showers", icon: "🌧" },
    82: { text: "Violent showers", icon: "⛈" },
    95: { text: "Thunderstorm", icon: "⛈" },
    96: { text: "Thunderstorm with hail", icon: "🌩" },
    99: { text: "Severe thunderstorm", icon: "🌩️" },
  };

  return map[code] || { text: "Unknown", icon: "❔" };
}

interface WeatherCardProps {
  name: string;
  temperature: number;
  weathercode?: number;
  unit?: "C" | "F";
}

export default function WeatherCard({
  name,
  temperature,
  weathercode = 0,
  unit = "C",
}: WeatherCardProps) {
  const { text, icon } = getWeatherDescription(weathercode);

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-white shadow-md rounded-2xl p-5 w-52 text-center border border-gray-100"
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-1">{name}</h3>
      <div className="text-5xl mb-2">{icon}</div>
      <p className="text-gray-700 text-sm mb-2">{text}</p>
      <p className="text-2xl font-bold text-blue-600">
        {temperature}°{unit}
      </p>
    </motion.div>
  );
}
