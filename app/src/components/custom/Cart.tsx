import { useState } from 'react';
import { Plus, Minus, ShoppingBag, ArrowLeft, Trash2, Check } from 'lucide-react';
import { useStore } from '@/store';
import { ordersDB } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import type { Order } from '@/types';

type PaymentMethod = 'cod' | 'online' | 'vodafone';

export function Cart() {
  const { cart, cartTotal, cartCount, removeFromCart, updateQuantity, clearCart, settings } = useStore();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [orderData, setOrderData] = useState({
    name: '',
    phone: '',
    address: '',
    transactionId: '',
  });
  const [isOrderComplete, setIsOrderComplete] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-EG').format(price);
  };

  const shippingCost = cartTotal >= settings.freeShippingThreshold ? 0 : settings.shippingCost;
  const totalWithShipping = cartTotal + shippingCost;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      toast.error('السلة فارغة');
      return;
    }

    // Create order
    const order: Omit<Order, 'id'> = {
      customerName: orderData.name,
      phone: orderData.phone,
      address: orderData.address,
      items: cart.map(item => ({
        product: {
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          image: item.product.image,
          category: item.product.category,
        },
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      })),
      subtotal: cartTotal,
      shipping: shippingCost,
      total: totalWithShipping,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
      status: 'pending',
      transactionId: paymentMethod === 'vodafone' ? orderData.transactionId : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save order to database
    ordersDB.create(order);
    
    setIsOrderComplete(true);
    toast.success('تم تقديم طلبك بنجاح!');
    clearCart();
    
    setTimeout(() => {
      setIsCheckoutOpen(false);
      setIsOrderComplete(false);
      setOrderData({ name: '', phone: '', address: '', transactionId: '' });
    }, 3000);
  };

  if (cart.length === 0 && !isOrderComplete) {
    return (
      <section id="cart" className="w-full bg-paper py-16 md:py-24 min-h-[50vh]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-text-muted" />
          </div>
          <h2 className="text-2xl font-bold text-ink mb-2">السلة فارغة</h2>
          <p className="text-text-secondary mb-6">ابدأ التسوق واكتشف منتجاتنا المميزة</p>
          <a 
            href="#products"
            className="btn-primary inline-flex gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>تصفح المنتجات</span>
          </a>
        </div>
      </section>
    );
  }

  return (
    <section id="cart" className="w-full bg-paper py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <h2 className="text-3xl md:text-4xl font-black text-ink mb-8">سلة التسوق</h2>
        
        {isOrderComplete ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-card">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-ink mb-2">تم تقديم طلبك بنجاح!</h3>
            <p className="text-text-secondary">سنتواصل معك قريباً لتأكيد الطلب</p>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="space-y-4 mb-8">
              {cart.map((item) => (
                <div 
                  key={item.product.id}
                  className="bg-white rounded-xl p-4 flex gap-4 shadow-card"
                >
                  <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                    <img 
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-ink mb-1">{item.product.name}</h3>
                    {item.size && (
                      <p className="text-sm text-text-muted">المقاس: {item.size}</p>
                    )}
                    {item.color && (
                      <p className="text-sm text-text-muted">اللون: {item.color}</p>
                    )}
                    <p className="text-cobalt font-bold mt-2">
                      {formatPrice(item.product.price)} ج.م
                    </p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-text-muted hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-xl p-6 shadow-card">
              <h3 className="font-bold text-lg text-ink mb-4">ملخص الطلب</h3>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-text-secondary">
                  <span>عدد المنتجات</span>
                  <span>{cartCount}</span>
                </div>
                <div className="flex justify-between text-text-secondary">
                  <span>المجموع الفرعي</span>
                  <span>{formatPrice(cartTotal)} ج.م</span>
                </div>
                <div className="flex justify-between text-text-secondary">
                  <span>الشحن</span>
                  <span className={shippingCost === 0 ? 'text-green-600' : ''}>
                    {shippingCost === 0 ? 'مجاني' : `${formatPrice(shippingCost)} ج.م`}
                  </span>
                </div>
                {shippingCost === 0 && (
                  <p className="text-sm text-green-600">
                    🎉 لقد حصلت على شحن مجاني!
                  </p>
                )}
              </div>
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">الإجمالي</span>
                  <span className="text-2xl font-black text-cobalt">
                    {formatPrice(totalWithShipping)} ج.م
                  </span>
                </div>
              </div>
              <Button 
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full gap-2 bg-ink hover:bg-cobalt"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>إتمام الطلب</span>
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Checkout Dialog */}
      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle>إتمام الطلب</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleCheckout} className="space-y-6 mt-4">
            {/* Customer Info */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">الاسم الكامل</Label>
                <Input
                  id="name"
                  value={orderData.name}
                  onChange={(e) => setOrderData({ ...orderData, name: e.target.value })}
                  placeholder="أدخل اسمك الكامل"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">رقم الهاتف</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={orderData.phone}
                  onChange={(e) => setOrderData({ ...orderData, phone: e.target.value })}
                  placeholder="01xxxxxxxxx"
                  required
                />
              </div>
              <div>
                <Label htmlFor="address">العنوان</Label>
                <Input
                  id="address"
                  value={orderData.address}
                  onChange={(e) => setOrderData({ ...orderData, address: e.target.value })}
                  placeholder="المدينة، الحي، الشارع"
                  required
                />
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <Label className="mb-3 block">طريقة الدفع</Label>
              <RadioGroup 
                value={paymentMethod} 
                onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
                className="space-y-2"
              >
                {settings.enableCOD && (
                  <div className="flex items-center space-x-2 space-x-reverse p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex-1 cursor-pointer">
                      الدفع عند الاستلام
                    </Label>
                  </div>
                )}
                {settings.enableOnlinePayment && (
                  <div className="flex items-center space-x-2 space-x-reverse p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value="online" id="online" />
                    <Label htmlFor="online" className="flex-1 cursor-pointer">
                      الدفع الإلكتروني
                    </Label>
                  </div>
                )}
                {settings.enableVodafoneCash && (
                  <div className="flex items-center space-x-2 space-x-reverse p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value="vodafone" id="vodafone" />
                    <Label htmlFor="vodafone" className="flex-1 cursor-pointer">
                      فودافون كاش
                    </Label>
                  </div>
                )}
              </RadioGroup>
            </div>

            {/* Vodafone Cash Instructions */}
            {paymentMethod === 'vodafone' && settings.enableVodafoneCash && (
              <div className="bg-yellow-50 p-4 rounded-lg text-sm space-y-2">
                <p className="font-medium mb-2">تعليمات الدفع بفودافون كاش:</p>
                <ol className="list-decimal list-inside space-y-1 text-text-secondary">
                  <li>أرسل المبلغ إلى رقم: {settings.vodafoneNumber}</li>
                  <li>احتفظ برقم العملية (Transaction ID)</li>
                  <li>أدخل رقم العملية أدناه</li>
                </ol>
                <div className="mt-3">
                  <Label htmlFor="transactionId">رقم العملية</Label>
                  <Input
                    id="transactionId"
                    value={orderData.transactionId}
                    onChange={(e) => setOrderData({ ...orderData, transactionId: e.target.value })}
                    placeholder="أدخل رقم العملية"
                    required={paymentMethod === 'vodafone'}
                  />
                </div>
              </div>
            )}

            {/* Order Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-bold">الإجمالي</span>
                <span className="text-xl font-black text-cobalt">
                  {formatPrice(totalWithShipping)} ج.م
                </span>
              </div>
            </div>

            <Button type="submit" className="w-full gap-2 bg-cobalt hover:bg-cobalt/90">
              <Check className="w-5 h-5" />
              <span>تأكيد الطلب</span>
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
