import React from 'react';
import { AppView } from '../types';
import LetterGlitch from './LetterGlitch';

interface LayoutProps {
  children: React.ReactNode;
  currentView: AppView;
  setView: (view: AppView) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, setView }) => {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Letter Glitch Background - Balance visual */}
      <div className="fixed inset-0 z-[-2]">
        <LetterGlitch
          glitchColors={['#0a3d24', '#15803d', '#166534']}
          glitchSpeed={80}
          centerVignette={true}
          outerVignette={true}
          smooth={true}
        />
      </div>

      {/* Overlay sutil para contraste */}
      <div
        className="fixed inset-0 z-[-1] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.6) 100%)'
        }}
      />

      {/* Navigation */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-6xl glass rounded-2xl px-6 py-3 flex items-center justify-between z-50 transition-all hover:border-white/20">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setView(AppView.LANDING)}>
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center neon-glow group-hover:scale-110 transition-transform">
            <span className="text-black font-black text-xs">AI</span>
          </div>
          <span className="text-xl font-bold tracking-tight">AIExcel</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
          <button onClick={() => setView(AppView.LANDING)} className={`hover:text-green-400 transition-colors ${currentView === AppView.LANDING ? 'text-green-400' : ''}`}>Inicio</button>
          <button onClick={() => setView(AppView.CATALOG)} className={`hover:text-green-400 transition-colors ${currentView === AppView.CATALOG ? 'text-green-400' : ''}`}>Cursos</button>
        </div>

        {/* Espacio vacío para mantener el logo centrado visualmente */}
        <div className="w-8" />
      </nav>

      <main className="flex-1 pt-24 px-4 sm:px-8 max-w-7xl mx-auto w-full pb-12">
        {children}
      </main>

      <footer className="py-8 text-center text-gray-500 text-sm border-t border-white/5 mt-12">
        <p>© 2024 AIExcel - Tu primer paso hacia el dominio de los datos.</p>
      </footer>
    </div>
  );
};

export default Layout;


