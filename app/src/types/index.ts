// Product Types
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: 'clothes' | 'shoes' | 'accessories';
  description?: string;
  sizes?: string[];
  colors?: string[];
  featured?: boolean;
  isNew?: boolean;
  inStock?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  slug: 'clothes' | 'shoes' | 'accessories';
  image: string;
  description?: string;
  productCount?: number;
  isActive?: boolean;
}

// Cart Types
export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
}

// Order Types
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethod = 'cod' | 'online' | 'vodafone';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  email?: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  notes?: string;
  paymentProof?: string; // For Vodafone Cash
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
}

// Slider Image Types
export interface SliderImage {
  id: string;
  image: string;
  title?: string;
  subtitle?: string;
  link?: string;
  order: number;
  isActive: boolean;
}

// Notification/Announcement Types
export interface Announcement {
  id: string;
  message: string;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
}

// Site Settings Types
export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  logo?: string;
  favicon?: string;
  primaryColor: string;
  secondaryColor: string;
  whatsappNumber: string;
  phoneNumber: string;
  email: string;
  address: string;
  freeShippingThreshold: number;
  shippingCost: number;
  enableCOD: boolean;
  enableOnlinePayment: boolean;
  enableVodafoneCash: boolean;
  vodafoneNumber: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    tiktok?: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
}

// Admin User Types
export interface AdminUser {
  id: string;
  username: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'editor';
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

// Dashboard Stats Types
export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalCustomers: number;
  pendingOrders: number;
  pendingPayments: number;
  recentOrders: Order[];
  topProducts: Product[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Filter Types
export interface ProductFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  inStock?: boolean;
  search?: string;
}

export interface OrderFilter {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  startDate?: string;
  endDate?: string;
  search?: string;
}
