import React, { useState } from 'react';
import { X, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Theme } from '../types';
import firebaseConfig from '../../firebase-applet-config.json';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, pass: string) => void;
  theme: Theme;
  error?: string;
}

export default function LoginModal({ isOpen, onClose, onLogin, theme, error }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  const isDark = theme === 'dark';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`relative w-full max-w-sm rounded-[2.5rem] overflow-hidden shadow-2xl ${isDark ? 'glass border-white/10' : 'bg-white/95 border-white shadow-xl shadow-night/5'}`}
          >
            <div className="p-10 text-center">
              <h2 className="text-3xl font-black uppercase tracking-tighter mb-10">
                Admin Login
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-left space-y-2">
                  <label className="text-[12px] font-black uppercase tracking-[0.3em] ml-1">Email / Username</label>
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full px-5 py-3.5 text-base rounded-2xl border outline-none transition-all focus:ring-4 focus:ring-burgundy/20
                       ${isDark ? 'bg-white/5 border-white/5 text-white' : 'bg-gray-50/50 border-gray-100 text-night'}`}
                    placeholder="Enter email"
                  />
                </div>

                <div className="text-left space-y-2">
                  <label className="text-[12px] font-black uppercase tracking-[0.3em] ml-1">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full px-5 py-3.5 text-base rounded-2xl border outline-none transition-all focus:ring-4 focus:ring-burgundy/20
                       ${isDark ? 'bg-white/5 border-white/5 text-white' : 'bg-gray-50/50 border-gray-100 text-night'}`}
                    placeholder="Enter password"
                  />
                </div>

                {error && (
                  <div className="space-y-2">
                    <p className="text-red-400 text-[11px] font-medium bg-red-400/10 p-3 rounded-xl border border-red-400/20 leading-relaxed">
                      {error}
                    </p>
                    <div className="flex flex-col gap-1 items-center opacity-40">
                      <p className={`text-[8px] font-black uppercase tracking-[0.2em] transition-colors ${isDark ? 'text-white' : 'text-night'}`}>
                        Project: {firebaseConfig.projectId}
                      </p>
                      <p className={`text-[8px] font-black uppercase tracking-[0.2em] transition-colors ${isDark ? 'text-white' : 'text-night'}`}>
                        Admin: revanthsai3567@gmail.com
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-4 pt-4">
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className={`flex-1 py-4 rounded-2xl font-bold transition-all border
                        ${isDark ? 'border-white/10 text-white hover:bg-white/5' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-burgundy text-white py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 hover:bg-burgundy/90 transition-all active:scale-95 shadow-lg shadow-burgundy/20"
                    >
                      Login
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
