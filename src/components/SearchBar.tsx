"use client";

import { Search, Loader2 } from "lucide-react";
import { FormEvent, useState } from "react";

interface SearchBarProps {
  /** Wird mit dem eingegebenen Stadtnamen aufgerufen, wenn gesucht wird. */
  onSearch: (city: string) => void;
  /** Zeigt einen Ladezustand im Button an. */
  loading: boolean;
}

/**
 * Suchleiste zum Eingeben eines Stadtnamens.
 * Verwaltet den Eingabewert lokal und delegiert die Suche an die Elternkomponente.
 */
export default function SearchBar({ onSearch, loading }: SearchBarProps) {
  const [value, setValue] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed.length > 0) {
      onSearch(trimmed);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-xl items-center gap-2"
    >
      <div className="relative flex-1">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/60"
          aria-hidden="true"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Stadt suchen, z. B. Berlin, London, Tokio…"
          aria-label="Stadtname"
          className="glass w-full rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-white/50 outline-none transition focus:ring-2 focus:ring-cyan-300/60"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="glass flex items-center gap-2 rounded-2xl px-5 py-3.5 font-medium text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
        ) : (
          <Search className="h-5 w-5" aria-hidden="true" />
        )}
        <span className="hidden sm:inline">Suchen</span>
      </button>
    </form>
  );
}
