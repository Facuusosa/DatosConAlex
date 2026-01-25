import React from 'react';
import { AppView } from '../types';
import { GraduationCap, Clock, Bell, ChevronRight, Sparkles } from 'lucide-react';

interface CursosPageProps {
    setView: (view: AppView) => void;
}

const CursosPage: React.FC<CursosPageProps> = ({ setView }) => {
    return (
        <div className="animate-in fade-in duration-500">
            {/* Header */}
            <div className="text-center mb-16">
                <div className="badge mb-6" style={{ background: 'rgba(59, 130, 246, 0.1)', borderColor: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa' }}>
                    <GraduationCap size={14} className="mr-2" />
                    Academia
                </div>
                <h1 className="headline-xl mb-6">
                    Cursos de{' '}
                    <span className="text-gradient-purple neon-text-subtle" style={{ background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #2563eb 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Excel
                    </span>
                </h1>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                    Próximamente tendrás acceso a cursos completos para dominar Excel desde cero hasta nivel avanzado.
                </p>
            </div>

            {/* Coming Soon Card */}
            <div className="max-w-2xl mx-auto">
                <div className="glass-strong rounded-[2rem] overflow-hidden border border-blue-500/20">
                    {/* Visual */}
                    <div className="relative h-64 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 flex items-center justify-center">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-48 h-48 bg-blue-500/20 rounded-full blur-[80px]"></div>
                        </div>
                        <div className="relative z-10 text-center">
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-3xl flex items-center justify-center text-blue-400 mx-auto mb-4 float border border-blue-500/20">
                                <GraduationCap size={48} />
                            </div>
                            <div className="flex items-center gap-2 justify-center text-blue-400 font-bold">
                                <Clock size={18} />
                                <span className="text-lg">Próximamente</span>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 md:p-10 text-center">
                        <h2 className="headline-md text-white mb-4">Cursos en Desarrollo</h2>
                        <p className="text-gray-400 mb-8 leading-relaxed max-w-lg mx-auto">
                            Estamos preparando cursos completos de Excel con videos explicativos,
                            ejercicios prácticos y certificación. Desde nivel principiante hasta
                            técnicas avanzadas de análisis de datos.
                        </p>

                        {/* Features Preview */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                            <div className="glass p-5 rounded-2xl">
                                <p className="text-3xl font-black text-blue-400 font-display">10+</p>
                                <p className="text-sm text-gray-500 mt-1">Horas de video</p>
                            </div>
                            <div className="glass p-5 rounded-2xl">
                                <p className="text-3xl font-black text-blue-400 font-display">50+</p>
                                <p className="text-sm text-gray-500 mt-1">Ejercicios prácticos</p>
                            </div>
                            <div className="glass p-5 rounded-2xl">
                                <p className="text-3xl font-black font-display">📜</p>
                                <p className="text-sm text-gray-500 mt-1">Certificación</p>
                            </div>
                        </div>

                        {/* Notify Me */}
                        <div className="glass rounded-2xl p-6 border border-blue-500/10">
                            <div className="flex items-center gap-3 justify-center mb-4">
                                <Bell size={20} className="text-blue-400" />
                                <span className="font-bold font-display">¿Querés que te avisemos cuando esté listo?</span>
                            </div>
                            <p className="text-sm text-gray-500 mb-5">
                                Seguinos en redes para enterarte primero.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <a
                                    href="https://www.tiktok.com/@datos.conalex"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-3 glass rounded-xl hover:bg-white/5 transition-colors flex items-center justify-center gap-2 font-medium"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                    </svg>
                                    TikTok
                                </a>
                                <a
                                    href="https://www.instagram.com/datos_conalex"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-3 glass rounded-xl hover:bg-white/5 transition-colors flex items-center justify-center gap-2 font-medium"
                                >
                                    <svg className="w-5 h-5 text-pink-400" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                    </svg>
                                    Instagram
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA to Planillas */}
            <div className="mt-16 text-center">
                <div className="glass inline-block px-8 py-6 rounded-2xl">
                    <p className="text-gray-400 mb-4">Mientras tanto, explorá nuestras planillas disponibles</p>
                    <button
                        onClick={() => setView(AppView.PLANILLAS)}
                        className="btn-primary inline-flex items-center gap-2"
                    >
                        <Sparkles size={18} />
                        Ver Planillas
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CursosPage;
