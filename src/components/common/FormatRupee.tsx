import React from 'react';

interface FormatRupeeProps {
  amount: number;
  compact?: boolean;
  showSign?: boolean;
  className?: string;
}

export function formatINR(value: number, compact = false): string {
  const isNegative = value < 0;
  const absValue = Math.abs(value);

  if (compact) {
    if (absValue >= 10000000) {
      return `${isNegative ? '-' : ''}₹${(absValue / 10000000).toFixed(2)} Cr`;
    }
    if (absValue >= 100000) {
      return `${isNegative ? '-' : ''}₹${(absValue / 100000).toFixed(2)} L`;
    }
    if (absValue >= 1000) {
      return `${isNegative ? '-' : ''}₹${(absValue / 1000).toFixed(1)}k`;
    }
  }

  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(absValue);

  return `${isNegative ? '-' : ''}₹${formatted}`;
}

export const FormatRupee: React.FC<FormatRupeeProps> = ({
  amount,
  compact = false,
  showSign = false,
  className = '',
}) => {
  const formatted = formatINR(amount, compact);
  const signPrefix = showSign && amount > 0 ? '+' : '';

  return (
    <span className={`tabular-nums font-mono ${className}`}>
      {signPrefix}
      {formatted}
    </span>
  );
};
