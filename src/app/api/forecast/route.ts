// =============================================================
// API-Route: GET /api/forecast?city=<Stadtname>
// Liefert die 5-Tage-Wettervorhersage einer Stadt.
// =============================================================

import { NextRequest, NextResponse } from "next/server";
import { OWM_BASE_URL, mapForecast } from "@/lib/weather";
import type { ForecastResponse } from "@/lib/types";

export async function GET(request: NextRequest) {
  const city = request.nextUrl.searchParams.get("city");

  if (!city || city.trim().length === 0) {
    return NextResponse.json(
      { error: "Bitte gib einen Stadtnamen an." },
      { status: 400 }
    );
  }

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

  // 5-Tage-Vorhersage in 3-Stunden-Schritten
  const url = `${OWM_BASE_URL}/forecast?q=${encodeURIComponent(
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
        { error: "Fehler beim Abrufen der Vorhersage." },
        { status: res.status }
      );
    }

    const data = await res.json();
    const response: ForecastResponse = {
      city: data.city.name,
      country: data.city.country,
      days: mapForecast(data),
    };

    return NextResponse.json(response);
  } catch (err) {
    console.error("Forecast API Fehler:", err);
    return NextResponse.json(
      { error: "Der Wetterdienst ist momentan nicht erreichbar." },
      { status: 502 }
    );
  }
}
