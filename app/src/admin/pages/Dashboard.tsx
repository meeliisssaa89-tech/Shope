import { useEffect } from 'react';
import { 
  ShoppingBag, 
  Package, 
  Users, 
  TrendingUp, 
  Clock, 
  AlertCircle,
  ArrowLeft,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAdmin } from '@/store/adminStore';
import { AdminLayout } from '@/admin/components/AdminLayout';

type AdminPage = 'dashboard' | 'products' | 'categories' | 'orders' | 'slider' | 'announcements' | 'settings';

interface AdminDashboardProps {
  onNavigate: (page: AdminPage) => void;
  onExit: () => void;
}

export function AdminDashboard({ onNavigate, onExit }: AdminDashboardProps) {
  const { 
    stats, 
    refreshStats, 
    orders, 
    updateOrderStatus,
    updatePaymentStatus 
  } = useAdmin();

  useEffect(() => {
    refreshStats();
  }, []);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      paid: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
    };
    const labels: Record<string, string> = {
      pending: 'معلق',
      confirmed: 'مؤكد',
      processing: 'قيد المعالجة',
      shipped: 'تم الشحن',
      delivered: 'تم التوصيل',
      cancelled: 'ملغي',
      paid: 'مدفوع',
      failed: 'فاشل',
    };
    return <Badge className={styles[status] || 'bg-gray-100'}>{labels[status] || status}</Badge>;
  };

  const recentOrders = orders
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <AdminLayout currentPage="dashboard" onNavigate={onNavigate} onExit={onExit}>
      <div className="p-6 space-y-6" dir="rtl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-black">لوحة التحكم</h1>
          <Button variant="outline" onClick={refreshStats}>
            تحديث البيانات
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">إجمالي الطلبات</CardTitle>
              <ShoppingBag className="w-4 h-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">إجمالي الإيرادات</CardTitle>
              <TrendingUp className="w-4 h-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRevenue.toLocaleString()} ج.م</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">المنتجات</CardTitle>
              <Package className="w-4 h-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">العملاء</CardTitle>
              <Users className="w-4 h-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stats.pendingOrders > 0 && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="flex items-center gap-4 p-4">
                <Clock className="w-8 h-8 text-yellow-600" />
                <div>
                  <p className="font-bold text-yellow-800">طلبات معلقة</p>
                  <p className="text-yellow-700">لديك {stats.pendingOrders} طلب في انتظار التأكيد</p>
                </div>
                <Button 
                  variant="outline" 
                  className="mr-auto"
                  onClick={() => onNavigate('orders')}
                >
                  عرض
                  <ArrowLeft className="w-4 h-4 mr-2" />
                </Button>
              </CardContent>
            </Card>
          )}

          {stats.pendingPayments > 0 && (
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="flex items-center gap-4 p-4">
                <AlertCircle className="w-8 h-8 text-orange-600" />
                <div>
                  <p className="font-bold text-orange-800">مدفوعات معلقة</p>
                  <p className="text-orange-700">لديك {stats.pendingPayments} دفعة في انتظار التأكيد</p>
                </div>
                <Button 
                  variant="outline" 
                  className="mr-auto"
                  onClick={() => onNavigate('orders')}
                >
                  عرض
                  <ArrowLeft className="w-4 h-4 mr-2" />
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>أحدث الطلبات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-right py-3 px-4">رقم الطلب</th>
                    <th className="text-right py-3 px-4">العميل</th>
                    <th className="text-right py-3 px-4">المبلغ</th>
                    <th className="text-right py-3 px-4">حالة الطلب</th>
                    <th className="text-right py-3 px-4">الدفع</th>
                    <th className="text-right py-3 px-4">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">#{order.id.slice(-6)}</td>
                      <td className="py-3 px-4">{order.customerName}</td>
                      <td className="py-3 px-4">{order.total.toLocaleString()} ج.م</td>
                      <td className="py-3 px-4">{getStatusBadge(order.status)}</td>
                      <td className="py-3 px-4">{getStatusBadge(order.paymentStatus)}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          {order.status === 'pending' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateOrderStatus(order.id, 'confirmed')}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                          {order.paymentStatus === 'pending' && order.paymentMethod === 'vodafone' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600"
                              onClick={() => updatePaymentStatus(order.id, 'paid')}
                            >
                              تأكيد الدفع
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
