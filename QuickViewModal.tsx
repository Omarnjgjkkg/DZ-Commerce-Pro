import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

const QuickViewModal: React.FC = () => {
  const { quickViewProduct, setQuickViewProduct, addToCart, toggleWishlist, isInWishlist, formatPrice, getCategoryLabel, t, theme, addReview, getProductReviews } = useStore();
  const [reviewForm, setReviewForm] = useState({ name: '', rating: 5, comment: '' });
  const [showReview, setShowReview] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const isDark = theme === 'dark';

  if (!quickViewProduct) return null;
  const reviews = getProductReviews(quickViewProduct.id);
  const inWishlist = isInWishlist(quickViewProduct.id);
  const discount = quickViewProduct.originalPrice ? Math.round(((quickViewProduct.originalPrice - quickViewProduct.price) / quickViewProduct.originalPrice) * 100) : 0;
  const images = quickViewProduct.images.length > 0 ? quickViewProduct.images : [''];

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewForm.name && reviewForm.comment) { addReview({ productId: quickViewProduct.id, ...reviewForm }); setReviewForm({ name: '', rating: 5, comment: '' }); setShowReview(false); }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setQuickViewProduct(null)} />
      <div className={`relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl shadow-2xl animate-scaleIn ${isDark ? 'bg-dark-card' : 'bg-white'}`}>
        <button onClick={() => setQuickViewProduct(null)} className={`absolute top-3 z-10 w-8 h-8 rounded-full flex items-center justify-center ${isDark ? 'bg-dark-bg text-dark-text' : 'bg-gray-100 text-gray-600'}`} style={{right:'12px'}}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="grid md:grid-cols-2 gap-4 p-5">
          {/* Gallery */}
          <div>
            <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 mb-2">
              <img src={images[activeImg]} alt={quickViewProduct.name} className="w-full h-full object-cover" />
              {discount > 0 && <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">-{discount}%</div>}
              {images.length > 1 && (
                <>
                  <button onClick={() => setActiveImg(p => (p - 1 + images.length) % images.length)} className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/80 rounded-full flex items-center justify-center shadow text-xs">›</button>
                  <button onClick={() => setActiveImg(p => (p + 1) % images.length)} className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/80 rounded-full flex items-center justify-center shadow text-xs">‹</button>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-1.5 overflow-x-auto">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)} className={`w-12 h-12 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${i === activeImg ? 'border-primary-500' : (isDark ? 'border-dark-border opacity-50' : 'border-gray-200 opacity-50')}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded w-fit mb-2 ${isDark ? 'text-primary-400 bg-primary-500/10' : 'text-primary-600 bg-primary-50'}`}>{getCategoryLabel(quickViewProduct.category)}</span>
            <h2 className={`text-lg font-bold mb-2 ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>{quickViewProduct.name}</h2>
            <div className="flex items-center gap-1.5 mb-3">
              <div className="flex">{[1,2,3,4,5].map(s => <span key={s} className={`text-xs ${s <= quickViewProduct.rating ? 'text-amber-400' : 'text-gray-300'}`}>★</span>)}</div>
              <span className={`text-[10px] ${isDark ? 'text-dark-text2' : 'text-gray-500'}`}>({quickViewProduct.reviews} {t('reviews')})</span>
            </div>
            <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-dark-text2' : 'text-gray-600'}`}>{quickViewProduct.description}</p>
            <div className="flex items-baseline gap-2 mb-4">
              <span className={`text-2xl font-black ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>{formatPrice(quickViewProduct.price)}</span>
              {quickViewProduct.originalPrice && <span className={`text-sm line-through ${isDark ? 'text-dark-text2' : 'text-gray-400'}`}>{formatPrice(quickViewProduct.originalPrice)}</span>}
            </div>
            <div className="flex gap-2 mb-4">
              <button onClick={() => { addToCart(quickViewProduct); setQuickViewProduct(null); }} className="flex-1 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
                {t('addToCart')}
              </button>
              <button onClick={() => toggleWishlist(quickViewProduct.id)} className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${inWishlist ? 'bg-red-500 text-white' : (isDark ? 'bg-dark-bg text-dark-text2' : 'bg-gray-100 text-gray-500')}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill={inWishlist ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              </button>
            </div>

            {/* Reviews */}
            <div className={`border-t pt-3 flex-1 ${isDark ? 'border-dark-border' : 'border-gray-100'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`font-bold text-xs ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>{t('reviews')} ({reviews.length})</span>
                <button onClick={() => setShowReview(!showReview)} className="text-[10px] text-primary-500 font-semibold">{t('writeReview')}</button>
              </div>
              {showReview && (
                <form onSubmit={handleSubmitReview} className={`mb-3 p-3 rounded-xl ${isDark ? 'bg-dark-bg' : 'bg-gray-50'}`}>
                  <input type="text" placeholder={t('yourName')} value={reviewForm.name} onChange={(e) => setReviewForm({...reviewForm, name: e.target.value})} className={`w-full p-2 rounded-lg mb-2 text-xs ${isDark ? 'bg-dark-card border-dark-border text-dark-text' : 'bg-white border border-gray-200'}`} required />
                  <div className="flex gap-1 mb-2">{[1,2,3,4,5].map(s => (<button key={s} type="button" onClick={() => setReviewForm({...reviewForm, rating: s})} className={`text-sm ${s <= reviewForm.rating ? 'text-amber-400' : 'text-gray-300'}`}>★</button>))}</div>
                  <textarea placeholder={t('yourReview')} value={reviewForm.comment} onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})} className={`w-full p-2 rounded-lg mb-2 text-xs resize-none ${isDark ? 'bg-dark-card border-dark-border text-dark-text' : 'bg-white border border-gray-200'}`} rows={2} required />
                  <button type="submit" className="w-full py-2 bg-primary-600 text-white rounded-lg font-semibold text-xs">{t('submitReview')}</button>
                </form>
              )}
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {reviews.length > 0 ? reviews.map(r => (
                  <div key={r.id} className={`p-2 rounded-lg ${isDark ? 'bg-dark-bg' : 'bg-gray-50'}`}>
                    <div className="flex items-center justify-between mb-0.5">
                      <span className={`font-semibold text-[10px] ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>{r.name}</span>
                      <div className="flex">{[1,2,3,4,5].map(s => <span key={s} className={`text-[8px] ${s <= r.rating ? 'text-amber-400' : 'text-gray-300'}`}>★</span>)}</div>
                    </div>
                    <p className={`text-[10px] ${isDark ? 'text-dark-text2' : 'text-gray-600'}`}>{r.comment}</p>
                  </div>
                )) : <p className={`text-[10px] text-center py-3 ${isDark ? 'text-dark-text2' : 'text-gray-400'}`}>{t('noReviews')}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default QuickViewModal;
