import React from 'react';
import { Youtube, Instagram, Linkedin } from 'lucide-react';
import { Theme } from '../types';

interface FooterProps {
  theme: Theme;
}

export default function Footer({ theme }: FooterProps) {
  const isDark = theme === 'dark';

  return (
    <footer id="footer" className={`py-20 px-8 border-t transition-colors duration-500 ${isDark ? 'bg-black/40 border-white/10 text-gray-500' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="flex gap-8 items-center">
          <a href="https://youtube.com/@friendlyfinds-1?si=izNRNDOi_z-FOl4w" target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 hover:text-burgundy transition-colors group`}>
            <Youtube size={24} className="group-hover:text-burgundy" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Friendly Finds</span>
          </a>
          <a href="https://www.instagram.com/friendly._finds?igsh=MWdsZHdzdWt4aWlrNA==" target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 hover:text-burgundy transition-colors group`}>
            <Instagram size={24} className="group-hover:text-burgundy" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">friendly._finds</span>
          </a>
        </div>

        <div className="text-center md:text-right">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2">
            FriendlyFinds. <span className="text-burgundy opacity-50">Premium Selection</span>
          </p>
          <p className="text-[9px] opacity-40 uppercase tracking-widest mb-1">
            &copy; 2024 All Rights Reserved
          </p>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60 flex items-center justify-center md:justify-end gap-2">
            Curated by <span className="text-burgundy">Ayman Saleem</span>
            <a href="https://www.linkedin.com/in/ayman-saleem-6069912ba/" target="_blank" rel="noopener noreferrer" className="hover:text-burgundy transition-colors inline-block">
              <Linkedin size={14} />
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
