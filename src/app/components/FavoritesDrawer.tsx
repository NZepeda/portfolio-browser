"use client";

import { Portfolio } from "../data/portfolios";
import { useFavorites } from "../hooks/useFavorites";

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  portfolios: Portfolio[];
  onSelectPortfolio: (portfolioId: string) => void;
}

export default function FavoritesDrawer({
  isOpen,
  onClose,
  portfolios,
  onSelectPortfolio,
}: FavoritesDrawerProps) {
  const { favorites, toggleFavorite } = useFavorites();

  const favoritePortfolios = portfolios.filter((portfolio) =>
    favorites.includes(portfolio.id)
  );

  const handlePortfolioClick = (portfolioId: string) => {
    onSelectPortfolio(portfolioId);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              Favorites ({favoritePortfolios.length})
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
              aria-label="Close favorites"
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {favoritePortfolios.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 p-6 text-center">
                <div className="text-6xl mb-4">🤍</div>
                <p className="text-lg">No favorites yet</p>
                <p className="text-sm mt-2">
                  Click the heart icon to save your favorite portfolios
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {favoritePortfolios.map((portfolio) => (
                  <li
                    key={portfolio.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between p-4 gap-3">
                      <button
                        onClick={() => handlePortfolioClick(portfolio.id)}
                        className="flex-1 text-left"
                      >
                        <div className="font-medium text-gray-900 mb-1 capitalize">
                          {portfolio.id.replace(/-/g, " ")}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {portfolio.url}
                        </div>
                      </button>
                      <button
                        onClick={() => toggleFavorite(portfolio.id)}
                        className="text-2xl hover:scale-110 transition-transform"
                        title="Remove from favorites"
                      >
                        ❤️
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
