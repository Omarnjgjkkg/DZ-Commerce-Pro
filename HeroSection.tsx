import React from 'react';
import { useStore } from '../context/StoreContext';

const HeroSection: React.FC = () => {
  const { setSelectedCategory, t, theme } = useStore();
  const isDark = theme === 'dark';

  return (
    <section className={`relative overflow-hidden ${isDark ? 'bg-gradient-to-br from-[#0c0f1a] via-[#131836] to-[#0c0f1a]' : 'bg-gradient-to-br from-primary-800 via-primary-700 to-primary-900'}`}>
      <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
      <div className="absolute top-0 right-0 w-60 h-60 bg-accent-500/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary-400/15 rounded-full blur-[100px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="text-center lg:text-start animate-fadeIn">
            <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-white/80 text-xs font-medium mb-4">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              {t('heroExclusive')}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
              {t('heroTitle1')}<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-amber-300 to-yellow-400">{t('heroTitle2')}</span><br />
              {t('heroTitle3')}
            </h1>
            <p className="text-sm text-white/60 max-w-md mx-auto lg:mx-0 mb-6 leading-relaxed">{t('heroDesc')}</p>
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <button onClick={() => { setSelectedCategory('الكل'); document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="px-6 py-2.5 bg-white text-primary-700 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                {t('shopNow')}
              </button>
              <button onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-6 py-2.5 bg-white/10 backdrop-blur-sm text-white border border-white/15 rounded-xl font-bold text-sm hover:bg-white/20 transition-all">
                {t('browseProducts')}
              </button>
            </div>
          </div>

          <div className="hidden lg:grid grid-cols-2 gap-3 animate-slideUp">
            {[
              { icon: '📦', val: '+1000', label: t('productsAvailable') },
              { icon: '⭐', val: '4.9', label: t('customerRating') },
              { icon: '🚚', val: t('freeLabel'), label: t('fastDelivery') },
              { icon: '🔒', val: '100%', label: t('securePayment') },
            ].map((s, i) => (
              <div key={i} className={`${i % 2 === 1 ? 'mt-6' : ''} rounded-2xl p-4 border transition-all hover:bg-white/10 ${isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white/[0.08] border-white/[0.08]'}`}>
                <div className="text-xl mb-2">{s.icon}</div>
                <h3 className="text-xl font-bold text-white mb-0.5">{s.val}</h3>
                <p className="text-white/50 text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none"><path d="M0 30L60 27C120 24 240 18 360 16C480 14 600 16 720 22C840 28 960 38 1080 37C1200 36 1320 24 1380 18L1440 12V60H0Z" fill={isDark ? '#0c0f1a' : '#f8fafc'} /></svg>
      </div>
    </section>
  );
};

export default HeroSection;
