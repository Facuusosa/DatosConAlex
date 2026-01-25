import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import PlanillasPage from './pages/PlanillasPage';
import PlanillaDetailPage from './pages/PlanillaDetailPage';
import OfertasPage from './pages/OfertasPage';
import CursosPage from './pages/CursosPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentFailedPage from './pages/PaymentFailedPage';
import PaymentPendingPage from './pages/PaymentPendingPage';
import { AppView } from './types';

/**
 * ============================================================================
 * Datos con Alex - App Principal
 * ============================================================================
 * 
 * Plataforma de venta de planillas Excel premium.
 * Flujo: Landing -> Planillas/Ofertas -> Detalle -> Checkout -> Mercado Pago
 *        -> PaymentSuccess/Failed/Pending
 * 
 * ============================================================================
 */

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.LANDING);
  const [selectedPlanillaId, setSelectedPlanillaId] = useState<string | null>(null);
  const [checkoutPlanillaId, setCheckoutPlanillaId] = useState<string | null>(null);
  const [checkoutOfertaId, setCheckoutOfertaId] = useState<string | null>(null);

  // Check URL for payment return pages on mount
  useEffect(() => {
    const path = window.location.pathname;

    if (path === '/pago-exitoso') {
      setCurrentView(AppView.PAYMENT_SUCCESS);
    } else if (path === '/pago-fallido') {
      setCurrentView(AppView.PAYMENT_FAILED);
    } else if (path === '/pago-pendiente') {
      setCurrentView(AppView.PAYMENT_PENDING);
    }
  }, []);

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  const renderView = () => {
    switch (currentView) {
      case AppView.LANDING:
        return <LandingPage setView={setCurrentView} />;

      case AppView.PLANILLAS:
        return (
          <PlanillasPage
            setView={setCurrentView}
            setSelectedPlanillaId={setSelectedPlanillaId}
          />
        );

      case AppView.PLANILLA_DETAIL:
        return (
          <PlanillaDetailPage
            setView={setCurrentView}
            planillaId={selectedPlanillaId}
            setCheckoutPlanillaId={setCheckoutPlanillaId}
          />
        );

      case AppView.OFERTAS:
        return (
          <OfertasPage
            setView={setCurrentView}
            setCheckoutOfertaId={setCheckoutOfertaId}
          />
        );

      case AppView.CURSOS:
        return <CursosPage setView={setCurrentView} />;

      case AppView.CHECKOUT:
        return (
          <CheckoutPage
            setView={setCurrentView}
            planillaId={checkoutPlanillaId}
            ofertaId={checkoutOfertaId}
          />
        );

      case AppView.PAYMENT_SUCCESS:
        return <PaymentSuccessPage setView={setCurrentView} />;

      case AppView.PAYMENT_FAILED:
        return <PaymentFailedPage setView={setCurrentView} />;

      case AppView.PAYMENT_PENDING:
        return <PaymentPendingPage setView={setCurrentView} />;

      default:
        return <LandingPage setView={setCurrentView} />;
    }
  };

  return (
    <Layout
      currentView={currentView}
      setView={setCurrentView}
    >
      {renderView()}
    </Layout>
  );
};

export default App;
