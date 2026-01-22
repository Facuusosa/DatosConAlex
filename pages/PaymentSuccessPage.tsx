import React, { useEffect, useState } from 'react';
import { AppView } from '../types';
import { CheckCircle, Download, Loader2, XCircle, AlertCircle } from 'lucide-react';

/**
 * ============================================================================
 * PAGO EXITOSO PAGE
 * ============================================================================
 * 
 * Página que muestra después de un pago exitoso en Mercado Pago.
 * - Verifica el pago con el backend
 * - Muestra mensaje de éxito
 * - Ofrece botón de descarga del curso
 * 
 * ============================================================================
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface PaymentSuccessPageProps {
    setView: (view: AppView) => void;
}

interface PaymentData {
    success: boolean;
    payment_id?: string;
    status?: string;
    status_detail?: string;
    amount?: number;
    order_id?: number;
    customer_name?: string;
    customer_email?: string;
    course_title?: string;
    message?: string;
    download_url?: string;
    error?: string;
}

const PaymentSuccessPage: React.FC<PaymentSuccessPageProps> = ({ setView }) => {
    const [loading, setLoading] = useState(true);
    const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const validatePayment = async () => {
            // Obtener parámetros de la URL (enviados por Mercado Pago)
            const urlParams = new URLSearchParams(window.location.search);
            const paymentId = urlParams.get('payment_id') || urlParams.get('collection_id');
            const externalReference = urlParams.get('external_reference');
            const status = urlParams.get('status') || urlParams.get('collection_status');

            if (!paymentId || !externalReference) {
                setError('No se encontraron los datos del pago en la URL.');
                setLoading(false);
                return;
            }

            try {
                // Llamar al backend para validar el pago
                const response = await fetch(
                    `${API_URL}/api/payments/validate/?payment_id=${paymentId}&external_reference=${externalReference}&status=${status}`
                );

                const data: PaymentData = await response.json();
                setPaymentData(data);
            } catch (err) {
                console.error('Error validating payment:', err);
                setError('Error al verificar el pago. Por favor, contacta a soporte.');
            } finally {
                setLoading(false);
            }
        };

        validatePayment();
    }, []);

    const handleDownload = () => {
        if (paymentData?.download_url) {
            window.open(`${API_URL}${paymentData.download_url}`, '_blank');
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 animate-in fade-in duration-500">
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center">
                    <Loader2 size={40} className="text-green-500 animate-spin" />
                </div>
                <h1 className="text-2xl font-bold">Verificando tu pago...</h1>
                <p className="text-gray-400">Esto solo tomará un momento</p>
            </div>
        );
    }

    // Error state
    if (error || (paymentData && !paymentData.success)) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 animate-in fade-in duration-500 max-w-lg mx-auto text-center">
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center">
                    <XCircle size={40} className="text-red-500" />
                </div>
                <h1 className="text-2xl font-bold">Hubo un problema</h1>
                <p className="text-gray-400">{error || paymentData?.error || 'El pago no pudo ser procesado.'}</p>

                <div className="flex gap-4 mt-4">
                    <button
                        onClick={() => setView(AppView.CHECKOUT)}
                        className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all"
                    >
                        Intentar de nuevo
                    </button>
                    <button
                        onClick={() => setView(AppView.LANDING)}
                        className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all"
                    >
                        Volver al inicio
                    </button>
                </div>
            </div>
        );
    }

    // Success state
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-8 animate-in fade-in duration-500 max-w-2xl mx-auto text-center py-12">
            {/* Success Icon */}
            <div className="relative">
                <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center animate-in zoom-in duration-500">
                    <CheckCircle size={48} className="text-green-500" />
                </div>
                <div className="absolute inset-0 w-24 h-24 bg-green-500/20 rounded-full animate-ping" />
            </div>

            {/* Success Message */}
            <div className="space-y-3">
                <h1 className="text-4xl font-extrabold text-white">¡Pago Exitoso!</h1>
                <p className="text-xl text-gray-300">{paymentData?.message}</p>
            </div>

            {/* Payment Details */}
            <div className="glass p-6 rounded-2xl border border-white/10 w-full max-w-md space-y-4">
                <h2 className="font-bold text-lg text-left">Detalles de la compra</h2>

                <div className="space-y-3 text-sm">
                    {paymentData?.customer_name && (
                        <div className="flex justify-between">
                            <span className="text-gray-400">Nombre:</span>
                            <span className="font-medium">{paymentData.customer_name}</span>
                        </div>
                    )}
                    {paymentData?.customer_email && (
                        <div className="flex justify-between">
                            <span className="text-gray-400">Email:</span>
                            <span className="font-medium">{paymentData.customer_email}</span>
                        </div>
                    )}
                    {paymentData?.course_title && (
                        <div className="flex justify-between">
                            <span className="text-gray-400">Curso:</span>
                            <span className="font-medium">{paymentData.course_title}</span>
                        </div>
                    )}
                    {paymentData?.amount && (
                        <div className="flex justify-between">
                            <span className="text-gray-400">Total pagado:</span>
                            <span className="font-medium text-green-500">${paymentData.amount.toFixed(2)}</span>
                        </div>
                    )}
                    {paymentData?.payment_id && (
                        <div className="flex justify-between">
                            <span className="text-gray-400">ID de pago:</span>
                            <span className="font-mono text-xs">{paymentData.payment_id}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Download Button */}
            {paymentData?.download_url && (
                <button
                    onClick={handleDownload}
                    className="flex items-center gap-3 px-8 py-4 bg-green-600 hover:bg-green-700 
                   text-white font-bold rounded-2xl text-lg transition-all hover:scale-105
                   shadow-lg shadow-green-500/20"
                >
                    <Download size={24} />
                    Descargar Curso
                </button>
            )}

            {/* Email Notice */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 max-w-md">
                <AlertCircle size={20} className="text-blue-400 shrink-0 mt-0.5" />
                <p className="text-sm text-blue-300 text-left">
                    También te enviamos un email a <strong>{paymentData?.customer_email}</strong> con el link de descarga.
                </p>
            </div>

            {/* Back to Home */}
            <button
                onClick={() => setView(AppView.LANDING)}
                className="text-gray-400 hover:text-white transition-colors text-sm"
            >
                ← Volver al inicio
            </button>
        </div>
    );
};

export default PaymentSuccessPage;
