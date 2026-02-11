import type { 
  Product, 
  Category, 
  Order, 
  SliderImage, 
  Announcement, 
  SiteSettings,
  AdminUser 
} from '@/types';

// Database Keys
const DB_KEYS = {
  PRODUCTS: 'yazan_products',
  CATEGORIES: 'yazan_categories',
  ORDERS: 'yazan_orders',
  SLIDER_IMAGES: 'yazan_slider_images',
  ANNOUNCEMENTS: 'yazan_announcements',
  SETTINGS: 'yazan_settings',
  ADMIN_USERS: 'yazan_admin_users',
  CURRENT_ADMIN: 'yazan_current_admin',
  CART: 'yazan_cart',
};

// Initialize default data
const defaultCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'ملابس',
    slug: 'clothes',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&h=900&fit=crop',
    description: 'أحدث صيحات الموضة في عالم الملابس',
    productCount: 0,
    isActive: true,
  },
  {
    id: 'cat-2',
    name: 'أحذية',
    slug: 'shoes',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=900&fit=crop',
    description: ' تشكيلة واسعة من الأحذية العصرية',
    productCount: 0,
    isActive: true,
  },
  {
    id: 'cat-3',
    name: 'إكسسوارات',
    slug: 'accessories',
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&h=900&fit=crop',
    description: 'إكسسوارات أنيقة تكمل إطلالتك',
    productCount: 0,
    isActive: true,
  },
];

const defaultProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'قميص أبيض كلاسيكي',
    price: 799,
    originalPrice: 999,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=800&fit=crop',
    category: 'clothes',
    description: 'قميص أبيض أنيق مناسب للمناسبات الرسمية والعمل',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['أبيض', 'أزرق فاتح'],
    featured: true,
    inStock: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-2',
    name: 'بنطال كحلي أنيق',
    price: 999,
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop',
    category: 'clothes',
    description: 'بنطال كحلي بقصة عصرية وجودة عالية',
    sizes: ['30', '32', '34', '36', '38'],
    colors: ['كحلي', 'أسود', 'رمادي'],
    featured: true,
    inStock: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-3',
    name: 'حذاء كلاسيكي جلد',
    price: 1299,
    originalPrice: 1599,
    image: 'https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?w=600&h=800&fit=crop',
    category: 'shoes',
    description: 'حذاء كلاسيكي من الجلد الطبيعي',
    sizes: ['40', '41', '42', '43', '44', '45'],
    colors: ['أسود', 'بني'],
    featured: true,
    inStock: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-4',
    name: 'ساعة أنيقة',
    price: 899,
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=800&fit=crop',
    category: 'accessories',
    description: 'ساعة يد أنيقة بتصميم عصري',
    colors: ['فضي', 'ذهبي', 'أسود'],
    featured: true,
    inStock: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-5',
    name: 'جاكيت جلد عصري',
    price: 1499,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=800&fit=crop',
    category: 'clothes',
    description: 'جاكيت جلد بقصة عصرية وأنيقة',
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['أسود', 'بني'],
    featured: true,
    isNew: true,
    inStock: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-6',
    name: 'حذاء رياضي أبيض',
    price: 1199,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=800&fit=crop',
    category: 'shoes',
    description: 'حذاء رياضي مريح بتصميم عصري',
    sizes: ['40', '41', '42', '43', '44', '45'],
    colors: ['أبيض', 'أسود', 'رمادي'],
    isNew: true,
    inStock: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-7',
    name: 'نظارة شمسية',
    price: 599,
    originalPrice: 799,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=800&fit=crop',
    category: 'accessories',
    description: 'نظارة شمسية بإطار معدني أنيق',
    colors: ['ذهبي', 'فضي', 'أسود'],
    inStock: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-8',
    name: 'حزام جلد',
    price: 399,
    image: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=600&h=800&fit=crop',
    category: 'accessories',
    description: 'حزام جلد طبيعي بإبزيم معدني',
    sizes: ['90', '100', '110', '120'],
    colors: ['بني', 'أسود'],
    inStock: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-9',
    name: 'تيشيرت قطن',
    price: 349,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop',
    category: 'clothes',
    description: 'تيشيرت قطن 100% مريح وناعم',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['أبيض', 'أسود', 'رمادي', 'كحلي'],
    inStock: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-10',
    name: 'حذاء رسمي',
    price: 1099,
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=800&fit=crop',
    category: 'shoes',
    description: 'حذاء رسمي أنيق للمناسبات الخاصة',
    sizes: ['40', '41', '42', '43', '44', '45'],
    colors: ['أسود', 'بني'],
    inStock: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const defaultSliderImages: SliderImage[] = [
  {
    id: 'slide-1',
    image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1200&h=600&fit=crop',
    title: 'تشكيلة جديدة',
    subtitle: 'اكتشف أحدث صيحات الموضة',
    link: '#products',
    order: 1,
    isActive: true,
  },
  {
    id: 'slide-2',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop',
    title: 'عروض حصرية',
    subtitle: 'خصومات تصل إلى 30%',
    link: '#featured-products',
    order: 2,
    isActive: true,
  },
];

const defaultAnnouncements: Announcement[] = [
  {
    id: 'ann-1',
    message: '🚚 التوصيل مجاني للطلبات فوق 2000 جنيه',
    isActive: true,
  },
];

const defaultSettings: SiteSettings = {
  siteName: 'Yazan Store',
  siteDescription: 'أزياء وأحذية وإكسسوارات بأسلوب عصري',
  primaryColor: '#2B66E7',
  secondaryColor: '#111111',
  whatsappNumber: '+201234567890',
  phoneNumber: '+201234567890',
  email: 'info@yazanstore.com',
  address: 'القاهرة، مصر',
  freeShippingThreshold: 2000,
  shippingCost: 50,
  enableCOD: true,
  enableOnlinePayment: true,
  enableVodafoneCash: true,
  vodafoneNumber: '01012345678',
  socialLinks: {
    facebook: 'https://facebook.com/yazanstore',
    instagram: 'https://instagram.com/yazanstore',
  },
  seo: {
    title: 'Yazan Store | يازان ستور',
    description: 'أزياء وأحذية وإكسسوارات بأسلوب عصري',
    keywords: 'ملابس, أحذية, إكسسوارات, موضة, تسوق',
  },
};

const defaultAdminUsers: AdminUser[] = [
  {
    id: 'admin-1',
    username: 'admin',
    name: 'المشرف',
    email: 'admin@yazanstore.com',
    role: 'admin',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

// Initialize Database
export function initializeDB(): void {
  if (typeof window === 'undefined') return;
  
  // Only initialize if data doesn't exist
  if (!localStorage.getItem(DB_KEYS.PRODUCTS)) {
    localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(defaultProducts));
  }
  if (!localStorage.getItem(DB_KEYS.CATEGORIES)) {
    localStorage.setItem(DB_KEYS.CATEGORIES, JSON.stringify(defaultCategories));
  }
  if (!localStorage.getItem(DB_KEYS.SLIDER_IMAGES)) {
    localStorage.setItem(DB_KEYS.SLIDER_IMAGES, JSON.stringify(defaultSliderImages));
  }
  if (!localStorage.getItem(DB_KEYS.ANNOUNCEMENTS)) {
    localStorage.setItem(DB_KEYS.ANNOUNCEMENTS, JSON.stringify(defaultAnnouncements));
  }
  if (!localStorage.getItem(DB_KEYS.SETTINGS)) {
    localStorage.setItem(DB_KEYS.SETTINGS, JSON.stringify(defaultSettings));
  }
  if (!localStorage.getItem(DB_KEYS.ADMIN_USERS)) {
    localStorage.setItem(DB_KEYS.ADMIN_USERS, JSON.stringify(defaultAdminUsers));
  }
  // Default password: admin123
  if (!localStorage.getItem('yazan_admin_password')) {
    localStorage.setItem('yazan_admin_password', btoa('admin123'));
  }
}

// Generic CRUD Operations
class LocalStorageDB<T extends { id: string }> {
  private key: string;
  
  constructor(key: string) {
    this.key = key;
  }

  getAll(): T[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : [];
  }

  getById(id: string): T | undefined {
    const items = this.getAll();
    return items.find(item => item.id === id);
  }

  create(item: Omit<T, 'id'> & { id?: string }): T {
    const items = this.getAll();
    const newItem = {
      ...item,
      id: item.id || `${this.key}-${Date.now()}`,
    } as T;
    items.push(newItem);
    localStorage.setItem(this.key, JSON.stringify(items));
    return newItem;
  }

  update(id: string, updates: Partial<T>): T | null {
    const items = this.getAll();
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return null;
    
    items[index] = { ...items[index], ...updates };
    localStorage.setItem(this.key, JSON.stringify(items));
    return items[index];
  }

  delete(id: string): boolean {
    const items = this.getAll();
    const filtered = items.filter(item => item.id !== id);
    if (filtered.length === items.length) return false;
    localStorage.setItem(this.key, JSON.stringify(filtered));
    return true;
  }

  setAll(items: T[]): void {
    localStorage.setItem(this.key, JSON.stringify(items));
  }
}

// Database Instances
export const productsDB = new LocalStorageDB<Product>(DB_KEYS.PRODUCTS);
export const categoriesDB = new LocalStorageDB<Category>(DB_KEYS.CATEGORIES);
export const ordersDB = new LocalStorageDB<Order>(DB_KEYS.ORDERS);
export const sliderImagesDB = new LocalStorageDB<SliderImage>(DB_KEYS.SLIDER_IMAGES);
export const announcementsDB = new LocalStorageDB<Announcement>(DB_KEYS.ANNOUNCEMENTS);

// Settings Operations
export const settingsDB = {
  get(): SiteSettings {
    if (typeof window === 'undefined') return defaultSettings;
    const data = localStorage.getItem(DB_KEYS.SETTINGS);
    return data ? JSON.parse(data) : defaultSettings;
  },
  update(settings: Partial<SiteSettings>): SiteSettings {
    const current = this.get();
    const updated = { ...current, ...settings };
    localStorage.setItem(DB_KEYS.SETTINGS, JSON.stringify(updated));
    return updated;
  },
};

// Admin Auth Operations
export const adminAuthDB = {
  login(username: string, password: string): AdminUser | null {
    if (typeof window === 'undefined') return null;
    
    const users: AdminUser[] = JSON.parse(localStorage.getItem(DB_KEYS.ADMIN_USERS) || '[]');
    const user = users.find(u => u.username === username && u.isActive);
    
    if (!user) return null;
    
    const storedPassword = localStorage.getItem('yazan_admin_password');
    if (storedPassword !== btoa(password)) return null;
    
    // Update last login
    user.lastLogin = new Date().toISOString();
    localStorage.setItem(DB_KEYS.ADMIN_USERS, JSON.stringify(users));
    localStorage.setItem(DB_KEYS.CURRENT_ADMIN, JSON.stringify(user));
    
    return user;
  },
  
  logout(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(DB_KEYS.CURRENT_ADMIN);
  },
  
  getCurrentUser(): AdminUser | null {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(DB_KEYS.CURRENT_ADMIN);
    return data ? JSON.parse(data) : null;
  },
  
  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  },
  
  changePassword(oldPassword: string, newPassword: string): boolean {
    if (typeof window === 'undefined') return false;
    
    const storedPassword = localStorage.getItem('yazan_admin_password');
    if (storedPassword !== btoa(oldPassword)) return false;
    
    localStorage.setItem('yazan_admin_password', btoa(newPassword));
    return true;
  },
};

// Cart Operations
export const cartDB = {
  getAll() {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(DB_KEYS.CART);
    return data ? JSON.parse(data) : [];
  },
  
  setAll(items: unknown[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(DB_KEYS.CART, JSON.stringify(items));
  },
  
  clear() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(DB_KEYS.CART);
  },
};

// Stats Operations
export const statsDB = {
  getDashboardStats() {
    const orders = ordersDB.getAll();
    const products = productsDB.getAll();
    
    const totalRevenue = orders
      .filter(o => o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + o.total, 0);
    
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const pendingPayments = orders.filter(o => o.paymentStatus === 'pending').length;
    
    const recentOrders = orders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
    
    return {
      totalOrders: orders.length,
      totalRevenue,
      totalProducts: products.length,
      totalCustomers: new Set(orders.map(o => o.phone)).size,
      pendingOrders,
      pendingPayments,
      recentOrders,
      topProducts: products.filter(p => p.featured).slice(0, 5),
    };
  },
};

// Export DB Keys for direct access if needed
export { DB_KEYS };
