import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';

const Navbar: React.FC = () => {
  const { currentPage, setCurrentPage, cartCount, searchQuery, setSearchQuery, t, theme, isRtl, isAdmin, logoutAdmin, setShowLogin } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isDark = theme === 'dark';

  // SECRET: 5 taps on logo to open admin login
  const tapCount = useRef(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const handleLogoClick = () => {
    if (isAdmin) { setCurrentPage('admin'); return; }
    tapCount.current++;
    if (tapCount.current >= 8) {
      tapCount.current = 0;
      setShowLogin(true);
    }
    clearTimeout(tapTimer.current);
    tapTimer.current = setTimeout(() => { tapCount.current = 0; }, 2000);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navBg = scrolled
    ? (isDark ? 'bg-dark-card/98 border-dark-border shadow-lg shadow-black/30' : 'bg-white/98 border-gray-200/60 shadow-md')
    : (isDark ? 'bg-transparent border-transparent' : 'bg-transparent border-transparent');

  return (
    <nav className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-all duration-300 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo - SECRET ADMIN TRIGGER: 5 taps */}
          <div className="flex items-center gap-2 cursor-pointer group select-none" onClick={handleLogoClick}>
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-black bg-gradient-to-l from-primary-500 to-primary-700 bg-clip-text text-transparent">{t('storeName')}</span>
              {isAdmin && <span className="block text-[8px] text-red-400 font-bold -mt-1">⚡ وضع الأدمن</span>}
            </div>
          </div>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <input type="text" placeholder={t('searchPlaceholder')} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full py-2 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all ${isDark ? 'bg-dark-bg border border-dark-border text-dark-text placeholder-dark-text2' : 'bg-gray-100 border border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-white'} ${isRtl ? 'pl-9 pr-4' : 'pr-9 pl-4'}`} />
              <svg xmlns="http://www.w3.org/2000/svg" className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-dark-text2' : 'text-gray-400'} ${isRtl ? 'left-3' : 'right-3'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Home */}
            <button onClick={() => setCurrentPage('home')}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${currentPage === 'home' ? (isDark ? 'bg-primary-500/15 text-primary-400' : 'bg-primary-50 text-primary-700') : (isDark ? 'text-dark-text2 hover:bg-dark-bg' : 'text-gray-500 hover:bg-gray-100')}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              {t('home')}
            </button>

            {/* Admin button - ONLY visible when logged in */}
            {isAdmin && (
              <button onClick={() => setCurrentPage('admin')}
                className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${currentPage === 'admin' ? 'bg-red-500/15 text-red-400' : (isDark ? 'text-red-400/70 hover:bg-dark-bg' : 'text-red-500/70 hover:bg-red-50')}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                Admin
              </button>
            )}

            {/* Cart */}
            <button onClick={() => setCurrentPage('cart')}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${currentPage === 'cart' || currentPage === 'checkout' ? 'bg-primary-600 text-white shadow-md shadow-primary-500/25' : (isDark ? 'bg-dark-bg text-dark-text hover:bg-dark-border' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
              <span className="hidden sm:inline">{t('cart')}</span>
              {cartCount > 0 && <span className={`absolute -top-1.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold ${isRtl ? '-left-1.5' : '-right-1.5'}`}>{cartCount}</span>}
            </button>

            {/* Logout - only when admin */}
            {isAdmin && (
              <button onClick={logoutAdmin} className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-red-500/90 text-white hover:bg-red-600 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              </button>
            )}

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={`sm:hidden p-1.5 rounded-lg ${isDark ? 'text-dark-text hover:bg-dark-bg' : 'text-gray-600 hover:bg-gray-100'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d={mobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden pb-2">
          <input type="text" placeholder={t('searchPlaceholder')} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full py-2 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 ${isDark ? 'bg-dark-bg border border-dark-border text-dark-text placeholder-dark-text2' : 'bg-gray-100 border border-gray-200'} ${isRtl ? 'pl-9 pr-3' : 'pr-9 pl-3'}`} />
        </div>

        {mobileMenuOpen && (
          <div className={`sm:hidden pb-3 border-t pt-2 animate-fadeIn ${isDark ? 'border-dark-border' : 'border-gray-100'}`}>
            <button onClick={() => { setCurrentPage('home'); setMobileMenuOpen(false); }} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold mb-1 ${currentPage === 'home' ? (isDark ? 'bg-primary-500/15 text-primary-400' : 'bg-primary-50 text-primary-700') : (isDark ? 'text-dark-text2' : 'text-gray-600')}`}>{t('home')}</button>
            {isAdmin && (
              <button onClick={() => { setCurrentPage('admin'); setMobileMenuOpen(false); }} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-red-400`}>⚡ {t('adminPanel')}</button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
