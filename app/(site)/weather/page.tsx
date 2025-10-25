"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun,
  Cloud,
  CloudSun,
  CloudRain,
  CloudLightning,
  Snowflake,
  CloudFog,
  CloudDrizzle,
  Search as SearchIcon,
  Plus,
  X,
} from "lucide-react";

/**
 * Weather page with:
 * - geolocation detection
 * - search by city
 * - 5-day forecast (from /data/2.5/forecast)
 * - multi-region dashboard (favorites)
 * - unit toggle (C/F)
 * - rotating background images + dark/light detection
 *
 * Requires NEXT_PUBLIC_WEATHER_API_KEY in .env.local
 *
 * Place background images in: public/weather image/
 * e.g. sunny.jpg, cloudy.jpg, rainy.jpg, snow.jpg, storm.jpg, thunderstorm.jpg
 */

/* ---------- helpers & maps ---------- */

const WEATHER_ICON_MAP: Record<string, { icon: JSX.Element; text: string }> = {
  Clear: { icon: <Sun className="w-10 h-10 text-yellow-300" />, text: "Clear" },
  Clouds: { icon: <Cloud className="w-10 h-10 text-gray-300" />, text: "Clouds" },
  "Partly Cloudy": { icon: <CloudSun className="w-10 h-10 text-yellow-200" />, text: "Partly Cloudy" },
  Rain: { icon: <CloudRain className="w-10 h-10 text-blue-400" />, text: "Rain" },
  Drizzle: { icon: <CloudDrizzle className="w-10 h-10 text-blue-300" />, text: "Drizzle" },
  Thunderstorm: { icon: <CloudLightning className="w-10 h-10 text-yellow-400" />, text: "Storm" },
  Snow: { icon: <Snowflake className="w-10 h-10 text-cyan-200" />, text: "Snow" },
  Mist: { icon: <CloudFog className="w-10 h-10 text-gray-400" />, text: "Mist" },
  Fog: { icon: <CloudFog className="w-10 h-10 text-gray-400" />, text: "Fog" },
};

const BACKGROUNDS = {
  Clear: "sunny.jpg",
  Clouds: "partly cloudy.jpg",
  Rain: "rain shower.jpg",
  Drizzle: "rain shower.jpg",
  Thunderstorm: "storm.jpg",
  Snow: "snow.jpg",
  Fog: "fog.jpg",
  Default: "sunny.jpg",
};

/* convert Kelvin/C<->F helpers (OpenWeather returns metric if units=metric) */
const cToF = (c: number) => (c * 9) / 5 + 32;
const fToC = (f: number) => ((f - 32) * 5) / 9;

/* group forecast list items by day (YYYY-MM-DD) and produce daily summary */
function aggregateDailyForecast(forecastList: any[], unit: "C" | "F") {
  // forecastList items have dt_txt and main.temp (in units used by API)
  const days: Record<
    string,
    { min: number; max: number; icon: string; desc: string; samples: number }
  > = {};

  for (const item of forecastList) {
    const date = item.dt_txt?.split(" ")[0];
    if (!date) continue;
    const temp = item.main?.temp ?? null;
    if (temp === null) continue;
    const icon = item.weather?.[0]?.main ?? "Clear";
    const desc = item.weather?.[0]?.description ?? "";
    if (!days[date]) days[date] = { min: temp, max: temp, icon, desc, samples: 1 };
    else {
      days[date].min = Math.min(days[date].min, temp);
      days[date].max = Math.max(days[date].max, temp);
      days[date].samples++;
      // prefer the icon of the sample near midday; but simple replace is fine here
      days[date].icon = icon;
      days[date].desc = desc;
    }
  }

  return Object.entries(days).map(([date, vals]) => {
    let min = vals.min;
    let max = vals.max;
    // convert if user wants F but API provided C (we'll convert on demand in UI)
    return {
      date,
      min,
      max,
      icon: vals.icon,
      desc: vals.desc,
    };
  });
}

/* ---------- main component ---------- */

export default function WeatherPageAll() {
  const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
  const [navbarHeight, setNavbarHeight] = useState<number>(72);

  // primary states
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<"C" | "F">("C");

  // location/state
  const [current, setCurrent] = useState<any | null>(null); // current location weather (object from /weather)
  const [forecast, setForecast] = useState<any[] | null>(null); // 5-day/3-hour list

  // search
  const [query, setQuery] = useState<string>("");
  const [searching, setSearching] = useState(false);

  // multi-region favorites
  const [favorites, setFavorites] = useState<any[]>(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem("fav_cities") : null;
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // background & visual
  const [bgImage, setBgImage] = useState<string>(BACKGROUNDS.Default);
  const [isDarkBg, setIsDarkBg] = useState<boolean>(true);
  const [bgIndexRotate, setBgIndexRotate] = useState(0);
  const bgPool = Object.values(BACKGROUNDS);

  /* ------------------ effects ------------------ */

  // measure navbar height so layout doesn't overlap
  useEffect(() => {
    const nav = document.querySelector("nav");
    if (nav) setNavbarHeight(nav.clientHeight);
  }, []);

  // rotate backgrounds slowly
  useEffect(() => {
    const id = setInterval(() => {
      setBgIndexRotate((s) => (s + 1) % bgPool.length);
    }, 15000);
    return () => clearInterval(id);
  }, [bgPool.length]);

  // when rotate index changes, update bgImage
  useEffect(() => {
    setBgImage(bgPool[bgIndexRotate] || BACKGROUNDS.Default);
  }, [bgIndexRotate, bgPool]);

  // detect brightness of current bgImage
  useEffect(() => {
    let mounted = true;
    const img = new Image();
    img.src = `/weather image/${bgImage}`;
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (!mounted) return;
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        canvas.width = 20;
        canvas.height = 20;
        ctx.drawImage(img, 0, 0, 20, 20);
        const data = ctx.getImageData(0, 0, 20, 20).data;
        let r = 0,
          g = 0,
          b = 0;
        for (let i = 0; i < data.length; i += 4) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
        }
        const avg = (r + g + b) / (data.length / 4) / 3;
        setIsDarkBg(avg < 130);
      } catch {
        setIsDarkBg(true);
      }
    };
    return () => {
      mounted = false;
    };
  }, [bgImage]);

  // initial load: geolocation -> fetch weather
  useEffect(() => {
    if (!apiKey) {
      setError("Missing API key. Set NEXT_PUBLIC_WEATHER_API_KEY in .env.local");
      setLoading(false);
      return;
    }

    const fetchByCoords = async (lat: number, lon: number) => {
      try {
        setLoading(true);
        setError(null);

        const wRes = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
        );
        if (!wRes.ok) throw wRes;
        const wJson = await wRes.json();

        const fRes = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
        );
        if (!fRes.ok) throw fRes;
        const fJson = await fRes.json();

        setCurrent(wJson);
        setForecast(fJson.list || []);
        // choose background depending on main condition
        const main = wJson.weather?.[0]?.main;
        setBgImage(BACKGROUNDS[main] || BACKGROUNDS.Default);
      } catch (err: any) {
        console.error("fetchByCoords err", err);
        if (err?.status === 401) setError("Invalid API key (401). Check NEXT_PUBLIC_WEATHER_API_KEY");
        else setError("Failed to fetch weather. Try searching a city or enabling location.");
      } finally {
        setLoading(false);
      }
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchByCoords(pos.coords.latitude, pos.coords.longitude),
        (err) => {
          console.warn("geo denied:", err);
          setError("Location denied. Use the search bar to find a city.");
          setLoading(false);
        },
        { maximumAge: 1000 * 60 * 5 }
      );
    } else {
      setError("Geolocation not supported. Use the search bar to find a city.");
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey]);

  /* ---------- helpers ---------- */

  const toDisplayTemp = (tempC: number | null | undefined) => {
    if (tempC == null) return "--";
    return unit === "C" ? `${tempC.toFixed(1)}°C` : `${cToF(tempC).toFixed(1)}°F`;
  };

  const toggleUnit = () => setUnit((u) => (u === "C" ? "F" : "C"));

  const searchCity = async (q: string) => {
    if (!q || !apiKey) return;
    try {
      setSearching(true);
      setError(null);
      // Use OpenWeather direct city search (q=...), first get current
      const wRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(q)}&units=metric&appid=${apiKey}`
      );
      if (!wRes.ok) {
        if (wRes.status === 404) throw new Error("City not found");
        if (wRes.status === 401) throw new Error("Invalid API key (401)");
        throw new Error("Failed to fetch city weather");
      }
      const wJson = await wRes.json();

      const { coord } = wJson;
      // fetch forecast by coords
      const fRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${coord.lat}&lon=${coord.lon}&units=metric&appid=${apiKey}`
      );
      if (!fRes.ok) throw new Error("Failed to fetch forecast");
      const fJson = await fRes.json();

      setCurrent(wJson);
      setForecast(fJson.list || []);
      setBgImage(BACKGROUNDS[wJson.weather?.[0]?.main] || BACKGROUNDS.Default);
    } catch (err: any) {
      setError(err.message || "Search failed");
    } finally {
      setSearching(false);
    }
  };

  const addFavorite = (cityObj: any) => {
    if (!cityObj?.id) return;
    setFavorites((prev) => {
      if (prev.some((c) => c.id === cityObj.id)) return prev;
      const updated = [...prev, cityObj];
      try {
        localStorage.setItem("fav_cities", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const removeFavorite = (id: number) => {
    setFavorites((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      try {
        localStorage.setItem("fav_cities", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const fetchFavoriteWeather = async (fav: any) => {
    // fetch current for a favorite city (by id or name)
    try {
      if (!apiKey) return;
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?id=${fav.id}&units=metric&appid=${apiKey}`
      );
      if (!res.ok) throw res;
      const json = await res.json();
      return json;
    } catch (err) {
      console.error("fav fetch err", err);
      return null;
    }
  };

  // load favorites current temps (optional enhancement)
  useEffect(() => {
    if (!favorites.length) return;
    // refresh favorites' current data in background
    (async () => {
      const results: any[] = [];
      for (const f of favorites) {
        const r = await fetchFavoriteWeather(f);
        if (r) results.push(r);
        else results.push(f); // fallback to stored info
      }
      setFavorites(results);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // only on mount

  /* compute aggregated 5-day forecast */
  const dailyForecast = useMemo(() => {
    if (!forecast) return [];
    return aggregateDailyForecast(forecast, unit).slice(0, 5); // next 5 days
  }, [forecast, unit]);

  /* ---------- UI ---------- */

  return (
    <div className={`relative min-h-screen ${isDarkBg ? "text-white" : "text-gray-900"}`}>
      {/* background image (fixed) */}
      <AnimatePresence mode="wait">
        <motion.img
          key={bgImage}
          src={`/weather image/${bgImage}`}
          alt="weather background"
          className="fixed inset-0 w-full h-full object-cover -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          style={{ filter: isDarkBg ? "brightness(0.6) blur(2px)" : "brightness(1) blur(1px)" }}
        />
      </AnimatePresence>

      {/* page content scrolls above background */}
      <div
        className="relative z-10 min-h-screen"
        style={{ paddingTop: navbarHeight }}
      >
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
          {/* header + search */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Weather</h1>
              <p className="text-sm opacity-80 mt-1">Live weather, 5-day forecast, favorites</p>
            </div>

            <div className="w-full md:w-auto flex gap-2 items-center">
              <div className="relative">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") searchCity(query);
                  }}
                  placeholder="Search city (e.g. Lagos, London)"
                  className={`pl-10 pr-3 py-2 rounded-full outline-none shadow-sm w-72 transition ${
                    isDarkBg ? "bg-white/10 text-white placeholder-white/60" : "bg-white text-gray-900"
                  }`}
                />
                <SearchIcon className={`absolute left-3 top-2.5 w-5 h-5 ${isDarkBg ? "text-white/70" : "text-gray-500"}`} />
              </div>

              <button
                onClick={() => searchCity(query)}
                disabled={!query || searching}
                className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {searching ? "Searching..." : "Search"}
              </button>

              <button
                onClick={() => toggleUnit()}
                className={`ml-2 px-4 py-2 rounded-full border ${isDarkBg ? "border-white/30 text-white" : "border-gray-200 text-gray-900"}`}
                title="Toggle °C / °F"
              >
                °{unit}
              </button>
            </div>
          </div>

          {/* main layout: left content + right favorites */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* left: current + forecast + carousel / multi-region preview */}
            <div className="lg:col-span-2 space-y-6">
              {/* current card */}
              <div className={`rounded-2xl p-6 backdrop-blur-md shadow-lg ${isDarkBg ? "bg-black/40 text-white" : "bg-white/60 text-gray-900"}`}>
                {loading ? (
                  <div className="animate-pulse">
                    <div className="h-10 bg-gray-200/30 rounded mb-4 w-56" />
                    <div className="h-40 bg-gray-200/30 rounded" />
                  </div>
                ) : current ? (
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 flex items-center justify-center rounded-lg">
                        {(WEATHER_ICON_MAP[current.weather?.[0]?.main] || WEATHER_ICON_MAP.Clear).icon}
                      </div>
                      <div>
                        <div className="text-lg font-semibold">{current.name}, {current.sys?.country}</div>
                        <div className="text-sm opacity-80 capitalize">{current.weather?.[0]?.description}</div>
                      </div>
                    </div>

                    <div className="ml-auto text-right">
                      <div className="text-5xl font-bold">
                        {toDisplayTemp(current.main?.temp)}
                      </div>
                      <div className="text-sm opacity-80 mt-1">
                        Feels like {toDisplayTemp(current.main?.feels_like)} • Humidity {current.main?.humidity}% • Wind {Math.round(current.wind?.speed)} m/s
                      </div>

                      <div className="mt-4 flex gap-2 justify-end">
                        <button
                          onClick={() => addFavorite({ id: current.id, name: current.name, country: current.sys?.country })}
                          className="px-3 py-1 rounded-full bg-green-600 text-white hover:bg-green-700"
                        >
                          <Plus className="w-4 h-4 inline-block mr-1" /> Save
                        </button>
                        <button
                          onClick={() => {
                            // refresh current
                            if (current?.coord) {
                              (async () => {
                                setLoading(true);
                                try {
                                  const lat = current.coord.lat;
                                  const lon = current.coord.lon;
                                  const res = await fetch(
                                    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
                                  );
                                  if (res.ok) {
                                    const json = await res.json();
                                    setCurrent(json);
                                  }
                                } catch {}
                                setLoading(false);
                              })();
                            }
                          }}
                          className="px-3 py-1 rounded-full border"
                        >
                          Refresh
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <div className="text-lg font-medium mb-2">No location selected</div>
                    <div className="text-sm opacity-80">Allow location access or search a city above.</div>
                  </div>
                )}
              </div>

              {/* 5-day forecast */}
              <div className={`rounded-2xl p-4 backdrop-blur-md shadow-lg ${isDarkBg ? "bg-black/30 text-white" : "bg-white/60 text-gray-900"}`}>
                <h3 className="text-lg font-semibold mb-3">5-day forecast</h3>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                  {dailyForecast.length === 0 ? (
                    <div className="text-sm opacity-80 col-span-5">No forecast available</div>
                  ) : (
                    dailyForecast.map((d) => {
                      const iconObj = WEATHER_ICON_MAP[d.icon] || WEATHER_ICON_MAP.Clear;
                      return (
                        <div key={d.date} className="rounded-lg p-3 text-center border border-white/10">
                          <div className="text-sm font-medium">{new Date(d.date).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}</div>
                          <div className="mt-2">{iconObj.icon}</div>
                          <div className="mt-2 font-semibold">{unit === "C" ? `${d.max.toFixed(0)}° / ${d.min.toFixed(0)}°C` : `${cToF(d.max).toFixed(0)}° / ${cToF(d.min).toFixed(0)}°F`}</div>
                          <div className="text-xs opacity-80 mt-1 capitalize">{d.desc}</div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Multi-region dashboard: favorites quick view */}
              <div className={`rounded-2xl p-4 backdrop-blur-md shadow-lg ${isDarkBg ? "bg-black/30 text-white" : "bg-white/60 text-gray-900"}`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold">Favorites</h3>
                  <div className="text-sm opacity-80">Saved cities</div>
                </div>

                {favorites.length === 0 ? (
                  <div className="text-sm opacity-80">No favorites yet — save a city to quickly compare.</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {favorites.map((fav: any) => (
                      <div key={fav.id || fav.name} className="rounded-lg p-3 flex items-center justify-between border border-white/10">
                        <div>
                          <div className="font-medium">{fav.name} {fav.country ? `, ${fav.country}` : ""}</div>
                          <div className="text-xs opacity-80">
                            {fav.main?.temp ? toDisplayTemp(fav.main.temp) : "—"}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={async () => {
                              // load detail for favorite and show in main area
                              try {
                                setLoading(true);
                                const res = await fetch(
                                  `https://api.openweathermap.org/data/2.5/weather?id=${fav.id}&units=metric&appid=${apiKey}`
                                );
                                if (!res.ok) throw res;
                                const json = await res.json();
                                const fRes = await fetch(
                                  `https://api.openweathermap.org/data/2.5/forecast?lat=${json.coord.lat}&lon=${json.coord.lon}&units=metric&appid=${apiKey}`
                                );
                                const fJson = await fRes.json();
                                setCurrent(json);
                                setForecast(fJson.list || []);
                                setBgImage(BACKGROUNDS[json.weather?.[0]?.main] || BACKGROUNDS.Default);
                              } catch (err) {
                                setError("Failed loading favorite");
                              } finally {
                                setLoading(false);
                              }
                            }}
                            className="px-2 py-1 rounded-full border text-sm"
                          >
                            View
                          </button>

                          <button
                            onClick={() => removeFavorite(fav.id)}
                            className="px-2 py-1 rounded-full bg-red-600 text-white"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* right: utility column (search suggestions, tips) */}
            <aside className="space-y-6">
              <div className={`rounded-2xl p-4 backdrop-blur-md shadow-lg ${isDarkBg ? "bg-black/30 text-white" : "bg-white/60 text-gray-900"}`}>
                <h4 className="font-semibold mb-2">Quick actions</h4>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      // detect again
                      if ("geolocation" in navigator) {
                        setLoading(true);
                        navigator.geolocation.getCurrentPosition(
                          (pos) => {
                            (async () => {
                              try {
                                const lat = pos.coords.latitude;
                                const lon = pos.coords.longitude;
                                const wRes = await fetch(
                                  `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
                                );
                                const wJson = await wRes.json();
                                const fRes = await fetch(
                                  `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
                                );
                                const fJson = await fRes.json();
                                setCurrent(wJson);
                                setForecast(fJson.list || []);
                                setBgImage(BACKGROUNDS[wJson.weather?.[0]?.main] || BACKGROUNDS.Default);
                              } catch (err) {
                                setError("Failed to refresh location");
                              } finally {
                                setLoading(false);
                              }
                            })();
                          },
                          (err) => {
                            setLoading(false);
                            setError("Location denied");
                          }
                        );
                      } else {
                        setError("Geolocation not supported");
                      }
                    }}
                    className="px-3 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Use my location
                  </button>

                  <button
                    onClick={() => {
                      // clear current & forecast
                      setCurrent(null);
                      setForecast(null);
                    }}
                    className="px-3 py-2 rounded-full border"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className={`rounded-2xl p-4 backdrop-blur-md shadow-lg ${isDarkBg ? "bg-black/20 text-white" : "bg-white/60 text-gray-900"}`}>
                <h4 className="font-semibold mb-2">Tips</h4>
                <ul className="text-sm opacity-80 space-y-1">
                  <li>- Allow location to auto-detect weather</li>
                  <li>- Save cities to compare quickly</li>
                  <li>- Toggle °C / °F as needed</li>
                </ul>
              </div>

              <div className={`rounded-2xl p-4 backdrop-blur-md shadow-lg ${isDarkBg ? "bg-black/20 text-white" : "bg-white/60 text-gray-900"}`}>
                <h4 className="font-semibold mb-2">Data source</h4>
                <p className="text-xs opacity-80">Weather data from OpenWeatherMap (current + 5-day forecast).</p>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* global error toast (simple) */}
      {error && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <div className="rounded-lg px-4 py-2 bg-red-600 text-white shadow-lg">
            <div className="flex items-center gap-4">
              <div className="font-medium">Error</div>
              <div className="text-sm opacity-90">{error}</div>
              <button onClick={() => setError(null)} className="ml-4 text-white/80">Dismiss</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
