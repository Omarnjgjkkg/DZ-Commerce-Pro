import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';

const CountdownTimer: React.FC = () => {
  const { t, theme } = useStore();
  const isDark = theme === 'dark';
  const [tl, setTl] = useState({ d: 3, h: 12, m: 45, s: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTl(p => {
        let { d, h, m, s } = p;
        s--; if (s < 0) { s = 59; m--; } if (m < 0) { m = 59; h--; } if (h < 0) { h = 23; d--; } if (d < 0) { d = 3; h = 12; m = 45; s = 30; }
        return { d, h, m, s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const B = ({ v, l }: { v: number; l: string }) => (
    <div className="text-center">
      <div className={`text-lg sm:text-xl font-black rounded-lg px-2 py-1 min-w-[40px] ${isDark ? 'bg-white/10 text-white' : 'bg-white text-primary-700 shadow'}`}>
        {String(v).padStart(2, '0')}
      </div>
      <span className="text-[10px] block text-white/60 mt-0.5">{l}</span>
    </div>
  );

  return (
    <section className={`py-4 ${isDark ? 'bg-gradient-to-r from-purple-900/80 via-primary-900/80 to-pink-900/80' : 'bg-gradient-to-r from-red-500 via-pink-500 to-purple-500'}`}>
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-center sm:text-start">
          <span className="text-base">🔥</span>
          <span className="text-white font-bold text-sm">{t('specialOffer')}</span>
          <span className="text-white/60 text-xs">- {t('limitedTime')}</span>
        </div>
        <div className="flex items-center gap-2">
          <B v={tl.d} l={t('days')} />
          <span className="text-white/50 font-bold text-sm">:</span>
          <B v={tl.h} l={t('hours')} />
          <span className="text-white/50 font-bold text-sm">:</span>
          <B v={tl.m} l={t('minutes')} />
          <span className="text-white/50 font-bold text-sm">:</span>
          <B v={tl.s} l={t('seconds')} />
        </div>
        <button onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })} className="px-4 py-1.5 bg-white text-primary-700 rounded-lg font-bold text-xs hover:bg-gray-100 transition-all shadow">
          {t('shopNow')}
        </button>
      </div>
    </section>
  );
};

export default CountdownTimer;
