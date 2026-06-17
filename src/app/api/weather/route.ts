// =============================================================
// API-Route: GET /api/weather?city=<Stadtname>
// Liefert das aktuelle Wetter einer Stadt.
//
// Diese Server-Route fungiert als sicherer Proxy: Der geheime
// API-Schlüssel bleibt auf dem Server und gelangt nie zum Client.
// =============================================================

import { NextRequest, NextResponse } from "next/server";
import { OWM_BASE_URL, mapCurrentWeather } from "@/lib/weather";

export async function GET(request: NextRequest) {
  const city = request.nextUrl.searchParams.get("city");

  // 1) Eingabe validieren
  if (!city || city.trim().length === 0) {
    return NextResponse.json(
      { error: "Bitte gib einen Stadtnamen an." },
      { status: 400 }
    );
  }

  // 2) API-Schlüssel aus den Umgebungsvariablen lesen
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey || apiKey === "dein_api_schluessel_hier") {
    return NextResponse.json(
      {
        error:
          "Kein gültiger API-Schlüssel konfiguriert. Bitte OPENWEATHER_API_KEY in .env.local setzen.",
      },
      { status: 500 }
    );
  }

  // 3) Anfrage an OpenWeatherMap stellen (metrisch + deutsche Beschreibung)
  const url = `${OWM_BASE_URL}/weather?q=${encodeURIComponent(
    city
  )}&units=metric&lang=de&appid=${apiKey}`;

  try {
    const res = await fetch(url, { next: { revalidate: 600 } });

    if (res.status === 404) {
      return NextResponse.json(
        { error: `Stadt "${city}" wurde nicht gefunden.` },
        { status: 404 }
      );
    }

    if (!res.ok) {
      return NextResponse.json(
        { error: "Fehler beim Abrufen der Wetterdaten." },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(mapCurrentWeather(data));
  } catch (err) {
    console.error("Weather API Fehler:", err);
    return NextResponse.json(
      { error: "Der Wetterdienst ist momentan nicht erreichbar." },
      { status: 502 }
    );
  }
}
