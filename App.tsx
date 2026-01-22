import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import CoursePage from './pages/CoursePage';
import CatalogPage from './pages/CatalogPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentFailedPage from './pages/PaymentFailedPage';
import PaymentPendingPage from './pages/PaymentPendingPage';
import { AppView } from './types';

/**
 * ============================================================================
 * AIExcel - App Principal (Simplificado)
 * ============================================================================
 * 
 * Versión simplificada sin Login ni About Us.
 * Flujo principal: Landing -> Catalog -> Course -> Checkout -> Mercado Pago
 *                  -> PaymentSuccess/Failed/Pending
 * 
 * ============================================================================
 */

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.LANDING);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

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
      case AppView.CATALOG:
        return (
          <CatalogPage
            setView={setCurrentView}
            setSelectedCourseId={setSelectedCourseId}
          />
        );
      case AppView.COURSE:
        return (
          <CoursePage
            setView={setCurrentView}
            courseId={selectedCourseId}
          />
        );
      case AppView.CHECKOUT:
        return <CheckoutPage setView={setCurrentView} />;
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
