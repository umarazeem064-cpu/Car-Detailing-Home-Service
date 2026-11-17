import React, { useState } from 'react';
import { ExternalLink, RefreshCw, Star } from 'lucide-react';
import { LanguageCode, STUDIO_ANCHOR, TRANSLATIONS } from '../data/studioData';
import { LivePlaceReview, LiveStudioPlace } from '../hooks/useStudioPlace';

interface ReviewsSectionProps {
  language: LanguageCode;
  place: LiveStudioPlace | null;
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
}

const ReviewerAvatar: React.FC<{
  name: string;
  photoUri: string | null;
}> = ({ name, photoUri }) => {
  const [imgFailed, setImgFailed] = useState(false);
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');

  if (photoUri && !imgFailed) {
    return (
      <img
        src={photoUri}
        alt={name}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setImgFailed(true)}
        className="w-10 h-10 rounded-full object-cover border border-zinc-200 dark:border-zinc-700 shrink-0"
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-amber-400 font-display text-sm font-semibold flex items-center justify-center shrink-0"
    >
      {initials || 'G'}
    </div>
  );
};

const ReviewCard: React.FC<{
  review: LivePlaceReview;
  verifiedLabel: string;
}> = ({ review, verifiedLabel }) => {
  const roundedStars = Math.max(1, Math.min(5, Math.round(review.rating)));

  return (
    <article className="flex flex-col justify-between rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 p-6 space-y-5">
      <div className="space-y-4">
        {/* Rating Row */}
        <div className="flex items-center justify-between gap-3">
          <div
            className="flex items-center gap-0.5 text-amber-500"
            aria-label={`${review.rating} out of 5 stars`}
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < roundedStars
                    ? 'fill-amber-500 text-amber-500'
                    : 'text-zinc-300 dark:text-zinc-700'
                }`}
                aria-hidden="true"
              />
            ))}
          </div>
          {review.relativeTime && (
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {review.relativeTime}
            </span>
          )}
        </div>

        {/* Review Body */}
        <p className="text-sm sm:text-[15px] text-zinc-700 dark:text-zinc-300 leading-relaxed">
          {review.text
            ? `“${review.text}”`
            : `Rated ${review.rating.toFixed(1)} out of 5 stars on Google Maps.`}
        </p>
      </div>

      {/* Mandatory Google Author Attribution */}
      <div className="flex items-center gap-3 pt-4 border-t border-zinc-200/80 dark:border-zinc-800">
        <ReviewerAvatar
          name={review.authorName}
          photoUri={review.authorPhotoUri}
        />
        <div className="min-w-0 flex-1">
          {review.authorUri ? (
            <a
              href={review.authorUri}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm font-semibold text-zinc-950 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 truncate transition-colors"
            >
              {review.authorName}
            </a>
          ) : (
            <p className="text-sm font-semibold text-zinc-950 dark:text-white truncate">
              {review.authorName}
            </p>
          )}
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {verifiedLabel}
          </p>
        </div>
      </div>
    </article>
  );
};

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  language,
  place,
  isLoading,
  error,
  onRefresh,
}) => {
  const t = TRANSLATIONS[language];
  const mapsUrl = place?.googleMapsUri || STUDIO_ANCHOR.mapsShortUrl;
  const reviews = place?.reviews ?? [];

  return (
    <section
      id="reviews"
      className="py-20 lg:py-28 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-950/60 transition-colors"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header + Aggregate Live Google Rating */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-medium tracking-wide text-amber-700 dark:text-amber-400">
              {t.reviews.kicker}
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-950 dark:text-white">
              {t.reviews.title}
            </h2>
            <p className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {t.reviews.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-5 shrink-0">
            {place?.rating != null && (
              <div className="flex items-center gap-3">
                <span className="font-mono text-3xl font-semibold text-zinc-950 dark:text-white tabular-nums">
                  {place.rating.toFixed(1)}
                </span>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.round(place.rating || 0)
                            ? 'fill-amber-500 text-amber-500'
                            : 'text-zinc-300 dark:text-zinc-700'
                        }`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 tabular-nums">
                    {place.userRatingCount != null
                      ? `${place.userRatingCount.toLocaleString('en-US')} ${t.reviews.basedOn}`
                      : t.reviews.verifiedSource}
                  </p>
                </div>
              </div>
            )}

            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 px-4 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs sm:text-sm font-medium text-zinc-900 dark:text-zinc-100 hover:border-amber-500 transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0"
            >
              <span>{t.reviews.viewAllOnMaps}</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {t.reviews.loadingText}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[0, 1, 2].map((idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-6 space-y-4 animate-pulse"
                >
                  <div className="h-4 w-24 rounded bg-zinc-200 dark:bg-zinc-800" />
                  <div className="space-y-2">
                    <div className="h-3.5 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
                    <div className="h-3.5 w-5/6 rounded bg-zinc-200 dark:bg-zinc-800" />
                    <div className="h-3.5 w-2/3 rounded bg-zinc-200 dark:bg-zinc-800" />
                  </div>
                  <div className="flex items-center gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                    <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                    <div className="h-3.5 w-28 rounded bg-zinc-200 dark:bg-zinc-800" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Live Reviews Grid */}
        {!isLoading && reviews.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((rev, index) => (
                <ReviewCard
                  key={`${rev.authorName}-${index}`}
                  review={rev}
                  verifiedLabel={t.reviews.verifiedSource}
                />
              ))}
            </div>
            <p className="mt-6 text-xs text-zinc-500 dark:text-zinc-400">
              Reviews &amp; ratings sourced live via Google Maps Platform Places API · Powered by Google
            </p>
          </>
        )}

        {/* Empty or Error State (Never fabricates fake reviews) */}
        {!isLoading && reviews.length === 0 && (
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <p className="text-base font-medium text-zinc-950 dark:text-white">
                {place?.displayName || STUDIO_ANCHOR.fallbackName}
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {error ? `${t.reviews.noReviewsText}` : t.reviews.noReviewsText}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={onRefresh}
                className="h-10 px-4 rounded-lg border border-zinc-300 dark:border-zinc-700 text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 inline-flex items-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{t.reviews.retryLabel}</span>
              </button>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 px-4 rounded-lg bg-zinc-950 text-white dark:bg-amber-500 dark:text-zinc-950 text-xs font-semibold inline-flex items-center gap-2 whitespace-nowrap"
              >
                <span>{t.reviews.viewAllOnMaps}</span>
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
