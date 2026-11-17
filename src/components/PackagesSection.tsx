import React from 'react';
import { ArrowRight, Check, Clock } from 'lucide-react';
import {
  CURRENCIES,
  CurrencyCode,
  formatPackagePrice,
  LanguageCode,
  SERVICE_PACKAGES,
  TRANSLATIONS,
  VEHICLE_MULTIPLIERS,
  VehicleClass,
} from '../data/studioData';
import { ResilientImage } from './ResilientImage';

interface PackagesSectionProps {
  language: LanguageCode;
  currency: CurrencyCode;
  onCurrencyChange: (c: CurrencyCode) => void;
  vehicleClass: VehicleClass;
  onVehicleClassChange: (v: VehicleClass) => void;
  selectedPackageId: string;
  onSelectPackage: (packageId: string) => void;
}

export const PackagesSection: React.FC<PackagesSectionProps> = ({
  language,
  currency,
  onCurrencyChange,
  vehicleClass,
  onVehicleClassChange,
  selectedPackageId,
  onSelectPackage,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <section
      id="packages"
      className="py-20 lg:py-28 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-950/60 transition-colors"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header + Controls */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-medium tracking-wide text-amber-700 dark:text-amber-400">
              {t.packages.kicker}
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-950 dark:text-white">
              {t.packages.title}
            </h2>
            <p className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {t.packages.subtitle}
            </p>
          </div>

          {/* Interactive Vehicle Class & Currency Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
            <div
              role="group"
              aria-label={t.packages.vehicleSizeLabel}
              className="flex items-center gap-1 p-1 rounded-lg bg-zinc-200/70 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
            >
              {(['sedan', 'suv', 'luxury'] as VehicleClass[]).map((vClass) => {
                const active = vehicleClass === vClass;
                return (
                  <button
                    key={vClass}
                    type="button"
                    onClick={() => onVehicleClassChange(vClass)}
                    className={`h-9 px-3 rounded-md text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                      active
                        ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-xs'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                    }`}
                  >
                    {t.packages.vehicleClasses[vClass]}
                  </button>
                );
              })}
            </div>

            <div
              role="group"
              aria-label="Currency selector"
              className="flex items-center gap-1 p-1 rounded-lg bg-zinc-200/70 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
            >
              {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => {
                const active = currency === code;
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => onCurrencyChange(code)}
                    className={`h-9 px-2.5 rounded-md text-xs font-mono font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                      active
                        ? 'bg-zinc-950 text-white dark:bg-amber-500 dark:text-zinc-950'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                    }`}
                  >
                    {code}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Active Vehicle Example Hint */}
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-8 font-mono">
          {t.packages.vehicleClasses[vehicleClass]} · {VEHICLE_MULTIPLIERS[vehicleClass].example} · {CURRENCIES[currency].label}
        </p>

        {/* 3 Packages Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {SERVICE_PACKAGES.map((pkg) => {
            const isSelected = selectedPackageId === pkg.id;
            const formattedPrice = formatPackagePrice(
              pkg.baseUsd,
              currency,
              vehicleClass
            );

            return (
              <article
                key={pkg.id}
                className={`flex flex-col rounded-xl overflow-hidden border transition-colors ${
                  pkg.featured
                    ? 'border-amber-500/70 dark:border-amber-500/60 bg-white dark:bg-zinc-900'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60'
                }`}
              >
                {/* Crisp 4:3 Image Header */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-900">
                  <ResilientImage
                    src={pkg.image}
                    alt={pkg.imageAlt}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/75 via-zinc-950/20 to-transparent" />
                  <div className="absolute bottom-3.5 inset-x-5 flex items-center justify-between text-xs text-zinc-200">
                    <span className="font-mono font-medium">
                      {pkg.number} {pkg.featured ? `· ${t.packages.featuredLabel}` : ''}
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-mono text-zinc-200">
                      <Clock className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
                      {pkg.duration[language]}
                    </span>
                  </div>
                </div>

                {/* Package Content */}
                <div className="flex flex-col flex-1 p-6 sm:p-7">
                  <div className="space-y-2.5 pb-6 border-b border-zinc-200/80 dark:border-zinc-800">
                    <h3 className="text-xl font-semibold tracking-tight text-zinc-950 dark:text-white leading-snug">
                      {pkg.name[language]}
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {pkg.subtitle[language]}
                    </p>
                  </div>

                  {/* Dynamic Multi-Currency Price */}
                  <div className="py-5 flex items-baseline justify-between gap-4 border-b border-zinc-200/80 dark:border-zinc-800">
                    <div>
                      <span className="font-mono text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-950 dark:text-white tabular-nums">
                        {formattedPrice}
                      </span>
                      <span className="ms-2 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                        {currency}
                      </span>
                    </div>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      {t.packages.estimatedTime}: {pkg.duration[language]}
                    </span>
                  </div>

                  {/* Feature Inclusions */}
                  <ul className="py-6 space-y-3 flex-1 text-sm text-zinc-700 dark:text-zinc-300">
                    {pkg.features[language].map((feature, index) => (
                      <li key={index} className="flex items-start gap-2.5 leading-relaxed">
                        <Check
                          className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Select Package CTA */}
                  <button
                    type="button"
                    onClick={() => onSelectPackage(pkg.id)}
                    className={`w-full h-11 px-4 rounded-lg text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                      pkg.featured
                        ? 'bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-amber-500 dark:text-zinc-950 dark:hover:bg-amber-400'
                        : isSelected
                          ? 'bg-amber-600 text-white dark:bg-amber-500/20 dark:text-amber-300 border border-amber-500/60'
                          : 'bg-zinc-100 text-zinc-950 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700'
                    }`}
                  >
                    <span>
                      {isSelected ? t.packages.selectedPackage : t.packages.selectPackage}
                    </span>
                    <ArrowRight className="w-4 h-4 rtl:rotate-180" aria-hidden="true" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
