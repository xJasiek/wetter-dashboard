// =============================================================
// Hilfsfunktionen rund um Wetterdaten und die OpenWeatherMap-API
// =============================================================

import type { CurrentWeather, ForecastDay } from "./types";

/** Basis-URL der OpenWeatherMap-API (Version 2.5, kostenloser Tarif) */
export const OWM_BASE_URL = "https://api.openweathermap.org/data/2.5";

/**
 * Liefert die vollständige URL zu einem Wetter-Icon von OpenWeatherMap.
 * @param icon Icon-Code, z. B. "10d"
 */
export function getIconUrl(icon: string): string {
  return `https://www.shutterstock.com/image-vector/weather-line-icons-set-editable-260nw-2647468179.jpg`;
}

/**
 * Wandelt einen Unix-Timestamp unter Berücksichtigung des
 * Zeitzonen-Offsets der Stadt in eine lesbare Uhrzeit (HH:MM) um.
 */
export function formatTime(unix: number, timezoneOffset = 0): string {
  const date = new Date((unix + timezoneOffset) * 1000);
  return date.toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
}

/**
 * Gibt den deutschen Wochentag (z. B. "Mo", "Di") zu einem
 * Unix-Timestamp zurück.
 */
export function formatWeekday(unix: number): string {
  const date = new Date(unix * 1000);
  return date.toLocaleDateString("de-DE", { weekday: "short" });
}

/**
 * Gibt das Datum im Format "TT.MM." zurück.
 */
export function formatDate(unix: number): string {
  const date = new Date(unix * 1000);
  return date.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
  });
}

// -------------------------------------------------------------
// Typen für die rohen OpenWeatherMap-Antworten (nur die Felder,
// die wir tatsächlich nutzen). So bleibt der Code typsicher.
// -------------------------------------------------------------

interface OwmWeatherEntry {
  description: string;
  icon: string;
}

interface OwmCurrentResponse {
  name: string;
  dt: number;
  timezone: number;
  main: { temp: number; feels_like: number; humidity: number; pressure: number };
  wind: { speed: number };
  weather: OwmWeatherEntry[];
  sys: { country: string; sunrise: number; sunset: number };
}

interface OwmForecastItem {
  dt: number;
  main: { temp: number; temp_min: number; temp_max: number; humidity: number };
  wind: { speed: number };
  weather: OwmWeatherEntry[];
  dt_txt: string;
}

interface OwmForecastResponse {
  city: { name: string; country: string };
  list: OwmForecastItem[];
}

/**
 * Konvertiert die rohe "current weather"-Antwort von OpenWeatherMap
 * in unser aufgeräumtes {@link CurrentWeather}-Format.
 */
export function mapCurrentWeather(data: OwmCurrentResponse): CurrentWeather {
  return {
    city: data.name,
    country: data.sys.country,
    temperature: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    description: data.weather[0]?.description ?? "Unbekannt",
    icon: data.weather[0]?.icon ?? "01d",
    humidity: data.main.humidity,
    // OpenWeatherMap liefert die Windgeschwindigkeit in m/s -> km/h
    windSpeed: Math.round(data.wind.speed * 3.6),
    pressure: data.main.pressure,
    sunrise: data.sys.sunrise,
    sunset: data.sys.sunset,
    timezone: data.timezone,
  };
}

/**
 * Die kostenlose Forecast-API liefert Wetterdaten in 3-Stunden-Schritten.
 * Diese Funktion gruppiert die Einträge nach Kalendertag und berechnet
 * pro Tag Min-/Max-Temperatur sowie ein repräsentatives Icon (vom Mittag).
 *
 * @returns Liste mit bis zu 5 Tagen (der heutige Tag wird ausgelassen,
 *          sofern genügend zukünftige Tage vorhanden sind).
 */
export function mapForecast(data: OwmForecastResponse): ForecastDay[] {
  // Einträge nach Datum (YYYY-MM-DD) gruppieren
  const groups = new Map<string, OwmForecastItem[]>();

  for (const item of data.list) {
    const dayKey = item.dt_txt.split(" ")[0]; // "2024-05-20"
    const existing = groups.get(dayKey) ?? [];
    existing.push(item);
    groups.set(dayKey, existing);
  }

  const todayKey = new Date().toISOString().split("T")[0];
  const days: ForecastDay[] = [];

  for (const [dayKey, items] of groups) {
    // Den heutigen Tag überspringen, damit die Vorhersage in die Zukunft zeigt
    if (dayKey === todayKey) continue;

    const temps = items.map((i) => i.main.temp);
    const tempMin = Math.min(...items.map((i) => i.main.temp_min));
    const tempMax = Math.max(...items.map((i) => i.main.temp_max));

    // Repräsentativen Eintrag möglichst nahe an 12:00 Uhr wählen
    const midday =
      items.find((i) => i.dt_txt.includes("12:00:00")) ??
      items[Math.floor(items.length / 2)];

    const avgHumidity = Math.round(
      items.reduce((sum, i) => sum + i.main.humidity, 0) / items.length
    );

    days.push({
      date: midday.dt,
      tempMin: Math.round(tempMin),
      tempMax: Math.round(tempMax),
      description: midday.weather[0]?.description ?? "Unbekannt",
      icon: midday.weather[0]?.icon ?? "01d",
      humidity: avgHumidity,
      windSpeed: Math.round(midday.wind.speed * 3.6),
    });

    // Vermeidet eine ungenutzte Variable-Warnung und dokumentiert die Absicht
    void temps;
  }

  // Auf maximal 5 Tage begrenzen
  return days.slice(0, 5);
}
