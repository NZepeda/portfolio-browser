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

  const handleOpenInNewTab = () => {
    window.open(current.url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex flex-col h-full">
      <TopNav
        currentIndex={currentIndex}
        total={total}
        onPrev={handlePrev}
        onNext={handleNext}
        onRandom={handleRandom}
      />

      <div className="p-4 bg-white border-b border-gray-300">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {current.name}
            </h2>
            {current.description && (
              <p className="text-gray-600 mb-2">{current.description}</p>
            )}
            <a
              href={current.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm break-all"
            >
              {current.url}
            </a>
          </div>
          <button
            onClick={handleOpenInNewTab}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors whitespace-nowrap"
          >
            Open in new tab ↗
          </button>
        </div>
      </div>

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
