import React from 'react';
import { AppView } from '../types';
import { Clock, Mail } from 'lucide-react';

/**
 * ============================================================================
 * PAGO PENDIENTE PAGE
 * ============================================================================
 * 
 * Página que se muestra cuando el pago queda pendiente (ej: pago en efectivo).
 * 
 * ============================================================================
 */

interface PaymentPendingPageProps {
    setView: (view: AppView) => void;
}

const PaymentPendingPage: React.FC<PaymentPendingPageProps> = ({ setView }) => {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-8 animate-in fade-in duration-500 max-w-lg mx-auto text-center py-12">
            {/* Pending Icon */}
            <div className="w-24 h-24 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <Clock size={48} className="text-yellow-500" />
            </div>

            {/* Message */}
            <div className="space-y-3">
                <h1 className="text-4xl font-extrabold text-white">Pago Pendiente</h1>
                <p className="text-gray-400">
                    Tu pago está siendo procesado. Esto puede tomar entre 1-2 días hábiles
                    dependiendo del método de pago elegido.
                </p>
            </div>

            {/* Info Card */}
            <div className="glass p-6 rounded-2xl border border-white/10 w-full text-left space-y-4">
                <div className="flex items-start gap-3">
                    <Mail size={20} className="text-green-500 shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-bold">Te avisaremos por email</h3>
                        <p className="text-sm text-gray-400">
                            Una vez que se confirme el pago, recibirás un email con el link para
                            descargar tu curso.
                        </p>
                    </div>
                </div>
            </div>

            {/* Back to Home */}
            <button
                onClick={() => setView(AppView.LANDING)}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white 
                 font-semibold rounded-xl transition-all"
            >
                Volver al inicio
            </button>
        </div>
    );
};

export default PaymentPendingPage;
