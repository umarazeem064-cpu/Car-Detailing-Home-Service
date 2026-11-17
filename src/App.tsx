/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import {
  ArrowRight,
  MapPin,
  MessageCircle,
  Star,
} from 'lucide-react';
import {
  CurrencyCode,
  LanguageCode,
  SERVICE_PACKAGES,
  STUDIO_ANCHOR,
  STUDIO_IMAGES,
  TRANSLATIONS,
  VehicleClass,
} from './data/studioData';
import {
  useStudioPlace,
  UseStudioPlaceResult,
} from './hooks/useStudioPlace';
import { Preloader } from './components/Preloader';
import { Navbar } from './components/Navbar';
import { BeforeAfterGallery } from './components/BeforeAfterGallery';
import { PackagesSection } from './components/PackagesSection';
import { CredentialsSection } from './components/CredentialsSection';
import { ReviewsSection } from './components/ReviewsSection';
import { BookingSection } from './components/BookingSection';
import { StudioLocationMap } from './components/StudioLocationMap';
import { ResilientImage } from './components/ResilientImage';

const MAPS_API_KEY = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '').trim();

interface StudioExperienceProps {
  hasMapsApiKey: boolean;
  placeState: UseStudioPlaceResult;
}

function StudioPlacesContainer() {
  const placeState = useStudioPlace(true);
  return <StudioExperience hasMapsApiKey={true} placeState={placeState} />;
}

function StudioExperience({
  hasMapsApiKey,
  placeState,
}: StudioExperienceProps) {
  const { place, isLoading, error, refresh } = placeState;

  const [language, setLanguage] = useState<LanguageCode>('en');
  const [currency, setCurrency] = useState<CurrencyCode>('PKR');
  const [vehicleClass, setVehicleClass] = useState<VehicleClass>('sedan');
  const [selectedPackageId, setSelectedPackageId] = useState<string>(
    SERVICE_PACKAGES[2].id
  );
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return true;
  });

  const t = TRANSLATIONS[language];
  const studioName = place?.displayName || STUDIO_ANCHOR.fallbackName;

  // Sync dark mode class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('cdhs-theme', isDark ? 'dark' : 'light');
    } catch {
      // Ignore storage failures in sandboxed frames
    }
  }, [isDark]);

  // Sync RTL/LTR direction and document language
  useEffect(() => {
    document.documentElement.dir = t.dir;
    document.documentElement.lang = language;
  }, [language, t.dir]);

  const whatsappBaseUrl = place?.whatsappDigits
    ? `https://wa.me/${place.whatsappDigits}`
    : `https://wa.me/?text=${encodeURIComponent(
        `Hello ${studioName}, I would like to inquire about car detailing and 9H ceramic coating.`
      )}`;

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSelectPackage = (pkgId: string) => {
    setSelectedPackageId(pkgId);
    scrollToSection('booking');
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 transition-colors duration-200">
      <Preloader studioName={studioName} />

      <Navbar
        studioName={studioName}
        language={language}
        onLanguageChange={setLanguage}
        currency={currency}
        onCurrencyChange={setCurrency}
        isDark={isDark}
        onToggleTheme={() => setIsDark((prev) => !prev)}
        whatsappUrl={whatsappBaseUrl}
        onBookNowClick={() => scrollToSection('booking')}
      />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section
          id="home"
          className="relative overflow-hidden bg-zinc-950 text-white border-b border-zinc-800"
        >
          {/* Full-bleed .jpg Studio Bay Photograph with Measured Contrast Scrim */}
          <div className="absolute inset-0">
            <ResilientImage
              src={STUDIO_IMAGES.heroStudio}
              alt="Obsidian luxury sports sedan parked inside hexagonal LED-lit car detailing studio bay"
              className="w-full h-full object-cover object-center"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/92 via-zinc-950/75 to-zinc-950/45" />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950/55" />
          </div>

          <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20 sm:pt-28 sm:pb-24 lg:pt-32 lg:pb-28">
            <div className="max-w-3xl space-y-6">
              {/* Quiet unboxed location & live Google rating metadata */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-zinc-300">
                <span className="inline-flex items-center gap-1.5 text-amber-400 font-medium">
                  <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>
                    {place?.formattedAddress || t.hero.locationLine}
                  </span>
                </span>
                {place?.rating != null && (
                  <>
                    <span aria-hidden="true" className="text-zinc-500">
                      ·
                    </span>
                    <a
                      href={place.googleMapsUri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-zinc-200 hover:text-amber-300 transition-colors font-mono tabular-nums"
                    >
                      <Star
                        className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                        aria-hidden="true"
                      />
                      <span>{place.rating.toFixed(1)}</span>
                      {place.userRatingCount != null && (
                        <span className="text-zinc-400">
                          ({place.userRatingCount})
                        </span>
                      )}
                    </a>
                  </>
                )}
              </div>

              {/* Hero Display Headline */}
              <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.75rem] font-semibold tracking-tight leading-[1.08] text-white">
                {t.hero.headline}
              </h1>

              {/* Subheadline */}
              <p className="text-base sm:text-lg text-zinc-300 max-w-2xl leading-relaxed">
                {t.hero.subheadline}
              </p>

              {/* Hero Actions */}
              <div className="flex flex-wrap items-center gap-3.5 pt-3">
                <button
                  type="button"
                  onClick={() => scrollToSection('booking')}
                  className="h-12 px-6 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 text-sm font-semibold inline-flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
                >
                  <span>{t.hero.primaryCta}</span>
                  <ArrowRight
                    className="w-4 h-4 rtl:rotate-180"
                    aria-hidden="true"
                  />
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection('packages')}
                  className="h-12 px-6 rounded-lg border border-white/25 bg-white/10 hover:bg-white/15 backdrop-blur-xs text-white text-sm font-medium transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  {t.hero.secondaryCta}
                </button>

                <a
                  href={whatsappBaseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-12 px-5 rounded-lg text-sm font-medium text-emerald-300 hover:text-emerald-200 inline-flex items-center gap-2 transition-colors whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4" aria-hidden="true" />
                  <span>{t.hero.whatsappCta}</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* INTERACTIVE BEFORE/AFTER TRANSFORMATION GALLERY */}
        <BeforeAfterGallery language={language} />

        {/* SERVICES & DYNAMIC MULTI-CURRENCY PACKAGES */}
        <PackagesSection
          language={language}
          currency={currency}
          onCurrencyChange={setCurrency}
          vehicleClass={vehicleClass}
          onVehicleClassChange={setVehicleClass}
          selectedPackageId={selectedPackageId}
          onSelectPackage={handleSelectPackage}
        />

        {/* WHY CHOOSE US & STUDIO CREDENTIALS */}
        <CredentialsSection
          language={language}
          liveRating={place?.rating ?? null}
          liveReviewCount={place?.userRatingCount ?? null}
        />

        {/* REAL LIVE GOOGLE REVIEWS & TESTIMONIALS */}
        <ReviewsSection
          language={language}
          place={place}
          isLoading={isLoading}
          error={error}
          onRefresh={refresh}
        />

        {/* INTERACTIVE APPOINTMENT BOOKING SYSTEM */}
        <BookingSection
          language={language}
          currency={currency}
          vehicleClass={vehicleClass}
          selectedPackageId={selectedPackageId}
          onSelectPackageId={setSelectedPackageId}
          place={place}
          whatsappBaseUrl={whatsappBaseUrl}
        />
      </main>

      {/* INTERACTIVE GOOGLE MAPS LOCATION & FOOTER */}
      <StudioLocationMap
        language={language}
        isDark={isDark}
        hasMapsApiKey={hasMapsApiKey}
        place={place}
        isLoading={isLoading}
        whatsappUrl={whatsappBaseUrl}
      />
    </div>
  );
}

export default function App() {
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  useEffect(() => {
    const handleQuotaExceeded = () => {
      setQuotaExceeded(true);
    };
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => {
      window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    };
  }, []);

  const hasMapsApiKey = MAPS_API_KEY.length > 0;

  return (
    <>
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {hasMapsApiKey ? (
        <APIProvider
          apiKey={MAPS_API_KEY}
          language="en"
          region="PK"
          libraries={['places', 'marker']}
        >
          <StudioPlacesContainer />
        </APIProvider>
      ) : (
        <StudioExperience
          hasMapsApiKey={false}
          placeState={{
            place: null,
            isLoading: false,
            error: null,
            refresh: () => {},
          }}
        />
      )}
    </>
  );
}
