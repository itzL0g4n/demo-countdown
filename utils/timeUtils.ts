import { TimeLeft } from '../types';

// UTC+7 (Hanoi/Bangkok)
const TARGET_OFFSET = 7 * 60 * 60 * 1000; 

// TEST MODE: Set target to 12 seconds from now to test the end state immediately.
const TARGET_DATE = new Date().getTime() + 12000; 

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