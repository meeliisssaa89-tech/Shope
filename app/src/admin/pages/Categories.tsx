import { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useAdmin } from '@/store/adminStore';
import { AdminLayout } from '@/admin/components/AdminLayout';
import type { Category } from '@/types';

type AdminPage = 'dashboard' | 'products' | 'categories' | 'orders' | 'slider' | 'announcements' | 'settings';

interface AdminCategoriesProps {
  onNavigate: (page: AdminPage) => void;
  onExit: () => void;
}

export function AdminCategories({ onNavigate, onExit }: AdminCategoriesProps) {
  const { categories, addCategory, updateCategory, deleteCategory, products } = useAdmin();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '' as 'clothes' | 'shoes' | 'accessories',
    image: '',
    description: '',
    isActive: true,
  });

  const getProductCount = (slug: string) => {
    return products.filter(p => p.category === slug).length;
  };

  const handleOpenDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        slug: category.slug,
        image: category.image,
        description: category.description || '',
        isActive: category.isActive !== false,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        slug: 'clothes',
        image: '',
        description: '',
        isActive: true,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (editingCategory) {
      updateCategory(editingCategory.id, { ...formData, productCount: getProductCount(formData.slug) });
    } else {
      addCategory({ ...formData, productCount: 0 });
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setCategoryToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete);
      setIsDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  const slugOptions = [
    { value: 'clothes', label: 'ملابس' },
    { value: 'shoes', label: 'أحذية' },
    { value: 'accessories', label: 'إكسسوارات' },
  ];

  return (
    <AdminLayout currentPage="categories" onNavigate={onNavigate} onExit={onExit}>
      <div className="p-6 space-y-6" dir="rtl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-3xl font-black">الفئات</h1>
          <Button onClick={() => handleOpenDialog()} className="gap-2">
            <Plus className="w-4 h-4" />
            إضافة فئة
          </Button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <Card key={category.id} className={`overflow-hidden group ${!category.isActive ? 'opacity-60' : ''}`}>
              <div className="relative h-48">
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="text-xl font-bold">{category.name}</h3>
                  <p className="text-sm text-white/80">{getProductCount(category.slug)} منتج</p>
                </div>
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    size="icon" 
                    variant="secondary"
                    onClick={() => handleOpenDialog(category)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="destructive"
                    onClick={() => handleDelete(category.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                {!category.isActive && (
                  <div className="absolute top-2 left-2">
                    <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded">معطلة</span>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <p className="text-sm text-gray-500 line-clamp-2">{category.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-lg" dir="rtl">
            <DialogHeader>
              <DialogTitle>{editingCategory ? 'تعديل فئة' : 'إضافة فئة جديدة'}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>اسم الفئة</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="أدخل اسم الفئة"
                />
              </div>

              <div className="space-y-2">
                <Label>الرمز (Slug)</Label>
                <select
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value as 'clothes' | 'shoes' | 'accessories' })}
                  className="w-full p-2 border rounded-lg"
                  disabled={!!editingCategory}
                >
                  {slugOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                {editingCategory && (
                  <p className="text-xs text-gray-500">لا يمكن تغيير الرمز بعد الإنشاء</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>رابط الصورة</Label>
                <Input
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://..."
                />
                {formData.image && (
                  <div className="w-full h-32 rounded-lg overflow-hidden">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>الوصف</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="وصف الفئة..."
                  rows={3}
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(v) => setFormData({ ...formData, isActive: v })}
                />
                <Label>الفئة نشطة</Label>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>إلغاء</Button>
              <Button onClick={handleSave} className="bg-ink">
                {editingCategory ? 'حفظ التغييرات' : 'إضافة الفئة'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent dir="rtl">
            <DialogHeader>
              <DialogTitle>تأكيد الحذف</DialogTitle>
            </DialogHeader>
            <p>هل أنت متأكد من حذف هذه الفئة؟ قد يؤثر ذلك على المنتجات المرتبطة بها.</p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>إلغاء</Button>
              <Button variant="destructive" onClick={confirmDelete}>حذف</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
