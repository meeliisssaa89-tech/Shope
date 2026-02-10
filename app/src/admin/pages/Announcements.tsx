import { useState } from 'react';
import { Plus, Edit2, Trash2, Megaphone, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useAdmin } from '@/store/adminStore';
import { AdminLayout } from '@/admin/components/AdminLayout';
import type { Announcement } from '@/types';

type AdminPage = 'dashboard' | 'products' | 'categories' | 'orders' | 'slider' | 'announcements' | 'settings';

interface AdminAnnouncementsProps {
  onNavigate: (page: AdminPage) => void;
  onExit: () => void;
}

export function AdminAnnouncements({ onNavigate, onExit }: AdminAnnouncementsProps) {
  const { announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement, setActiveAnnouncement } = useAdmin();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [announcementToDelete, setAnnouncementToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    message: '',
    isActive: true,
  });

  const handleOpenDialog = (announcement?: Announcement) => {
    if (announcement) {
      setEditingAnnouncement(announcement);
      setFormData({
        message: announcement.message,
        isActive: announcement.isActive,
      });
    } else {
      setEditingAnnouncement(null);
      setFormData({
        message: '',
        isActive: true,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (editingAnnouncement) {
      updateAnnouncement(editingAnnouncement.id, formData);
    } else {
      addAnnouncement(formData);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setAnnouncementToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (announcementToDelete) {
      deleteAnnouncement(announcementToDelete);
      setIsDeleteDialogOpen(false);
      setAnnouncementToDelete(null);
    }
  };

  const handleSetActive = (id: string) => {
    setActiveAnnouncement(id);
  };

  return (
    <AdminLayout currentPage="announcements" onNavigate={onNavigate} onExit={onExit}>
      <div className="p-6 space-y-6" dir="rtl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black">الإشعارات</h1>
            <p className="text-gray-500 mt-1">إدارة شريط الإشعارات العلوي في الموقع</p>
          </div>
          <Button onClick={() => handleOpenDialog()} className="gap-2">
            <Plus className="w-4 h-4" />
            إضافة إشعار
          </Button>
        </div>

        {/* Active Announcement Alert */}
        {announcements.find(a => a.isActive) && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="flex items-center gap-4 p-4">
              <Check className="w-6 h-6 text-green-600" />
              <div className="flex-1">
                <p className="font-bold text-green-800">الإشعار النشط حالياً:</p>
                <p className="text-green-700">{announcements.find(a => a.isActive)?.message}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Announcements List */}
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <Card 
              key={announcement.id} 
              className={`overflow-hidden ${announcement.isActive ? 'border-green-300' : ''}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    announcement.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                  }`}>
                    <Megaphone className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1">
                    <p className="font-medium text-lg">{announcement.message}</p>
                    <div className="flex items-center gap-2 mt-2">
                      {announcement.isActive ? (
                        <Badge className="bg-green-100 text-green-800">نشط</Badge>
                      ) : (
                        <Badge variant="secondary">معطل</Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!announcement.isActive && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleSetActive(announcement.id)}
                      >
                        تفعيل
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleOpenDialog(announcement)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleDelete(announcement.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {announcements.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">لا توجد إشعارات</p>
            <Button onClick={() => handleOpenDialog()} className="mt-4">
              إضافة إشعار جديد
            </Button>
          </div>
        )}

        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-lg" dir="rtl">
            <DialogHeader>
              <DialogTitle>{editingAnnouncement ? 'تعديل إشعار' : 'إضافة إشعار جديد'}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>نص الإشعار</Label>
                <Input
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="مثال: 🚚 التوصيل مجاني للطلبات فوق 2000 جنيه"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4"
                />
                <Label htmlFor="isActive">تفعيل هذا الإشعار فوراً</Label>
              </div>

              {formData.isActive && (
                <div className="p-3 bg-yellow-50 rounded-lg text-sm text-yellow-800">
                  <AlertCircle className="w-4 h-4 inline ml-1" />
                  سيتم تعطيل الإشعارات الأخرى تلقائياً
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>إلغاء</Button>
              <Button onClick={handleSave} className="bg-ink">
                {editingAnnouncement ? 'حفظ التغييرات' : 'إضافة الإشعار'}
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
            <p>هل أنت متأكد من حذف هذا الإشعار؟</p>
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
