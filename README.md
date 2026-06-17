# 🌤️ Wetter-Dashboard

Ein Wetter-Dashboard, das ich mit Next.js 14, TypeScript und Tailwind CSS gebaut habe. Man tippt eine Stadt ein und bekommt das aktuelle Wetter plus eine 5-Tage-Vorhersage. Sauberes UI, dunkler animierter Hintergrund, alles responsive.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38bdf8?logo=tailwindcss)
![Lizenz](https://img.shields.io/badge/Lizenz-MIT-green)

## Worum geht's

Die App holt sich Wetterdaten von der OpenWeatherMap-API und zeigt sie schön aufbereitet an. Der API-Key landet dabei nie im Browser, sondern bleibt sicher in den Next.js API-Routen, die als kleiner Proxy dazwischen sitzen.

Ich hab das Projekt gebaut, um ein paar Sachen zu üben, die in echten Apps ständig vorkommen:

* modernes React mit App Router und der Mischung aus Server- und Client-Komponenten
* externe REST-APIs ansprechen und serverseitig durchreichen
* typsicherer Code mit TypeScript
* ein UI, das nicht nur funktioniert, sondern auch gut aussieht

## Features

* 🔍 Städtesuche für jede Stadt weltweit
* 🌡️ Aktuelles Wetter mit Temperatur, gefühlter Temperatur und Beschreibung
* 💧 Details wie Luftfeuchtigkeit, Windgeschwindigkeit und Luftdruck
* 🌅 Sonnenauf- und -untergang, passend zur jeweiligen Zeitzone
* 📅 5-Tage-Vorhersage mit Höchst- und Tiefsttemperaturen
* 📱 Responsive, läuft auf Handy, Tablet und Desktop
* 🎨 Glasmorphismus-Look mit animiertem Verlaufshintergrund
* ⚡ Schnell dank serverseitigem Caching, und der API-Key bleibt geheim
* 🇩🇪 Alles auf Deutsch, inklusive der Wetterbeschreibungen

## Screenshots

> Die Bilder hier sind nur Platzhalter. Nach dem ersten Start kannst du eigene Screenshots reinpacken (z.B. in `public/screenshots/`).

| Aktuelles Wetter | 5-Tage-Vorhersage |
| :---: | :---: |
| ![Platzhalter Aktuelles Wetter](https://play-lh.googleusercontent.com/RVM-fT3YfEwdRRXC7XCyzf7nZGHy1oqH4gseTGFxpFEuGyI6uwQG2TSTJrbTevxC1g=w526-h296-rw) | ![Platzhalter Vorhersage](https://pbs.twimg.com/media/HJ_Wm3xWIAA7l_O.jpg) |

## Tech-Stack

| Bereich | Womit |
| --- | --- |
| Framework | [Next.js 14](https://nextjs.org/) (App Router) |
| Sprache | [TypeScript](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Wetterdaten | [OpenWeatherMap API](https://openweathermap.org/api) |
| Schrift | [Inter](https://fonts.google.com/specimen/Inter) (über `next/font`) |

## Setup

So bekommst du das Projekt lokal zum Laufen.

### 1. Repo klonen

```bash
git clone https://github.com/<dein-benutzername>/wetter-dashboard.git
cd wetter-dashboard
```

### 2. Pakete installieren

```bash
npm install
```

Geht auch mit `yarn`, `pnpm` oder `bun`, falls dir das lieber ist.

### 3. API-Key holen

1. Kostenlos bei [OpenWeatherMap](https://home.openweathermap.org/users/sign_up) registrieren.
2. Unter **API keys** im Konto den Schlüssel kopieren.
3. Kleiner Hinweis: Frische Keys brauchen manchmal bis zu 2 Stunden, bis sie aktiv sind.

### 4. Umgebungsvariablen setzen

Siehe [Umgebungsvariablen](#umgebungsvariablen) weiter unten.

### 5. Dev-Server starten

```bash
npm run dev
```

Dann [http://localhost:3000](http://localhost:3000) im Browser aufmachen. Fertig.

## Umgebungsvariablen

Die App braucht einen OpenWeatherMap-API-Key. Dafür legst du eine `.env.local` an:

```bash
cp .env.example .env.local
```

Und trägst deinen Key ein:

```env
OPENWEATHER_API_KEY=dein_api_schluessel_hier
```

| Variable | Wofür | Pflicht |
| --- | --- | :---: |
| `OPENWEATHER_API_KEY` | Dein persönlicher OpenWeatherMap-API-Key | ✅ |

> Wichtig: `.env.local` steht in der `.gitignore` und wird nicht mit committet. Pack deinen Key also niemals direkt ins Repo.

## Wie man's benutzt

1. App öffnen. Beim ersten Laden wird automatisch das Wetter für Berlin angezeigt.
2. Stadt ins Suchfeld tippen (z.B. `London`, `Tokio`, `New York`) und Enter drücken oder auf **Suchen** klicken.
3. Oben erscheint das aktuelle Wetter als große Karte, darunter die 5-Tage-Vorhersage.
4. Wenn eine Stadt nicht gefunden wird oder der Key fehlt, zeigt die App eine verständliche Fehlermeldung statt einfach abzustürzen.

## API-Details

Im Hintergrund nutze ich zwei kostenlose Endpunkte von OpenWeatherMap (Free-Tarif):

| Endpunkt | Wofür |
| --- | --- |
| `/data/2.5/weather` | Aktuelles Wetter einer Stadt |
| `/data/2.5/forecast` | Vorhersage in 3-Stunden-Schritten (wird zu Tagen zusammengefasst) |

Die ruft der Browser aber nicht direkt auf, sondern über zwei interne Next.js-Routen:

| Interne Route | Was sie macht |
| --- | --- |
| `GET /api/weather?city=<Stadt>` | Liefert aufbereitetes aktuelles Wetter |
| `GET /api/forecast?city=<Stadt>` | Liefert die aufbereitete 5-Tage-Vorhersage |

So bleibt der API-Key serverseitig und ist von außen nicht sichtbar. Die Antworten werden 10 Minuten gecacht (`revalidate: 600`), damit ich nicht unnötig viele Calls verbrauche.

## Projektstruktur

```
wetter-dashboard/
├── public/                     # Statische Dateien (Bilder, Screenshots)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── weather/route.ts    # API-Route: aktuelles Wetter
│   │   │   └── forecast/route.ts   # API-Route: 5-Tage-Vorhersage
│   │   ├── globals.css             # Globale Styles und Animationen
│   │   ├── layout.tsx              # Root-Layout (Schrift, Metadaten)
│   │   └── page.tsx                # Hauptseite (State-Handling)
│   ├── components/
│   │   ├── SearchBar.tsx           # Suchleiste
│   │   ├── CurrentWeatherCard.tsx  # Karte: aktuelles Wetter
│   │   ├── ForecastCard.tsx        # Kachel: einzelner Vorhersagetag
│   │   └── MessageState.tsx        # Lade-, Fehler- und Startzustände
│   └── lib/
│       ├── types.ts                # Zentrale TypeScript-Typen
│       └── weather.ts              # API-Helfer und Daten-Mapping
├── .env.example                # Vorlage für Umgebungsvariablen
├── .gitignore
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## Ideen für später

Ein paar Sachen, die ich vielleicht noch einbaue:

* 📍 Standort automatisch erkennen und Wetter dafür anzeigen
* ⭐ Lieblingsstädte speichern (z.B. über `localStorage`)
* 🌗 Dark/Light Mode zum Umschalten
* 📊 Temperaturverlauf als Diagramm
* 🗺️ Interaktive Wetterkarte (z.B. mit Leaflet)
* 🌐 Mehrsprachigkeit
* 🌡️ Umschalten zwischen °C und °F
* 🔔 Warnungen bei extremem Wetter
* ✅ Tests mit Jest oder Playwright

## Lizenz

MIT. Mach damit, was du willst.

---

<p align="center">Wetterdaten von <a href="https://openweathermap.org/">OpenWeatherMap</a></p>
