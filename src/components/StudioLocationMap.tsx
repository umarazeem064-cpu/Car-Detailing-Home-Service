import React, { useEffect, useState } from 'react';
import {
  AdvancedMarker,
  InfoWindow,
  Map as GoogleMap,
  Pin,
  useAdvancedMarkerRef,
  useMap,
} from '@vis.gl/react-google-maps';
import {
  Clock,
  ExternalLink,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Star,
} from 'lucide-react';
import {
  LanguageCode,
  STUDIO_ANCHOR,
  TRANSLATIONS,
} from '../data/studioData';
import { LiveStudioPlace } from '../hooks/useStudioPlace';

const MapRecenter: React.FC<{ center: { lat: number; lng: number } }> = ({
  center,
}) => {
  const map = useMap();
  useEffect(() => {
    if (map) {
      map.panTo(center);
    }
  }, [map, center.lat, center.lng]);
  return null;
};

interface StudioLocationMapProps {
  language: LanguageCode;
  isDark: boolean;
  hasMapsApiKey: boolean;
  place: LiveStudioPlace | null;
  isLoading: boolean;
  whatsappUrl: string;
}

const StudioPinWithInfo: React.FC<{
  position: { lat: number; lng: number };
  name: string;
  address: string;
  rating: number | null;
  mapsUri: string;
}> = ({ position, name, address, rating, mapsUri }) => {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infoOpen, setInfoOpen] = useState(true);

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={position}
        title={name}
        onClick={() => setInfoOpen((prev) => !prev)}
      >
        <Pin
          background="#d97706"
          borderColor="#78350f"
          glyphColor="#09090b"
          scale={1.2}
        />
      </AdvancedMarker>

      {infoOpen && marker && (
        <InfoWindow
          anchor={marker}
          maxWidth={270}
          onCloseClick={() => setInfoOpen(false)}
        >
          <div className="p-1 text-zinc-900 space-y-1.5">
            <p className="font-semibold text-sm leading-snug">{name}</p>
            <p className="text-xs text-zinc-600 leading-relaxed">{address}</p>
            {rating != null && (
              <p className="text-xs font-medium text-amber-700 inline-flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{rating.toFixed(1)} Google Maps</span>
              </p>
            )}
            <div className="pt-1">
              <a
                href={mapsUri}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-amber-700 hover:underline inline-flex items-center gap-1"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </InfoWindow>
      )}
    </>
  );
};

export const StudioLocationMap: React.FC<StudioLocationMapProps> = ({
  language,
  isDark,
  hasMapsApiKey,
  place,
  isLoading,
  whatsappUrl,
}) => {
  const t = TRANSLATIONS[language];
  const studioName = place?.displayName || STUDIO_ANCHOR.fallbackName;
  const center = place?.location || STUDIO_ANCHOR.coordinates;
  const mapsUri = place?.googleMapsUri || STUDIO_ANCHOR.mapsShortUrl;
  const formattedAddress =
    place?.formattedAddress || `${STUDIO_ANCHOR.city}, ${STUDIO_ANCHOR.country}`;
  const displayPhone =
    place?.internationalPhoneNumber || place?.nationalPhoneNumber || null;

  const todayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(
    new Date()
  );

  return (
    <footer
      id="contact"
      className="bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors"
    >
      {/* Location & Interactive Map Section */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
        <div className="max-w-2xl space-y-3 mb-12">
          <p className="text-xs font-medium tracking-wide text-amber-700 dark:text-amber-400">
            {t.location.kicker}
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-950 dark:text-white">
            {t.location.title}
          </h2>
          <p className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {t.location.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Interactive Google Map Canvas */}
          <div className="lg:col-span-7 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-200 dark:bg-zinc-900 h-[420px] lg:h-auto lg:min-h-[480px] relative">
            {hasMapsApiKey ? (
              <GoogleMap
                key={isDark ? 'map-dark' : 'map-light'}
                mapId="DEMO_MAP_ID"
                defaultCenter={center}
                defaultZoom={14}
                colorScheme={isDark ? 'DARK' : 'LIGHT'}
                gestureHandling="cooperative"
                internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                style={{ width: '100%', height: '100%' }}
              >
                <MapRecenter center={center} />
                <StudioPinWithInfo
                  position={center}
                  name={studioName}
                  address={formattedAddress}
                  rating={place?.rating ?? null}
                  mapsUri={mapsUri}
                />
              </GoogleMap>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-8 text-center bg-zinc-900 text-zinc-200">
                <MapPin className="w-8 h-8 text-amber-500" aria-hidden="true" />
                <div className="space-y-1 max-w-sm">
                  <p className="font-display text-lg font-semibold text-white">
                    {studioName}
                  </p>
                  <p className="text-sm text-zinc-400">{formattedAddress}</p>
                </div>
                <a
                  href={mapsUri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 px-4 rounded-lg bg-amber-500 text-zinc-950 text-xs font-semibold inline-flex items-center gap-2"
                >
                  <Navigation className="w-4 h-4" aria-hidden="true" />
                  <span>{t.location.openInMaps}</span>
                </a>
              </div>
            )}
          </div>

          {/* Verified Business Info & Operating Hours */}
          <div className="lg:col-span-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 p-6 sm:p-8 flex flex-col justify-between gap-7">
            <div className="space-y-6">
              {/* Address */}
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  {t.location.addressLabel}
                </p>
                <div className="flex items-start gap-2.5">
                  <MapPin
                    className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-1"
                    aria-hidden="true"
                  />
                  <p className="text-sm sm:text-base font-medium text-zinc-950 dark:text-white leading-relaxed">
                    {isLoading ? t.location.loadingListing : formattedAddress}
                  </p>
                </div>
              </div>

              {/* Phone & WhatsApp */}
              <div className="space-y-2.5 pt-5 border-t border-zinc-200 dark:border-zinc-800">
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  {t.location.phoneLabel}
                </p>
                {displayPhone && (
                  <p className="font-mono text-base font-semibold text-zinc-950 dark:text-white">
                    {displayPhone}
                  </p>
                )}
                <div className="flex flex-wrap gap-2.5 pt-1">
                  {displayPhone && (
                    <a
                      href={`tel:${displayPhone.replace(/\s+/g, '')}`}
                      className="h-10 px-4 rounded-lg border border-zinc-300 dark:border-zinc-700 text-xs font-medium text-zinc-900 dark:text-zinc-100 hover:border-amber-500 transition-colors inline-flex items-center gap-2 whitespace-nowrap"
                    >
                      <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{t.location.callStudio}</span>
                    </a>
                  )}
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold inline-flex items-center gap-2 transition-colors whitespace-nowrap"
                  >
                    <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{t.location.chatWhatsapp}</span>
                  </a>
                  <a
                    href={mapsUri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 px-4 rounded-lg border border-zinc-300 dark:border-zinc-700 text-xs font-medium text-zinc-900 dark:text-zinc-100 hover:border-amber-500 transition-colors inline-flex items-center gap-2 whitespace-nowrap"
                  >
                    <Navigation className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{t.location.openInMaps}</span>
                  </a>
                </div>
              </div>

              {/* Exact Opening & Closing Hours */}
              <div className="space-y-2.5 pt-5 border-t border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 inline-flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                    <span>{t.location.hoursLabel}</span>
                  </p>
                  {place?.isOpenNow != null && (
                    <span
                      className={`text-xs font-medium ${
                        place.isOpenNow
                          ? 'text-emerald-700 dark:text-emerald-400'
                          : 'text-zinc-500 dark:text-zinc-400'
                      }`}
                    >
                      {place.isOpenNow ? 'Open now' : 'Currently closed'}
                    </span>
                  )}
                </div>

                {place?.weekdayDescriptions &&
                place.weekdayDescriptions.length > 0 ? (
                  <ul className="space-y-1.5 text-xs sm:text-sm font-mono tabular-nums">
                    {place.weekdayDescriptions.map((line) => {
                      const isToday = line
                        .toLowerCase()
                        .startsWith(todayName.toLowerCase());
                      const colonIdx = line.indexOf(':');
                      const day = colonIdx > -1 ? line.slice(0, colonIdx) : line;
                      const hrs = colonIdx > -1 ? line.slice(colonIdx + 1).trim() : '';
                      return (
                        <li
                          key={line}
                          className={`flex items-center justify-between gap-4 ${
                            isToday
                              ? 'text-amber-700 dark:text-amber-400 font-semibold'
                              : 'text-zinc-600 dark:text-zinc-400'
                          }`}
                        >
                          <span>{day}</span>
                          <span>{hrs}</span>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {isLoading
                      ? t.location.loadingListing
                      : 'Check live opening hours directly on our Google Maps listing.'}
                  </p>
                )}
              </div>
            </div>

            {/* Lahore Coverage Areas */}
            <div className="pt-5 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                {t.location.serviceAreasTitle}
              </p>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {STUDIO_ANCHOR.serviceAreas.join(' · ')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quiet Editorial Bottom Bar */}
      <div className="border-t border-zinc-200 dark:border-zinc-800/80">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-xs text-zinc-500 dark:text-zinc-400">
          <div className="space-y-1.5">
            <p className="font-display text-sm font-semibold text-zinc-950 dark:text-white">
              {studioName}
            </p>
            <p>
              © {new Date().getFullYear()} {studioName}. {t.location.rightsReserved}{' '}
              · {t.location.developerCredit}
            </p>
          </div>

          {/* Social Links */}
          <div className="flex flex-wrap items-center gap-5 font-medium text-zinc-600 dark:text-zinc-400">
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-950 dark:hover:text-white transition-colors"
            >
              Instagram
            </a>
            <a
              href="https://www.tiktok.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-950 dark:hover:text-white transition-colors"
            >
              TikTok
            </a>
            <a
              href="https://www.youtube.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-950 dark:hover:text-white transition-colors"
            >
              YouTube
            </a>
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-950 dark:hover:text-white transition-colors"
            >
              Facebook
            </a>
            <a
              href="https://maps.google.com/help/terms_maps/?utm_campaign=gmp_mcp_codeassist_v1_aistudio"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-950 dark:hover:text-white transition-colors"
            >
              Google Maps Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
