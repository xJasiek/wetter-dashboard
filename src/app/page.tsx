"use client";

import { useCallback, useEffect, useState } from "react";
import { CloudSun } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import CurrentWeatherCard from "@/components/CurrentWeatherCard";
import ForecastCard from "@/components/ForecastCard";
import {
  LoadingState,
  ErrorState,
  EmptyState,
} from "@/components/MessageState";
import type { CurrentWeather, ForecastResponse } from "@/lib/types";

/**
 * Startseite des Wetter-Dashboards.
 *
 * Verwaltet den gesamten Anwendungszustand:
 *  - aktuelles Wetter & Vorhersage
 *  - Lade- und Fehlerzustände
 *  - ruft beim ersten Laden eine Standardstadt ab
 */
export default function Home() {
  const [current, setCurrent] = useState<CurrentWeather | null>(null);
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  /**
   * Ruft aktuelles Wetter und Vorhersage parallel ab.
   * Bei Fehlern wird eine verständliche Meldung gesetzt.
   */
  const fetchWeather = useCallback(async (city: string) => {
    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const [weatherRes, forecastRes] = await Promise.all([
        fetch(`/api/weather?city=${encodeURIComponent(city)}`),
        fetch(`/api/forecast?city=${encodeURIComponent(city)}`),
      ]);

      const weatherData = await weatherRes.json();
      const forecastData = await forecastRes.json();

      if (!weatherRes.ok) {
        throw new Error(weatherData.error ?? "Unbekannter Fehler.");
      }

      setCurrent(weatherData);
      setForecast(forecastRes.ok ? forecastData : null);
    } catch (err) {
      setCurrent(null);
      setForecast(null);
      setError(
        err instanceof Error
          ? err.message
          : "Beim Abrufen der Wetterdaten ist ein Fehler aufgetreten."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Beim ersten Laden eine Standardstadt anzeigen
  useEffect(() => {
    fetchWeather("Berlin");
  }, [fetchWeather]);

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-4 py-10 sm:py-16">
      {/* Kopfbereich */}
      <header className="text-center">
        <div className="mb-3 flex items-center justify-center gap-2">
          <CloudSun className="h-9 w-9 text-cyan-200" />
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Wetter-Dashboard
          </h1>
        </div>
        <p className="text-white/70">
          Aktuelles Wetter und 5-Tage-Vorhersage für jede Stadt weltweit.
        </p>
      </header>

      {/* Suchleiste */}
      <SearchBar onSearch={fetchWeather} loading={loading} />

      {/* Inhaltsbereich, je nach Zustand */}
      <section className="flex flex-col gap-6">
        {loading && <LoadingState />}

        {!loading && error && <ErrorState message={error} />}

        {!loading && !error && !searched && <EmptyState />}

        {!loading && !error && current && (
          <>
            <CurrentWeatherCard data={current} />

            {forecast && forecast.days.length > 0 && (
              <div className="animate-fade-in">
                <h3 className="mb-3 text-xl font-bold">5-Tage-Vorhersage</h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                  {forecast.days.map((day) => (
                    <ForecastCard key={day.date} day={day} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {/* Fußzeile */}
      <footer className="mt-auto pt-6 text-center text-sm text-white/50">
        <p>
          Wetterdaten von{" "}
          <a
            href="https://openweathermap.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline transition hover:text-white"
          >
            OpenWeatherMap
          </a>{" "}
          · Gebaut mit Next.js &amp; Tailwind CSS
        </p>
      </footer>
    </main>
  );
}
