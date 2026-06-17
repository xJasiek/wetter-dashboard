import Image from "next/image";
import {
  Droplets,
  Wind,
  Gauge,
  Thermometer,
  Sunrise,
  Sunset,
} from "lucide-react";
import type { CurrentWeather } from "@/lib/types";
import { getIconUrl, formatTime } from "@/lib/weather";

interface CurrentWeatherCardProps {
  data: CurrentWeather;
}

/**
 * Wiederverwendbare kleine Detail-Kachel (z. B. Luftfeuchtigkeit).
 */
function DetailTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="glass flex flex-col items-center gap-1 rounded-2xl p-4 text-center">
      <div className="text-cyan-200">{icon}</div>
      <span className="text-xs text-white/60">{label}</span>
      <span className="text-lg font-semibold">{value}</span>
    </div>
  );
}

/**
 * Hauptkarte mit dem aktuellen Wetter: Temperatur, Beschreibung, Icon
 * sowie Detail-Kacheln für Luftfeuchtigkeit, Wind, Luftdruck etc.
 */
export default function CurrentWeatherCard({ data }: CurrentWeatherCardProps) {
  return (
    <section className="glass animate-fade-in rounded-3xl p-6 sm:p-8">
      {/* Kopfbereich: Ort + Beschreibung + großes Icon */}
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-bold sm:text-3xl">
            {data.city}, {data.country}
          </h2>
          <p className="mt-1 text-lg capitalize text-white/80">
            {data.description}
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 sm:justify-start">
            <span className="text-6xl font-extrabold sm:text-7xl">
              {data.temperature}°
            </span>
            <span className="text-xl text-white/70">C</span>
          </div>
          <p className="mt-1 text-white/70">
            Gefühlt {data.feelsLike}°C
          </p>
        </div>

        <div className="animate-float">
          <Image
            src={getIconUrl(data.icon)}
            alt={data.description}
            width={160}
            height={160}
            priority
            className="drop-shadow-2xl"
          />
        </div>
      </div>

      {/* Detail-Kacheln */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <DetailTile
          icon={<Droplets className="h-6 w-6" />}
          label="Luftfeuchtigkeit"
          value={`${data.humidity}%`}
        />
        <DetailTile
          icon={<Wind className="h-6 w-6" />}
          label="Wind"
          value={`${data.windSpeed} km/h`}
        />
        <DetailTile
          icon={<Gauge className="h-6 w-6" />}
          label="Luftdruck"
          value={`${data.pressure} hPa`}
        />
        <DetailTile
          icon={<Thermometer className="h-6 w-6" />}
          label="Gefühlt"
          value={`${data.feelsLike}°C`}
        />
        <DetailTile
          icon={<Sunrise className="h-6 w-6" />}
          label="Sonnenaufgang"
          value={formatTime(data.sunrise, data.timezone)}
        />
        <DetailTile
          icon={<Sunset className="h-6 w-6" />}
          label="Sonnenuntergang"
          value={formatTime(data.sunset, data.timezone)}
        />
      </div>
    </section>
  );
}
