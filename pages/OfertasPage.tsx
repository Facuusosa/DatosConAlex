import React from 'react';
import { AppView } from '../types';
import { ofertas, getPlanillaById } from '../data/planillas';
import { Gift, Check, ShoppingCart, Sparkles, TrendingUp, ChevronRight, Zap } from 'lucide-react';

interface OfertasPageProps {
    setView: (view: AppView) => void;
    setCheckoutOfertaId: (id: string) => void;
}

const OfertasPage: React.FC<OfertasPageProps> = ({ setView, setCheckoutOfertaId }) => {

    const handleComprar = (ofertaId: string) => {
        setCheckoutOfertaId(ofertaId);
        setView(AppView.CHECKOUT);
    };

    return (
        <div className="animate-in fade-in duration-500">
            {/* Header */}
            <div className="text-center mb-16">
                <div className="badge badge-animated mb-6">
                    <Gift size={14} className="mr-2" />
                    Ofertas Especiales
                </div>
                <h1 className="headline-xl mb-6">
                    Packs & <span className="text-gradient neon-text-subtle">Combos</span>
                </h1>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                    Aprovechá nuestras ofertas exclusivas y obtené más por menos.
                </p>
            </div>

            {/* Ofertas */}
            <div className="space-y-8">
                {ofertas.map((oferta) => {
                    const includedPlanillas = oferta.planillas.map(id => getPlanillaById(id)).filter(Boolean);

                    return (
                        <div
                            key={oferta.id}
                            className="glass-strong rounded-[2rem] overflow-hidden border border-green-500/20 bg-gradient-to-r from-green-500/5 via-transparent to-emerald-500/5"
                        >
                            {/* Savings Banner */}
                            <div className="bg-gradient-to-r from-green-500 to-emerald-600 py-3 px-6 flex items-center justify-center gap-3">
                                <Zap size={18} className="text-black" />
                                <span className="text-black font-bold">AHORRÁ {oferta.savings}% CON ESTE PACK</span>
                                <Zap size={18} className="text-black" />
                            </div>

                            <div className="p-8 md:p-12">
                                <div className="flex flex-col lg:flex-row gap-10">
                                    {/* Left - Info */}
                                    <div className="flex-1 space-y-8">
                                        {/* Title */}
                                        <div className="flex items-center gap-5">
                                            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-500/30 float">
                                                <Gift size={36} />
                                            </div>
                                            <div>
                                                <h2 className="headline-lg text-white">{oferta.title}</h2>
                                                <p className="text-gray-400 mt-1">{oferta.description}</p>
                                            </div>
                                        </div>

                                        {/* Included Products */}
                                        <div>
                                            <h3 className="font-bold font-display text-gray-300 mb-4 text-lg">Este pack incluye:</h3>
                                            <div className="space-y-4">
                                                {includedPlanillas.map((planilla) => {
                                                    if (!planilla) return null;
                                                    const isGreen = planilla.color === 'green';
                                                    return (
                                                        <div
                                                            key={planilla.id}
                                                            className={`flex items-center gap-4 p-5 glass rounded-2xl border ${isGreen ? 'border-green-500/20' : 'border-purple-500/20'}`}
                                                        >
                                                            <div className={`w-14 h-14 ${isGreen ? 'bg-green-500/20 text-green-400' : 'bg-purple-500/20 text-purple-400'} rounded-xl flex items-center justify-center`}>
                                                                {isGreen ? <Sparkles size={26} /> : <TrendingUp size={26} />}
                                                            </div>
                                                            <div className="flex-1">
                                                                <h4 className="font-bold font-display text-lg">{planilla.title}</h4>
                                                                <p className="text-sm text-gray-500">{planilla.shortDescription}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <span className="text-gray-500 line-through">${planilla.originalPrice}</span>
                                                                <p className="text-xs text-green-400">Incluido</p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right - Price & CTA */}
                                    <div className="lg:w-96 space-y-6">
                                        <div className="glass-strong rounded-2xl p-8 border border-green-500/20">
                                            <div className="text-center mb-6">
                                                <p className="text-gray-500 text-sm mb-2">Precio del pack</p>
                                                <div className="flex items-center justify-center gap-4">
                                                    <span className="text-gray-500 line-through text-2xl">${oferta.originalPrice}</span>
                                                    <span className="text-green-400 text-5xl font-black neon-text">${oferta.price}</span>
                                                </div>
                                                <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-xl">
                                                    <Zap size={16} className="text-green-400" />
                                                    <span className="text-green-400 font-bold">Ahorrás ${(oferta.originalPrice - oferta.price).toFixed(2)}</span>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => handleComprar(oferta.id)}
                                                className="w-full py-5 btn-primary flex items-center justify-center gap-3 text-lg"
                                            >
                                                <ShoppingCart size={22} />
                                                Comprar Pack
                                            </button>

                                            <div className="mt-6 space-y-3">
                                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                                    <Check size={16} className="text-green-500 shrink-0" />
                                                    <span>Pago seguro con Mercado Pago</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                                    <Check size={16} className="text-green-500 shrink-0" />
                                                    <span>Descarga inmediata de ambos archivos</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                                    <Check size={16} className="text-green-500 shrink-0" />
                                                    <span>Soporte por email</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Individual Products CTA */}
            <div className="mt-16 text-center">
                <div className="glass inline-block px-8 py-6 rounded-2xl">
                    <p className="text-gray-400 mb-4">¿Preferís comprar por separado?</p>
                    <button
                        onClick={() => setView(AppView.PLANILLAS)}
                        className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 font-semibold transition-colors text-lg"
                    >
                        Ver planillas individuales
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OfertasPage;
