import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { CustomerInfo, OrderInfo, CheckoutStep } from '../types';
import { wilayas, SHIPPING_COSTS, SHIPPING_LABELS } from '../data/algeriaData';

const emptyCustomer: CustomerInfo = { fullName: '', phone: '', email: '', wilaya: '', daira: '', commune: '', address: '', notes: '' };

const CheckoutFlow: React.FC = () => {
  const { cart, cartTotal, couponDiscount, clearCart, setCurrentPage, formatPrice, theme } = useStore();
  const isDark = theme === 'dark';
  const [step, setStep] = useState<CheckoutStep>(1);
  const [customer, setCustomer] = useState<CustomerInfo>(emptyCustomer);
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerInfo, string>>>({});
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [transferReceipt, setTransferReceipt] = useState('');
  const [order, setOrder] = useState<OrderInfo | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedWilaya = useMemo(() => wilayas.find(w => w.nameAr === customer.wilaya), [customer.wilaya]);
  const shippingCost = selectedWilaya ? SHIPPING_COSTS[selectedWilaya.shippingZone] : 0;
  const discountAmount = cartTotal * (couponDiscount / 100);
  const subtotalAfterDiscount = cartTotal - discountAmount;
  const totalWithShipping = subtotalAfterDiscount + shippingCost;

  const inp = `w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 ${isDark ? 'bg-dark-bg border border-dark-border text-dark-text placeholder-dark-text2' : 'bg-white border border-gray-200 text-gray-900 placeholder-gray-400'}`;

  const validateStep1 = (): boolean => {
    const e: Partial<Record<keyof CustomerInfo, string>> = {};
    if (!customer.fullName || customer.fullName.length < 3) e.fullName = 'الاسم يجب أن يكون 3 أحرف على الأقل';
    if (!customer.phone || !/^0[567]\d{8}$/.test(customer.phone)) e.phone = 'رقم هاتف غير صحيح (05/06/07 + 8 أرقام)';
    if (!customer.wilaya) e.wilaya = 'اختر الولاية';
    if (!customer.daira || customer.daira.length < 2) e.daira = 'أدخل اسم الدائرة';
    if (!customer.commune || customer.commune.length < 2) e.commune = 'أدخل اسم البلدية';
    if (!customer.address || customer.address.length < 5) e.address = 'العنوان قصير جداً';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2) {
      setIsProcessing(true);
      setTimeout(() => {
        const orderId = `DZ-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
        const newOrder: OrderInfo = {
          orderId, customer, items: cart, subtotal: cartTotal, discount: discountAmount,
          shipping: shippingCost, total: totalWithShipping, paymentMethod, date: new Date().toISOString(), status: 'new',
        };
        const savedOrders = JSON.parse(localStorage.getItem('store_orders') || '[]');
        savedOrders.unshift(newOrder);
        localStorage.setItem('store_orders', JSON.stringify(savedOrders));
        setOrder(newOrder);
        setStep(3);
        setIsProcessing(false);
        clearCart();
      }, 2000);
    }
  };

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) { const r = new FileReader(); r.onloadend = () => setTransferReceipt(r.result as string); r.readAsDataURL(e.target.files[0]); }
  };

  // Generate downloadable receipt text
  const downloadReceipt = () => {
    if (!order) return;
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 5);
    const text = `
═══════════════════════════════════════
         فاتورة الطلب - متجري
═══════════════════════════════════════

رقم الطلب: #${order.orderId}
التاريخ: ${new Date(order.date).toLocaleDateString('ar-DZ')}

───────────────────────────────────────
معلومات العميل:
───────────────────────────────────────
الاسم: ${order.customer.fullName}
الهاتف: ${order.customer.phone}
${order.customer.email ? 'البريد: ' + order.customer.email : ''}
الولاية: ${order.customer.wilaya}
الدائرة: ${order.customer.daira}
البلدية: ${order.customer.commune}
العنوان: ${order.customer.address}
${order.customer.notes ? 'ملاحظات: ' + order.customer.notes : ''}

───────────────────────────────────────
المنتجات:
───────────────────────────────────────
${order.items.map(i => `• ${i.product.name} × ${i.quantity} = ${i.product.price * i.quantity} د.ج`).join('\n')}

───────────────────────────────────────
المجموع: ${order.subtotal} د.ج
${order.discount > 0 ? 'الخصم: -' + order.discount + ' د.ج' : ''}
التوصيل: ${order.shipping} د.ج
═══════════════════════════════════════
الإجمالي: ${order.total} د.ج
═══════════════════════════════════════

طريقة الدفع: ${order.paymentMethod === 'cod' ? 'الدفع عند الاستلام' : order.paymentMethod === 'transfer' ? 'تحويل بنكي' : 'بريدي موب'}

التوصيل المتوقع: ${deliveryDate.toLocaleDateString('ar-DZ')} (3-7 أيام عمل)

───────────────────────────────────────
شكراً لتسوقك معنا! نتمنى لك تجربة سعيدة.
═══════════════════════════════════════
    `.trim();

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `فاتورة-${order.orderId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const steps = [
    { num: 1 as CheckoutStep, label: 'البيانات' },
    { num: 2 as CheckoutStep, label: 'الدفع' },
    { num: 3 as CheckoutStep, label: 'تأكيد' },
  ];

  // ═══════ STEP 3: Thank you page ═══════
  if (step === 3 && order) {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 5);
    return (
      <div className={`min-h-screen py-8 ${isDark ? 'bg-dark-bg' : 'bg-[#f4f3ef]'}`}>
        <div className="max-w-lg mx-auto px-4">
          <div className={`rounded-2xl p-6 border animate-fadeIn ${isDark ? 'bg-dark-card border-dark-border' : 'bg-white border-gray-200 shadow-sm'}`}>
            <div className="text-center mb-5">
              <div className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-3 ${isDark ? 'bg-green-900/30' : 'bg-green-50'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              </div>
              <h2 className={`text-lg font-bold mb-1 ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>شكراً لك على طلبك!</h2>
              <p className={`text-xs ${isDark ? 'text-dark-text2' : 'text-gray-500'}`}>تم استلام طلبك بنجاح وسنتواصل معك قريباً</p>
              <div className={`inline-block px-3 py-1 rounded-lg text-xs font-mono font-bold mt-2 ${isDark ? 'bg-primary-500/10 text-primary-400' : 'bg-primary-50 text-primary-700'}`}>#{order.orderId}</div>
            </div>

            {/* Delivery estimate */}
            <div className={`p-3 rounded-xl mb-4 text-center ${isDark ? 'bg-amber-900/15 border border-amber-500/20' : 'bg-amber-50 border border-amber-200'}`}>
              <p className={`text-xs font-bold ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>📦 موعد التوصيل المتوقع</p>
              <p className={`text-sm font-black mt-1 ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>{deliveryDate.toLocaleDateString('ar-DZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p className={`text-[10px] mt-0.5 ${isDark ? 'text-amber-400/70' : 'text-amber-600'}`}>(3 إلى 7 أيام عمل)</p>
            </div>

            {/* Order summary */}
            <div className={`p-3 rounded-xl mb-3 text-xs ${isDark ? 'bg-dark-bg' : 'bg-gray-50'}`}>
              <p className={`font-bold text-[10px] mb-2 ${isDark ? 'text-dark-text2' : 'text-gray-500'}`}>المنتجات</p>
              {order.items.map(item => (
                <div key={item.product.id} className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <img src={item.product.images?.[0]} alt="" className="w-7 h-7 rounded object-cover" />
                    <span className={isDark ? 'text-dark-text2' : 'text-gray-600'}>{item.product.name} ×{item.quantity}</span>
                  </div>
                  <span className={`font-bold ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>{formatPrice(item.product.price * item.quantity)}</span>
                </div>
              ))}
              <div className={`border-t pt-2 mt-2 space-y-1 ${isDark ? 'border-dark-border' : 'border-gray-200'}`}>
                {order.discount > 0 && <div className="flex justify-between text-green-500"><span>خصم</span><span>-{formatPrice(order.discount)}</span></div>}
                <div className="flex justify-between"><span className={isDark ? 'text-dark-text2' : 'text-gray-500'}>توصيل ({SHIPPING_LABELS[selectedWilaya?.shippingZone || 'north']})</span><span>{formatPrice(order.shipping)}</span></div>
                <div className="flex justify-between font-black text-sm pt-1"><span className={isDark ? 'text-dark-text' : 'text-gray-900'}>الإجمالي</span><span className="text-primary-500">{formatPrice(order.total)}</span></div>
              </div>
            </div>

            {/* Delivery info */}
            <div className={`p-3 rounded-xl mb-4 text-xs ${isDark ? 'bg-dark-bg' : 'bg-gray-50'}`}>
              <p className={`font-bold text-[10px] mb-1 ${isDark ? 'text-dark-text2' : 'text-gray-500'}`}>بيانات التوصيل</p>
              <p className={isDark ? 'text-dark-text2' : 'text-gray-600'}>{order.customer.fullName} · <span dir="ltr">{order.customer.phone}</span></p>
              <p className={isDark ? 'text-dark-text2' : 'text-gray-600'}>{order.customer.wilaya} - {order.customer.daira} - {order.customer.commune}</p>
              <p className={isDark ? 'text-dark-text2' : 'text-gray-600'}>{order.customer.address}</p>
            </div>

            <div className="flex gap-2">
              <button onClick={() => setCurrentPage('home')} className="flex-1 py-2.5 bg-primary-600 text-white rounded-xl font-bold text-sm hover:bg-primary-700">متابعة التسوق</button>
              <button onClick={downloadReceipt} className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-1.5 ${isDark ? 'bg-dark-bg text-dark-text border border-dark-border hover:bg-dark-border' : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                تحميل الفاتورة
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ═══════ STEPS 1 & 2 ═══════
  return (
    <div className={`min-h-screen py-6 ${isDark ? 'bg-dark-bg' : 'bg-[#f4f3ef]'}`}>
      <div className="max-w-4xl mx-auto px-4">
        {/* Stepper */}
        <div className="flex items-center justify-center mb-6">
          {steps.map((s, i) => (
            <React.Fragment key={s.num}>
              <div className={`flex flex-col items-center gap-0.5 ${step >= s.num ? 'opacity-100' : 'opacity-40'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step > s.num ? 'bg-green-500 text-white' : step === s.num ? 'bg-primary-600 text-white' : (isDark ? 'bg-dark-card text-dark-text2' : 'bg-gray-200 text-gray-500')}`}>
                  {step > s.num ? '✓' : s.num}
                </div>
                <span className={`text-[10px] font-semibold ${step >= s.num ? (isDark ? 'text-dark-text' : 'text-gray-700') : (isDark ? 'text-dark-text2' : 'text-gray-400')}`}>{s.label}</span>
              </div>
              {i < steps.length - 1 && <div className={`w-12 sm:w-20 h-0.5 mx-1 rounded-full ${step > s.num ? 'bg-green-500' : (isDark ? 'bg-dark-border' : 'bg-gray-300')}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* ═══ Step 1: Customer Info ═══ */}
            {step === 1 && (
              <div className={`rounded-2xl p-5 border animate-fadeIn ${isDark ? 'bg-dark-card border-dark-border' : 'bg-white border-gray-200 shadow-sm'}`}>
                <h2 className={`text-sm font-bold mb-4 ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>📋 بيانات العميل</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-[10px] font-semibold mb-1 ${isDark ? 'text-dark-text2' : 'text-gray-600'}`}>الاسم الكامل *</label>
                    <input type="text" value={customer.fullName} onChange={e => { setCustomer({...customer, fullName: e.target.value}); setErrors({...errors, fullName: ''}); }} placeholder="الاسم الكامل" className={inp} />
                    {errors.fullName && <p className="text-red-500 text-[10px] mt-0.5">{errors.fullName}</p>}
                  </div>
                  <div>
                    <label className={`block text-[10px] font-semibold mb-1 ${isDark ? 'text-dark-text2' : 'text-gray-600'}`}>رقم الهاتف *</label>
                    <input type="tel" value={customer.phone} onChange={e => { setCustomer({...customer, phone: e.target.value.replace(/\D/g, '').slice(0, 10)}); setErrors({...errors, phone: ''}); }} placeholder="05XX XXX XXX" className={inp} dir="ltr" />
                    {errors.phone && <p className="text-red-500 text-[10px] mt-0.5">{errors.phone}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className={`block text-[10px] font-semibold mb-1 ${isDark ? 'text-dark-text2' : 'text-gray-600'}`}>البريد الإلكتروني (اختياري)</label>
                    <input type="email" value={customer.email} onChange={e => setCustomer({...customer, email: e.target.value})} placeholder="email@example.com" className={inp} dir="ltr" />
                  </div>

                  {/* Wilaya - dropdown */}
                  <div>
                    <label className={`block text-[10px] font-semibold mb-1 ${isDark ? 'text-dark-text2' : 'text-gray-600'}`}>الولاية *</label>
                    <select value={customer.wilaya} onChange={e => { setCustomer({...customer, wilaya: e.target.value}); setErrors({...errors, wilaya: ''}); }} className={`${inp} appearance-none`}>
                      <option value="">-- اختر الولاية --</option>
                      {wilayas.map(w => <option key={w.code} value={w.nameAr}>{w.code} - {w.nameAr}</option>)}
                    </select>
                    {errors.wilaya && <p className="text-red-500 text-[10px] mt-0.5">{errors.wilaya}</p>}
                    {selectedWilaya && <p className={`text-[10px] mt-0.5 ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>🚚 توصيل: {SHIPPING_COSTS[selectedWilaya.shippingZone]} د.ج ({SHIPPING_LABELS[selectedWilaya.shippingZone]})</p>}
                  </div>

                  {/* Daira - FREE TEXT */}
                  <div>
                    <label className={`block text-[10px] font-semibold mb-1 ${isDark ? 'text-dark-text2' : 'text-gray-600'}`}>الدائرة *</label>
                    <input type="text" value={customer.daira} onChange={e => { setCustomer({...customer, daira: e.target.value}); setErrors({...errors, daira: ''}); }} placeholder="أدخل اسم الدائرة" className={inp} />
                    {errors.daira && <p className="text-red-500 text-[10px] mt-0.5">{errors.daira}</p>}
                  </div>

                  {/* Commune - FREE TEXT */}
                  <div>
                    <label className={`block text-[10px] font-semibold mb-1 ${isDark ? 'text-dark-text2' : 'text-gray-600'}`}>البلدية *</label>
                    <input type="text" value={customer.commune} onChange={e => { setCustomer({...customer, commune: e.target.value}); setErrors({...errors, commune: ''}); }} placeholder="أدخل اسم البلدية" className={inp} />
                    {errors.commune && <p className="text-red-500 text-[10px] mt-0.5">{errors.commune}</p>}
                  </div>

                  {/* Address */}
                  <div>
                    <label className={`block text-[10px] font-semibold mb-1 ${isDark ? 'text-dark-text2' : 'text-gray-600'}`}>العنوان التفصيلي *</label>
                    <input type="text" value={customer.address} onChange={e => { setCustomer({...customer, address: e.target.value}); setErrors({...errors, address: ''}); }} placeholder="الشارع، الحي، رقم المبنى" className={inp} />
                    {errors.address && <p className="text-red-500 text-[10px] mt-0.5">{errors.address}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label className={`block text-[10px] font-semibold mb-1 ${isDark ? 'text-dark-text2' : 'text-gray-600'}`}>ملاحظات (اختياري)</label>
                    <textarea value={customer.notes} onChange={e => setCustomer({...customer, notes: e.target.value})} placeholder="ملاحظات إضافية..." className={`${inp} resize-none`} rows={2} />
                  </div>
                </div>
              </div>
            )}

            {/* ═══ Step 2: Payment ═══ */}
            {step === 2 && (
              <div className={`rounded-2xl p-5 border animate-fadeIn ${isDark ? 'bg-dark-card border-dark-border' : 'bg-white border-gray-200 shadow-sm'}`}>
                <h2 className={`text-sm font-bold mb-4 ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>💳 طريقة الدفع</h2>
                <div className="space-y-2">
                  {[
                    { key: 'cod', icon: '💵', title: 'الدفع عند الاستلام', desc: 'ادفع نقدًا عند الاستلام · 3-7 أيام' },
                    { key: 'transfer', icon: '🏦', title: 'تحويل بنكي CCP', desc: 'تأكيد خلال 24 ساعة' },
                    { key: 'baridimob', icon: '📱', title: 'بريدي موب', desc: 'بريد الجزائر أو تطبيق بريدي موب' },
                  ].map(pm => (
                    <button key={pm.key} onClick={() => setPaymentMethod(pm.key)}
                      className={`w-full p-3 rounded-xl border-2 text-start flex items-center gap-3 text-sm transition-all ${paymentMethod === pm.key ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : (isDark ? 'border-dark-border' : 'border-gray-200')}`}>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentMethod === pm.key ? 'border-primary-500' : (isDark ? 'border-dark-text2' : 'border-gray-300')}`}>
                        {paymentMethod === pm.key && <div className="w-2 h-2 rounded-full bg-primary-500" />}
                      </div>
                      <span className="text-lg">{pm.icon}</span>
                      <div>
                        <p className={`font-bold text-sm ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>{pm.title}</p>
                        <p className={`text-[10px] ${isDark ? 'text-dark-text2' : 'text-gray-500'}`}>{pm.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>

                {(paymentMethod === 'transfer' || paymentMethod === 'baridimob') && (
                  <div className={`mt-3 p-3 rounded-xl animate-fadeIn text-xs ${isDark ? 'bg-dark-bg' : 'bg-gray-50'}`}>
                    <p className={`font-bold mb-1 ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>بيانات الحساب:</p>
                    <p className={isDark ? 'text-dark-text2' : 'text-gray-600'}>CCP: <span className="font-mono font-bold">0020006548 52</span></p>
                    <p className={isDark ? 'text-dark-text2' : 'text-gray-600'}>RIP: <span className="font-mono font-bold">007 99999 0020006548 52</span></p>
                    <label className={`flex flex-col items-center justify-center w-full h-20 border-2 border-dashed rounded-xl cursor-pointer mt-2 ${isDark ? 'border-dark-border bg-dark-card' : 'border-gray-300 bg-white'}`}>
                      {transferReceipt ? <span className="text-green-500 text-xs">✓ تم رفع الوصل</span> : <span className={`text-xs ${isDark ? 'text-dark-text2' : 'text-gray-500'}`}>📤 ارفع صورة وصل التحويل</span>}
                      <input type="file" accept="image/*" onChange={handleReceiptUpload} className="hidden" />
                    </label>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ═══ Sidebar ═══ */}
          <div className="lg:col-span-1">
            <div className={`rounded-2xl p-4 border sticky top-20 ${isDark ? 'bg-dark-card border-dark-border' : 'bg-white border-gray-200 shadow-sm'}`}>
              <h3 className={`text-sm font-bold mb-3 ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>ملخص الطلب</h3>
              <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
                {cart.map(item => (
                  <div key={item.product.id} className="flex items-center gap-2">
                    <img src={item.product.images?.[0]} alt="" className="w-8 h-8 rounded object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold truncate ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>{item.product.name}</p>
                      <p className={`text-[10px] ${isDark ? 'text-dark-text2' : 'text-gray-500'}`}>×{item.quantity}</p>
                    </div>
                    <span className={`text-xs font-bold ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className={`space-y-1 border-t pt-2 text-xs ${isDark ? 'border-dark-border' : 'border-gray-200'}`}>
                <div className="flex justify-between"><span className={isDark ? 'text-dark-text2' : 'text-gray-500'}>المجموع</span><span>{formatPrice(cartTotal)}</span></div>
                {discountAmount > 0 && <div className="flex justify-between text-green-500"><span>خصم</span><span>-{formatPrice(discountAmount)}</span></div>}
                <div className="flex justify-between"><span className={isDark ? 'text-dark-text2' : 'text-gray-500'}>التوصيل</span>{shippingCost ? <span>{shippingCost} د.ج</span> : <span className="text-gray-400">--</span>}</div>
              </div>
              <div className={`border-t-2 border-dashed pt-2 mt-2 ${isDark ? 'border-dark-border' : 'border-gray-200'}`}>
                <div className="flex justify-between items-center"><span className={`text-sm font-bold ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>الإجمالي</span><span className="text-lg font-black text-primary-500">{formatPrice(totalWithShipping)}</span></div>
              </div>
              <div className="mt-4 space-y-2">
                <button onClick={handleNext} disabled={isProcessing}
                  className="w-full py-3 bg-primary-600 text-white rounded-xl font-bold text-sm hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center gap-2">
                  {isProcessing ? (<><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> جاري المعالجة...</>) : step === 2 ? 'تأكيد الطلب ✓' : 'متابعة →'}
                </button>
                <button onClick={() => step === 1 ? setCurrentPage('cart') : setStep(1)}
                  className={`w-full py-2 rounded-xl text-xs font-semibold ${isDark ? 'text-dark-text2 hover:bg-dark-bg' : 'text-gray-500 hover:bg-gray-100'}`}>
                  ← {step === 1 ? 'العودة للسلة' : 'تعديل البيانات'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutFlow;
