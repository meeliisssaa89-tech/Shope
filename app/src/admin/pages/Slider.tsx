import { useState } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { useAdmin } from '@/store/adminStore';
import { AdminLayout } from '@/admin/components/AdminLayout';
import type { SliderImage } from '@/types';

type AdminPage = 'dashboard' | 'products' | 'categories' | 'orders' | 'slider' | 'announcements' | 'settings';

interface AdminSliderProps {
  onNavigate: (page: AdminPage) => void;
  onExit: () => void;
}

export function AdminSlider({ onNavigate, onExit }: AdminSliderProps) {
  const { sliderImages, addSliderImage, updateSliderImage, deleteSliderImage, reorderSliderImages } = useAdmin();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<SliderImage | null>(null);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    image: '',
    title: '',
    subtitle: '',
    link: '',
    isActive: true,
  });

  const sortedImages = [...sliderImages].sort((a, b) => a.order - b.order);

  const handleOpenDialog = (image?: SliderImage) => {
    if (image) {
      setEditingImage(image);
      setFormData({
        image: image.image,
        title: image.title || '',
        subtitle: image.subtitle || '',
        link: image.link || '',
        isActive: image.isActive,
      });
    } else {
      setEditingImage(null);
      setFormData({
        image: '',
        title: '',
        subtitle: '',
        link: '',
        isActive: true,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (editingImage) {
      updateSliderImage(editingImage.id, formData);
    } else {
      const maxOrder = Math.max(0, ...sliderImages.map(img => img.order));
      addSliderImage({ ...formData, order: maxOrder + 1 });
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setImageToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (imageToDelete) {
      deleteSliderImage(imageToDelete);
      setIsDeleteDialogOpen(false);
      setImageToDelete(null);
    }
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newImages = [...sortedImages];
    [newImages[index], newImages[index - 1]] = [newImages[index - 1], newImages[index]];
    const reordered = newImages.map((img, i) => ({ ...img, order: i + 1 }));
    reorderSliderImages(reordered);
  };

  const moveDown = (index: number) => {
    if (index === sortedImages.length - 1) return;
    const newImages = [...sortedImages];
    [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
    const reordered = newImages.map((img, i) => ({ ...img, order: i + 1 }));
    reorderSliderImages(reordered);
  };

  const toggleActive = (image: SliderImage) => {
    updateSliderImage(image.id, { isActive: !image.isActive });
  };

  return (
    <AdminLayout currentPage="slider" onNavigate={onNavigate} onExit={onExit}>
      <div className="p-6 space-y-6" dir="rtl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black">صور السلايدر</h1>
            <p className="text-gray-500 mt-1">إدارة صور البانر الرئيسي في الصفحة الأمامية</p>
          </div>
          <Button onClick={() => handleOpenDialog()} className="gap-2">
            <Plus className="w-4 h-4" />
            إضافة صورة
          </Button>
        </div>

        {/* Images List */}
        <div className="space-y-4">
          {sortedImages.map((image, index) => (
            <Card key={image.id} className={`overflow-hidden ${!image.isActive ? 'opacity-60' : ''}`}>
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  {/* Image Preview */}
                  <div className="relative w-full md:w-64 h-40">
                    <img 
                      src={image.image} 
                      alt={image.title}
                      className="w-full h-full object-cover"
                    />
                    {!image.isActive && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="bg-gray-800 text-white px-3 py-1 rounded text-sm">معطلة</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-lg">{image.title || 'بدون عنوان'}</h3>
                      <p className="text-gray-500">{image.subtitle || 'بدون وصف فرعي'}</p>
                      {image.link && (
                        <p className="text-sm text-cobalt mt-1">{image.link}</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-4">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleOpenDialog(image)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => toggleActive(image)}
                      >
                        {image.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDelete(image.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>

                      <div className="mr-auto flex gap-1">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => moveUp(index)}
                          disabled={index === 0}
                        >
                          <ArrowUp className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => moveDown(index)}
                          disabled={index === sortedImages.length - 1}
                        >
                          <ArrowDown className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {sortedImages.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">لا توجد صور في السلايدر</p>
            <Button onClick={() => handleOpenDialog()} className="mt-4">
              إضافة صورة جديدة
            </Button>
          </div>
        )}

        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-lg" dir="rtl">
            <DialogHeader>
              <DialogTitle>{editingImage ? 'تعديل صورة' : 'إضافة صورة جديدة'}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>رابط الصورة</Label>
                <Input
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://..."
                />
                {formData.image && (
                  <div className="w-full h-40 rounded-lg overflow-hidden">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>العنوان (اختياري)</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="عنوان الصورة"
                />
              </div>

              <div className="space-y-2">
                <Label>الوصف الفرعي (اختياري)</Label>
                <Input
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="وصف قصير"
                />
              </div>

              <div className="space-y-2">
                <Label>رابط الزر (اختياري)</Label>
                <Input
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  placeholder="#products أو رابط خارجي"
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(v) => setFormData({ ...formData, isActive: v })}
                />
                <Label>الصورة نشطة</Label>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>إلغاء</Button>
              <Button onClick={handleSave} className="bg-ink">
                {editingImage ? 'حفظ التغييرات' : 'إضافة الصورة'}
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
            <p>هل أنت متأكد من حذف هذه الصورة؟</p>
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
