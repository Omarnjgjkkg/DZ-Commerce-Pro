import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ProductsSection from './components/ProductsSection';
import CartPage from './components/CartPage';
import AdminPage from './components/AdminPage';
import Footer from './components/Footer';
import Notification from './components/Notification';
import SettingsPanel from './components/SettingsPanel';
import AnnouncementBar from './components/AnnouncementBar';
import CountdownTimer from './components/CountdownTimer';
import BackToTop from './components/BackToTop';
import QuickViewModal from './components/QuickViewModal';
import WishlistButton from './components/WishlistButton';
import AdminLogin from './components/AdminLogin';
import CheckoutFlow from './components/CheckoutFlow';

/* Scroll Progress Bar */
const ScrollProgress: React.FC = () => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return <div className="fixed top-0 left-0 right-0 z-[200] h-1 bg-transparent"><div className="h-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-150" style={{ width: `${progress}%` }} /></div>;
};

const AppContent: React.FC = () => {
  const { currentPage, theme } = useStore();
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-dark-bg' : 'bg-[#f4f3ef]'}`}>
      <ScrollProgress />
      <AnnouncementBar />
      <Navbar />
      <Notification />
      <SettingsPanel />
      <WishlistButton />
      <BackToTop />
      <QuickViewModal />
      <AdminLogin />

      {currentPage === 'home' && (<><HeroSection /><CountdownTimer /><ProductsSection /></>)}
      {currentPage === 'cart' && <CartPage />}
      {currentPage === 'checkout' && <CheckoutFlow />}
      {currentPage === 'admin' && <AdminPage />}

      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (<StoreProvider><AppContent /></StoreProvider>);
};

export default App;
