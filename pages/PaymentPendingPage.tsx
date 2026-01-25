import React from 'react';
import { AppView } from '../types';
import { Clock, Mail, ArrowRight } from 'lucide-react';

interface PaymentPendingPageProps {
    setView: (view: AppView) => void;
}

const PaymentPendingPage: React.FC<PaymentPendingPageProps> = ({ setView }) => {
    return (
        <div className="animate-in zoom-in duration-500 max-w-2xl mx-auto py-12 text-center">
            {/* Pending Icon */}
            <div className="mb-8">
                <div className="w-24 h-24 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Clock size={48} className="text-yellow-500 animate-pulse" />
                </div>
                <h1 className="text-4xl md:text-5xl font-black mb-4">
                    Pago <span className="text-yellow-400">Pendiente</span>
                </h1>
                <p className="text-gray-400 text-lg">
                    Tu pago está siendo procesado. Esto puede tomar unos minutos.
                </p>
            </div>

            {/* Info Card */}
            <div className="glass rounded-[2rem] p-8 space-y-6 mb-8">
                <div className="flex items-center gap-4 p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                    <Mail size={24} className="text-yellow-500 shrink-0" />
                    <div className="text-left">
                        <p className="font-bold">Te avisamos por email</p>
                        <p className="text-sm text-gray-400">
                            Cuando el pago se acredite, recibirás el link de descarga automáticamente.
                        </p>
                    </div>
                </div>

                <div className="p-4 bg-white/5 rounded-xl text-left">
                    <p className="text-sm text-gray-400">
                        <strong className="text-gray-300">¿Pagaste en efectivo?</strong><br />
                        Si elegiste Pago Fácil, Rapipago u otro medio en efectivo,
                        el pago puede demorar hasta 48 horas en acreditarse.
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
                <button
                    onClick={() => setView(AppView.LANDING)}
                    className="px-8 py-4 bg-white/5 border border-white/10 font-bold rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2 mx-auto"
                >
                    Volver al inicio
                    <ArrowRight size={18} />
                </button>
            </div>

            {/* Help */}
            <div className="mt-12 p-6 glass rounded-2xl">
                <p className="text-gray-400 mb-2">¿Tenés dudas sobre tu pago?</p>
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

export default PaymentPendingPage;
