import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';

const BackToTop: React.FC = () => {
  const { isRtl } = useStore();
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = () => setVisible(window.scrollY > 300); window.addEventListener('scroll', t); return () => window.removeEventListener('scroll', t); }, []);
  if (!visible) return null;
  return (
    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`fixed bottom-[72px] z-50 w-9 h-9 bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow-md flex items-center justify-center transition-all hover:scale-105 animate-fadeIn ${isRtl ? 'left-4' : 'right-4'}`}>
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
    </button>
  );
};
export default BackToTop;
