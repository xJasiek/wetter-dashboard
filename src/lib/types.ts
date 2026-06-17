// =============================================================
// Zentrale TypeScript-Typdefinitionen für das Wetter-Dashboard
// =============================================================

/** Aufbereitete Daten zum aktuellen Wetter einer Stadt */
export interface CurrentWeather {
  city: string;
  country: string;
  temperature: number; // in °C
  feelsLike: number; // gefühlte Temperatur in °C
  description: string; // z. B. "leichter Regen"
  icon: string; // OpenWeatherMap Icon-Code (z. B. "04d")
  humidity: number; // Luftfeuchtigkeit in %
  windSpeed: number; // Windgeschwindigkeit in km/h
  pressure: number; // Luftdruck in hPa
  sunrise: number; // Sonnenaufgang (Unix-Timestamp, Sekunden)
  sunset: number; // Sonnenuntergang (Unix-Timestamp, Sekunden)
  timezone: number; // Zeitzonen-Offset in Sekunden
}

/** Ein einzelner Tag innerhalb der Vorhersage */
export interface ForecastDay {
  date: number; // Unix-Timestamp (Sekunden)
  tempMin: number; // Tiefsttemperatur in °C
  tempMax: number; // Höchsttemperatur in °C
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}

/** Vollständige Antwort der Vorhersage-API-Route */
export interface ForecastResponse {
  city: string;
  country: string;
  days: ForecastDay[];
}

/** Einheitliches Fehlerformat der API-Routen */
export interface ApiError {
  error: string;
}
