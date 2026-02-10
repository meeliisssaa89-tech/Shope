import { useState, useEffect } from 'react';
import { Save, Store, CreditCard, Truck, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAdmin } from '@/store/adminStore';
import { AdminLayout } from '@/admin/components/AdminLayout';

type AdminPage = 'dashboard' | 'products' | 'categories' | 'orders' | 'slider' | 'announcements' | 'settings';

interface AdminSettingsProps {
  onNavigate: (page: AdminPage) => void;
  onExit: () => void;
}

export function AdminSettings({ onNavigate, onExit }: AdminSettingsProps) {
  const { settings, updateSettings } = useAdmin();
  const [formData, setFormData] = useState(settings);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSocialChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [platform]: value }
    }));
    setHasChanges(true);
  };

  const handleSeoChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      seo: { ...prev.seo, [field]: value }
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    updateSettings(formData);
    setHasChanges(false);
  };

  return (
    <AdminLayout currentPage="settings" onNavigate={onNavigate} onExit={onExit}>
      <div className="p-6 space-y-6" dir="rtl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black">الإعدادات</h1>
            <p className="text-gray-500 mt-1">إدارة إعدادات الموقع العامة</p>
          </div>
          {hasChanges && (
            <Button onClick={handleSave} className="gap-2 bg-green-600">
              <Save className="w-4 h-4" />
              حفظ التغييرات
            </Button>
          )}
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="general">عام</TabsTrigger>
            <TabsTrigger value="payment">الدفع</TabsTrigger>
            <TabsTrigger value="shipping">الشحن</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="w-5 h-5" />
                  معلومات المتجر
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>اسم المتجر</Label>
                    <Input
                      value={formData.siteName}
                      onChange={(e) => handleChange('siteName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>البريد الإلكتروني</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>وصف المتجر</Label>
                  <Input
                    value={formData.siteDescription}
                    onChange={(e) => handleChange('siteDescription', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>رقم الهاتف</Label>
                    <Input
                      value={formData.phoneNumber}
                      onChange={(e) => handleChange('phoneNumber', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>رقم واتساب</Label>
                    <Input
                      value={formData.whatsappNumber}
                      onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>العنوان</Label>
                  <Input
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  روابط التواصل الاجتماعي
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>فيسبوك</Label>
                  <Input
                    value={formData.socialLinks.facebook || ''}
                    onChange={(e) => handleSocialChange('facebook', e.target.value)}
                    placeholder="https://facebook.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>إنستغرام</Label>
                  <Input
                    value={formData.socialLinks.instagram || ''}
                    onChange={(e) => handleSocialChange('instagram', e.target.value)}
                    placeholder="https://instagram.com/..."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Settings */}
          <TabsContent value="payment" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  طرق الدفع
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">الدفع عند الاستلام</p>
                    <p className="text-sm text-gray-500">الدفع نقداً عند استلام الطلب</p>
                  </div>
                  <Switch
                    checked={formData.enableCOD}
                    onCheckedChange={(v) => handleChange('enableCOD', v)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">الدفع الإلكتروني</p>
                    <p className="text-sm text-gray-500">بطاقات ائتمانية ومحافظ إلكترونية</p>
                  </div>
                  <Switch
                    checked={formData.enableOnlinePayment}
                    onCheckedChange={(v) => handleChange('enableOnlinePayment', v)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">فودافون كاش</p>
                    <p className="text-sm text-gray-500">الدفع عبر محفظة فودافون كاش</p>
                  </div>
                  <Switch
                    checked={formData.enableVodafoneCash}
                    onCheckedChange={(v) => handleChange('enableVodafoneCash', v)}
                  />
                </div>

                {formData.enableVodafoneCash && (
                  <div className="space-y-2 p-4 border rounded-lg">
                    <Label>رقم فودافون كاش</Label>
                    <Input
                      value={formData.vodafoneNumber}
                      onChange={(e) => handleChange('vodafoneNumber', e.target.value)}
                      placeholder="01xxxxxxxx"
                    />
                    <p className="text-sm text-gray-500">
                      سيتم عرض هذا الرقم للعملاء لإرسال المدفوعات عليه
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Shipping Settings */}
          <TabsContent value="shipping" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  إعدادات الشحن
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>تكلفة الشحن (ج.م)</Label>
                    <Input
                      type="number"
                      value={formData.shippingCost}
                      onChange={(e) => handleChange('shippingCost', Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>الحد الأدنى للشحن المجاني (ج.م)</Label>
                    <Input
                      type="number"
                      value={formData.freeShippingThreshold}
                      onChange={(e) => handleChange('freeShippingThreshold', Number(e.target.value))}
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  سيتم تطبيق الشحن المجاني على الطلبات التي تبلغ قيمتها {formData.freeShippingThreshold} ج.م أو أكثر
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SEO Settings */}
          <TabsContent value="seo" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  تحسين محركات البحث (SEO)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>عنوان الموقع (Title)</Label>
                  <Input
                    value={formData.seo.title}
                    onChange={(e) => handleSeoChange('title', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>وصف الموقع (Meta Description)</Label>
                  <Input
                    value={formData.seo.description}
                    onChange={(e) => handleSeoChange('description', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>الكلمات المفتاحية (Keywords)</Label>
                  <Input
                    value={formData.seo.keywords}
                    onChange={(e) => handleSeoChange('keywords', e.target.value)}
                    placeholder="افصل بين الكلمات بفاصلة"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        {hasChanges && (
          <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-auto md:w-96 z-50">
            <Card className="bg-ink text-paper shadow-xl">
              <CardContent className="flex items-center justify-between p-4">
                <span>لديك تغييرات غير محفوظة</span>
                <Button onClick={handleSave} className="bg-cobalt hover:bg-cobalt/90">
                  <Save className="w-4 h-4 ml-2" />
                  حفظ
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
