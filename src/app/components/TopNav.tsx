"use client";

import { portfolios } from "../data/portfolios";
import { useFavorites } from "../hooks/useFavorites";

interface TopNavProps {
  currentIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onRandom: () => void;
  onOpenFavorites: () => void;
}

export default function TopNav({
  currentIndex,
  onPrev,
  onNext,
  onRandom,
  onOpenFavorites,
}: TopNavProps) {
  const current = portfolios[currentIndex];

  const { toggleFavorite, isFavorite } = useFavorites();

  const isCurrentFavorite = isFavorite(current.id);

  const handleOpenInNewTab = () => {
    window.open(current.url, "_blank", "noopener,noreferrer");
  };

  const handleFavoriteToggle = () => {
    toggleFavorite(current.id);
  };

  return (
    <nav className="flex items-center justify-between gap-4 p-4 bg-gray-100 border-b border-gray-300">
      <div className="flex gap-2">
        <button
          onClick={onPrev}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          ← Prev
        </button>
        <button
          onClick={onRandom}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
        >
          Random 🎲
        </button>
        <button
          onClick={onNext}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Next →
        </button>
      </div>
      <a
        href={current.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline text-sm break-all"
      >
        {current.url}
      </a>

      <div className="flex gap-2">
        <button
          onClick={onOpenFavorites}
          className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors whitespace-nowrap"
          title="View favorites"
        >
          Favorites
        </button>
        <button
          onClick={handleFavoriteToggle}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-2xl rounded transition-all duration-200 hover:scale-110"
          title={
            isCurrentFavorite ? "Remove from favorites" : "Add to favorites"
          }
        >
          {isCurrentFavorite ? "❤️" : "🤍"}
        </button>
        <button
          onClick={handleOpenInNewTab}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors whitespace-nowrap"
        >
          Open in new tab ↗
        </button>
      </div>
    </nav>
  );
}
