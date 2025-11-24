"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "developer-portfolio-favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setFavorites(new Set(parsed));
        }
      }
    } catch (error) {
      console.warn("Failed to load favorites from localStorage:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    try {
      const favoritesArray = Array.from(favorites);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favoritesArray));
    } catch (error) {
      console.warn("Failed to save favorites to localStorage:", error);
    }
  }, [favorites, isLoaded]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      debugger;
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  const isFavorite = (id: string): boolean => {
    return favorites.has(id);
  };

  const getFavorites = (): string[] => {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return [];
    }

    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch (error) {
      console.warn("Failed to parse favorites from localStorage:", error);
    }

    return [];
  };

  const clearFavorites = () => {
    setFavorites(new Set());
  };

  return {
    favorites: getFavorites(),
    toggleFavorite,
    isFavorite,
    clearFavorites,
    isLoaded,
  };
}
