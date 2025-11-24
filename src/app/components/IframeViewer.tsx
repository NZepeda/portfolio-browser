"use client";

interface IframeViewerProps {
  url: string;
  isLoading: boolean;
  onLoad: () => void;
}

export default function IframeViewer({
  url,
  isLoading,
  onLoad,
}: IframeViewerProps) {
  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="relative flex-1 min-h-0">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
              <p className="text-gray-700 font-medium">Loading preview...</p>
            </div>
          </div>
        )}
        <iframe
          src={url}
          title={url}
          loading="lazy"
          onLoad={onLoad}
          className="w-full h-full border-0"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </div>
      <p className="text-xs text-gray-600 p-2 bg-gray-50 border-t border-gray-200 text-center">
        If you don&apos;t see the site, it may block embedding. Use &quot;Open
        in new tab&quot; to view it directly.
      </p>
    </div>
  );
}
