import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { Product, Category, Order, CartItem, SiteSettings, SliderImage, Announcement } from '@/types';
import { 
  productsDB, 
  categoriesDB, 
  ordersDB, 
  settingsDB, 
  sliderImagesDB, 
  announcementsDB,
  cartDB,
  initializeDB 
} from '@/lib/db';

// Store State Interface
interface StoreState {
  // Data
  products: Product[];
  categories: Category[];
  orders: Order[];
  sliderImages: SliderImage[];
  announcements: Announcement[];
  settings: SiteSettings;
  
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, size?: string, color?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  
  // Products
  getProductsByCategory: (category: string) => Product[];
  getProductById: (id: string) => Product | undefined;
  getFeaturedProducts: () => Product[];
  getNewProducts: () => Product[];
  
  // Refresh Data
  refreshProducts: () => void;
  refreshCategories: () => void;
  refreshOrders: () => void;
  refreshSliderImages: () => void;
  refreshAnnouncements: () => void;
  refreshSettings: () => void;
  refreshAll: () => void;
}

// Create Context
const StoreContext = createContext<StoreState | undefined>(undefined);

// Provider Component
export function StoreProvider({ children }: { children: ReactNode }) {
  // Initialize data from LocalStorage
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [sliderImages, setSliderImages] = useState<SliderImage[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({} as SiteSettings);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize on mount
  useEffect(() => {
    initializeDB();
    refreshAll();
    setIsInitialized(true);
  }, []);

  // Refresh Functions
  const refreshProducts = useCallback(() => {
    setProducts(productsDB.getAll());
  }, []);

  const refreshCategories = useCallback(() => {
    setCategories(categoriesDB.getAll());
  }, []);

  const refreshOrders = useCallback(() => {
    setOrders(ordersDB.getAll());
  }, []);

  const refreshSliderImages = useCallback(() => {
    setSliderImages(sliderImagesDB.getAll());
  }, []);

  const refreshAnnouncements = useCallback(() => {
    setAnnouncements(announcementsDB.getAll());
  }, []);

  const refreshSettings = useCallback(() => {
    setSettings(settingsDB.get());
  }, []);

  const refreshAll = useCallback(() => {
    refreshProducts();
    refreshCategories();
    refreshOrders();
    refreshSliderImages();
    refreshAnnouncements();
    refreshSettings();
    setCart(cartDB.getAll());
  }, []);

  // Cart Operations
  const addToCart = useCallback((product: Product, quantity = 1, size?: string, color?: string) => {
    setCart((prev) => {
      const existingItem = prev.find(
        (item) => 
          item.product.id === product.id && 
          item.size === size && 
          item.color === color
      );
      
      let newCart;
      if (existingItem) {
        newCart = prev.map((item) =>
          item.product.id === product.id && item.size === size && item.color === color
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newCart = [...prev, { product, quantity, size, color }];
      }
      
      cartDB.setAll(newCart);
      return newCart;
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => {
      const newCart = prev.filter((item) => item.product.id !== productId);
      cartDB.setAll(newCart);
      return newCart;
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) => {
      const newCart = prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );
      cartDB.setAll(newCart);
      return newCart;
    });
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
    cartDB.clear();
  }, []);

  // Computed Values
  const cartTotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  // Product Helpers
  const getProductsByCategory = useCallback(
    (categorySlug: string) => products.filter((p) => p.category === categorySlug),
    [products]
  );

  const getProductById = useCallback(
    (id: string) => products.find((p) => p.id === id),
    [products]
  );

  const getFeaturedProducts = useCallback(
    () => products.filter((p) => p.featured),
    [products]
  );

  const getNewProducts = useCallback(
    () => products.filter((p) => p.isNew),
    [products]
  );

  const value: StoreState = {
    products,
    categories,
    orders,
    sliderImages,
    announcements,
    settings,
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartCount,
    getProductsByCategory,
    getProductById,
    getFeaturedProducts,
    getNewProducts,
    refreshProducts,
    refreshCategories,
    refreshOrders,
    refreshSliderImages,
    refreshAnnouncements,
    refreshSettings,
    refreshAll,
  };

  if (!isInitialized) {
    return <div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>;
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

// Hook
export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
