import { TimeLeft } from '../types';

// Target: January 1, 2026, 00:00:00 (Hanoi/Bangkok - UTC+7)
// In UTC, this corresponds to December 31, 2025 at 17:00:00
const TARGET_DATE = new Date(Date.UTC(2025, 11, 31, 17, 0, 0)).getTime();

export const calculateTimeLeft = (): TimeLeft | null => {
  const now = new Date().getTime();
  const difference = TARGET_DATE - now;

  if (difference <= 0) {
    return null;
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
};

export const formatNumber = (num: number): string => {
  return num.toString().padStart(2, '0');
};