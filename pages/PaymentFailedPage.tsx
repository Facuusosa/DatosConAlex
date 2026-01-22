import React from 'react';
import { AppView } from '../types';
import { XCircle, RefreshCw } from 'lucide-react';

/**
 * ============================================================================
 * PAGO FALLIDO PAGE
 * ============================================================================
 * 
 * Página que se muestra cuando el pago falla en Mercado Pago.
 * 
 * ============================================================================
 */

interface PaymentFailedPageProps {
    setView: (view: AppView) => void;
}

const PaymentFailedPage: React.FC<PaymentFailedPageProps> = ({ setView }) => {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-8 animate-in fade-in duration-500 max-w-lg mx-auto text-center py-12">
            {/* Error Icon */}
            <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center">
                <XCircle size={48} className="text-red-500" />
            </div>

            {/* Error Message */}
            <div className="space-y-3">
                <h1 className="text-4xl font-extrabold text-white">Pago No Procesado</h1>
                <p className="text-gray-400">
                    El pago no pudo ser completado. Esto puede ocurrir por fondos insuficientes,
                    datos incorrectos, o una cancelación.
                </p>
            </div>

            {/* What to do */}
            <div className="glass p-6 rounded-2xl border border-white/10 w-full text-left space-y-4">
                <h2 className="font-bold">¿Qué podés hacer?</h2>
                <ul className="space-y-2 text-sm text-gray-400">
                    <li className="flex items-start gap-2">
                        <span className="text-green-500 font-bold">•</span>
                        Verificar que los datos de tu tarjeta sean correctos
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-green-500 font-bold">•</span>
                        Comprobar que tenés fondos suficientes
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-green-500 font-bold">•</span>
                        Probar con otro método de pago
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-green-500 font-bold">•</span>
                        Contactar a tu banco si el problema persiste
                    </li>
                </ul>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
                <button
                    onClick={() => setView(AppView.CHECKOUT)}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 
                   text-white font-semibold rounded-xl transition-all hover:scale-105"
                >
                    <RefreshCw size={18} />
                    Intentar de nuevo
                </button>
                <button
                    onClick={() => setView(AppView.LANDING)}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white 
                   font-semibold rounded-xl transition-all"
                >
                    Volver al inicio
                </button>
            </div>
        </div>
    );
};

export default PaymentFailedPage;
