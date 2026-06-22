import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

const AdminLogin: React.FC = () => {
  const { showLogin, setShowLogin, loginAdmin, t, theme } = useStore();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const isDark = theme === 'dark';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginAdmin(code)) { setError(t('loginError')); setCode(''); }
    else { setShowLogin(false); setCode(''); }
  };

  if (!showLogin) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setShowLogin(false); setError(''); }} />
      <div className={`relative w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-scaleIn ${isDark ? 'bg-dark-card' : 'bg-white'}`}>
        <div className="bg-gradient-to-br from-primary-600 to-primary-800 p-6 text-center">
          <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-white">{t('loginTitle')}</h2>
          <p className="text-white/60 text-xs mt-1">{t('loginSubtitle')}</p>
        </div>
        <form onSubmit={handleSubmit} className="p-5">
          <input type="password" value={code} onChange={(e) => setCode(e.target.value)} placeholder={t('loginPlaceholder')}
            className={`w-full px-4 py-3 rounded-xl text-center text-base font-mono tracking-[0.3em] mb-3 focus:outline-none focus:ring-2 focus:ring-primary-500 ${isDark ? 'bg-dark-bg border border-dark-border text-dark-text placeholder-dark-text2' : 'bg-gray-50 border border-gray-200'}`}
            autoFocus autoComplete="off" />
          {error && <p className="text-red-500 text-xs text-center mb-3 animate-fadeIn">{error}</p>}
          <button type="submit" className="w-full py-3 bg-primary-600 text-white rounded-xl font-bold text-sm hover:bg-primary-700 transition-all">{t('loginButton')}</button>
          <button type="button" onClick={() => { setShowLogin(false); setError(''); setCode(''); }}
            className={`w-full py-2 mt-2 rounded-xl text-xs font-medium ${isDark ? 'text-dark-text2' : 'text-gray-500'}`}>{t('cancel')}</button>
        </form>
      </div>
    </div>
  );
};
export default AdminLogin;
