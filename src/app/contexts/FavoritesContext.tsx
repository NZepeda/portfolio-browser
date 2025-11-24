"use client";

import { createContext, useEffect, useState, ReactNode } from "react";

const STORAGE_KEY = "developer-portfolio-favorites";

interface FavoritesContextType {
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  clearFavorites: () => void;
  isLoaded: boolean;
}

export const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

interface FavoritesProviderProps {
  children: ReactNode;
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
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

  const clearFavorites = () => {
    setFavorites(new Set());
  };

  const value: FavoritesContextType = {
    favorites: Array.from(favorites),
    toggleFavorite,
    isFavorite,
    clearFavorites,
    isLoaded,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}
