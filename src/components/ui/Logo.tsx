import React from 'react';

interface MonogramProps {
  size?: number;
  className?: string;
  strokeWidth?: number;
}

export const Monogram: React.FC<MonogramProps> = ({
  size = 20,
  className = '',
  strokeWidth = 6,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    className={className}
    role="img"
    aria-label="Samuel Bonneau"
  >
    <path d="M20 24 A6 8 0 1 0 14 32 A6 8 0 1 1 8 40" />
    <path d="M34 16 V48 M34 16 H45 A8 8 0 0 1 45 32 H34 M34 32 H47 A8 8 0 0 1 47 48 H34" />
  </svg>
);
