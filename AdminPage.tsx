import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, OrderInfo, StoreSettings } from '../types';

const defaultSettings: StoreSettings = {
  phone: '+213 550 123 456', email: 'info@mystore.dz',
  ccpAccount: '0020006548 52', ccpKey: '52', ripAccount: '007 99999 0020006548 52',
  baridimobName: 'متجري للتجارة الإلكترونية', address: 'الجزائر العاصمة',
  freeShippingMin: 5000, announcement: '🎉 شحن مجاني للطلبات فوق 5000 د.ج',
};
const cats = ['إلكترونيات', 'أزياء', 'إكسسوارات', 'أجهزة منزلية'];

const AdminPage: React.FC = () => {
  const { products, addProduct, removeProduct, editProduct, formatPrice, getCategoryLabel, theme } = useStore();
  const isDark = theme === 'dark';

  const [tab, setTab] = useState<'orders' | 'products' | 'settings' | 'add'>('orders');
  const [orders, setOrders] = useState<OrderInfo[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(() => {
    const s = localStorage.getItem('store_settings');
    return s ? JSON.parse(s) : defaultSettings;
  });
  const [form, setForm] = useState({ name: '', description: '', price: '', originalPrice: '', imageUrls: '', category: cats[0], rating: '4.5', reviews: '0', badge: '', inStock: true });
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    const o = localStorage.getItem('store_orders');
    if (o) setOrders(JSON.parse(o));
  }, []);

  const saveOrders = (newOrders: OrderInfo[]) => {
    setOrders(newOrders);
    localStorage.setItem('store_orders', JSON.stringify(newOrders));
  };

  const updateOrderStatus = (orderId: string, status: OrderInfo['status']) => {
    saveOrders(orders.map(o => o.orderId === orderId ? { ...o, status } : o));
  };

  const saveSettings = () => {
    localStorage.setItem('store_settings', JSON.stringify(settings));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => setUploadedImages(prev => [...prev, reader.result as string]);
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price) return;
    const urlImgs = form.imageUrls.split(',').map(u => u.trim()).filter(Boolean);
    const allImgs = [...uploadedImages, ...urlImgs];
    const data = {
      name: form.name, description: form.description, price: parseFloat(form.price),
      originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : undefined,
      images: allImgs.length > 0 ? allImgs : ['https://images.pexels.com/photos/4533076/pexels-photo-4533076.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'],
      category: form.category, rating: parseFloat(form.rating) || 4.5, reviews: parseInt(form.reviews) || 0,
      badge: form.badge || undefined, inStock: form.inStock, soldCount: 0, stockCount: 50,
    };
    if (editingId) { editProduct(editingId, data); setEditingId(null); }
    else { addProduct(data as Omit<Product, 'id'>); }
    setForm({ name: '', description: '', price: '', originalPrice: '', imageUrls: '', category: cats[0], rating: '4.5', reviews: '0', badge: '', inStock: true });
    setUploadedImages([]); setTab('products');
  };

  const handleEdit = (p: Product) => {
    setForm({ name: p.name, description: p.description, price: p.price.toString(), originalPrice: p.originalPrice?.toString() || '', imageUrls: p.images.join(', '), category: p.category, rating: p.rating.toString(), reviews: p.reviews.toString(), badge: p.badge || '', inStock: p.inStock });
    setUploadedImages([]); setEditingId(p.id); setTab('add');
  };

  const handleDelete = (id: string) => {
    if (deleteConfirm === id) { removeProduct(id); setDeleteConfirm(null); }
    else { setDeleteConfirm(id); setTimeout(() => setDeleteConfirm(null), 3000); }
  };

  const ic = `w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 ${isDark ? 'bg-dark-bg border border-dark-border text-dark-text placeholder-dark-text2' : 'bg-gray-50 border border-gray-200'}`;

  const statusColors: Record<string, string> = {
    new: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
    confirmed: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
    completed: 'bg-gray-100 text-gray-700 dark:bg-gray-700/40 dark:text-gray-400',
  };
  const statusLabels: Record<string, string> = { new: 'جديد', confirmed: 'مُتحقق', cancelled: 'ملغى', completed: 'مُكتمل' };

  const newOrders = orders.filter(o => o.status === 'new').length;
  const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0);

  return (
    <div className={`min-h-screen py-6 ${isDark ? 'bg-dark-bg' : 'bg-[#f4f3ef]'}`}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className={`text-xl font-black flex items-center gap-2 ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>
              <span className="text-lg">⚡</span> لوحة التحكم
            </h1>
            <p className={`text-xs ${isDark ? 'text-dark-text2' : 'text-gray-500'}`}>إدارة المنتجات والطلبات والإعدادات</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {[
            { icon: '📦', val: products.length, label: 'المنتجات', color: 'from-blue-500/20 to-blue-600/20' },
            { icon: '🛒', val: orders.length, label: 'الطلبات', color: 'from-green-500/20 to-green-600/20', badge: newOrders > 0 ? newOrders : undefined },
            { icon: '💰', val: formatPrice(totalRevenue), label: 'الإيرادات', color: 'from-amber-500/20 to-amber-600/20' },
            { icon: '⭐', val: products.length > 0 ? (products.reduce((s, p) => s + p.rating, 0) / products.length).toFixed(1) : '0', label: 'التقييم', color: 'from-purple-500/20 to-purple-600/20' },
          ].map((s, i) => (
            <div key={i} className={`rounded-xl p-4 border relative overflow-hidden ${isDark ? 'bg-dark-card border-dark-border' : 'bg-white border-gray-100 shadow-sm'}`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-30`} />
              <div className="relative flex items-center gap-2">
                <span className="text-xl">{s.icon}</span>
                <div>
                  <p className={`text-lg font-black ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>{s.val}</p>
                  <p className={`text-[10px] ${isDark ? 'text-dark-text2' : 'text-gray-500'}`}>{s.label}</p>
                </div>
                {s.badge && <span className="absolute top-0 left-0 w-5 h-5 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold">{s.badge}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className={`flex gap-1 mb-6 p-1 rounded-xl ${isDark ? 'bg-dark-card' : 'bg-gray-100'}`}>
          {[
            { key: 'orders', label: '🛒 الطلبات', badge: newOrders },
            { key: 'products', label: '📦 المنتجات' },
            { key: 'add', label: editingId ? '✏️ تعديل' : '➕ إضافة' },
            { key: 'settings', label: '⚙️ إعدادات' },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key as typeof tab)}
              className={`flex-1 relative py-2 rounded-lg text-xs font-bold transition-all ${tab === t.key ? (isDark ? 'bg-primary-600 text-white shadow' : 'bg-white text-primary-700 shadow') : (isDark ? 'text-dark-text2 hover:text-dark-text' : 'text-gray-500 hover:text-gray-700')}`}>
              {t.label}
              {t.badge ? <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[8px] rounded-full flex items-center justify-center">{t.badge}</span> : null}
            </button>
          ))}
        </div>

        {/* ORDERS TAB */}
        {tab === 'orders' && (
          <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-dark-card border-dark-border' : 'bg-white border-gray-100 shadow-sm'}`}>
            {orders.length === 0 ? (
              <div className="py-16 text-center">
                <span className="text-4xl block mb-2">📭</span>
                <p className={`text-sm font-bold ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>لا توجد طلبات بعد</p>
                <p className={`text-xs ${isDark ? 'text-dark-text2' : 'text-gray-500'}`}>ستظهر هنا عند ورود طلبات جديدة</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-dark-border">
                {orders.map(order => (
                  <div key={order.orderId} className={`p-4 ${order.status === 'new' ? (isDark ? 'bg-blue-900/5' : 'bg-blue-50/50') : ''}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`font-mono font-bold text-xs ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>#{order.orderId}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColors[order.status]}`}>{statusLabels[order.status]}</span>
                        </div>
                        <p className={`text-[10px] ${isDark ? 'text-dark-text2' : 'text-gray-500'}`}>{new Date(order.date).toLocaleString('ar-DZ')}</p>
                      </div>
                      <span className={`text-sm font-black ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>{formatPrice(order.total)}</span>
                    </div>

                    {/* Customer info */}
                    <div className={`p-2 rounded-lg mb-2 text-xs ${isDark ? 'bg-dark-bg' : 'bg-gray-50'}`}>
                      <div className="grid grid-cols-2 gap-1">
                        <span className={isDark ? 'text-dark-text2' : 'text-gray-500'}>👤 {order.customer.fullName}</span>
                        <span className={isDark ? 'text-dark-text2' : 'text-gray-500'}>📞 <span dir="ltr">{order.customer.phone}</span></span>
                        <span className={isDark ? 'text-dark-text2' : 'text-gray-500'}>📍 {order.customer.wilaya} - {order.customer.daira}</span>
                        <span className={isDark ? 'text-dark-text2' : 'text-gray-500'}>🏠 {order.customer.commune}</span>
                      </div>
                      {order.customer.address && <p className={`mt-1 ${isDark ? 'text-dark-text2' : 'text-gray-500'}`}>📝 {order.customer.address}</p>}
                      {order.customer.notes && <p className={`mt-0.5 text-amber-500`}>💬 {order.customer.notes}</p>}
                    </div>

                    {/* Items */}
                    <div className="flex gap-1.5 mb-2 overflow-x-auto">
                      {order.items.map(item => (
                        <div key={item.product.id} className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] flex-shrink-0 ${isDark ? 'bg-dark-bg' : 'bg-gray-50'}`}>
                          <img src={item.product.images?.[0]} alt="" className="w-6 h-6 rounded object-cover" />
                          <span className={isDark ? 'text-dark-text' : 'text-gray-700'}>{item.product.name} ×{item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    {/* Payment */}
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] ${isDark ? 'text-dark-text2' : 'text-gray-500'}`}>
                        💳 {order.paymentMethod === 'cod' ? 'دفع عند الاستلام' : order.paymentMethod === 'transfer' ? 'تحويل بنكي' : 'بريدي موب'}
                        {order.shipping > 0 && <> · 🚚 {order.shipping} د.ج</>}
                      </span>

                      {/* Action Buttons */}
                      <div className="flex gap-1">
                        {order.status === 'new' && (
                          <>
                            <button onClick={() => updateOrderStatus(order.orderId, 'confirmed')} className="px-2 py-1 bg-green-500 text-white text-[10px] font-bold rounded-lg hover:bg-green-600">✓ تحقق</button>
                            <button onClick={() => updateOrderStatus(order.orderId, 'cancelled')} className="px-2 py-1 bg-red-500 text-white text-[10px] font-bold rounded-lg hover:bg-red-600">✕ إلغاء</button>
                          </>
                        )}
                        {order.status === 'confirmed' && (
                          <button onClick={() => updateOrderStatus(order.orderId, 'completed')} className="px-2 py-1 bg-blue-500 text-white text-[10px] font-bold rounded-lg hover:bg-blue-600">✓ مُكتمل</button>
                        )}
                        {order.status === 'cancelled' && (
                          <button onClick={() => saveOrders(orders.filter(o => o.orderId !== order.orderId))} className="px-2 py-1 text-[10px] font-bold text-red-400 hover:bg-red-900/20 rounded-lg">🗑️ حذف</button>
                        )}
                        {order.status === 'completed' && (
                          <button onClick={() => saveOrders(orders.filter(o => o.orderId !== order.orderId))} className="px-2 py-1 text-[10px] font-bold text-gray-400 hover:bg-gray-500/20 rounded-lg">🗑️ حذف</button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PRODUCTS TAB */}
        {tab === 'products' && (
          <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-dark-card border-dark-border' : 'bg-white border-gray-100 shadow-sm'}`}>
            <div className="divide-y divide-gray-100 dark:divide-dark-border">
              {products.map(p => (
                <div key={p.id} className="p-3 flex gap-3 items-center">
                  <img src={p.images?.[0] || ''} alt="" className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold text-xs truncate ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>{p.name}</p>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>{formatPrice(p.price)}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isDark ? 'text-dark-text2 bg-dark-bg' : 'text-gray-500 bg-gray-100'}`}>{getCategoryLabel(p.category)}</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => handleEdit(p)} className={`px-2 py-1 rounded-lg text-[10px] font-bold ${isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>✏️</button>
                    <button onClick={() => handleDelete(p.id)} className={`px-2 py-1 rounded-lg text-[10px] font-bold ${deleteConfirm === p.id ? 'bg-red-500 text-white' : (isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-50 text-red-600')}`}>
                      {deleteConfirm === p.id ? 'تأكيد' : '🗑️'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ADD/EDIT TAB */}
        {tab === 'add' && (
          <div className={`rounded-2xl p-5 border ${isDark ? 'bg-dark-card border-dark-border' : 'bg-white border-gray-100 shadow-sm'}`}>
            <h2 className={`text-sm font-bold mb-4 ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>{editingId ? '✏️ تعديل المنتج' : '➕ إضافة منتج جديد'}</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className={`block text-[10px] font-semibold mb-1 ${isDark ? 'text-dark-text2' : 'text-gray-600'}`}>اسم المنتج *</label>
                  <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="اسم المنتج" className={ic} required />
                </div>
                <div>
                  <label className={`block text-[10px] font-semibold mb-1 ${isDark ? 'text-dark-text2' : 'text-gray-600'}`}>الفئة</label>
                  <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className={`${ic} appearance-none`}>
                    {cats.map(c => <option key={c} value={c}>{getCategoryLabel(c)}</option>)}
                  </select>
                </div>
                <div>
                  <label className={`block text-[10px] font-semibold mb-1 ${isDark ? 'text-dark-text2' : 'text-gray-600'}`}>السعر *</label>
                  <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} min="0" step="0.01" className={ic} required />
                </div>
                <div>
                  <label className={`block text-[10px] font-semibold mb-1 ${isDark ? 'text-dark-text2' : 'text-gray-600'}`}>السعر الأصلي</label>
                  <input type="number" value={form.originalPrice} onChange={e => setForm({...form, originalPrice: e.target.value})} min="0" className={ic} />
                </div>
                <div className="md:col-span-2">
                  <label className={`block text-[10px] font-semibold mb-1 ${isDark ? 'text-dark-text2' : 'text-gray-600'}`}>روابط الصور (فاصلة بين كل رابط)</label>
                  <input type="text" value={form.imageUrls} onChange={e => setForm({...form, imageUrls: e.target.value})} placeholder="https://..." className={ic} dir="ltr" />
                </div>
                <div className="md:col-span-2">
                  <label className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-xl cursor-pointer ${isDark ? 'border-dark-border bg-dark-bg' : 'border-gray-300 bg-gray-50'}`}>
                    <span className="text-lg mb-1">📷</span>
                    <span className={`text-[10px] ${isDark ? 'text-dark-text2' : 'text-gray-500'}`}>ارفع صور من جهازك</span>
                    <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                  </label>
                  {uploadedImages.length > 0 && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {uploadedImages.map((img, i) => (
                        <div key={i} className="relative">
                          <img src={img} alt="" className="w-16 h-16 rounded-lg object-cover border border-primary-300" />
                          <button type="button" onClick={() => setUploadedImages(p => p.filter((_, j) => j !== i))} className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[8px] flex items-center justify-center">✕</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className={`block text-[10px] font-semibold mb-1 ${isDark ? 'text-dark-text2' : 'text-gray-600'}`}>الوصف</label>
                  <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={2} className={`${ic} resize-none`} />
                </div>
                <div>
                  <label className={`block text-[10px] font-semibold mb-1 ${isDark ? 'text-dark-text2' : 'text-gray-600'}`}>شارة</label>
                  <input type="text" value={form.badge} onChange={e => setForm({...form, badge: e.target.value})} placeholder="جديد، خصم..." className={ic} />
                </div>
                <div className="flex items-center gap-3 pt-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={form.inStock} onChange={e => setForm({...form, inStock: e.target.checked})} className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-600" />
                    <span className={`ms-2 text-xs font-semibold ${isDark ? 'text-dark-text2' : 'text-gray-700'}`}>متوفر</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 py-2.5 bg-primary-600 text-white rounded-xl font-bold text-sm hover:bg-primary-700">{editingId ? 'حفظ التعديلات' : 'إضافة المنتج'}</button>
                <button type="button" onClick={() => { setTab('products'); setEditingId(null); setUploadedImages([]); }} className={`px-6 py-2.5 rounded-xl font-bold text-sm ${isDark ? 'bg-dark-bg text-dark-text2' : 'bg-gray-100 text-gray-600'}`}>إلغاء</button>
              </div>
            </form>
          </div>
        )}

        {/* SETTINGS TAB */}
        {tab === 'settings' && (
          <div className={`rounded-2xl p-5 border ${isDark ? 'bg-dark-card border-dark-border' : 'bg-white border-gray-100 shadow-sm'}`}>
            <h2 className={`text-sm font-bold mb-4 flex items-center gap-1.5 ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>⚙️ إعدادات المتجر</h2>
            <div className="space-y-4">
              <div className={`p-4 rounded-xl ${isDark ? 'bg-dark-bg' : 'bg-gray-50'}`}>
                <h3 className={`text-xs font-bold mb-3 ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>📞 معلومات التواصل</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-[10px] font-semibold mb-1 ${isDark ? 'text-dark-text2' : 'text-gray-600'}`}>رقم الهاتف</label>
                    <input type="text" value={settings.phone} onChange={e => setSettings({...settings, phone: e.target.value})} className={ic} dir="ltr" />
                  </div>
                  <div>
                    <label className={`block text-[10px] font-semibold mb-1 ${isDark ? 'text-dark-text2' : 'text-gray-600'}`}>البريد الإلكتروني</label>
                    <input type="email" value={settings.email} onChange={e => setSettings({...settings, email: e.target.value})} className={ic} dir="ltr" />
                  </div>
                  <div className="md:col-span-2">
                    <label className={`block text-[10px] font-semibold mb-1 ${isDark ? 'text-dark-text2' : 'text-gray-600'}`}>العنوان</label>
                    <input type="text" value={settings.address} onChange={e => setSettings({...settings, address: e.target.value})} className={ic} />
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-xl ${isDark ? 'bg-dark-bg' : 'bg-gray-50'}`}>
                <h3 className={`text-xs font-bold mb-3 ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>🏦 بيانات الدفع</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-[10px] font-semibold mb-1 ${isDark ? 'text-dark-text2' : 'text-gray-600'}`}>حساب CCP</label>
                    <input type="text" value={settings.ccpAccount} onChange={e => setSettings({...settings, ccpAccount: e.target.value})} className={ic} dir="ltr" />
                  </div>
                  <div>
                    <label className={`block text-[10px] font-semibold mb-1 ${isDark ? 'text-dark-text2' : 'text-gray-600'}`}>مفتاح CCP</label>
                    <input type="text" value={settings.ccpKey} onChange={e => setSettings({...settings, ccpKey: e.target.value})} className={ic} dir="ltr" />
                  </div>
                  <div>
                    <label className={`block text-[10px] font-semibold mb-1 ${isDark ? 'text-dark-text2' : 'text-gray-600'}`}>حساب RIP</label>
                    <input type="text" value={settings.ripAccount} onChange={e => setSettings({...settings, ripAccount: e.target.value})} className={ic} dir="ltr" />
                  </div>
                  <div>
                    <label className={`block text-[10px] font-semibold mb-1 ${isDark ? 'text-dark-text2' : 'text-gray-600'}`}>اسم بريدي موب</label>
                    <input type="text" value={settings.baridimobName} onChange={e => setSettings({...settings, baridimobName: e.target.value})} className={ic} />
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-xl ${isDark ? 'bg-dark-bg' : 'bg-gray-50'}`}>
                <h3 className={`text-xs font-bold mb-3 ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>🏷️ إعدادات عامة</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-[10px] font-semibold mb-1 ${isDark ? 'text-dark-text2' : 'text-gray-600'}`}>حد الشحن المجاني (د.ج)</label>
                    <input type="number" value={settings.freeShippingMin} onChange={e => setSettings({...settings, freeShippingMin: Number(e.target.value)})} className={ic} />
                  </div>
                  <div>
                    <label className={`block text-[10px] font-semibold mb-1 ${isDark ? 'text-dark-text2' : 'text-gray-600'}`}>رسالة الإعلان العلوي</label>
                    <input type="text" value={settings.announcement} onChange={e => setSettings({...settings, announcement: e.target.value})} className={ic} />
                  </div>
                </div>
              </div>

              <button onClick={saveSettings} className="w-full py-2.5 bg-primary-600 text-white rounded-xl font-bold text-sm hover:bg-primary-700 transition-all">
                💾 حفظ الإعدادات
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
