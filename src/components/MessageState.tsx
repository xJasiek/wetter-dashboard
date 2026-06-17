import { CloudOff, Loader2, CloudSun } from "lucide-react";

/** Ladeanzeige während Daten abgerufen werden. */
export function LoadingState() {
  return (
    <div className="glass flex flex-col items-center gap-3 rounded-3xl p-12 text-center">
      <Loader2 className="h-10 w-10 animate-spin text-cyan-200" />
      <p className="text-white/80">Wetterdaten werden geladen…</p>
    </div>
  );
}

/** Fehleranzeige (z. B. Stadt nicht gefunden). */
export function ErrorState({ message }: { message: string }) {
  return (
    <div className="glass flex flex-col items-center gap-3 rounded-3xl p-12 text-center">
      <CloudOff className="h-10 w-10 text-rose-300" />
      <p className="max-w-md text-white/80">{message}</p>
    </div>
  );
}

/** Startzustand, bevor eine Suche durchgeführt wurde. */
export function EmptyState() {
  return (
    <div className="glass flex flex-col items-center gap-3 rounded-3xl p-12 text-center">
      <CloudSun className="h-12 w-12 animate-float text-cyan-200" />
      <p className="text-lg font-medium">Willkommen beim Wetter-Dashboard</p>
      <p className="max-w-md text-white/70">
        Suche oben nach einer Stadt, um das aktuelle Wetter und die
        5-Tage-Vorhersage anzuzeigen.
      </p>
    </div>
  );
}
