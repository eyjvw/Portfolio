import React from 'react';

/** Shown while an app's code chunk loads (first open only). */
export const AppSpinner: React.FC = () => (
  <div className="flex-1 flex items-center justify-center">
    <div className="w-5 h-5 rounded-full border-2 border-current border-t-transparent opacity-40 animate-spin" />
  </div>
);
