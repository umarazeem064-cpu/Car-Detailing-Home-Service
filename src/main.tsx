import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Tier 1 Google Maps Platform quota & authentication failure detection
(window as unknown as { gm_authFailure?: () => void }).gm_authFailure = () => {
  window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
};

const origConsoleError = console.error;
console.error = (...args: unknown[]) => {
  origConsoleError.apply(console, args);
  const message = args.map((a) => String(a)).join(' ');
  if (
    message.includes('OverQuotaMapError') ||
    message.includes('QuotaExceededError')
  ) {
    window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
  }
};

createRoot(document.getElementById('root')!).render(<App />);
