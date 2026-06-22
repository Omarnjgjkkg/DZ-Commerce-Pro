import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Language, CurrencyCode, currencies, languageInfo } from '../data/translations';

const SettingsPanel: React.FC = () => {
  const { language, currency, theme, setLanguage, setCurrency, toggleTheme, t, isRtl } = useStore();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const isDark = theme === 'dark';

  useEffect(() => {
    const h = (e: MouseEvent) => { if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <div ref={panelRef} className="fixed bottom-5 z-[90]" style={{ [isRtl ? 'left' : 'right']: '16px' }}>
      <button onClick={() => setOpen(!open)}
        className={`w-10 h-10 rounded-xl shadow-lg flex items-center justify-center transition-all hover:scale-105 ${open ? 'rotate-45' : ''} ${isDark ? 'bg-primary-600 text-white' : 'bg-primary-600 text-white'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {open && (
        <div className={`absolute bottom-14 ${isRtl ? 'left-0' : 'right-0'} w-64 rounded-2xl shadow-2xl border overflow-hidden animate-scaleIn ${isDark ? 'bg-dark-card border-dark-border' : 'bg-white border-gray-100'}`}>
          <div className="bg-gradient-to-l from-primary-600 to-primary-700 px-4 py-3 flex items-center justify-between">
            <span className="text-white text-sm font-bold">{t('settings')}</span>
            <button onClick={() => setOpen(false)} className="text-white/60 hover:text-white"><svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>

          <div className="p-3 space-y-4">
            {/* Theme */}
            <div>
              <label className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 block ${isDark ? 'text-dark-text2' : 'text-gray-400'}`}>{t('appearance')}</label>
              <button onClick={toggleTheme} className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm ${isDark ? 'bg-dark-bg border border-dark-border' : 'bg-gray-50 border border-gray-200'}`}>
                <span className={`text-xs font-medium ${isDark ? 'text-dark-text' : 'text-gray-700'}`}>{isDark ? '🌙 ' + t('darkMode') : '☀️ ' + t('lightMode')}</span>
                <div className={`w-9 h-5 rounded-full relative transition-all ${isDark ? 'bg-primary-600' : 'bg-gray-300'}`}>
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${isDark ? (isRtl ? 'right-0.5' : 'left-[calc(100%-18px)]') : (isRtl ? 'right-[calc(100%-18px)]' : 'left-0.5')}`} />
                </div>
              </button>
            </div>

            {/* Language */}
            <div>
              <label className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 block ${isDark ? 'text-dark-text2' : 'text-gray-400'}`}>{t('language')}</label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['ar', 'en', 'fr'] as Language[]).map(l => (
                  <button key={l} onClick={() => setLanguage(l)} className={`flex flex-col items-center gap-0.5 px-2 py-2 rounded-xl text-xs font-semibold transition-all ${language === l ? 'bg-primary-600 text-white shadow' : (isDark ? 'bg-dark-bg text-dark-text2 border border-dark-border' : 'bg-gray-50 text-gray-600 border border-gray-200')}`}>
                    <span className="text-base">{languageInfo[l].flag}</span>
                    <span className="text-[10px]">{languageInfo[l].nativeName}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Currency */}
            <div>
              <label className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 block ${isDark ? 'text-dark-text2' : 'text-gray-400'}`}>{t('currency')}</label>
              <div className="space-y-1.5">
                {(['DZD', 'USD'] as CurrencyCode[]).map(c => {
                  const info = currencies[c];
                  return (
                    <button key={c} onClick={() => setCurrency(c)} className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${currency === c ? 'bg-primary-600 text-white shadow' : (isDark ? 'bg-dark-bg text-dark-text2 border border-dark-border' : 'bg-gray-50 text-gray-600 border border-gray-200')}`}>
                      <span className="text-sm">{info.flag}</span>
                      <span className="flex-1 text-start">{info.name[language]}</span>
                      {currency === c && <span>✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPanel;
