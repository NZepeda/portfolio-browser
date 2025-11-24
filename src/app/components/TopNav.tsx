"use client";

import { portfolios } from "../data/portfolios";

interface TopNavProps {
  currentIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onRandom: () => void;
}

export default function TopNav({
  currentIndex,
  onPrev,
  onNext,
  onRandom,
}: TopNavProps) {
  const current = portfolios[currentIndex];

  const handleOpenInNewTab = () => {
    window.open(current.url, "_blank", "noopener,noreferrer");
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
      <button
        onClick={handleOpenInNewTab}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors whitespace-nowrap"
      >
        Open in new tab ↗
      </button>
    </nav>
  );
}
