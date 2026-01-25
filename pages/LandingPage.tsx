import React from 'react';
import { AppView } from '../types';
import { ChevronRight, Sparkles, FileSpreadsheet, Gift, ArrowRight } from 'lucide-react';

interface LandingPageProps {
  setView: (view: AppView) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ setView }) => {
  return (
    <div className="animate-in fade-in duration-1000">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 flex flex-col items-center text-center space-y-8 overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 w-full h-full -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-500/5 blur-[150px] rounded-full"></div>
          <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-emerald-500/10 blur-[100px] rounded-full"></div>
        </div>

        {/* Badge */}
        <div className="badge badge-animated">
          <Sparkles size={14} className="mr-2" />
          Planillas Excel Premium
        </div>

        {/* Main Headline */}
        <div className="space-y-4 max-w-4xl">
          <h1 className="headline-xl">
            Organiza tu vida con{' '}
            <span className="text-gradient neon-text-subtle block mt-2">
              Datos con Alex
            </span>
          </h1>
        </div>

        {/* Subheadline */}
        <p className="text-gray-400 max-w-xl text-lg md:text-xl font-medium leading-relaxed">
          Planillas profesionales diseñadas para que{' '}
          <span className="text-white font-semibold">tomes el control</span> de tus hábitos,
          finanzas y productividad.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <button
            onClick={() => setView(AppView.PLANILLAS)}
            className="group btn-primary flex items-center gap-3 text-lg"
          >
            <FileSpreadsheet size={22} />
            Ver Planillas
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => setView(AppView.OFERTAS)}
            className="px-8 py-4 glass rounded-2xl font-bold hover:bg-white/5 transition-all flex items-center gap-3 group border border-green-500/20 hover:border-green-500/40"
          >
            <Gift size={20} className="text-green-400 group-hover:scale-110 transition-transform" />
            <span className="text-gradient">Ver Ofertas</span>
          </button>
        </div>
      </section>

      {/* Product Cards Section */}
      <section className="py-16 md:py-20">
        <div className="text-center mb-12">
          <h2 className="headline-lg">
            Nuestras <span className="text-gradient">Planillas</span>
          </h2>
          <p className="text-gray-500 mt-4 max-w-lg mx-auto">
            Diseñadas para profesionales que valoran su tiempo
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Tracker de Hábitos Card */}
          <div
            onClick={() => setView(AppView.PLANILLAS)}
            className="glass card-hover p-8 md:p-10 rounded-[2rem] cursor-pointer group overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-green-500/10 blur-[60px] rounded-full transition-all group-hover:bg-green-500/20"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center text-green-400 mb-6 group-hover:scale-110 transition-transform border border-green-500/20">
                <Sparkles size={32} />
              </div>
              <h3 className="headline-md text-white mb-3">Tracker de Hábitos</h3>
              <p className="text-gray-400 leading-relaxed mb-6">
                Controla y mejora tus hábitos diarios con estadísticas automáticas y visualizaciones que te motivan a seguir.
              </p>
              <div className="flex items-center gap-2 text-green-400 font-semibold group-hover:gap-3 transition-all">
                <span>Explorar</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Planificador Financiero Card */}
          <div
            onClick={() => setView(AppView.PLANILLAS)}
            className="glass card-hover p-8 md:p-10 rounded-[2rem] cursor-pointer group overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 blur-[60px] rounded-full transition-all group-hover:bg-purple-500/20"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-violet-500/20 rounded-2xl flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform border border-purple-500/20">
                <FileSpreadsheet size={32} />
              </div>
              <h3 className="headline-md text-white mb-3">Planificador Financiero</h3>
              <p className="text-gray-400 leading-relaxed mb-6">
                Organiza tus finanzas personales con gráficos inteligentes y reportes automáticos que te ayudan a ahorrar.
              </p>
              <div className="flex items-center gap-2 text-purple-400 font-semibold group-hover:gap-3 transition-all">
                <span>Explorar</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Offer Banner */}
      <section className="py-12">
        <div
          onClick={() => setView(AppView.OFERTAS)}
          className="glass-strong p-8 md:p-10 rounded-[2rem] cursor-pointer card-hover border border-green-500/20 bg-gradient-to-r from-green-500/5 via-transparent to-emerald-500/5"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-500/30 float">
                <Gift size={36} />
              </div>
              <div>
                <h3 className="headline-md text-white">Pack Productividad Total</h3>
                <p className="text-gray-400 mt-1">
                  2 planillas + bonus exclusivos — <span className="text-green-400 font-bold">Ahorrá 33%</span>
                </p>
              </div>
            </div>
            <button className="btn-primary whitespace-nowrap">
              Ver Oferta
            </button>
          </div>
        </div>
      </section>

      {/* Social Section */}
      <section className="py-16 text-center">
        <p className="text-gray-600 text-sm font-semibold uppercase tracking-[0.2em] mb-8">
          Seguinos en redes
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="https://www.tiktok.com/@datos.conalex"
            target="_blank"
            rel="noopener noreferrer"
            className="glass px-6 py-4 rounded-2xl flex items-center gap-3 hover:bg-white/5 transition-all group border border-white/5 hover:border-white/10"
          >
            <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
            </svg>
            <span className="font-semibold">@datos.conalex</span>
          </a>
          <a
            href="https://www.instagram.com/datos_conalex"
            target="_blank"
            rel="noopener noreferrer"
            className="glass px-6 py-4 rounded-2xl flex items-center gap-3 hover:bg-white/5 transition-all group border border-white/5 hover:border-pink-500/20"
          >
            <svg className="w-6 h-6 text-pink-400 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            <span className="font-semibold">@datos_conalex</span>
          </a>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
