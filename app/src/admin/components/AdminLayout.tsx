import { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Grid3X3, 
  ShoppingCart, 
  Image, 
  Megaphone, 
  Settings,
  LogOut,
  Menu,
  Store,
  ChevronLeft,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAdmin } from '@/store/adminStore';

type AdminPage = 'dashboard' | 'products' | 'categories' | 'orders' | 'slider' | 'announcements' | 'settings';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage: AdminPage;
  onNavigate: (page: AdminPage) => void;
  onExit: () => void;
}

const navItems: { page: AdminPage; label: string; icon: typeof LayoutDashboard }[] = [
  { page: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
  { page: 'products', label: 'المنتجات', icon: Package },
  { page: 'categories', label: 'الفئات', icon: Grid3X3 },
  { page: 'orders', label: 'الطلبات', icon: ShoppingCart },
  { page: 'slider', label: 'صور السلايدر', icon: Image },
  { page: 'announcements', label: 'الإشعارات', icon: Megaphone },
  { page: 'settings', label: 'الإعدادات', icon: Settings },
];

export function AdminLayout({ children, currentPage, onNavigate, onExit }: AdminLayoutProps) {
  const { logout, currentAdmin } = useAdmin();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    onExit();
  };

  const handleViewStore = () => {
    onExit();
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-ink rounded-lg flex items-center justify-center">
            <Store className="w-5 h-5 text-paper" />
          </div>
          <div>
            <h1 className="font-black text-lg">Yazan Store</h1>
            <p className="text-xs text-gray-500">لوحة التحكم</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-auto">
        {navItems.map((item) => (
          <button
            key={item.page}
            onClick={() => {
              onNavigate(item.page);
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-right ${
              currentPage === item.page 
                ? 'bg-ink text-paper' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
            <ChevronLeft className="w-4 h-4 mr-auto opacity-0" />
          </button>
        ))}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t space-y-3">
        {currentAdmin && (
          <div className="px-4 py-2">
            <p className="text-sm font-medium">{currentAdmin.name}</p>
            <p className="text-xs text-gray-500">{currentAdmin.email}</p>
          </div>
        )}
        <Button 
          variant="outline" 
          className="w-full justify-start gap-2"
          onClick={handleViewStore}
        >
          <ArrowRight className="w-4 h-4" />
          العودة للمتجر
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start gap-2 text-red-600 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          تسجيل الخروج
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed top-0 right-0 w-64 h-full bg-white border-l z-40">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b z-40 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-ink rounded-lg flex items-center justify-center">
            <Store className="w-4 h-4 text-paper" />
          </div>
          <span className="font-bold">Yazan Store</span>
        </div>
        
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64 p-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </header>

      {/* Main Content */}
      <main className="lg:mr-64 min-h-screen pt-16 lg:pt-0">
        {children}
      </main>
    </div>
  );
}
