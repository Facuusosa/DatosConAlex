import React from 'react';
import { AppView } from '../types';
import { XCircle, RefreshCw, ArrowRight, HelpCircle } from 'lucide-react';

interface PaymentFailedPageProps {
    setView: (view: AppView) => void;
}

const PaymentFailedPage: React.FC<PaymentFailedPageProps> = ({ setView }) => {
    return (
        <div className="animate-in zoom-in duration-500 max-w-2xl mx-auto py-12 text-center">
            {/* Error Icon */}
            <div className="mb-8">
                <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <XCircle size={48} className="text-red-500" />
                </div>
                <h1 className="text-4xl md:text-5xl font-black mb-4">
                    Pago <span className="text-red-400">No Procesado</span>
                </h1>
                <p className="text-gray-400 text-lg">
                    Hubo un problema al procesar tu pago. No te preocupes, no se realizó ningún cargo.
                </p>
            </div>

            {/* Info Card */}
            <div className="glass rounded-[2rem] p-8 space-y-6 mb-8">
                <h3 className="font-bold text-gray-300">Posibles causas:</h3>
                <div className="space-y-3 text-left">
                    <div className="flex items-start gap-3 p-3 bg-white/5 rounded-xl">
                        <HelpCircle size={20} className="text-gray-400 shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-400">Fondos insuficientes en la tarjeta o cuenta</p>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-white/5 rounded-xl">
                        <HelpCircle size={20} className="text-gray-400 shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-400">Datos de la tarjeta incorrectos</p>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-white/5 rounded-xl">
                        <HelpCircle size={20} className="text-gray-400 shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-400">La transacción fue rechazada por el banco</p>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
                <p className="text-gray-500 text-sm">¿Qué querés hacer?</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => setView(AppView.CHECKOUT)}
                        className="px-8 py-4 bg-green-500 text-black font-bold rounded-xl hover:bg-green-400 transition-all flex items-center justify-center gap-2"
                    >
                        <RefreshCw size={18} />
                        Intentar de nuevo
                    </button>
                    <button
                        onClick={() => setView(AppView.PLANILLAS)}
                        className="px-8 py-4 bg-white/5 border border-white/10 font-bold rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                    >
                        Ver planillas
                        <ArrowRight size={18} />
                    </button>
                </div>
            </div>

            {/* Help */}
            <div className="mt-12 p-6 glass rounded-2xl">
                <p className="text-gray-400 mb-2">¿Necesitás ayuda?</p>
                <p className="text-sm text-gray-500">
                    Contactanos por Instagram{' '}
                    <a
                        href="https://www.instagram.com/datos_conalex"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-400 hover:underline"
                    >
                        @datos_conalex
                    </a>
                </p>
            </div>
        </div>
    );
};

export default PaymentFailedPage;
