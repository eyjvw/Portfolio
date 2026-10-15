import React from 'react';
import { useDesktop } from '../../context/DesktopContext';

export const Wallpaper: React.FC = () => {
  const { wallpaper } = useDesktop();

  return (
    <div
      className="fixed inset-0 pointer-events-none transition-all duration-700 ease-out z-0 overflow-hidden"
      style={{ background: wallpaper.cssBackground }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(150,215,200,0.15),rgba(255,255,255,0))]" />
    </div>
  );
};
