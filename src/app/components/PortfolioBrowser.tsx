"use client";

import { useEffect, useState } from "react";
import type { Portfolio } from "../data/portfolios";
import TopNav from "./TopNav";
import IframeViewer from "./IframeViewer";

interface PortfolioBrowserProps {
  portfolios: Portfolio[];
}

export default function PortfolioBrowser({
  portfolios,
}: PortfolioBrowserProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isIframeLoading, setIsIframeLoading] = useState(true);

  const total = portfolios.length;
  const current = portfolios[currentIndex];

  useEffect(() => {
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

  return (
    <div className="flex flex-col h-full">
      <TopNav
        currentIndex={currentIndex}
        onPrev={handlePrev}
        onNext={handleNext}
        onRandom={handleRandom}
      />

      <div className="flex-1 min-h-0">
        <IframeViewer
          url={current.url}
          isLoading={isIframeLoading}
          onLoad={handleIframeLoad}
        />
      </div>
    </div>
  );
}
