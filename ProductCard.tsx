import React, { useState } from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

const ProductCard: React.FC<{ product: Product; index: number }> = ({ product, index }) => {
  const { addToCart, toggleWishlist, isInWishlist, setQuickViewProduct, t, formatPrice, getCategoryLabel, theme, addToRecentlyViewed, toggleCompare, isInCompare } = useStore();
  const isDark = theme === 'dark';
  const inWishlist = isInWishlist(product.id);
  const inCompare = isInCompare(product.id);
  const [imgIdx, setImgIdx] = useState(0);
  const imgs = product.images.length > 0 ? product.images : [''];
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
  const handleView = () => { addToRecentlyViewed(product.id); setQuickViewProduct(product); };

  return (
    <div className={`group rounded-2xl overflow-hidden transition-all duration-400 border animate-fadeIn flex flex-col ${isDark ? 'bg-dark-card border-dark-border hover:border-primary-500/30 hover:shadow-xl hover:shadow-primary-500/5' : 'bg-white border-gray-100 hover:border-primary-200 hover:shadow-xl hover:shadow-primary-500/5'}`}
      style={{ animationDelay: `${index * 60}ms` }}>

      <div className="relative overflow-hidden aspect-[4/3]" onMouseEnter={() => imgs.length > 1 && setImgIdx(1)} onMouseLeave={() => setImgIdx(0)}>
        <img src={imgs[imgIdx]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />

        {product.badge && <div className="absolute top-2 right-2 bg-gradient-to-l from-red-500 to-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow">{product.badge}</div>}
        {discount > 0 && <div className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-bold w-8 h-8 rounded-full flex items-center justify-center shadow">-{discount}%</div>}
        {imgs.length > 1 && <div className={`absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-bold ${isDark ? 'bg-black/50 text-white' : 'bg-white/80 text-gray-600'}`}>+{imgs.length}</div>}

        {/* Wishlist + Compare buttons */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ top: product.badge ? '28px' : '8px' }}>
          <button onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }} className={`w-7 h-7 rounded-full flex items-center justify-center transition-all text-xs ${inWishlist ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-500 hover:text-red-500'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill={inWishlist ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          </button>
          <button onClick={(e) => { e.stopPropagation(); toggleCompare(product.id); }} className={`w-7 h-7 rounded-full flex items-center justify-center transition-all text-xs ${inCompare ? 'bg-blue-500 text-white' : 'bg-white/90 text-gray-500 hover:text-blue-500'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          </button>
        </div>

        {/* Quick View overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-end justify-center pb-3 opacity-0 group-hover:opacity-100">
          <button onClick={handleView} className="bg-white/95 text-gray-700 px-3 py-1.5 rounded-lg font-semibold text-xs shadow-lg flex items-center gap-1 translate-y-2 group-hover:translate-y-0 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            {t('quickView')}
          </button>
        </div>
      </div>

      <div className="p-3 flex flex-col flex-1">
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded w-fit mb-2 ${isDark ? 'text-primary-400 bg-primary-500/10' : 'text-primary-600 bg-primary-50'}`}>{getCategoryLabel(product.category)}</span>
        <h3 className={`font-bold text-sm mb-1 line-clamp-1 cursor-pointer ${isDark ? 'text-dark-text group-hover:text-primary-400' : 'text-gray-900 group-hover:text-primary-600'}`} onClick={handleView}>{product.name}</h3>
        <p className={`text-xs leading-relaxed mb-2 line-clamp-2 flex-1 ${isDark ? 'text-dark-text2' : 'text-gray-500'}`}>{product.description}</p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex">{[1,2,3,4,5].map(s => <span key={s} className={`text-[10px] ${s <= Math.floor(product.rating) ? 'text-amber-400' : (isDark ? 'text-dark-border' : 'text-gray-200')}`}>★</span>)}</div>
          <span className={`text-[10px] ${isDark ? 'text-dark-text2' : 'text-gray-400'}`}>({product.reviews})</span>
          {product.stockCount !== undefined && product.stockCount <= 10 && <span className="text-[10px] text-red-500 font-medium mr-auto">⚡ {product.stockCount} {t('stock')}</span>}
        </div>

        <div className={`flex items-center justify-between pt-2 border-t ${isDark ? 'border-dark-border' : 'border-gray-50'}`}>
          <div>
            <span className={`text-base font-black ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>{formatPrice(product.price)}</span>
            {product.originalPrice && <span className={`text-[10px] line-through block ${isDark ? 'text-dark-text2' : 'text-gray-400'}`}>{formatPrice(product.originalPrice)}</span>}
          </div>
          <button onClick={() => addToCart(product)} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isDark ? 'bg-primary-500/15 hover:bg-primary-600 text-primary-400 hover:text-white' : 'bg-primary-50 hover:bg-primary-600 text-primary-600 hover:text-white'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
