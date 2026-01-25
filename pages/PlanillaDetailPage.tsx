import React from 'react';
import { AppView } from '../types';
import { getPlanillaById } from '../data/planillas';
import { ChevronLeft, Check, ShoppingCart, Play, Sparkles, TrendingUp, Download, Shield } from 'lucide-react';

interface PlanillaDetailPageProps {
    setView: (view: AppView) => void;
    planillaId: string | null;
    setCheckoutPlanillaId: (id: string) => void;
}

const PlanillaDetailPage: React.FC<PlanillaDetailPageProps> = ({
    setView,
    planillaId,
    setCheckoutPlanillaId
}) => {
    const planilla = planillaId ? getPlanillaById(planillaId) : null;

    if (!planilla) {
        return (
            <div className="text-center py-20">
                <p className="text-gray-500">Planilla no encontrada</p>
                <button
                    onClick={() => setView(AppView.PLANILLAS)}
                    className="mt-4 text-green-400 hover:underline"
                >
                    Volver al catálogo
                </button>
            </div>
        );
    }

    const handleComprar = () => {
        setCheckoutPlanillaId(planilla.id);
        setView(AppView.CHECKOUT);
    };

    const getColorClasses = (color: string) => {
        switch (color) {
            case 'green':
                return {
                    bg: 'bg-green-500/20',
                    text: 'text-green-400',
                    border: 'border-green-500/30',
                    button: 'btn-primary',
                    gradient: 'from-green-500/10 to-emerald-500/10',
                };
            case 'purple':
                return {
                    bg: 'bg-purple-500/20',
                    text: 'text-purple-400',
                    border: 'border-purple-500/30',
                    button: 'bg-gradient-to-r from-purple-500 to-violet-600 text-white',
                    gradient: 'from-purple-500/10 to-violet-500/10',
                };
            default:
                return {
                    bg: 'bg-blue-500/20',
                    text: 'text-blue-400',
                    border: 'border-blue-500/30',
                    button: 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white',
                    gradient: 'from-blue-500/10 to-cyan-500/10',
                };
        }
    };

    const colors = getColorClasses(planilla.color);

    const getIcon = () => {
        switch (planilla.color) {
            case 'green':
                return <Sparkles size={32} />;
            case 'purple':
                return <TrendingUp size={32} />;
            default:
                return <Sparkles size={32} />;
        }
    };

    const discount = Math.round((1 - planilla.price / planilla.originalPrice) * 100);

    return (
        <div className="animate-in fade-in duration-500">
            {/* Back Button */}
            <button
                onClick={() => setView(AppView.PLANILLAS)}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
            >
                <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Volver al catálogo</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left - Image & Video */}
                <div className="space-y-6">
                    {/* Main Image */}
                    <div className={`relative rounded-[2rem] overflow-hidden bg-gradient-to-br ${colors.gradient} aspect-video shadow-2xl`}>
                        <img
                            src={planilla.image}
                            alt={planilla.title}
                            className="w-full h-full object-cover"
                        />
                        {/* Discount Badge */}
                        <div className={`absolute top-4 left-4 px-4 py-2 ${colors.bg} rounded-xl ${colors.text} font-bold`}>
                            -{discount}% OFF
                        </div>
                    </div>

                    {/* Video Placeholder */}
                    <div className={`glass-strong rounded-2xl p-6 ${colors.border}`}>
                        <div className="flex items-center gap-4 mb-4">
                            <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center ${colors.text}`}>
                                <Play size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold font-display">Video Explicativo</h3>
                                <p className="text-sm text-gray-500">Demo de ~50 segundos</p>
                            </div>
                        </div>
                        <div className="aspect-video bg-black/40 rounded-xl flex items-center justify-center border border-white/5">
                            <div className="text-center">
                                <div className={`w-16 h-16 ${colors.bg} rounded-full flex items-center justify-center ${colors.text} mx-auto mb-3 cursor-pointer hover:scale-110 transition-transform`}>
                                    <Play size={32} />
                                </div>
                                <p className="text-gray-500 text-sm">Video próximamente</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right - Details */}
                <div className="space-y-6">
                    {/* Header */}
                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className={`w-16 h-16 ${colors.bg} rounded-2xl flex items-center justify-center ${colors.text}`}>
                                {getIcon()}
                            </div>
                            <div>
                                <h1 className="headline-lg text-white">{planilla.title}</h1>
                                <p className="text-gray-500">Por <span className="text-green-400 font-medium">Datos con Alex</span></p>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="glass rounded-2xl p-6">
                        <h3 className="font-bold font-display mb-3">Descripción</h3>
                        <p className="text-gray-400 whitespace-pre-line leading-relaxed">
                            {planilla.description}
                        </p>
                    </div>

                    {/* Features */}
                    <div className="glass rounded-2xl p-6">
                        <h3 className="font-bold font-display mb-4">¿Qué incluye?</h3>
                        <div className="grid grid-cols-1 gap-3">
                            {planilla.features.map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <div className={`w-6 h-6 ${colors.bg} rounded-lg flex items-center justify-center shrink-0`}>
                                        <Check size={14} className={colors.text} />
                                    </div>
                                    <span className="text-gray-300">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Price & CTA */}
                    <div className={`glass-strong rounded-2xl p-8 ${colors.border}`}>
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <p className="text-gray-500 text-sm mb-1">Precio especial</p>
                                <div className="flex items-baseline gap-3">
                                    <span className="text-gray-500 line-through text-xl">${planilla.originalPrice}</span>
                                    <span className={`${colors.text} text-4xl font-black neon-text-subtle`}>
                                        ${planilla.price}
                                    </span>
                                </div>
                            </div>
                            <div className={`px-4 py-2 ${colors.bg} rounded-xl`}>
                                <span className={`${colors.text} font-bold text-lg`}>-{discount}%</span>
                            </div>
                        </div>

                        <button
                            onClick={handleComprar}
                            className={`w-full py-5 ${colors.button} font-bold rounded-xl flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] text-lg shadow-lg`}
                        >
                            <ShoppingCart size={22} />
                            Comprar Ahora
                        </button>

                        <div className="flex items-center justify-center gap-6 mt-4 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                                <Shield size={16} className="text-green-500" />
                                <span>Pago seguro</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Download size={16} className="text-green-500" />
                                <span>Descarga inmediata</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlanillaDetailPage;
