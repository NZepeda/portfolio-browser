"use client";

interface TopNavProps {
  currentIndex: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onRandom: () => void;
}

export default function TopNav({
  currentIndex,
  total,
  onPrev,
  onNext,
  onRandom,
}: TopNavProps) {
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
      <span className="text-sm font-medium text-gray-700">
        {currentIndex + 1} / {total}
      </span>
    </nav>
  );
}
