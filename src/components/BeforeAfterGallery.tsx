import React, { useCallback, useRef, useState } from 'react';
import { Columns2, MoveHorizontal } from 'lucide-react';
import {
  LanguageCode,
  TRANSFORMATION_CASES,
  TRANSLATIONS,
} from '../data/studioData';
import { ResilientImage } from './ResilientImage';

interface BeforeAfterGalleryProps {
  language: LanguageCode;
}

export const BeforeAfterGallery: React.FC<BeforeAfterGalleryProps> = ({
  language,
}) => {
  const t = TRANSLATIONS[language];
  const [activeIndex, setActiveIndex] = useState(0);
  const [sliderPos, setSliderPos] = useState(50);
  const [viewMode, setViewMode] = useState<'slider' | 'sideBySide'>('slider');
  const containerRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);

  const activeCase = TRANSFORMATION_CASES[activeIndex];

  const updateSliderFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const rawPct = ((clientX - rect.left) / rect.width) * 100;
    const clamped = Math.max(4, Math.min(96, rawPct));
    setSliderPos(clamped);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    updateSliderFromClientX(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    updateSliderFromClientX(e.clientX);
  };

  const handlePointerUp = () => {
    draggingRef.current = false;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setSliderPos((p) => Math.max(4, p - 5));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setSliderPos((p) => Math.min(96, p + 5));
    }
  };

  return (
    <section
      id="gallery"
      className="py-20 lg:py-28 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 transition-colors"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-medium tracking-wide text-amber-700 dark:text-amber-400">
              {t.gallery.kicker}
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-950 dark:text-white">
              {t.gallery.title}
            </h2>
            <p className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {t.gallery.subtitle}
            </p>
          </div>

          {/* Interactive View Mode Control */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 self-start lg:self-auto shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('slider')}
              className={`h-9 px-3.5 rounded-md text-xs font-medium inline-flex items-center gap-2 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                viewMode === 'slider'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
              }`}
            >
              <MoveHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{t.gallery.sliderMode}</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('sideBySide')}
              className={`h-9 px-3.5 rounded-md text-xs font-medium inline-flex items-center gap-2 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                viewMode === 'sideBySide'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
              }`}
            >
              <Columns2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{t.gallery.sideBySideMode}</span>
            </button>
          </div>
        </div>

        {/* Transformation Case Selector Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {TRANSFORMATION_CASES.map((item, idx) => {
            const selected = idx === activeIndex;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveIndex(idx);
                  setSliderPos(50);
                }}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors cursor-pointer whitespace-nowrap ${
                  selected
                    ? 'bg-zinc-950 text-white border-zinc-950 dark:bg-amber-500 dark:text-zinc-950 dark:border-amber-500'
                    : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600'
                }`}
              >
                0{idx + 1}. {item.title[language]}
              </button>
            );
          })}
        </div>

        {/* Main Showcase Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-8">
            {viewMode === 'slider' ? (
              <div
                ref={containerRef}
                dir="ltr"
                role="slider"
                tabIndex={0}
                aria-label={`${activeCase.title[language]} before and after comparison`}
                aria-valuemin={4}
                aria-valuemax={96}
                aria-valuenow={Math.round(sliderPos)}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                onKeyDown={handleKeyDown}
                className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-900 select-none touch-none cursor-ew-resize focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                {/* AFTER Image (Full layer underneath) */}
                <ResilientImage
                  src={activeCase.afterImage}
                  alt={`${activeCase.title[language]} — ${t.gallery.afterLabel}`}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="eager"
                />

                {/* BEFORE Image (Clipped to sliderPos via clip-path so proportions never distort) */}
                <div
                  className="absolute inset-0"
                  style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
                >
                  <ResilientImage
                    src={activeCase.beforeImage}
                    alt={`${activeCase.title[language]} — ${t.gallery.beforeLabel}`}
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                </div>

                {/* Scrim Corners for Before/After Labels */}
                <div className="pointer-events-none absolute top-4 left-4 px-3 py-1.5 rounded-md bg-zinc-950/80 backdrop-blur-xs text-xs font-medium text-zinc-100 border border-white/10">
                  {t.gallery.beforeLabel}
                </div>
                <div className="pointer-events-none absolute top-4 right-4 px-3 py-1.5 rounded-md bg-amber-500/95 text-xs font-semibold text-zinc-950">
                  {t.gallery.afterLabel}
                </div>

                {/* Divider Line & Handle */}
                <div
                  className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow-[0_0_12px_rgba(0,0,0,0.65)]"
                  style={{ left: `${sliderPos}%` }}
                >
                  <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white text-zinc-950 shadow-lg flex items-center justify-center border-2 border-amber-500">
                    <MoveHorizontal className="w-4 h-4" aria-hidden="true" />
                  </div>
                </div>

                <div className="pointer-events-none absolute bottom-4 inset-x-0 flex justify-center">
                  <span className="px-3 py-1 rounded-md bg-zinc-950/75 backdrop-blur-xs text-xs text-zinc-200">
                    {t.gallery.dragHint}
                  </span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
                <figure className="relative rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-900 aspect-[4/3]">
                  <ResilientImage
                    src={activeCase.beforeImage}
                    alt={`${activeCase.title[language]} — ${t.gallery.beforeLabel}`}
                    className="w-full h-full object-cover"
                  />
                  <figcaption className="absolute top-3 left-3 px-3 py-1 rounded-md bg-zinc-950/85 text-xs font-medium text-white">
                    {t.gallery.beforeLabel}
                  </figcaption>
                </figure>
                <figure className="relative rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-900 aspect-[4/3]">
                  <ResilientImage
                    src={activeCase.afterImage}
                    alt={`${activeCase.title[language]} — ${t.gallery.afterLabel}`}
                    className="w-full h-full object-cover"
                  />
                  <figcaption className="absolute top-3 left-3 px-3 py-1 rounded-md bg-amber-500 text-xs font-semibold text-zinc-950">
                    {t.gallery.afterLabel}
                  </figcaption>
                </figure>
              </div>
            )}
          </div>

          {/* Right Technical Proof Panel */}
          <div className="lg:col-span-4 flex flex-col justify-between rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/70 p-6 sm:p-8">
            <div className="space-y-4">
              <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                {activeCase.vehicle}
              </p>
              <h3 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">
                {activeCase.title[language]}
              </h3>
              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {activeCase.summary[language]}
              </p>
            </div>

            <div className="pt-8 mt-8 border-t border-zinc-200 dark:border-zinc-800 space-y-5">
              <div className="grid grid-cols-3 gap-4">
                {activeCase.metrics.map((m) => (
                  <div key={m.value} className="space-y-1">
                    <p className="font-mono text-xl sm:text-2xl font-semibold text-zinc-950 dark:text-amber-400 tabular-nums">
                      {m.value}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-snug">
                      {m.label[language]}
                    </p>
                  </div>
                ))}
              </div>

              {viewMode === 'slider' && (
                <div className="flex items-center justify-between gap-2 pt-3 border-t border-zinc-200/70 dark:border-zinc-800/70">
                  <button
                    type="button"
                    onClick={() => setSliderPos(92)}
                    className="flex-1 h-9 rounded-md border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    {t.gallery.beforeLabel}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSliderPos(50)}
                    className="flex-1 h-9 rounded-md border border-zinc-200 dark:border-zinc-700 text-xs font-mono font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    50 / 50
                  </button>
                  <button
                    type="button"
                    onClick={() => setSliderPos(8)}
                    className="flex-1 h-9 rounded-md border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    {t.gallery.afterLabel}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
