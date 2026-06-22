import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

const Footer: React.FC = () => {
  const { t, theme, getCategoryLabel } = useStore();
  const isDark = theme === 'dark';
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => { e.preventDefault(); if (email.trim()) { setSubscribed(true); setEmail(''); setTimeout(() => setSubscribed(false), 3000); } };

  return (
    <footer className={isDark ? 'bg-[#080b14] text-white' : 'bg-gray-900 text-white'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter */}
        <div className="py-8 border-b border-gray-800">
          <div className="max-w-lg mx-auto text-center">
            <h3 className="text-lg font-bold mb-2">{t('newsletter')}</h3>
            <p className="text-gray-400 text-xs mb-4">{t('newsletterDesc')}</p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('newsletterPlaceholder')} required
                className="flex-1 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
              <button type="submit" className="px-5 py-2.5 bg-primary-600 text-white rounded-xl font-bold text-xs hover:bg-primary-700 transition-all">{subscribed ? '✅' : t('subscribe')}</button>
            </form>
          </div>
        </div>

        <div className="py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              </div>
              <span className="text-base font-bold">{t('storeName')}</span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed mb-4">{t('footerDesc')}</p>
            <div className="flex gap-2">{['🐦', '📷', '💬'].map((ic, i) => (<a key={i} href="#" className="w-7 h-7 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-all text-xs">{ic}</a>))}</div>
          </div>
          <div>
            <h4 className="text-sm font-bold mb-3">{t('quickLinks')}</h4>
            <ul className="space-y-1.5">{[t('homePage'), t('products'), t('offers'), t('aboutUs')].map(l => (<li key={l}><a href="#" className="text-gray-400 hover:text-white text-xs transition-colors">{l}</a></li>))}</ul>
          </div>
          <div>
            <h4 className="text-sm font-bold mb-3">{t('sections')}</h4>
            <ul className="space-y-1.5">{['إلكترونيات', 'أزياء', 'إكسسوارات', 'أجهزة منزلية'].map(c => (<li key={c}><a href="#" className="text-gray-400 hover:text-white text-xs transition-colors">{getCategoryLabel(c)}</a></li>))}</ul>
          </div>
          <div>
            <h4 className="text-sm font-bold mb-3">{t('contactInfo')}</h4>
            <ul className="space-y-2">
              <li className="text-gray-400 text-xs flex items-center gap-1.5"><span className="text-[10px]">📞</span><span dir="ltr">+213 550 123 456</span></li>
              <li className="text-gray-400 text-xs flex items-center gap-1.5"><span className="text-[10px]">📧</span>info@mystore.dz</li>
              <li className="text-gray-400 text-xs flex items-center gap-1.5"><span className="text-[10px]">📍</span>{t('location')}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-gray-500 text-[10px]">{t('allRightsReserved')}</p>
          <div className="flex gap-1.5">{['VISA', 'MC', 'CCP', 'بريدي'].map(m => (<span key={m} className="bg-gray-800 px-2 py-0.5 rounded text-[9px] font-bold text-gray-400">{m}</span>))}</div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
