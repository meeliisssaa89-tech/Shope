import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { 
  Product, 
  Category, 
  Order, 
  OrderStatus, 
  PaymentStatus,
  SiteSettings, 
  SliderImage, 
  Announcement,
  AdminUser 
} from '@/types';
import { 
  productsDB, 
  categoriesDB, 
  ordersDB, 
  settingsDB, 
  sliderImagesDB, 
  announcementsDB,
  adminAuthDB,
  statsDB 
} from '@/lib/db';
import { toast } from 'sonner';

// Admin Store State Interface
interface AdminState {
  // Auth
  currentAdmin: AdminUser | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  
  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => Product | null;
  deleteProduct: (id: string) => boolean;
  
  // Categories
  categories: Category[];
  addCategory: (category: Omit<Category, 'id'>) => Category;
  updateCategory: (id: string, updates: Partial<Category>) => Category | null;
  deleteCategory: (id: string) => boolean;
  
  // Orders
  orders: Order[];
  updateOrderStatus: (id: string, status: OrderStatus) => Order | null;
  updatePaymentStatus: (id: string, status: PaymentStatus) => Order | null;
  deleteOrder: (id: string) => boolean;
  
  // Slider Images
  sliderImages: SliderImage[];
  addSliderImage: (image: Omit<SliderImage, 'id'>) => SliderImage;
  updateSliderImage: (id: string, updates: Partial<SliderImage>) => SliderImage | null;
  deleteSliderImage: (id: string) => boolean;
  reorderSliderImages: (images: SliderImage[]) => void;
  
  // Announcements
  announcements: Announcement[];
  addAnnouncement: (announcement: Omit<Announcement, 'id'>) => Announcement;
  updateAnnouncement: (id: string, updates: Partial<Announcement>) => Announcement | null;
  deleteAnnouncement: (id: string) => boolean;
  setActiveAnnouncement: (id: string) => void;
  
  // Settings
  settings: SiteSettings;
  updateSettings: (updates: Partial<SiteSettings>) => void;
  
  // Stats
  stats: {
    totalOrders: number;
    totalRevenue: number;
    totalProducts: number;
    totalCustomers: number;
    pendingOrders: number;
    pendingPayments: number;
  };
  refreshStats: () => void;
  
  // Refresh All Data
  refreshAll: () => void;
}

// Create Context
const AdminContext = createContext<AdminState | undefined>(undefined);

// Provider Component
export function AdminProvider({ children }: { children: ReactNode }) {
  // Auth State
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(() => 
    adminAuthDB.getCurrentUser()
  );
  
  // Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [sliderImages, setSliderImages] = useState<SliderImage[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({} as SiteSettings);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    pendingPayments: 0,
  });

  // Auth Functions
  const login = useCallback((username: string, password: string): boolean => {
    const user = adminAuthDB.login(username, password);
    if (user) {
      setCurrentAdmin(user);
      toast.success('تم تسجيل الدخول بنجاح');
      return true;
    }
    toast.error('اسم المستخدم أو كلمة المرور غير صحيحة');
    return false;
  }, []);

  const logout = useCallback(() => {
    adminAuthDB.logout();
    setCurrentAdmin(null);
    toast.success('تم تسجيل الخروج');
  }, []);

  // Refresh Functions
  const refreshAll = useCallback(() => {
    setProducts(productsDB.getAll());
    setCategories(categoriesDB.getAll());
    setOrders(ordersDB.getAll());
    setSliderImages(sliderImagesDB.getAll());
    setAnnouncements(announcementsDB.getAll());
    setSettings(settingsDB.get());
    refreshStats();
  }, []);

  const refreshStats = useCallback(() => {
    setStats(statsDB.getDashboardStats());
  }, []);

  // Product Functions
  const addProduct = useCallback((product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct = productsDB.create({
      ...product,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setProducts(prev => [...prev, newProduct]);
    toast.success('تم إضافة المنتج بنجاح');
    refreshStats();
    return newProduct;
  }, [refreshStats]);

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    const updated = productsDB.update(id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
    if (updated) {
      setProducts(prev => prev.map(p => p.id === id ? updated : p));
      toast.success('تم تحديث المنتج بنجاح');
    }
    return updated;
  }, []);

  const deleteProduct = useCallback((id: string) => {
    const success = productsDB.delete(id);
    if (success) {
      setProducts(prev => prev.filter(p => p.id !== id));
      toast.success('تم حذف المنتج بنجاح');
      refreshStats();
    }
    return success;
  }, [refreshStats]);

  // Category Functions
  const addCategory = useCallback((category: Omit<Category, 'id'>) => {
    const newCategory = categoriesDB.create(category);
    setCategories(prev => [...prev, newCategory]);
    toast.success('تم إضافة الفئة بنجاح');
    return newCategory;
  }, []);

  const updateCategory = useCallback((id: string, updates: Partial<Category>) => {
    const updated = categoriesDB.update(id, updates);
    if (updated) {
      setCategories(prev => prev.map(c => c.id === id ? updated : c));
      toast.success('تم تحديث الفئة بنجاح');
    }
    return updated;
  }, []);

  const deleteCategory = useCallback((id: string) => {
    const success = categoriesDB.delete(id);
    if (success) {
      setCategories(prev => prev.filter(c => c.id !== id));
      toast.success('تم حذف الفئة بنجاح');
    }
    return success;
  }, []);

  // Order Functions
  const updateOrderStatus = useCallback((id: string, status: OrderStatus) => {
    const updated = ordersDB.update(id, { 
      status, 
      updatedAt: new Date().toISOString() 
    });
    if (updated) {
      setOrders(prev => prev.map(o => o.id === id ? updated : o));
      toast.success('تم تحديث حالة الطلب');
      refreshStats();
    }
    return updated;
  }, [refreshStats]);

  const updatePaymentStatus = useCallback((id: string, status: PaymentStatus) => {
    const updated = ordersDB.update(id, { 
      paymentStatus: status, 
      updatedAt: new Date().toISOString() 
    });
    if (updated) {
      setOrders(prev => prev.map(o => o.id === id ? updated : o));
      toast.success('تم تحديث حالة الدفع');
      refreshStats();
    }
    return updated;
  }, [refreshStats]);

  const deleteOrder = useCallback((id: string) => {
    const success = ordersDB.delete(id);
    if (success) {
      setOrders(prev => prev.filter(o => o.id !== id));
      toast.success('تم حذف الطلب');
      refreshStats();
    }
    return success;
  }, [refreshStats]);

  // Slider Image Functions
  const addSliderImage = useCallback((image: Omit<SliderImage, 'id'>) => {
    const newImage = sliderImagesDB.create(image);
    setSliderImages(prev => [...prev, newImage]);
    toast.success('تم إضافة الصورة بنجاح');
    return newImage;
  }, []);

  const updateSliderImage = useCallback((id: string, updates: Partial<SliderImage>) => {
    const updated = sliderImagesDB.update(id, updates);
    if (updated) {
      setSliderImages(prev => prev.map(img => img.id === id ? updated : img));
      toast.success('تم تحديث الصورة بنجاح');
    }
    return updated;
  }, []);

  const deleteSliderImage = useCallback((id: string) => {
    const success = sliderImagesDB.delete(id);
    if (success) {
      setSliderImages(prev => prev.filter(img => img.id !== id));
      toast.success('تم حذف الصورة بنجاح');
    }
    return success;
  }, []);

  const reorderSliderImages = useCallback((images: SliderImage[]) => {
    sliderImagesDB.setAll(images);
    setSliderImages(images);
  }, []);

  // Announcement Functions
  const addAnnouncement = useCallback((announcement: Omit<Announcement, 'id'>) => {
    const newAnnouncement = announcementsDB.create(announcement);
    setAnnouncements(prev => [...prev, newAnnouncement]);
    toast.success('تم إضافة الإشعار بنجاح');
    return newAnnouncement;
  }, []);

  const updateAnnouncement = useCallback((id: string, updates: Partial<Announcement>) => {
    const updated = announcementsDB.update(id, updates);
    if (updated) {
      setAnnouncements(prev => prev.map(a => a.id === id ? updated : a));
      toast.success('تم تحديث الإشعار بنجاح');
    }
    return updated;
  }, []);

  const deleteAnnouncement = useCallback((id: string) => {
    const success = announcementsDB.delete(id);
    if (success) {
      setAnnouncements(prev => prev.filter(a => a.id !== id));
      toast.success('تم حذف الإشعار بنجاح');
    }
    return success;
  }, []);

  const setActiveAnnouncement = useCallback((id: string) => {
    const all = announcementsDB.getAll();
    const updated = all.map(a => ({
      ...a,
      isActive: a.id === id
    }));
    announcementsDB.setAll(updated);
    setAnnouncements(updated);
    toast.success('تم تفعيل الإشعار');
  }, []);

  // Settings Functions
  const updateSettings = useCallback((updates: Partial<SiteSettings>) => {
    const updated = settingsDB.update(updates);
    setSettings(updated);
    toast.success('تم حفظ الإعدادات بنجاح');
  }, []);

  const value: AdminState = {
    currentAdmin,
    isAuthenticated: !!currentAdmin,
    login,
    logout,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    orders,
    updateOrderStatus,
    updatePaymentStatus,
    deleteOrder,
    sliderImages,
    addSliderImage,
    updateSliderImage,
    deleteSliderImage,
    reorderSliderImages,
    announcements,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    setActiveAnnouncement,
    settings,
    updateSettings,
    stats,
    refreshStats,
    refreshAll,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

// Hook
export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
