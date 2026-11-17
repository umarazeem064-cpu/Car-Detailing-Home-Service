import React, { useState } from 'react';
import {
  Globe,
  Menu,
  MessageCircle,
  Moon,
  Sun,
  X,
} from 'lucide-react';
import {
  CURRENCIES,
  CurrencyCode,
  LanguageCode,
  TRANSLATIONS,
} from '../data/studioData';

interface NavbarProps {
  studioName: string;
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  currency: CurrencyCode;
  onCurrencyChange: (curr: CurrencyCode) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  whatsappUrl: string;
  onBookNowClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  studioName,
  language,
  onLanguageChange,
  currency,
  onCurrencyChange,
  isDark,
  onToggleTheme,
  whatsappUrl,
  onBookNowClick,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = TRANSLATIONS[language];

  const navItems = [
    { href: '#home', label: t.nav.home },
    { href: '#gallery', label: t.nav.gallery },
    { href: '#packages', label: t.nav.pricing },
    { href: '#credentials', label: t.nav.services },
    { href: '#reviews', label: t.nav.reviews },
    { href: '#contact', label: t.nav.contact },
  ];

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 lg:gap-8">
        {/* Zone 1: Clean single-line brand wordmark */}
        <a
          href="#home"
          className="flex items-center gap-2.5 text-zinc-950 dark:text-white whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-sm"
        >
          <svg
            viewBox="0 0 32 32"
            className="w-7 h-7 text-amber-600 dark:text-amber-500 shrink-0"
            fill="none"
            aria-hidden="true"
          >
            <polygon
              points="16,2 28,9 28,23 16,30 4,23 4,9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <polygon
              points="16,8 23,12 23,20 16,24 9,20 9,12"
              fill="currentColor"
              fillOpacity="0.16"
              stroke="currentColor"
              strokeWidth="1.25"
            />
          </svg>
          <span className="font-display text-base sm:text-lg font-semibold tracking-tight truncate max-w-[180px] sm:max-w-[230px]">
            {studioName}
          </span>
        </a>

        {/* Zone 2: Clean single-line navigation links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden xl:flex items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-300"
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative py-1 whitespace-nowrap shrink-0 hover:text-zinc-950 dark:hover:text-white transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-amber-600 dark:after:bg-amber-400 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-sm"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Compact interactive controls & primary CTA */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Currency Switcher */}
          <label className="hidden md:flex items-center">
            <span className="sr-only">Currency</span>
            <select
              aria-label="Select Currency"
              value={currency}
              onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
              className="h-9 px-2.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs font-mono font-medium text-zinc-800 dark:text-zinc-200 hover:border-zinc-400 dark:hover:border-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 cursor-pointer transition-colors"
            >
              {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
                <option key={code} value={code}>
                  {CURRENCIES[code].label}
                </option>
              ))}
            </select>
          </label>

          {/* Language Switcher */}
          <label className="hidden md:flex items-center relative">
            <span className="sr-only">Language</span>
            <Globe
              className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400 absolute start-2.5 pointer-events-none"
              aria-hidden="true"
            />
            <select
              aria-label="Select Language"
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
              className="h-9 ps-7 pe-2.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:border-zinc-400 dark:hover:border-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 cursor-pointer transition-colors"
            >
              <option value="en">EN</option>
              <option value="ur">اردو</option>
              <option value="ar">العربية</option>
              <option value="es">ES</option>
            </select>
          </label>

          {/* Dark / Light Theme Toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="w-10 h-10 sm:w-9 sm:h-9 inline-flex items-center justify-center rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 hover:text-amber-600 dark:hover:text-amber-400 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 cursor-pointer shrink-0"
          >
            {isDark ? (
              <Sun className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Moon className="w-4 h-4" aria-hidden="true" />
            )}
          </button>

          {/* Direct WhatsApp Quick Chat */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.nav.whatsapp}
            title={t.nav.whatsapp}
            className="hidden sm:inline-flex items-center justify-center w-9 h-9 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-emerald-700 dark:text-emerald-400 hover:border-emerald-500/60 hover:bg-emerald-500/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 shrink-0"
          >
            <MessageCircle className="w-4 h-4" aria-hidden="true" />
          </a>

          {/* Primary Book Now CTA */}
          <button
            type="button"
            onClick={onBookNowClick}
            className="h-10 sm:h-9 px-4 rounded-md bg-zinc-950 text-white dark:bg-amber-500 dark:text-zinc-950 text-xs sm:text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-amber-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950"
          >
            {t.nav.bookNow}
          </button>

          {/* Mobile Drawer Trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
            className="xl:hidden w-10 h-10 inline-flex items-center justify-center rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer shrink-0"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation & Controls Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 sm:px-6 py-5 space-y-5">
          <nav className="grid grid-cols-2 gap-2" aria-label="Mobile Navigation">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={handleNavClick}
                className="px-3 py-2.5 rounded-md text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-zinc-200 dark:border-zinc-800">
            <div>
              <label className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1.5">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
                className="w-full h-11 px-3 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-sm font-mono text-zinc-900 dark:text-zinc-100"
              >
                {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
                  <option key={code} value={code}>
                    {CURRENCIES[code].label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1.5">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
                className="w-full h-11 px-3 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-sm text-zinc-900 dark:text-zinc-100"
              >
                <option value="en">English</option>
                <option value="ur">اردو</option>
                <option value="ar">العربية</option>
                <option value="es">Español</option>
              </select>
            </div>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-md border border-emerald-600/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-sm font-medium"
          >
            <MessageCircle className="w-4 h-4" aria-hidden="true" />
            <span>{t.hero.whatsappCta}</span>
          </a>
        </div>
      )}
    </header>
  );
};
