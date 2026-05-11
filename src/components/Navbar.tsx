import React from 'react';
import { Moon, Sun, Lock, Home, PhoneCall } from 'lucide-react';
import { motion } from 'motion/react';
import { Theme } from '../types';

interface NavbarProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  onLoginClick: () => void;
  isAdmin: boolean;
  onHomeClick: () => void;
  onContactClick: () => void;
}

export default function Navbar({ theme, setTheme, onLoginClick, isAdmin, onHomeClick, onContactClick }: NavbarProps) {
  const isDark = theme === 'dark';
  
  return (
    <nav className={`fixed top-0 w-full z-50 px-8 py-4 transition-all duration-300 border-b ${isDark ? 'glass border-white/5' : 'glass-light border-white/30'} backdrop-blur-xl`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-0.5"
        >
          <h1 
            onClick={onHomeClick}
            className={`text-2xl font-bold tracking-tighter cursor-pointer ${isDark ? 'text-white' : 'text-night'}`}
          >
            Friendly<span className="text-burgundy">Finds.</span>
          </h1>
          <p className={`text-[9px] font-bold uppercase tracking-[0.2em] transition-colors ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Discover Amazing Products ✨
          </p>
        </motion.div>

        <div className="flex items-center gap-8">
          <div className="hidden md:flex gap-8 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">
            <button onClick={onHomeClick} className="hover:text-burgundy transition-colors">Home</button>
            <button onClick={onContactClick} className="hover:text-burgundy transition-colors">Contact Us</button>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all hover:scale-105 active:scale-95
                ${isDark ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {!isAdmin && (
              <button 
                onClick={onLoginClick}
                className={`w-10 h-10 rounded-full bg-burgundy text-white flex items-center justify-center shadow-lg shadow-burgundy/20 transition-all hover:scale-105 active:scale-95`}
              >
                <Lock size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
