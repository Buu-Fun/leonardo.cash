import { getUnixTime } from 'date-fns';
import { ethers } from 'ethers';

// Formatting numbers
interface FormatOptions {
  value?: number | string;
  decimalsOffset?: number;
  minDecimals?: number;
  maxDecimals?: number;
}

export function format({
  value,
  decimalsOffset = 0,
  minDecimals = 2,
  maxDecimals = 4,
}: FormatOptions): string {
  if (value === undefined) {
    return '';
  }
  let innerValue = value.toString();
  if (decimalsOffset) {
    innerValue = ethers.formatUnits(innerValue, decimalsOffset);
  }
  return Number.parseFloat(innerValue).toLocaleString('en-US', {
    minimumFractionDigits: minDecimals,
    maximumFractionDigits: maxDecimals,
  });
}

export function timeDifference(date: number) {
  if (!date) return 'Never';
  const now = new Date();
  const diffInSeconds = Math.floor(getUnixTime(now) - date);
  const isFuture = diffInSeconds < 0;
  const absDiffInSeconds = Math.abs(diffInSeconds);

  const minute = 60;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;

  const suffix = isFuture ? 'to go' : 'ago';

  if (absDiffInSeconds < minute) {
    return `less than 1 min ${suffix}`;
  }
  if (absDiffInSeconds < hour) {
    const minutes = Math.floor(absDiffInSeconds / minute);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ${suffix}`;
  }
  if (absDiffInSeconds < day) {
    const hours = Math.floor(absDiffInSeconds / hour);
    return `${hours} hour${hours > 1 ? 's' : ''} ${suffix}`;
  }
  if (absDiffInSeconds < week) {
    const days = Math.floor(absDiffInSeconds / day);
    return `${days} day${days > 1 ? 's' : ''} ${suffix}`;
  }

  const weeks = Math.floor(absDiffInSeconds / week);
  return `${weeks} week${weeks > 1 ? 's' : ''} ${suffix}`;
}

export const tokenArgValue = (name: string, symbol: any) => {
  return `${name} (${symbol})`;
};

export const prettyAmount = (amount: number) => {
  if (amount < 1000) {
    return amount;
  }
  if (amount < 1000000) {
    return `${(amount / 1000).toFixed(2)}K`;
  }
  return `${(amount / 1000000).toFixed(2)}M`;
};

export const truncateAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};
