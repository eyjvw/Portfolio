import React from 'react';

interface CatLogoProps {
  size?: number;
  className?: string;
}

/** White cat sitting with its back turned and its head tilted, like the profile photo. */
export const CatLogo: React.FC<CatLogoProps> = ({ size = 88, className = '' }) => (
  <svg
    width={size}
    height={size * 1.2}
    viewBox="0 0 100 120"
    fill="currentColor"
    className={className}
    role="img"
    aria-label="Chat blanc"
  >
    <g transform="rotate(-7 50 40)" stroke="currentColor" strokeWidth={4} strokeLinejoin="round">
      <path d="M34 27 L32.5 12 Q32.5 9 35 10.5 L46 19 Z" />
      <path d="M66 27 L67.5 12 Q67.5 9 65 10.5 L54 19 Z" />
      <ellipse cx="50" cy="32.5" rx="18.5" ry="15.5" stroke="none" />
    </g>
    <path d="M38 43 C29 53 21 71 21 91 C21 104 30 110 41 110 L59 110 C70 110 79 104 79 91 C79 71 71 53 62 43 Z" />
    <path
      className="cat-tail"
      d="M74 107 C90 110 98 100 95 88 C93 81 86 81 86 87"
      fill="none"
      stroke="currentColor"
      strokeWidth={7.5}
      strokeLinecap="round"
    />
  </svg>
);
