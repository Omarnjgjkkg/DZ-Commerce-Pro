import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, CartItem, Page, ThemeMode, Review } from '../types';
import { defaultProducts } from '../data/defaultProducts';
import { Language, CurrencyCode, currencies, translations, languageInfo, categoryMap } from '../data/translations';

const ADMIN_PASSWORD = '22072004';
const COUPONS: Record<string, number> = { SAVE10: 10, SAVE20: 20, WELCOME: 15, VIP50: 50 };

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  reviews: Review[];
  recentlyViewed: string[];
  compareList: string[];
  currentPage: Page;
  searchQuery: string;
  selectedCategory: string;
  sortBy: string;
  notification: { message: string; type: 'success' | 'error' | 'info' } | null;
  couponCode: string;
  couponDiscount: number;
  quickViewProduct: Product | null;
  isAdmin: boolean;
  showLogin: boolean;
  language: Language;
  currency: CurrencyCode;
  theme: ThemeMode;
  setLanguage: (lang: Language) => void;
  setCurrency: (currency: CurrencyCode) => void;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  t: (key: string) => string;
  formatPrice: (price: number) => string;
  getCategoryLabel: (cat: string) => string;
  isRtl: boolean;
  setCurrentPage: (page: Page) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setSortBy: (sort: string) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  removeProduct: (id: string) => void;
  editProduct: (id: string, product: Partial<Product>) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  addReview: (review: Omit<Review, 'id' | 'date'>) => void;
  getProductReviews: (productId: string) => Review[];
  setQuickViewProduct: (product: Product | null) => void;
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  // Admin auth
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  setShowLogin: (show: boolean) => void;
  // Recently viewed
  addToRecentlyViewed: (productId: string) => void;
  // Compare
  toggleCompare: (productId: string) => void;
  isInCompare: (productId: string) => boolean;
  clearCompare: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('store_products');
    return saved ? JSON.parse(saved) : defaultProducts;
  });
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('store_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('store_wishlist');
    return saved ? JSON.parse(saved) : [];
  });
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('store_reviews');
    return saved ? JSON.parse(saved) : [];
  });
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => {
    const saved = localStorage.getItem('store_recentlyViewed');
    return saved ? JSON.parse(saved) : [];
  });
  const [compareList, setCompareList] = useState<string[]>(() => {
    const saved = localStorage.getItem('store_compare');
    return saved ? JSON.parse(saved) : [];
  });

  const [language, setLanguageState] = useState<Language>(() => (localStorage.getItem('store_language') as Language) || 'ar');
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => (localStorage.getItem('store_currency') as CurrencyCode) || 'DZD');
  const [theme, setThemeState] = useState<ThemeMode>(() => (localStorage.getItem('store_theme') as ThemeMode) || 'light');
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [sortBy, setSortBy] = useState('default');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem('store_admin') === 'true');
  const [showLogin, setShowLogin] = useState(false);

  const isRtl = languageInfo[language].dir === 'rtl';

  // Persist
  useEffect(() => { localStorage.setItem('store_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('store_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('store_wishlist', JSON.stringify(wishlist)); }, [wishlist]);
  useEffect(() => { localStorage.setItem('store_reviews', JSON.stringify(reviews)); }, [reviews]);
  useEffect(() => { localStorage.setItem('store_recentlyViewed', JSON.stringify(recentlyViewed)); }, [recentlyViewed]);
  useEffect(() => { localStorage.setItem('store_compare', JSON.stringify(compareList)); }, [compareList]);
  useEffect(() => { localStorage.setItem('store_language', language); }, [language]);
  useEffect(() => { localStorage.setItem('store_currency', currency); }, [currency]);
  useEffect(() => { localStorage.setItem('store_theme', theme); }, [theme]);
  useEffect(() => { sessionStorage.setItem('store_admin', String(isAdmin)); }, [isAdmin]);
  useEffect(() => { document.documentElement.classList.toggle('dark', theme === 'dark'); }, [theme]);
  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRtl]);

  const setLanguage = useCallback((lang: Language) => setLanguageState(lang), []);
  const setCurrency = useCallback((cur: CurrencyCode) => setCurrencyState(cur), []);
  const setTheme = useCallback((t: ThemeMode) => setThemeState(t), []);
  const toggleTheme = useCallback(() => setThemeState(p => p === 'light' ? 'dark' : 'light'), []);

  const t = useCallback((key: string): string => {
    return (translations[language] as Record<string, string>)[key] || key;
  }, [language]);

  const formatPrice = useCallback((priceInSAR: number): string => {
    const cur = currencies[currency];
    const converted = priceInSAR * cur.rate;
    const formatted = converted.toLocaleString(undefined, {
      minimumFractionDigits: currency === 'DZD' ? 0 : 2,
      maximumFractionDigits: currency === 'DZD' ? 0 : 2,
    });
    return `${formatted} ${cur.symbol}`;
  }, [currency]);

  const getCategoryLabel = useCallback((cat: string): string => {
    return categoryMap[language]?.[cat] || cat;
  }, [language]);

  const showNotification = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  // Admin Auth
  const loginAdmin = useCallback((password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      showNotification(t('loginSuccess'), 'success');
      return true;
    } else {
      showNotification(t('loginError'), 'error');
      return false;
    }
  }, [showNotification, t]);

  const logoutAdmin = useCallback(() => {
    setIsAdmin(false);
    setCurrentPage('home');
    showNotification('تم تسجيل الخروج', 'info');
  }, [showNotification]);

  // Products
  const addProduct = useCallback((product: Omit<Product, 'id'>) => {
    if (!isAdmin) return;
    const newProduct: Product = { ...product, id: crypto.randomUUID(), soldCount: product.soldCount || 0, stockCount: product.stockCount || 50 };
    setProducts(prev => [newProduct, ...prev]);
    showNotification(t('productAdded'), 'success');
  }, [isAdmin, showNotification, t]);

  const removeProduct = useCallback((id: string) => {
    if (!isAdmin) return;
    setProducts(prev => prev.filter(p => p.id !== id));
    setCart(prev => prev.filter(item => item.product.id !== id));
    setWishlist(prev => prev.filter(pid => pid !== id));
    showNotification(t('productDeleted'), 'success');
  }, [isAdmin, showNotification, t]);

  const editProduct = useCallback((id: string, updates: Partial<Product>) => {
    if (!isAdmin) return;
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    showNotification(t('productEdited'), 'success');
  }, [isAdmin, showNotification, t]);

  // Cart
  const addToCart = useCallback((product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { product, quantity: 1 }];
    });
    showNotification(t('addedToCart'), 'success');
  }, [showNotification, t]);

  const removeFromCart = useCallback((productId: string) => setCart(prev => prev.filter(item => item.product.id !== productId)), []);
  const updateCartQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) { setCart(prev => prev.filter(item => item.product.id !== productId)); return; }
    setCart(prev => prev.map(item => item.product.id === productId ? { ...item, quantity } : item));
  }, []);
  const clearCart = useCallback(() => {
    setCart([]); setCouponCode(''); setCouponDiscount(0); showNotification(t('cartCleared'), 'info');
  }, [showNotification, t]);

  // Wishlist
  const toggleWishlist = useCallback((productId: string) => {
    setWishlist(prev => {
      if (prev.includes(productId)) { showNotification(t('removedFromWishlist'), 'info'); return prev.filter(id => id !== productId); }
      showNotification(t('addedToWishlist'), 'success'); return [...prev, productId];
    });
  }, [showNotification, t]);
  const isInWishlist = useCallback((productId: string) => wishlist.includes(productId), [wishlist]);

  // Recently Viewed
  const addToRecentlyViewed = useCallback((productId: string) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(id => id !== productId);
      return [productId, ...filtered].slice(0, 8);
    });
  }, []);

  // Compare
  const toggleCompare = useCallback((productId: string) => {
    setCompareList(prev => {
      if (prev.includes(productId)) return prev.filter(id => id !== productId);
      if (prev.length >= 4) { showNotification('يمكن مقارنة 4 منتجات كحد أقصى', 'error'); return prev; }
      showNotification('تم إضافته للمقارنة', 'info'); return [...prev, productId];
    });
  }, [showNotification]);
  const isInCompare = useCallback((productId: string) => compareList.includes(productId), [compareList]);
  const clearCompare = useCallback(() => setCompareList([]), []);

  // Coupon
  const applyCoupon = useCallback((code: string): boolean => {
    const upperCode = code.toUpperCase();
    if (COUPONS[upperCode]) { setCouponCode(upperCode); setCouponDiscount(COUPONS[upperCode]); showNotification(t('couponApplied') + ` (${COUPONS[upperCode]}%)`, 'success'); return true; }
    showNotification(t('invalidCoupon'), 'error'); return false;
  }, [showNotification, t]);
  const removeCoupon = useCallback(() => { setCouponCode(''); setCouponDiscount(0); showNotification(t('couponRemoved'), 'info'); }, [showNotification, t]);

  // Reviews
  const addReview = useCallback((review: Omit<Review, 'id' | 'date'>) => {
    setReviews(prev => [{ ...review, id: crypto.randomUUID(), date: new Date().toISOString() }, ...prev]);
    showNotification(t('reviewAdded'), 'success');
  }, [showNotification, t]);
  const getProductReviews = useCallback((productId: string) => reviews.filter(r => r.productId === productId), [reviews]);

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <StoreContext.Provider value={{
      products, cart, wishlist, reviews, recentlyViewed, compareList, currentPage, searchQuery, selectedCategory, sortBy, notification, couponCode, couponDiscount, quickViewProduct,
      isAdmin, showLogin, language, currency, theme,
      setLanguage, setCurrency, setTheme, toggleTheme, t, formatPrice, getCategoryLabel, isRtl,
      setCurrentPage, setSearchQuery, setSelectedCategory, setSortBy,
      addProduct, removeProduct, editProduct,
      addToCart, removeFromCart, updateCartQuantity, clearCart,
      cartTotal, cartCount,
      toggleWishlist, isInWishlist,
      applyCoupon, removeCoupon,
      addReview, getProductReviews,
      setQuickViewProduct, showNotification,
      loginAdmin, logoutAdmin, setShowLogin,
      addToRecentlyViewed,
      toggleCompare, isInCompare, clearCompare,
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
