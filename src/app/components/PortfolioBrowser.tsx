"use client";

import { useEffect, useState } from "react";
import type { Portfolio } from "../data/portfolios";
import TopNav from "./TopNav";
import IframeViewer from "./IframeViewer";
import FavoritesDrawer from "./FavoritesDrawer";

interface PortfolioBrowserProps {
  portfolios: Portfolio[];
}

export default function PortfolioBrowser({
  portfolios,
}: PortfolioBrowserProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isIframeLoading, setIsIframeLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const total = portfolios.length;
  const current = portfolios[currentIndex];

  useEffect(() => {
    // Whenever the currentIndex changes, it means the user has navigated to a new portfolio.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsIframeLoading(true);
  }, [currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((i) => (i - 1 + total) % total);
  };

  const handleNext = () => {
    setCurrentIndex((i) => (i + 1) % total);
  };

  const handleRandom = () => {
    if (total <= 1) return;

    setCurrentIndex((current) => {
      let i = current;
      while (i === current) {
        i = Math.floor(Math.random() * total);
      }
      return i;
    });
  };

  const handleIframeLoad = () => {
    setIsIframeLoading(false);
  };

  const handleOpenFavorites = () => {
    setIsDrawerOpen(true);
  };

  const handleCloseFavorites = () => {
    setIsDrawerOpen(false);
  };

  const handleSelectPortfolio = (portfolioId: string) => {
    const index = portfolios.findIndex((p) => p.id === portfolioId);
    if (index !== -1) {
      setCurrentIndex(index);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <TopNav
        currentIndex={currentIndex}
        onPrev={handlePrev}
        onNext={handleNext}
        onRandom={handleRandom}
        onOpenFavorites={handleOpenFavorites}
      />

      <div className="flex-1 min-h-0">
        <IframeViewer
          url={current.url}
          isLoading={isIframeLoading}
          onLoad={handleIframeLoad}
        />
      </div>

      <FavoritesDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseFavorites}
        portfolios={portfolios}
        onSelectPortfolio={handleSelectPortfolio}
      />
    </div>
  );
}
