import React, { useEffect, useState } from 'react';

interface PreloaderProps {
  studioName: string;
}

export const Preloader: React.FC<PreloaderProps> = ({ studioName }) => {
  const [progress, setProgress] = useState(18);
  const [leaving, setLeaving] = useState(false);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      setMounted(false);
      return;
    }

    const t1 = window.setTimeout(() => setProgress(68), 160);
    const t2 = window.setTimeout(() => setProgress(100), 420);
    const t3 = window.setTimeout(() => setLeaving(true), 620);
    const t4 = window.setTimeout(() => setMounted(false), 960);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.clearTimeout(t4);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      aria-hidden={leaving}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-zinc-950 text-zinc-100 transition-opacity duration-300 ease-out ${
        leaving ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center gap-6 px-6 max-w-sm w-full">
        {/* Hexagonal Automotive Detailing Emblem */}
        <div className="relative flex items-center justify-center w-16 h-16">
          <svg
            viewBox="0 0 64 64"
            className="w-16 h-16 text-amber-500"
            fill="none"
            aria-hidden="true"
          >
            <polygon
              points="32,4 56,18 56,46 32,60 8,46 8,18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <polygon
              points="32,14 47,23 47,41 32,50 17,41 17,23"
              stroke="currentColor"
              strokeOpacity="0.4"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M23 33.5L29.5 40L42 25.5"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="text-center space-y-1.5">
          <p className="font-display text-lg font-semibold tracking-tight text-white">
            {studioName}
          </p>
          <p className="text-xs text-zinc-400">
            9H Ceramic Coating · Paint Correction Studio
          </p>
        </div>

        {/* Compositor-only progress bar */}
        <div className="w-full h-0.5 bg-zinc-800 overflow-hidden rounded-full">
          <div
            className="h-full w-full bg-amber-500 origin-left transition-transform duration-300 ease-out"
            style={{ transform: `scaleX(${progress / 100})` }}
          />
        </div>
      </div>
    </div>
  );
};
