import { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';

const LAUNCH_DATE_KEY = 'foliogen_launch_target';
const OFFER_DAYS = 10;

function getTargetDate(): Date {
  const stored = localStorage.getItem(LAUNCH_DATE_KEY);
  if (stored) {
    return new Date(stored);
  }
  
  // Set target date to 10 days from now
  const target = new Date();
  target.setDate(target.getDate() + OFFER_DAYS);
  localStorage.setItem(LAUNCH_DATE_KEY, target.toISOString());
  return target;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

function calculateTimeLeft(targetDate: Date): TimeLeft {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();
  
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return { days, hours, minutes, seconds, expired: false };
}

export function LaunchTimer() {
  const [targetDate] = useState(() => getTargetDate());
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft.expired) {
    return null;
  }

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="mx-2 mb-3 px-3 py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg">
      <div className="flex items-center gap-2">
        <Zap className="h-4 w-4 animate-pulse" />
        <span className="text-xs font-semibold uppercase tracking-wide">Launch Offer</span>
      </div>
      <div className="mt-1 font-mono text-sm font-bold">
        {pad(timeLeft.days)}d {pad(timeLeft.hours)}h {pad(timeLeft.minutes)}m {pad(timeLeft.seconds)}s
      </div>
    </div>
  );
}
