import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateCartQuantity, clearCart, cartTotal, setCurrentPage, t, formatPrice, getCategoryLabel, theme, couponCode, couponDiscount, applyCoupon, removeCoupon } = useStore();
  const isDark = theme === 'dark';
  const [couponInput, setCouponInput] = useState('');
  // Payment moved to checkout flow

  const handleApplyCoupon = () => { if (couponInput.trim()) { applyCoupon(couponInput.trim()); setCouponInput(''); } };
  const discountAmount = cartTotal * (couponDiscount / 100);
  const subtotalAfterDiscount = cartTotal - discountAmount;
  const taxAmount = subtotalAfterDiscount * 0.15;

  if (cart.length === 0) {
    return (
      <div className={`min-h-[60vh] flex items-center justify-center ${isDark ? 'bg-dark-bg' : 'bg-[#f4f3ef]'}`}>
        <div className="text-center animate-fadeIn">
          <div className="text-8xl mb-6">🛒</div>
          <h2 className={`text-3xl font-bold mb-4 ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>{t('cartEmpty')}</h2>
          <p className={`mb-8 text-lg ${isDark ? 'text-dark-text2' : 'text-gray-500'}`}>{t('cartEmptyDesc')}</p>
          <button onClick={() => setCurrentPage('home')} className="px-8 py-4 bg-primary-600 text-white rounded-2xl font-bold text-lg hover:bg-primary-700 transition-all shadow-lg">{t('browseProducts')}</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-8 lg:py-12 ${isDark ? 'bg-dark-bg' : 'bg-[#f4f3ef]'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 animate-fadeIn">
          <div>
            <h1 className={`text-3xl font-black ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>{t('shoppingCart')}</h1>
            <p className={`mt-1 ${isDark ? 'text-dark-text2' : 'text-gray-500'}`}>{cart.length} {t('productsInCart')}</p>
          </div>
          <button onClick={clearCart} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${isDark ? 'text-red-400 bg-red-900/30' : 'text-red-600 bg-red-50'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            {t('emptyCart')}
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, index) => (
              <div key={item.product.id} className={`rounded-2xl p-4 lg:p-6 border flex gap-4 lg:gap-6 animate-fadeIn ${isDark ? 'bg-dark-card border-dark-border' : 'bg-white border-gray-100 shadow-sm'}`} style={{ animationDelay: `${index * 100}ms` }}>
                <div className={`w-24 h-24 lg:w-32 lg:h-32 rounded-2xl overflow-hidden flex-shrink-0 ${isDark ? 'bg-dark-bg' : 'bg-gray-50'}`}>
                  <img src={item.product.images?.[0] || ''} alt={item.product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className={`font-bold text-lg truncate ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>{item.product.name}</h3>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isDark ? 'text-primary-400 bg-primary-900/40' : 'text-primary-600 bg-primary-50'}`}>{getCategoryLabel(item.product.category)}</span>
                    </div>
                    <button onClick={() => removeFromCart(item.product.id)} className={`p-2 rounded-xl transition-all ${isDark ? 'text-dark-text2 hover:text-red-400' : 'text-gray-400 hover:text-red-500'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                  <div className="flex items-end justify-between mt-4">
                    <div className={`flex items-center gap-1 rounded-xl p-1 ${isDark ? 'bg-dark-bg' : 'bg-gray-50'}`}>
                      <button onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)} className={`w-9 h-9 rounded-lg font-bold transition-colors ${isDark ? 'bg-dark-card text-dark-text hover:bg-dark-border' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>−</button>
                      <span className={`w-10 text-center font-bold ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>{item.quantity}</span>
                      <button onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)} className={`w-9 h-9 rounded-lg font-bold transition-colors ${isDark ? 'bg-dark-card text-dark-text hover:bg-dark-border' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>+</button>
                    </div>
                    <span className={`text-xl font-black ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className={`rounded-3xl p-6 lg:p-8 border sticky top-24 animate-fadeIn ${isDark ? 'bg-dark-card border-dark-border' : 'bg-white border-gray-100 shadow-sm'}`}>
              <h3 className={`text-xl font-bold mb-6 ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>{t('orderSummary')}</h3>

              <div className="mb-6">
                <label className={`text-sm font-medium mb-2 block ${isDark ? 'text-dark-text2' : 'text-gray-500'}`}>{t('couponCode')}</label>
                {couponCode ? (
                  <div className={`flex items-center justify-between p-3 rounded-xl ${isDark ? 'bg-green-900/30 border border-green-500/30' : 'bg-green-50 border border-green-200'}`}>
                    <span className={`font-bold ${isDark ? 'text-green-400' : 'text-green-700'}`}>{couponCode} (-{couponDiscount}%)</span>
                    <button onClick={removeCoupon} className="text-red-500 text-sm">{t('delete')}</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input type="text" value={couponInput} onChange={(e) => setCouponInput(e.target.value)} placeholder={t('enterCoupon')}
                      className={`flex-1 px-4 py-3 rounded-xl text-sm ${isDark ? 'bg-dark-bg border border-dark-border text-dark-text placeholder-dark-text2' : 'bg-gray-50 border border-gray-200'}`} />
                    <button onClick={handleApplyCoupon} className="px-4 py-3 bg-primary-600 text-white rounded-xl font-semibold text-sm hover:bg-primary-700">{t('apply')}</button>
                  </div>
                )}
              </div>

              {/* Payment info moved to checkout */}

              <div className="space-y-3 mb-6">
                <div className={`flex justify-between ${isDark ? 'text-dark-text2' : 'text-gray-600'}`}><span>{t('subtotal')}</span><span className="font-semibold">{formatPrice(cartTotal)}</span></div>
                {couponDiscount > 0 && <div className="flex justify-between text-green-500"><span>{t('discount')} ({couponDiscount}%)</span><span>-{formatPrice(discountAmount)}</span></div>}
                <div className={`flex justify-between ${isDark ? 'text-dark-text2' : 'text-gray-600'}`}><span>{t('tax')}</span><span className="font-semibold">{formatPrice(taxAmount)}</span></div>
              </div>

              <div className={`border-t-2 border-dashed pt-4 mb-6 ${isDark ? 'border-dark-border' : 'border-gray-100'}`}>
                <div className="flex justify-between"><span className={`text-lg font-bold ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>{t('total')}</span><span className="text-2xl font-black text-primary-500">{formatPrice(subtotalAfterDiscount + taxAmount)}</span></div>
              </div>

              <button onClick={() => setCurrentPage('checkout')} className="w-full py-4 bg-gradient-to-l from-primary-600 to-primary-700 text-white rounded-2xl font-bold text-lg hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg flex items-center justify-center gap-3">
                📋 {t('checkout')} →
              </button>
              <button onClick={() => setCurrentPage('home')} className="w-full py-3 mt-3 text-primary-500 font-semibold rounded-2xl text-center">{t('continueShopping')}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
