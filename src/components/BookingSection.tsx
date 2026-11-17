import React, { useMemo, useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  MapPin,
  MessageCircle,
  Phone,
  X,
} from 'lucide-react';
import {
  CurrencyCode,
  formatPackagePrice,
  LanguageCode,
  SERVICE_PACKAGES,
  STUDIO_ANCHOR,
  TRANSLATIONS,
  VehicleClass,
} from '../data/studioData';
import { LiveStudioPlace } from '../hooks/useStudioPlace';

interface BookingSectionProps {
  language: LanguageCode;
  currency: CurrencyCode;
  vehicleClass: VehicleClass;
  selectedPackageId: string;
  onSelectPackageId: (id: string) => void;
  place: LiveStudioPlace | null;
  whatsappBaseUrl: string;
}

interface BookingReceipt {
  reference: string;
  fullName: string;
  phone: string;
  whatsapp: string;
  vehicle: string;
  packageName: string;
  estimatedPrice: string;
  serviceMode: 'home' | 'studio';
  date: string;
  time: string;
  notes: string;
}

const TIME_SLOTS = [
  '09:00 AM',
  '11:00 AM',
  '01:30 PM',
  '04:00 PM',
  '06:30 PM',
];

function getTodayIsoDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function buildIcsCalendarFile(receipt: BookingReceipt, studioName: string, location: string): string {
  const datePart = receipt.date.replace(/-/g, '');
  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Car Detailing Home Service//Booking//EN',
    'BEGIN:VEVENT',
    `UID:${receipt.reference}@cardetailinghomeservice`,
    `DTSTART;VALUE=DATE:${datePart}`,
    `SUMMARY:${studioName} — ${receipt.packageName}`,
    `DESCRIPTION:Ref: ${receipt.reference} | Vehicle: ${receipt.vehicle} | Time: ${receipt.time} | Est: ${receipt.estimatedPrice}`,
    `LOCATION:${location}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return icsLines.join('\r\n');
}

export const BookingSection: React.FC<BookingSectionProps> = ({
  language,
  currency,
  vehicleClass,
  selectedPackageId,
  onSelectPackageId,
  place,
  whatsappBaseUrl,
}) => {
  const t = TRANSLATIONS[language];
  const minDate = useMemo(() => getTodayIsoDate(), []);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [sameAsPhone, setSameAsPhone] = useState(true);
  const [vehicle, setVehicle] = useState('');
  const [serviceMode, setServiceMode] = useState<'home' | 'studio'>('home');
  const [date, setDate] = useState(minDate);
  const [time, setTime] = useState(TIME_SLOTS[1]);
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<BookingReceipt | null>(null);

  const selectedPkg =
    SERVICE_PACKAGES.find((p) => p.id === selectedPackageId) ||
    SERVICE_PACKAGES[2];

  const livePrice = formatPackagePrice(
    selectedPkg.baseUsd,
    currency,
    vehicleClass
  );

  const studioName = place?.displayName || STUDIO_ANCHOR.fallbackName;
  const studioAddress =
    place?.formattedAddress || `${STUDIO_ANCHOR.city}, ${STUDIO_ANCHOR.country}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const trimmedName = fullName.trim();
    const trimmedPhone = phone.trim();
    const effectiveWhatsapp = (sameAsPhone ? trimmedPhone : whatsapp.trim());
    const trimmedVehicle = vehicle.trim();

    if (trimmedName.length < 2) {
      setFormError('Please enter your full name.');
      return;
    }
    const phoneDigits = trimmedPhone.replace(/[^\d]/g, '');
    if (phoneDigits.length < 9) {
      setFormError('Please enter a valid phone number (at least 9 digits).');
      return;
    }
    if (trimmedVehicle.length < 3) {
      setFormError('Please include your vehicle make, model, and year.');
      return;
    }
    if (!date) {
      setFormError('Please select a preferred appointment date.');
      return;
    }

    const randCode = Math.floor(1000 + Math.random() * 9000);
    const refId = `CDHS-${date.replace(/-/g, '').slice(2)}-${randCode}`;

    setReceipt({
      reference: refId,
      fullName: trimmedName,
      phone: trimmedPhone,
      whatsapp: effectiveWhatsapp || trimmedPhone,
      vehicle: trimmedVehicle,
      packageName: selectedPkg.name[language],
      estimatedPrice: `${livePrice} ${currency}`,
      serviceMode,
      date,
      time,
      notes: notes.trim(),
    });
  };

  const handleDownloadCalendar = () => {
    if (!receipt) return;
    const icsContent = buildIcsCalendarFile(receipt, studioName, studioAddress);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${receipt.reference}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const buildWhatsappDispatchUrl = (rec: BookingReceipt) => {
    const modeLabel =
      rec.serviceMode === 'home' ? t.booking.homeService : t.booking.studioDropoff;
    const msg = [
      `Hello ${studioName}! I would like to confirm my detailing booking:`,
      `• Ref: ${rec.reference}`,
      `• Name: ${rec.fullName}`,
      `• Vehicle: ${rec.vehicle}`,
      `• Package: ${rec.packageName} (${rec.estimatedPrice})`,
      `• Mode: ${modeLabel}`,
      `• Date & Time: ${rec.date} at ${rec.time}`,
      rec.notes ? `• Notes: ${rec.notes}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    const separator = whatsappBaseUrl.includes('?') ? '&' : '?';
    return `${whatsappBaseUrl}${separator}text=${encodeURIComponent(msg)}`;
  };

  return (
    <section
      id="booking"
      className="py-20 lg:py-28 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 transition-colors"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Summary & Live Concierge Column */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <p className="text-xs font-medium tracking-wide text-amber-700 dark:text-amber-400">
                {t.booking.kicker}
              </p>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-950 dark:text-white">
                {t.booking.title}
              </h2>
              <p className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {t.booking.subtitle}
              </p>
            </div>

            {/* Selected Package Summary */}
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/70 p-6 space-y-4">
              <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                <span>{t.booking.packageLabel}</span>
                <span className="font-mono">{selectedPkg.duration[language]}</span>
              </div>
              <p className="text-lg font-semibold text-zinc-950 dark:text-white">
                {selectedPkg.name[language]}
              </p>
              <div className="flex items-baseline justify-between pt-3 border-t border-zinc-200 dark:border-zinc-800">
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {t.packages.vehicleClasses[vehicleClass]}
                </span>
                <span className="font-mono text-2xl font-semibold text-amber-700 dark:text-amber-400 tabular-nums">
                  {livePrice}{' '}
                  <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400">
                    {currency}
                  </span>
                </span>
              </div>
            </div>

            {/* Direct Verified Contact Details */}
            <div className="space-y-4 pt-2 text-sm">
              <div className="flex items-start gap-3 text-zinc-700 dark:text-zinc-300">
                <MapPin
                  className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-1"
                  aria-hidden="true"
                />
                <span>{studioAddress}</span>
              </div>
              {(place?.internationalPhoneNumber || place?.nationalPhoneNumber) && (
                <div className="flex items-center gap-3 text-zinc-700 dark:text-zinc-300">
                  <Phone
                    className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0"
                    aria-hidden="true"
                  />
                  <a
                    href={`tel:${(
                      place.internationalPhoneNumber ||
                      place.nationalPhoneNumber ||
                      ''
                    ).replace(/\s+/g, '')}`}
                    className="font-mono hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                  >
                    {place.internationalPhoneNumber || place.nationalPhoneNumber}
                  </a>
                </div>
              )}
              {place?.weekdayDescriptions && place.weekdayDescriptions.length > 0 && (
                <div className="flex items-start gap-3 text-zinc-600 dark:text-zinc-400">
                  <Clock
                    className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-1"
                    aria-hidden="true"
                  />
                  <span>{place.weekdayDescriptions[0]}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Interactive Booking Form */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              noValidate
              className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/50 p-6 sm:p-8 space-y-6"
            >
              {formError && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-300 dark:border-red-900/60 bg-red-50 dark:bg-red-950/50 px-4 py-3 text-sm text-red-800 dark:text-red-300"
                >
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="booking-name"
                    className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    {t.booking.fullName} *
                  </label>
                  <input
                    id="booking-name"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={t.booking.fullNamePlaceholder}
                    className="w-full h-11 px-3.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-sm text-zinc-950 dark:text-white placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                  />
                </div>

                {/* Vehicle Make, Model, Year */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="booking-vehicle"
                    className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    {t.booking.vehicle} *
                  </label>
                  <input
                    id="booking-vehicle"
                    type="text"
                    required
                    value={vehicle}
                    onChange={(e) => setVehicle(e.target.value)}
                    placeholder={t.booking.vehiclePlaceholder}
                    className="w-full h-11 px-3.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-sm text-zinc-950 dark:text-white placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Phone Number */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="booking-phone"
                    className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    {t.booking.phone} *
                  </label>
                  <input
                    id="booking-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t.booking.phonePlaceholder}
                    className="w-full h-11 px-3.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-sm font-mono text-zinc-950 dark:text-white placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                  />
                </div>

                {/* WhatsApp Number */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <label
                      htmlFor="booking-whatsapp"
                      className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
                    >
                      {t.booking.whatsapp}
                    </label>
                    <label className="inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sameAsPhone}
                        onChange={(e) => setSameAsPhone(e.target.checked)}
                        className="rounded border-zinc-400 accent-amber-500"
                      />
                      <span>{t.booking.sameAsPhone}</span>
                    </label>
                  </div>
                  <input
                    id="booking-whatsapp"
                    type="tel"
                    disabled={sameAsPhone}
                    value={sameAsPhone ? phone : whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder={t.booking.phonePlaceholder}
                    className="w-full h-11 px-3.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-sm font-mono text-zinc-950 dark:text-white placeholder:text-zinc-400 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                  />
                </div>
              </div>

              {/* Service Package Dropdown */}
              <div className="space-y-1.5">
                <label
                  htmlFor="booking-package"
                  className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
                >
                  {t.booking.packageLabel} *
                </label>
                <select
                  id="booking-package"
                  value={selectedPackageId}
                  onChange={(e) => onSelectPackageId(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-sm text-zinc-950 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 cursor-pointer"
                >
                  {SERVICE_PACKAGES.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.number}. {pkg.name[language]} —{' '}
                      {formatPackagePrice(pkg.baseUsd, currency, vehicleClass)}{' '}
                      ({pkg.duration[language]})
                    </option>
                  ))}
                </select>
              </div>

              {/* Service Location Mode */}
              <div className="space-y-1.5">
                <span className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  {t.booking.serviceModeLabel}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setServiceMode('home')}
                    className={`h-11 px-4 rounded-lg border text-sm font-medium transition-colors cursor-pointer ${
                      serviceMode === 'home'
                        ? 'border-amber-500 bg-amber-500/10 text-amber-800 dark:text-amber-300'
                        : 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    {t.booking.homeService}
                  </button>
                  <button
                    type="button"
                    onClick={() => setServiceMode('studio')}
                    className={`h-11 px-4 rounded-lg border text-sm font-medium transition-colors cursor-pointer ${
                      serviceMode === 'studio'
                        ? 'border-amber-500 bg-amber-500/10 text-amber-800 dark:text-amber-300'
                        : 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    {t.booking.studioDropoff}
                  </button>
                </div>
              </div>

              {/* Date & Time Picker */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label
                    htmlFor="booking-date"
                    className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    {t.booking.preferredDate} *
                  </label>
                  <div className="relative">
                    <Calendar
                      className="w-4 h-4 text-zinc-400 absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                      aria-hidden="true"
                    />
                    <input
                      id="booking-date"
                      type="date"
                      min={minDate}
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full h-11 ps-10 pe-3.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-sm font-mono text-zinc-950 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="booking-time"
                    className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    {t.booking.preferredTime} *
                  </label>
                  <select
                    id="booking-time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-sm font-mono text-zinc-950 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 cursor-pointer"
                  >
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Optional Notes */}
              <div className="space-y-1.5">
                <label
                  htmlFor="booking-notes"
                  className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
                >
                  {t.booking.notes}
                </label>
                <textarea
                  id="booking-notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t.booking.notesPlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-sm text-zinc-950 dark:text-white placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full h-12 px-6 rounded-lg bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-amber-500 dark:text-zinc-950 dark:hover:bg-amber-400 text-sm font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                {t.booking.submitCta}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Instant Confirmation Modal */}
      {receipt && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-confirmed-heading"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/75 backdrop-blur-xs"
        >
          <div className="relative w-full max-w-lg rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-2xl space-y-6">
            <button
              type="button"
              onClick={() => setReceipt(null)}
              aria-label={t.booking.closeModal}
              className="absolute top-4 end-4 w-9 h-9 inline-flex items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>

            <div className="space-y-2">
              <div className="w-11 h-11 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3
                id="booking-confirmed-heading"
                className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white"
              >
                {t.booking.modalTitle}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {t.booking.modalSubtitle}
              </p>
            </div>

            {/* Structured Receipt Details */}
            <dl className="divide-y divide-zinc-200 dark:divide-zinc-800 border-y border-zinc-200 dark:border-zinc-800 text-sm">
              <div className="py-2.5 flex items-center justify-between gap-4">
                <dt className="text-zinc-500 dark:text-zinc-400">
                  {t.booking.referenceId}
                </dt>
                <dd className="font-mono font-semibold text-amber-700 dark:text-amber-400">
                  {receipt.reference}
                </dd>
              </div>
              <div className="py-2.5 flex items-center justify-between gap-4">
                <dt className="text-zinc-500 dark:text-zinc-400">
                  {t.booking.fullName}
                </dt>
                <dd className="font-medium text-zinc-950 dark:text-white">
                  {receipt.fullName}
                </dd>
              </div>
              <div className="py-2.5 flex items-center justify-between gap-4">
                <dt className="text-zinc-500 dark:text-zinc-400">
                  {t.booking.vehicle}
                </dt>
                <dd className="font-medium text-zinc-950 dark:text-white">
                  {receipt.vehicle}
                </dd>
              </div>
              <div className="py-2.5 flex items-center justify-between gap-4">
                <dt className="text-zinc-500 dark:text-zinc-400">
                  {t.booking.packageLabel}
                </dt>
                <dd className="font-medium text-zinc-950 dark:text-white text-end">
                  {receipt.packageName}
                </dd>
              </div>
              <div className="py-2.5 flex items-center justify-between gap-4">
                <dt className="text-zinc-500 dark:text-zinc-400">
                  {t.booking.preferredDate}
                </dt>
                <dd className="font-mono text-zinc-950 dark:text-white">
                  {receipt.date} · {receipt.time}
                </dd>
              </div>
              <div className="py-2.5 flex items-center justify-between gap-4">
                <dt className="text-zinc-500 dark:text-zinc-400">Estimate</dt>
                <dd className="font-mono font-semibold text-zinc-950 dark:text-white tabular-nums">
                  {receipt.estimatedPrice}
                </dd>
              </div>
            </dl>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={buildWhatsappDispatchUrl(receipt)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 h-11 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                <span>{t.booking.confirmWhatsapp}</span>
              </a>
              <button
                type="button"
                onClick={handleDownloadCalendar}
                className="h-11 px-4 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-sm font-medium inline-flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Download className="w-4 h-4" aria-hidden="true" />
                <span>{t.booking.downloadCalendar}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
