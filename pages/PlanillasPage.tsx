import React from 'react';
import { AppView } from '../types';
import { planillas } from '../data/planillas';
import { ChevronRight, Check, Sparkles, TrendingUp, ArrowRight } from 'lucide-react';

interface PlanillasPageProps {
    setView: (view: AppView) => void;
    setSelectedPlanillaId: (id: string) => void;
}

const PlanillasPage: React.FC<PlanillasPageProps> = ({ setView, setSelectedPlanillaId }) => {

    const handleSelectPlanilla = (planillaId: string) => {
        setSelectedPlanillaId(planillaId);
        setView(AppView.PLANILLA_DETAIL);
    };

    const getColorClasses = (color: string) => {
        switch (color) {
            case 'green':
                return {
                    bg: 'bg-green-500/20',
                    text: 'text-green-400',
                    border: 'border-green-500/20',
                    hoverBorder: 'hover:border-green-500/40',
                    gradient: 'from-green-500/10 to-emerald-500/10',
                    button: 'bg-green-500/10 text-green-400 hover:bg-green-500/20',
                };
            case 'purple':
                return {
                    bg: 'bg-purple-500/20',
                    text: 'text-purple-400',
                    border: 'border-purple-500/20',
                    hoverBorder: 'hover:border-purple-500/40',
                    gradient: 'from-purple-500/10 to-violet-500/10',
                    button: 'bg-purple-500/10 text-purple-400 hover:bg-purple-500/20',
                };
            default:
                return {
                    bg: 'bg-blue-500/20',
                    text: 'text-blue-400',
                    border: 'border-blue-500/20',
                    hoverBorder: 'hover:border-blue-500/40',
                    gradient: 'from-blue-500/10 to-cyan-500/10',
                    button: 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20',
                };
        }
    };

    const getIcon = (color: string) => {
        switch (color) {
            case 'green':
                return <Sparkles size={28} />;
            case 'purple':
                return <TrendingUp size={28} />;
            default:
                return <Sparkles size={28} />;
        }
    };

    return (
        <div className="animate-in fade-in duration-500">
            {/* Header with Social Links */}
            <div className="text-center mb-16">
                <h1 className="headline-xl mb-4">
                    Nuestras <span className="text-gradient neon-text-subtle">Planillas</span>
                </h1>
                <p className="text-gray-500 max-w-xl mx-auto text-lg mb-6">
                    Diseñadas para profesionales que valoran su tiempo
                </p>

                {/* Social Links */}
                <div className="flex items-center justify-center gap-4">
                    <a
                        href="https://www.tiktok.com/@datos.conalex"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass px-5 py-2.5 rounded-full flex items-center gap-2 hover:bg-white/5 transition-all text-sm font-medium text-gray-400 hover:text-white"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                        </svg>
                        TikTok
                    </a>
                    <a
                        href="https://www.instagram.com/datos_conalex"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass px-5 py-2.5 rounded-full flex items-center gap-2 hover:bg-white/5 transition-all text-sm font-medium text-gray-400 hover:text-pink-400"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                        Instagram
                    </a>
                </div>
            </div>

            {/* Planillas Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {planillas.map((planilla) => {
                    const colors = getColorClasses(planilla.color);

                    return (
                        <div
                            key={planilla.id}
                            className={`glass card-hover rounded-[2rem] overflow-hidden ${colors.border} ${colors.hoverBorder} cursor-pointer group`}
                            onClick={() => handleSelectPlanilla(planilla.id)}
                        >
                            {/* Image */}
                            <div className={`relative h-56 md:h-64 bg-gradient-to-br ${colors.gradient} overflow-hidden`}>
                                <img
                                    src={planilla.image}
                                    alt={planilla.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    loading="lazy"
                                />
                                {/* Price Badge */}
                                <div className="absolute top-4 right-4 px-4 py-2 glass-strong rounded-xl">
                                    <span className="text-gray-400 line-through text-sm mr-2">${planilla.originalPrice}</span>
                                    <span className={`${colors.text} font-bold text-xl`}>${planilla.price}</span>
                                </div>
                                {/* Discount Badge */}
                                <div className={`absolute top-4 left-4 px-3 py-1 ${colors.bg} rounded-lg ${colors.text} text-xs font-bold font-display`}>
                                    -{Math.round((1 - planilla.price / planilla.originalPrice) * 100)}%
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-8">
                                <div className="flex items-start gap-4 mb-5">
                                    <div className={`w-14 h-14 ${colors.bg} rounded-xl flex items-center justify-center ${colors.text} shrink-0 group-hover:scale-110 transition-transform`}>
                                        {getIcon(planilla.color)}
                                    </div>
                                    <div>
                                        <h3 className="headline-md text-white mb-1">{planilla.title}</h3>
                                        <p className="text-gray-500 text-sm">{planilla.shortDescription}</p>
                                    </div>
                                </div>

                                {/* Features Preview */}
                                <div className="grid grid-cols-2 gap-2 mb-6">
                                    {planilla.features.slice(0, 4).map((feature, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-400">
                                            <Check size={14} className={colors.text} />
                                            <span className="truncate">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* CTA */}
                                <button
                                    className={`w-full py-4 ${colors.button} font-display font-medium rounded-xl flex items-center justify-center gap-2 transition-all`}
                                >
                                    Ver Detalles
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Oferta CTA */}
            <div className="mt-16 text-center">
                <div className="glass-strong inline-block px-8 py-6 rounded-2xl">
                    <p className="text-gray-400 mb-4">¿Querés las dos planillas a un precio especial?</p>
                    <button
                        onClick={() => setView(AppView.OFERTAS)}
                        className="btn-primary"
                    >
                        Ver Pack Productividad — Ahorrá 33%
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PlanillasPage;
