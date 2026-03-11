"use client";
import { useState, useEffect } from "react";

const WMO_CODES: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Foggy",
  48: "Icy fog",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Heavy drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  71: "Light snow",
  73: "Snow",
  75: "Heavy snow",
  80: "Rain showers",
  81: "Heavy showers",
  95: "Thunderstorm",
};

const WMO_EMOJI: Record<number, string> = {
  0: "☀️",
  1: "🌤️",
  2: "⛅",
  3: "☁️",
  45: "🌫️",
  48: "🌫️",
  51: "🌦️",
  53: "🌦️",
  55: "🌧️",
  61: "🌧️",
  63: "🌧️",
  65: "🌧️",
  71: "🌨️",
  73: "❄️",
  75: "❄️",
  80: "🌦️",
  81: "⛈️",
  95: "⛈️",
};

function getWeatherLabel(code: number) {
  return WMO_CODES[code] ?? "Unknown";
}

function getWeatherEmoji(code: number) {
  return WMO_EMOJI[code] ?? "🌡️";
}

function formatDay(dateStr: string) {
  const date = new Date(dateStr);
  return {
    day: date.toLocaleDateString("en-US", { weekday: "short" }),
    date: date.toLocaleDateString("en-US", { day: "numeric", month: "short" }),
  };
}

type WeatherData = {
  current: {
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    weather_code: number;
    wind_speed_10m: number;
    time: string;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
  };
};

// ... keep all WMO_CODES, WMO_EMOJI, getWeatherLabel, getWeatherEmoji, formatDay, WeatherData same ...

function WeatherSkeleton() {
  return (
    <div className="mt-8 flex w-full animate-pulse flex-col">
      {/* Heading Skeleton */}
      <div className="mb-2.5 h-6 w-2/3 rounded bg-gray-200 md:h-8" />

      <div className="w-full rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        {/* Current */}
        <div className="mb-2 h-4 w-24 rounded bg-gray-200" />
        <div className="mb-2 h-12 w-32 rounded bg-gray-200" />
        <div className="mb-4 h-4 w-28 rounded bg-gray-200" />

        <div className="mb-1 flex gap-6 border-t border-gray-100 pt-3">
          <div className="h-4 w-24 rounded bg-gray-200" />
          <div className="h-4 w-24 rounded bg-gray-200" />
        </div>

        <div className="mb-5 h-3 w-40 rounded bg-gray-100" />

        {/* Today highlight */}
        <div className="mb-5 flex gap-4 rounded-lg bg-gray-50 px-4 py-3">
          <div className="h-4 w-28 rounded bg-gray-200" />
          <div className="h-4 w-28 rounded bg-gray-200" />
        </div>

        {/* 7-day */}
        <div className="mb-3 h-4 w-24 rounded bg-gray-200" />
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2 p-2">
              <div className="h-3 w-8 rounded bg-gray-200" />
              <div className="h-3 w-8 rounded bg-gray-100" />
              <div className="h-6 w-6 rounded-full bg-gray-200" />
              <div className="h-3 w-10 rounded bg-gray-200" />
              <div className="h-3 w-8 rounded bg-gray-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function WeatherWidget({
  heading,
  latitude,
  longitude,
}: {
  heading: string;
  latitude: number;
  longitude: number;
}) {
  const [data, setData] = useState<WeatherData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!latitude || !longitude) return;

    async function fetchWeather() {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Asia%2FKolkata`,
        );
        if (!res.ok) throw new Error("Failed");
        const json = await res.json();
        setData(json);
      } catch {
        setError(true);
      }
    }

    fetchWeather();
  }, [latitude, longitude]);

  if (error) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-5 text-sm text-gray-400 shadow-sm">
        Weather data unavailable.
      </div>
    );
  }

  if (!data) return <WeatherSkeleton />;

  const { current, daily } = data;

  const updatedAt = new Date(current.time).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="mt-8 flex w-full flex-col">
      <div className="mb-2.5 flex w-full min-w-0">
        <h2 className="w-full text-lg font-bold md:truncate md:text-2xl">
          {heading} Weather Today (Live) - Temperature, Rain Forecast & 7-Day
          Report
        </h2>
      </div>
      <div className="w-full rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="mb-1 text-sm text-gray-500">
          {getWeatherLabel(current.weather_code)}
        </p>
        <div className="mb-1 text-5xl font-bold text-gray-900">
          {Math.round(current.temperature_2m)}°C
        </div>
        <p className="mb-4 text-sm text-gray-500">
          Feels like {Math.round(current.apparent_temperature)}°C
        </p>
        <div className="mb-1 flex gap-6 border-t border-gray-100 pt-3 text-sm text-gray-700">
          <span>
            <span className="font-medium">Humidity:</span>{" "}
            {current.relative_humidity_2m}%
          </span>
          <span>
            <span className="font-medium">Wind:</span>{" "}
            {Math.round(current.wind_speed_10m)} km/h
          </span>
        </div>
        <p className="mb-5 text-xs text-gray-400">Updated: {updatedAt}</p>

        <div className="mb-5 flex gap-4 rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-700">
          <span>
            <span className="font-medium">Today:</span>{" "}
            {Math.round(daily.temperature_2m_max[0])}° /{" "}
            {Math.round(daily.temperature_2m_min[0])}°
          </span>
          <span>Rain Chance: {daily.precipitation_probability_max[0]}%</span>
        </div>

        {/* 7-Day Forecast */}
        <h3 className="mb-3 text-sm font-semibold text-gray-700">
          7-Day Forecast
        </h3>
        <div className="-mx-5 overflow-x-auto px-5">
          <div className="flex gap-1 text-center text-xs text-gray-600">
            {daily.time.map((dateStr, i) => {
              const { day, date } = formatDay(dateStr);
              return (
                <div
                  key={dateStr}
                  className={`flex min-w-25 flex-col items-center gap-1 rounded-lg p-2 ${
                    i === 0 ? "bg-blue-50 text-blue-700" : ""
                  }`}
                >
                  <span className="font-semibold">{day}</span>
                  <span className="text-gray-400">{date}</span>
                  <span className="text-lg">
                    {getWeatherEmoji(daily.weather_code[i])}
                  </span>
                  <span className="font-medium">
                    {Math.round(daily.temperature_2m_max[i])}° /{" "}
                    {Math.round(daily.temperature_2m_min[i])}°
                  </span>
                  <span className="text-gray-400">
                    Rain: {daily.precipitation_probability_max[i]}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
