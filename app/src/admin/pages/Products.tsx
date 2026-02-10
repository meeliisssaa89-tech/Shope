import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAdmin } from '@/store/adminStore';
import { AdminLayout } from '@/admin/components/AdminLayout';
import type { Product } from '@/types';

const initialProductState: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> = {
  name: '',
  price: 0,
  originalPrice: undefined,
  image: '',
  category: 'clothes',
  description: '',
  sizes: [],
  colors: [],
  featured: false,
  isNew: false,
  inStock: true,
};

type AdminPage = 'dashboard' | 'products' | 'categories' | 'orders' | 'slider' | 'announcements' | 'settings';

interface AdminProductsProps {
  onNavigate: (page: AdminPage) => void;
  onExit: () => void;
}

export function AdminProducts({ onNavigate, onExit }: AdminProductsProps) {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState(initialProductState);
  const [sizeInput, setSizeInput] = useState('');
  const [colorInput, setColorInput] = useState('');

  // Filter products
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        category: product.category,
        description: product.description || '',
        sizes: product.sizes || [],
        colors: product.colors || [],
        featured: product.featured || false,
        isNew: product.isNew || false,
        inStock: product.inStock !== false,
      });
    } else {
      setEditingProduct(null);
      setFormData(initialProductState);
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (editingProduct) {
      updateProduct(editingProduct.id, formData);
    } else {
      addProduct(formData);
    }
    setIsDialogOpen(false);
    setFormData(initialProductState);
  };

  const handleDelete = (id: string) => {
    setProductToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete);
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const addSize = () => {
    if (sizeInput && !formData.sizes?.includes(sizeInput)) {
      setFormData({ ...formData, sizes: [...(formData.sizes || []), sizeInput] });
      setSizeInput('');
    }
  };

  const removeSize = (size: string) => {
    setFormData({ ...formData, sizes: formData.sizes?.filter(s => s !== size) || [] });
  };

  const addColor = () => {
    if (colorInput && !formData.colors?.includes(colorInput)) {
      setFormData({ ...formData, colors: [...(formData.colors || []), colorInput] });
      setColorInput('');
    }
  };

  const removeColor = (color: string) => {
    setFormData({ ...formData, colors: formData.colors?.filter(c => c !== color) || [] });
  };

  return (
    <AdminLayout currentPage="products" onNavigate={onNavigate} onExit={onExit}>
      <div className="p-6 space-y-6" dir="rtl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-3xl font-black">المنتجات</h1>
          <Button onClick={() => handleOpenDialog()} className="gap-2">
            <Plus className="w-4 h-4" />
            إضافة منتج
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="البحث في المنتجات..."
            className="pr-10"
          />
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden group">
              <div className="relative aspect-square">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button 
                    size="icon" 
                    variant="secondary"
                    onClick={() => handleOpenDialog(product)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="destructive"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                {product.featured && (
                  <Badge className="absolute top-2 right-2 bg-yellow-500">
                    <Star className="w-3 h-3 mr-1" />
                    مميز
                  </Badge>
                )}
                {product.isNew && (
                  <Badge className="absolute top-2 left-2 bg-green-500">جديد</Badge>
                )}
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Badge variant="secondary" className="text-lg">نفذت الكمية</Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold truncate">{product.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-1">{product.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-bold text-cobalt">{product.price.toLocaleString()} ج.م</span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      {product.originalPrice.toLocaleString()} ج.م
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
            <DialogHeader>
              <DialogTitle>{editingProduct ? 'تعديل منتج' : 'إضافة منتج جديد'}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>اسم المنتج</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="أدخل اسم المنتج"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>الفئة</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(v) => setFormData({ ...formData, category: v as 'clothes' | 'shoes' | 'accessories' })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الفئة" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.slug}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>السعر</Label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    placeholder="0"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>السعر قبل الخصم (اختياري)</Label>
                  <Input
                    type="number"
                    value={formData.originalPrice || ''}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value ? Number(e.target.value) : undefined })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>رابط الصورة</Label>
                <Input
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://..."
                />
                {formData.image && (
                  <div className="w-32 h-32 rounded-lg overflow-hidden">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>الوصف</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="وصف المنتج..."
                  rows={3}
                />
              </div>

              {/* Sizes */}
              <div className="space-y-2">
                <Label>المقاسات</Label>
                <div className="flex gap-2">
                  <Input
                    value={sizeInput}
                    onChange={(e) => setSizeInput(e.target.value)}
                    placeholder="أضف مقاس"
                    onKeyPress={(e) => e.key === 'Enter' && addSize()}
                  />
                  <Button type="button" onClick={addSize} variant="outline">إضافة</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.sizes?.map((size) => (
                    <Badge key={size} variant="secondary" className="cursor-pointer" onClick={() => removeSize(size)}>
                      {size} ×
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className="space-y-2">
                <Label>الألوان</Label>
                <div className="flex gap-2">
                  <Input
                    value={colorInput}
                    onChange={(e) => setColorInput(e.target.value)}
                    placeholder="أضف لون"
                    onKeyPress={(e) => e.key === 'Enter' && addColor()}
                  />
                  <Button type="button" onClick={addColor} variant="outline">إضافة</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.colors?.map((color) => (
                    <Badge key={color} variant="secondary" className="cursor-pointer" onClick={() => removeColor(color)}>
                      {color} ×
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Switches */}
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.featured}
                    onCheckedChange={(v) => setFormData({ ...formData, featured: v })}
                  />
                  <Label>منتج مميز</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.isNew}
                    onCheckedChange={(v) => setFormData({ ...formData, isNew: v })}
                  />
                  <Label>منتج جديد</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.inStock}
                    onCheckedChange={(v) => setFormData({ ...formData, inStock: v })}
                  />
                  <Label>متوفر في المخزن</Label>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>إلغاء</Button>
              <Button onClick={handleSave} className="bg-ink">
                {editingProduct ? 'حفظ التغييرات' : 'إضافة المنتج'}
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
            <p>هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.</p>
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
