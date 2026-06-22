import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';

const WishlistButton: React.FC = () => {
  const { wishlist, products, t, theme, addToCart, toggleWishlist, formatPrice, setQuickViewProduct } = useStore();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const isDark = theme === 'dark';
  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  useEffect(() => {
    const h = (e: MouseEvent) => { if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <div ref={panelRef} className="fixed top-20 z-[80] right-4">
      <button onClick={() => setOpen(!open)} className={`relative w-9 h-9 rounded-xl shadow-md flex items-center justify-center transition-all hover:scale-105 ${isDark ? 'bg-dark-card text-red-400 border border-dark-border' : 'bg-white text-red-500 border border-gray-200'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill={wishlist.length > 0 ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
        {wishlist.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold">{wishlist.length}</span>}
      </button>
      {open && (
        <div className={`absolute top-11 right-0 w-72 rounded-xl shadow-2xl border overflow-hidden animate-scaleIn ${isDark ? 'bg-dark-card border-dark-border' : 'bg-white border-gray-100'}`}>
          <div className={`px-3 py-2 border-b ${isDark ? 'border-dark-border bg-dark-bg' : 'border-gray-100 bg-gray-50'}`}>
            <span className={`font-bold text-xs ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>❤️ {t('wishlist')} ({wishlist.length})</span>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {wishlistProducts.length > 0 ? wishlistProducts.map(product => (
              <div key={product.id} className={`p-2 border-b flex gap-2 ${isDark ? 'border-dark-border' : 'border-gray-50'}`}>
                <img src={product.images?.[0] || ''} alt="" className="w-12 h-12 rounded-lg object-cover cursor-pointer" onClick={() => { setQuickViewProduct(product); setOpen(false); }} />
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-xs truncate ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>{product.name}</p>
                  <p className={`text-xs font-bold ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>{formatPrice(product.price)}</p>
                  <div className="flex gap-1 mt-1">
                    <button onClick={() => { addToCart(product); toggleWishlist(product.id); }} className="text-[10px] px-1.5 py-0.5 bg-primary-600 text-white rounded">{t('addToCart')}</button>
                    <button onClick={() => toggleWishlist(product.id)} className="text-[10px] px-1.5 py-0.5 bg-red-100 text-red-600 rounded">{t('delete')}</button>
                  </div>
                </div>
              </div>
            )) : <div className="p-6 text-center"><p className={`text-xs ${isDark ? 'text-dark-text2' : 'text-gray-500'}`}>💔 {t('wishlistEmpty')}</p></div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default WishlistButton;
