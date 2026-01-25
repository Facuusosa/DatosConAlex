import React from 'react';
import { AppView } from '../types';
import LetterGlitch from './LetterGlitch';

interface LayoutProps {
  children: React.ReactNode;
  currentView: AppView;
  setView: (view: AppView) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, setView }) => {
  const navItems = [
    { view: AppView.LANDING, label: 'Inicio' },
    { view: AppView.PLANILLAS, label: 'Planillas', highlight: true },
    { view: AppView.OFERTAS, label: 'Ofertas' },
    { view: AppView.CURSOS, label: 'Cursos' },
  ];

  const isActive = (view: AppView) => {
    if (view === AppView.PLANILLAS) {
      return currentView === AppView.PLANILLAS || currentView === AppView.PLANILLA_DETAIL;
    }
    return currentView === view;
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Letter Glitch Background */}
      <div className="fixed inset-0 z-[-2]">
        <LetterGlitch
          glitchColors={['#0a3d24', '#15803d', '#166534']}
          glitchSpeed={80}
          centerVignette={true}
          outerVignette={true}
          smooth={true}
        />
      </div>

      {/* Overlay for contrast */}
      <div
        className="fixed inset-0 z-[-1] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.7) 100%)'
        }}
      />

      {/* Navigation */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl glass-strong rounded-2xl px-4 md:px-6 py-3 flex items-center justify-between z-50">
        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setView(AppView.LANDING)}
        >
          <div className="w-11 h-11 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center neon-glow group-hover:scale-105 transition-transform shadow-lg">
            <span className="text-black font-black text-sm font-display">DA</span>
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-lg font-bold tracking-tight leading-none font-display">
              Datos con Alex
            </span>
            <span className="text-[10px] text-gray-500 font-medium tracking-wide">
              PLANILLAS PREMIUM
            </span>
          </div>
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => setView(item.view)}
              className={`
                px-4 py-2 rounded-xl text-sm font-semibold transition-all
                ${isActive(item.view)
                  ? 'text-green-400 bg-green-500/10'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }
                ${item.highlight ? 'text-white' : ''}
              `}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-2">
          <a
            href="https://www.tiktok.com/@datos.conalex"
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors group"
            aria-label="TikTok"
          >
            <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
            </svg>
          </a>
          <a
            href="https://www.instagram.com/datos_conalex"
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors group"
            aria-label="Instagram"
          >
            <svg className="w-4 h-4 text-gray-400 group-hover:text-pink-400 transition-colors" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 pt-28 px-4 sm:px-8 max-w-7xl mx-auto w-full pb-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="py-10 border-t border-white/5 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center">
                <span className="text-black font-black text-xs font-display">DA</span>
              </div>
              <div>
                <span className="font-bold font-display">Datos con Alex</span>
                <p className="text-xs text-gray-600">Planillas Excel Premium</p>
              </div>
            </div>

            {/* Social */}
            <div className="flex items-center gap-6">
              <a
                href="https://www.tiktok.com/@datos.conalex"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-white transition-colors text-sm"
              >
                TikTok
              </a>
              <span className="text-gray-800">•</span>
              <a
                href="https://www.instagram.com/datos_conalex"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-pink-400 transition-colors text-sm"
              >
                Instagram
              </a>
            </div>

            {/* Copyright */}
            <p className="text-gray-600 text-sm">
              © 2024 Datos con Alex
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
