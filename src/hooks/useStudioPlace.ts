import { useCallback, useEffect, useRef, useState } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { STUDIO_ANCHOR } from '../data/studioData';

export interface LivePlaceReview {
  authorName: string;
  authorUri: string | null;
  authorPhotoUri: string | null;
  rating: number;
  relativeTime: string;
  text: string;
}

export interface LiveStudioPlace {
  placeId: string | null;
  displayName: string;
  formattedAddress: string | null;
  location: { lat: number; lng: number };
  rating: number | null;
  userRatingCount: number | null;
  nationalPhoneNumber: string | null;
  internationalPhoneNumber: string | null;
  whatsappDigits: string | null;
  weekdayDescriptions: string[];
  isOpenNow: boolean | null;
  googleMapsUri: string;
  businessStatus: string | null;
  reviews: LivePlaceReview[];
}

export interface UseStudioPlaceResult {
  place: LiveStudioPlace | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

function isQuotaError(err: unknown): boolean {
  const message =
    err instanceof Error
      ? err.message
      : typeof err === 'object' && err !== null
        ? JSON.stringify(err)
        : String(err);
  const upper = message.toUpperCase();
  return (
    upper.includes('OVER_QUERY_LIMIT') ||
    upper.includes('RESOURCE_EXHAUSTED') ||
    upper.includes('OVERQUOTAMAPERROR') ||
    upper.includes('QUOTA') ||
    upper.includes('429')
  );
}

function extractWhatsappDigits(
  internationalPhone?: string | null,
  nationalPhone?: string | null
): string | null {
  if (internationalPhone) {
    const cleaned = internationalPhone.replace(/[^\d]/g, '');
    if (cleaned.length >= 10) return cleaned;
  }
  if (nationalPhone) {
    const digits = nationalPhone.replace(/[^\d]/g, '');
    if (digits.startsWith('0') && digits.length >= 10) {
      return `92${digits.slice(1)}`;
    }
    if (digits.length >= 10) return digits;
  }
  return null;
}

function haversineMeters(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const h =
    sinDLat * sinDLat +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinDLng * sinDLng;
  return 2 * R * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

export function useStudioPlace(hasApiKey: boolean): UseStudioPlaceResult {
  const placesLib = useMapsLibrary('places');
  const [place, setPlace] = useState<LiveStudioPlace | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(hasApiKey);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);
  const fetchedRef = useRef(false);

  const refresh = useCallback(() => {
    fetchedRef.current = false;
    setReloadToken((n) => n + 1);
  }, []);

  useEffect(() => {
    if (!hasApiKey) {
      setIsLoading(false);
      return;
    }
    if (!placesLib) {
      return;
    }
    if (fetchedRef.current && reloadToken === 0) {
      return;
    }

    let cancelled = false;

    async function loadStudioDetails() {
      if (!placesLib) return;
      setIsLoading(true);
      setError(null);

      try {
        // Step 1: Search by exact business name anchored to the resolved Google Maps coordinates
        const searchRequest: google.maps.places.SearchByTextRequest = {
          textQuery: STUDIO_ANCHOR.searchQuery,
          fields: ['id', 'displayName', 'location'],
          locationBias: STUDIO_ANCHOR.coordinates,
          maxResultCount: 5,
          region: 'pk',
          language: 'en',
        };

        const searchResult = await placesLib.Place.searchByText(searchRequest);
        const candidates = searchResult?.places ?? [];

        if (cancelled) return;

        if (candidates.length === 0) {
          setPlace(null);
          setIsLoading(false);
          return;
        }

        // Pick closest matching listing to the exact Google Maps pin coordinates
        const sorted = [...candidates].sort((a, b) => {
          const aNameMatch = (a.displayName || '')
            .toLowerCase()
            .includes('car detailing home service')
            ? -2000
            : 0;
          const bNameMatch = (b.displayName || '')
            .toLowerCase()
            .includes('car detailing home service')
            ? -2000
            : 0;

          const aLoc = a.location
            ? { lat: a.location.lat(), lng: a.location.lng() }
            : STUDIO_ANCHOR.coordinates;
          const bLoc = b.location
            ? { lat: b.location.lat(), lng: b.location.lng() }
            : STUDIO_ANCHOR.coordinates;

          const distA = haversineMeters(aLoc, STUDIO_ANCHOR.coordinates) + aNameMatch;
          const distB = haversineMeters(bLoc, STUDIO_ANCHOR.coordinates) + bNameMatch;
          return distA - distB;
        });

        const matchedPlace = sorted[0];

        // Step 2: Fetch full contact, hours, rating, and live Google reviews via Places API (New)
        await matchedPlace.fetchFields({
          fields: [
            'displayName',
            'formattedAddress',
            'location',
            'rating',
            'userRatingCount',
            'nationalPhoneNumber',
            'internationalPhoneNumber',
            'regularOpeningHours',
            'googleMapsURI',
            'businessStatus',
            'reviews',
          ],
        });

        if (cancelled) return;

        let openNow: boolean | null = null;
        try {
          const openStatus = await matchedPlace.isOpen();
          if (typeof openStatus === 'boolean') {
            openNow = openStatus;
          }
        } catch {
          // Optional helper; ignore if hours are unavailable
        }

        if (cancelled) return;

        const loc = matchedPlace.location
          ? {
              lat: matchedPlace.location.lat(),
              lng: matchedPlace.location.lng(),
            }
          : STUDIO_ANCHOR.coordinates;

        const rawReviews = matchedPlace.reviews ?? [];
        const liveReviews: LivePlaceReview[] = rawReviews
          .filter((rev) => rev && (rev.text || rev.rating))
          .map((rev) => ({
            authorName: rev.authorAttribution?.displayName || 'Google Reviewer',
            authorUri: rev.authorAttribution?.uri || null,
            authorPhotoUri: rev.authorAttribution?.photoURI || null,
            rating: rev.rating ?? 5,
            relativeTime: rev.relativePublishTimeDescription || '',
            text: rev.text || '',
          }));

        fetchedRef.current = true;
        setPlace({
          placeId: matchedPlace.id || null,
          displayName: matchedPlace.displayName || STUDIO_ANCHOR.fallbackName,
          formattedAddress: matchedPlace.formattedAddress || null,
          location: loc,
          rating: typeof matchedPlace.rating === 'number' ? matchedPlace.rating : null,
          userRatingCount:
            typeof matchedPlace.userRatingCount === 'number'
              ? matchedPlace.userRatingCount
              : null,
          nationalPhoneNumber: matchedPlace.nationalPhoneNumber || null,
          internationalPhoneNumber: matchedPlace.internationalPhoneNumber || null,
          whatsappDigits: extractWhatsappDigits(
            matchedPlace.internationalPhoneNumber,
            matchedPlace.nationalPhoneNumber
          ),
          weekdayDescriptions:
            matchedPlace.regularOpeningHours?.weekdayDescriptions ?? [],
          isOpenNow: openNow,
          googleMapsUri:
            matchedPlace.googleMapsURI || STUDIO_ANCHOR.mapsShortUrl,
          businessStatus: matchedPlace.businessStatus || null,
          reviews: liveReviews,
        });
      } catch (err) {
        if (cancelled) return;
        if (isQuotaError(err)) {
          window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        }
        setError(
          err instanceof Error
            ? err.message
            : 'Unable to sync live Google Maps listing.'
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadStudioDetails();

    return () => {
      cancelled = true;
    };
  }, [placesLib, hasApiKey, reloadToken]);

  return { place, isLoading, error, refresh };
}
