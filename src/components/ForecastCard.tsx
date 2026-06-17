import Image from "next/image";
import { Droplets, Wind } from "lucide-react";
import type { ForecastDay } from "@/lib/types";
import { getIconUrl, formatWeekday, formatDate } from "@/lib/weather";

interface ForecastCardProps {
  day: ForecastDay;
}

/**
 * Eine einzelne Vorhersage-Kachel für einen Tag innerhalb der 5-Tage-Übersicht.
 */
export default function ForecastCard({ day }: ForecastCardProps) {
  return (
    <div className="glass flex flex-col items-center gap-2 rounded-2xl p-4 text-center transition hover:scale-105 hover:bg-white/20">
      <span className="font-semibold">{formatWeekday(day.date)}</span>
      <span className="text-xs text-white/60">{formatDate(day.date)}</span>

      <Image
        src={getIconUrl(day.icon)}
        alt={day.description}
        width={64}
        height={64}
      />

      <p className="text-xs capitalize text-white/70 leading-tight min-h-8">
        {day.description}
      </p>

      <div className="flex items-baseline gap-2">
        <span className="text-lg font-bold">{day.tempMax}°</span>
        <span className="text-sm text-white/50">{day.tempMin}°</span>
      </div>

      <div className="mt-1 flex w-full justify-center gap-3 text-xs text-white/60">
        <span className="flex items-center gap-1">
          <Droplets className="h-3.5 w-3.5" /> {day.humidity}%
        </span>
        <span className="flex items-center gap-1">
          <Wind className="h-3.5 w-3.5" /> {day.windSpeed}
        </span>
      </div>
    </div>
  );
}
