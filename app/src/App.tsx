import { useState, useEffect } from 'react';
import { StoreProvider } from '@/store';
import { AdminProvider, useAdmin } from '@/store/adminStore';
import { Toaster } from '@/components/ui/sonner';
import { initializeDB } from '@/lib/db';

// Frontend Components
import { NotificationBar } from '@/components/custom/NotificationBar';
import { Header } from '@/components/custom/Header';
import { BottomNav } from '@/components/custom/BottomNav';
import { WhatsAppButton } from '@/components/custom/WhatsAppButton';
import { Cart } from '@/components/custom/Cart';

// Frontend Sections
import { Hero } from '@/sections/Hero';
import { StatementBanner } from '@/sections/StatementBanner';
import { FeaturedProducts } from '@/sections/FeaturedProducts';
import { ProductMosaic } from '@/sections/ProductMosaic';
import { CategoryTriptych } from '@/sections/CategoryTriptych';
import { ProductShowcase } from '@/sections/ProductShowcase';
import { ValueProps } from '@/sections/ValueProps';
import { Testimonial } from '@/sections/Testimonial';
import { Contact } from '@/sections/Contact';

// Admin Components
import { AdminLogin } from '@/admin/pages/Login';
import { AdminDashboard } from '@/admin/pages/Dashboard';
import { AdminProducts } from '@/admin/pages/Products';
import { AdminCategories } from '@/admin/pages/Categories';
import { AdminOrders } from '@/admin/pages/Orders';
import { AdminSlider } from '@/admin/pages/Slider';
import { AdminAnnouncements } from '@/admin/pages/Announcements';
import { AdminSettings } from '@/admin/pages/Settings';

import './App.css';

// Initialize Database
initializeDB();

// Frontend Home Page
function HomePage() {
  return (
    <main className="relative">
      <Hero />
      <StatementBanner />
      <FeaturedProducts />
      <ProductMosaic />
      <CategoryTriptych />
      <ProductShowcase />
      <ValueProps />
      <Testimonial />
      <Cart />
      <Contact />
    </main>
  );
}

// Frontend Layout
function FrontendLayout({ onAdminClick }: { onAdminClick: () => void }) {
  return (
    <div className="relative min-h-screen bg-paper">
      <div className="grain-overlay" />
      <div className="hidden md:block">
        <NotificationBar />
      </div>
      <Header onAdminClick={onAdminClick} />
      <HomePage />
      <WhatsAppButton />
      <BottomNav />
      {/* Admin Access Button - Visible in footer area */}
      <AdminAccessButton onAdminClick={onAdminClick} />
    </div>
  );
}

// Admin Access Button Component
function AdminAccessButton({ onAdminClick }: { onAdminClick: () => void }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="fixed bottom-20 left-4 z-40 flex flex-col items-start gap-2">
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="w-10 h-10 bg-ink/80 hover:bg-ink text-paper rounded-full flex items-center justify-center shadow-lg transition-all"
        title="إعدادات"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      </button>
      
      {/* Admin Panel Button */}
      {isVisible && (
        <button
          onClick={onAdminClick}
          className="flex items-center gap-2 px-4 py-2 bg-cobalt text-white text-sm font-medium rounded-lg shadow-lg hover:bg-cobalt/90 transition-all animate-in slide-in-from-left-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2"/>
            <path d="M3 9h18"/>
            <path d="M9 21V9"/>
          </svg>
          لوحة التحكم
        </button>
      )}
    </div>
  );
}

// Admin Router Component
type AdminPage = 'login' | 'dashboard' | 'products' | 'categories' | 'orders' | 'slider' | 'announcements' | 'settings';

function AdminRouter({ onExit }: { onExit: () => void }) {
  const [currentPage, setCurrentPage] = useState<AdminPage>('login');
  const { isAuthenticated } = useAdmin();

  useEffect(() => {
    if (isAuthenticated && currentPage === 'login') {
      setCurrentPage('dashboard');
    }
  }, [isAuthenticated, currentPage]);

  const navigateTo = (page: AdminPage) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <AdminLogin onLoginSuccess={() => setCurrentPage('dashboard')} />;
      case 'dashboard':
        return <AdminDashboard onNavigate={navigateTo} onExit={onExit} />;
      case 'products':
        return <AdminProducts onNavigate={navigateTo} onExit={onExit} />;
      case 'categories':
        return <AdminCategories onNavigate={navigateTo} onExit={onExit} />;
      case 'orders':
        return <AdminOrders onNavigate={navigateTo} onExit={onExit} />;
      case 'slider':
        return <AdminSlider onNavigate={navigateTo} onExit={onExit} />;
      case 'announcements':
        return <AdminAnnouncements onNavigate={navigateTo} onExit={onExit} />;
      case 'settings':
        return <AdminSettings onNavigate={navigateTo} onExit={onExit} />;
      default:
        return <AdminDashboard onNavigate={navigateTo} onExit={onExit} />;
    }
  };

  return <>{renderPage()}</>;
}

// Main App
function AppContent() {
  const [showAdmin, setShowAdmin] = useState(false);

  if (showAdmin) {
    return (
      <AdminProvider>
        <AdminRouter onExit={() => setShowAdmin(false)} />
      </AdminProvider>
    );
  }

  return <FrontendLayout onAdminClick={() => setShowAdmin(true)} />;
}

function App() {
  return (
    <StoreProvider>
      <AppContent />
      <Toaster 
        position="top-center" 
        richColors 
        dir="rtl"
        toastOptions={{
          style: {
            fontFamily: 'Tajawal, Inter, sans-serif',
          },
        }}
      />
    </StoreProvider>
  );
}

export default App;
