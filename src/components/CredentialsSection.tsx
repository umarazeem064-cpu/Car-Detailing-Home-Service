import React, { useEffect, useRef, useState } from 'react';
import {
  LanguageCode,
  STUDIO_IMAGES,
  TRANSLATIONS,
} from '../data/studioData';
import { ResilientImage } from './ResilientImage';

interface CredentialsSectionProps {
  language: LanguageCode;
  liveRating: number | null;
  liveReviewCount: number | null;
}

function useAnimatedCounter(target: number, active: boolean, durationMs = 1100): number {
  const [value, setValue] = useState(target);

  useEffect(() => {
    if (!active) return;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setValue(target);
      return;
    }

    let rafId = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const ratio = Math.min(1, elapsed / durationMs);
      const eased = 1 - Math.pow(1 - ratio, 3);
      setValue(Math.round(target * eased));
      if (ratio < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [target, active, durationMs]);

  return value;
}

export const CredentialsSection: React.FC<CredentialsSectionProps> = ({
  language,
  liveRating,
  liveReviewCount,
}) => {
  const t = TRANSLATIONS[language];
  const sectionRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const carsCount = useAnimatedCounter(1500, inView);
  const yearsCount = useAnimatedCounter(10, inView);

  return (
    <section
      id="credentials"
      ref={sectionRef}
      className="py-20 lg:py-28 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 transition-colors"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Animated Metrics Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pb-14 mb-16 border-b border-zinc-200 dark:border-zinc-800">
          <div className="space-y-1.5">
            <p className="font-mono text-3xl sm:text-4xl font-semibold text-zinc-950 dark:text-white tabular-nums">
              {carsCount.toLocaleString('en-US')}+
            </p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {t.hero.statCarsLabel}
            </p>
          </div>
          <div className="space-y-1.5">
            <p className="font-mono text-3xl sm:text-4xl font-semibold text-zinc-950 dark:text-white tabular-nums">
              {yearsCount}+
            </p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {t.hero.statYearsLabel}
            </p>
          </div>
          <div className="space-y-1.5">
            <p className="font-mono text-3xl sm:text-4xl font-semibold text-amber-600 dark:text-amber-400 tabular-nums">
              {liveRating ? `${liveRating.toFixed(1)} / 5.0` : 'Verified'}
            </p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {liveReviewCount
                ? `${t.hero.statRatingLabel} (${liveReviewCount})`
                : t.hero.statRatingLabel}
            </p>
          </div>
          <div className="space-y-1.5">
            <p className="font-mono text-3xl sm:text-4xl font-semibold text-zinc-950 dark:text-white tabular-nums">
              9H SiO2
            </p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {t.hero.statProtectionLabel}
            </p>
          </div>
        </div>

        {/* Balanced 2-Column Editorial Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          <div className="lg:col-span-5 relative rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 min-h-[340px]">
            <ResilientImage
              src={STUDIO_IMAGES.ceramicStudio}
              alt="Master technician applying 9H liquid ceramic coating inside our detailing bay"
              className="w-full h-full object-cover lg:absolute lg:inset-0"
            />
          </div>

          <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
            <div className="space-y-3 max-w-2xl">
              <p className="text-xs font-medium tracking-wide text-amber-700 dark:text-amber-400">
                {t.credentials.kicker}
              </p>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-950 dark:text-white">
                {t.credentials.title}
              </h2>
              <p className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {t.credentials.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-7 pt-2">
              {t.credentials.items.map((item) => (
                <div
                  key={item.title}
                  className="pt-5 border-t border-zinc-200 dark:border-zinc-800 space-y-2"
                >
                  <h3 className="text-base font-semibold text-zinc-950 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
