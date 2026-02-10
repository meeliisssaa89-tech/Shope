import { useState } from 'react';
import { Search, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAdmin } from '@/store/adminStore';
import { AdminLayout } from '@/admin/components/AdminLayout';
import type { Order, OrderStatus, PaymentStatus } from '@/types';

type AdminPage = 'dashboard' | 'products' | 'categories' | 'orders' | 'slider' | 'announcements' | 'settings';

interface AdminOrdersProps {
  onNavigate: (page: AdminPage) => void;
  onExit: () => void;
}

const orderStatusOptions: { value: OrderStatus; label: string; color: string }[] = [
  { value: 'pending', label: 'معلق', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'confirmed', label: 'مؤكد', color: 'bg-blue-100 text-blue-800' },
  { value: 'processing', label: 'قيد المعالجة', color: 'bg-purple-100 text-purple-800' },
  { value: 'shipped', label: 'تم الشحن', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'delivered', label: 'تم التوصيل', color: 'bg-green-100 text-green-800' },
  { value: 'cancelled', label: 'ملغي', color: 'bg-red-100 text-red-800' },
];

const paymentStatusOptions: { value: PaymentStatus; label: string }[] = [
  { value: 'pending', label: 'معلق' },
  { value: 'paid', label: 'مدفوع' },
  { value: 'failed', label: 'فاشل' },
  { value: 'refunded', label: 'مسترد' },
];

const paymentMethodLabels: Record<string, string> = {
  cod: 'الدفع عند الاستلام',
  online: 'دفع إلكتروني',
  vodafone: 'فودافون كاش',
};

export function AdminOrders({ onNavigate, onExit }: AdminOrdersProps) {
  const { orders, updateOrderStatus, updatePaymentStatus } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.phone.includes(searchQuery) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const handlePaymentStatusChange = (orderId: string, newStatus: PaymentStatus) => {
    updatePaymentStatus(orderId, newStatus);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, paymentStatus: newStatus });
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    const option = orderStatusOptions.find(o => o.value === status);
    return <Badge className={option?.color || 'bg-gray-100'}>{option?.label || status}</Badge>;
  };

  return (
    <AdminLayout currentPage="orders" onNavigate={onNavigate} onExit={onExit}>
      <div className="p-6 space-y-6" dir="rtl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-3xl font-black">الطلبات</h1>
          <div className="text-sm text-gray-500">
            إجمالي الطلبات: {orders.length}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="البحث بالاسم، الهاتف، أو رقم الطلب..."
              className="pr-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="جميع الحالات" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الحالات</SelectItem>
              {orderStatusOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Orders Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-right py-3 px-4">رقم الطلب</th>
                    <th className="text-right py-3 px-4">العميل</th>
                    <th className="text-right py-3 px-4">المبلغ</th>
                    <th className="text-right py-3 px-4">طريقة الدفع</th>
                    <th className="text-right py-3 px-4">حالة الطلب</th>
                    <th className="text-right py-3 px-4">حالة الدفع</th>
                    <th className="text-right py-3 px-4">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">#{order.id.slice(-6)}</td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{order.customerName}</p>
                          <p className="text-sm text-gray-500">{order.phone}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-bold">{order.total.toLocaleString()} ج.م</td>
                      <td className="py-3 px-4">{paymentMethodLabels[order.paymentMethod]}</td>
                      <td className="py-3 px-4">{getStatusBadge(order.status)}</td>
                      <td className="py-3 px-4">
                        <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                          {paymentStatusOptions.find(o => o.value === order.paymentStatus)?.label}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewDetails(order)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredOrders.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">لا توجد طلبات مطابقة للبحث</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Details Dialog */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" dir="rtl">
            {selectedOrder && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    تفاصيل الطلب #{selectedOrder.id.slice(-6)}
                    {getStatusBadge(selectedOrder.status)}
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6 py-4">
                  {/* Customer Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">معلومات العميل</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">الاسم:</span>
                        <span>{selectedOrder.customerName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">الهاتف:</span>
                        <span>{selectedOrder.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">العنوان:</span>
                        <span>{selectedOrder.address}</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Order Items */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">المنتجات</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedOrder.items.map((item, index) => (
                          <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                            <img 
                              src={item.product.image} 
                              alt={item.product.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex-1">
                              <p className="font-medium">{item.product.name}</p>
                              <p className="text-sm text-gray-500">
                                الكمية: {item.quantity}
                                {item.size && ` | المقاس: ${item.size}`}
                                {item.color && ` | اللون: ${item.color}`}
                              </p>
                            </div>
                            <div className="font-bold">
                              {(item.product.price * item.quantity).toLocaleString()} ج.م
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Payment Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">معلومات الدفع</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">طريقة الدفع:</span>
                        <span>{paymentMethodLabels[selectedOrder.paymentMethod]}</span>
                      </div>
                      
                      {selectedOrder.paymentMethod === 'vodafone' && selectedOrder.transactionId && (
                        <div className="p-3 bg-yellow-50 rounded-lg">
                          <p className="font-medium text-yellow-800">رقم العملية: {selectedOrder.transactionId}</p>
                          {selectedOrder.paymentProof && (
                            <a 
                              href={selectedOrder.paymentProof} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-cobalt hover:underline text-sm"
                            >
                              عرض إثبات الدفع
                            </a>
                          )}
                        </div>
                      )}

                      <div className="border-t pt-3">
                        <div className="flex justify-between">
                          <span>المجموع الفرعي:</span>
                          <span>{selectedOrder.subtotal.toLocaleString()} ج.م</span>
                        </div>
                        <div className="flex justify-between">
                          <span>الشحن:</span>
                          <span>{selectedOrder.shipping.toLocaleString()} ج.م</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg">
                          <span>الإجمالي:</span>
                          <span className="text-cobalt">{selectedOrder.total.toLocaleString()} ج.م</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Status Updates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>تحديث حالة الطلب</Label>
                      <Select 
                        value={selectedOrder.status} 
                        onValueChange={(v) => handleStatusChange(selectedOrder.id, v as OrderStatus)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {orderStatusOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>تحديث حالة الدفع</Label>
                      <Select 
                        value={selectedOrder.paymentStatus} 
                        onValueChange={(v) => handlePaymentStatusChange(selectedOrder.id, v as PaymentStatus)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {paymentStatusOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
