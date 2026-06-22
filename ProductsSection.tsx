import React, { useMemo, useState } from 'react';
import { useStore } from '../context/StoreContext';
import ProductCard from './ProductCard';
import { currencies } from '../data/translations';

const internalCategories = ['الكل', 'إلكترونيات', 'أزياء', 'إكسسوارات', 'أجهزة منزلية'];

const ProductsSection: React.FC = () => {
  const { products, searchQuery, selectedCategory, setSelectedCategory, sortBy, setSortBy, t, getCategoryLabel, theme, recentlyViewed, addToRecentlyViewed, compareList, clearCompare } = useStore();
  const isDark = theme === 'dark';
  const [showFilters, setShowFilters] = useState(false);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(10000);

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.includes(searchQuery) || product.description.includes(searchQuery) || product.category.includes(searchQuery);
      const matchesCategory = selectedCategory === 'الكل' || product.category === selectedCategory;
      const matchesPrice = product.price >= priceMin && product.price <= priceMax;
      return matchesSearch && matchesCategory && matchesPrice;
    });
    switch (sortBy) {
      case 'price-low': filtered.sort((a, b) => a.price - b.price); break;
      case 'price-high': filtered.sort((a, b) => b.price - a.price); break;
      case 'rating': filtered.sort((a, b) => b.rating - a.rating); break;
    }
    return filtered;
  }, [products, searchQuery, selectedCategory, sortBy, priceMin, priceMax]);

  const recentlyViewedProducts = recentlyViewed.map(id => products.find(p => p.id === id)).filter(Boolean) as typeof products;
  // Compare products available via compareList

  return (
    <section id="products" className={`py-16 lg:py-24 ${isDark ? 'bg-dark-bg' : 'bg-[#f4f3ef]'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className={`text-3xl lg:text-4xl font-black mb-4 ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>{t('featuredProducts')}</h2>
          <p className={`max-w-2xl mx-auto text-lg ${isDark ? 'text-dark-text2' : 'text-gray-500'}`}>{t('featuredDesc')}</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          {internalCategories.map((cat) => (
            <button key={cat} onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 ${
                selectedCategory === cat ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30 scale-105'
                : (isDark ? 'bg-dark-card text-dark-text2 border border-dark-border hover:border-primary-500/50' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200')
              }`}>{getCategoryLabel(cat)}</button>
          ))}
        </div>

        <div className={`flex flex-wrap items-center justify-between gap-4 mb-8 p-4 rounded-2xl ${isDark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100 shadow-sm'}`}>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${isDark ? 'text-dark-text2' : 'text-gray-500'}`}>{t('sortBy')}:</span>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 ${isDark ? 'bg-dark-bg border border-dark-border text-dark-text' : 'bg-gray-50 border border-gray-200'}`}>
                <option value="default">{t('sortDefault')}</option>
                <option value="price-low">{t('sortPriceLow')}</option>
                <option value="price-high">{t('sortPriceHigh')}</option>
                <option value="rating">{t('sortRating')}</option>
              </select>
            </div>
            <button onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${showFilters ? 'bg-primary-600 text-white' : (isDark ? 'bg-dark-bg text-dark-text2 border border-dark-border' : 'bg-gray-50 text-gray-600 border border-gray-200')}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
              {t('filterPrice')}
            </button>
          </div>
          <div className="flex items-center gap-4">
            {compareList.length > 0 && (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                📊 {compareList.length} {t('compare')}
                <button onClick={clearCompare} className="text-red-500 hover:text-red-600 text-xs">{t('clearCompare')}</button>
              </div>
            )}
            <span className={`text-sm ${isDark ? 'text-dark-text2' : 'text-gray-400'}`}>{filteredProducts.length} {t('product')}</span>
          </div>
        </div>

        {showFilters && (
          <div className={`mb-8 p-4 rounded-2xl animate-fadeIn ${isDark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100 shadow-sm'}`}>
            <div className="flex flex-wrap items-center gap-4">
              <span className={`text-sm font-medium ${isDark ? 'text-dark-text2' : 'text-gray-500'}`}>{t('filterPrice')}:</span>
              <div className="flex items-center gap-2">
                <span className={`text-xs ${isDark ? 'text-dark-text2' : 'text-gray-400'}`}>{t('from')}</span>
                <input type="number" value={priceMin} onChange={(e) => setPriceMin(Number(e.target.value))}
                  className={`w-24 px-3 py-2 rounded-lg text-sm ${isDark ? 'bg-dark-bg border border-dark-border text-dark-text' : 'bg-gray-50 border border-gray-200'}`} min={0} />
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs ${isDark ? 'text-dark-text2' : 'text-gray-400'}`}>{t('to')}</span>
                <input type="number" value={priceMax} onChange={(e) => setPriceMax(Number(e.target.value))}
                  className={`w-24 px-3 py-2 rounded-lg text-sm ${isDark ? 'bg-dark-bg border border-dark-border text-dark-text' : 'bg-gray-50 border border-gray-200'}`} min={0} />
              </div>
            </div>
          </div>
        )}

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>{t('noProducts')}</h3>
            <p className={isDark ? 'text-dark-text2' : 'text-gray-500'}>{t('noProductsDesc')}</p>
          </div>
        )}

        {/* Recently Viewed */}
        {recentlyViewedProducts.length > 1 && (
          <div className="mt-20">
            <h3 className={`text-2xl font-black mb-6 ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>{t('recentlyViewed')}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {recentlyViewedProducts.slice(0, 4).map(product => (
                <div key={product.id} className={`rounded-2xl overflow-hidden border cursor-pointer transition-all hover:scale-105 ${isDark ? 'bg-dark-card border-dark-border' : 'bg-white border-gray-100'}`}
                  onClick={() => { addToRecentlyViewed(product.id); document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }); }}>
                  <img src={product.images?.[0] || ''} alt={product.name} className="w-full aspect-square object-cover" />
                  <div className="p-3">
                    <p className={`font-semibold text-sm truncate ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>{product.name}</p>
                    <p className={`text-sm font-bold ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>{product.price} {currencies['DZD'].symbol}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsSection;
