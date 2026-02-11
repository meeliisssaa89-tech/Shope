import { useState, useEffect } from 'react';
import { ShoppingBag, Menu, Settings } from 'lucide-react';
import { useStore } from '@/store';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navLinks = [
  { label: 'الرئيسية', href: '#hero' },
  { label: 'المنتجات', href: '#products' },
  { label: 'الأقسام', href: '#categories' },
  { label: 'تواصل', href: '#contact' },
];

interface HeaderProps {
  onAdminClick?: () => void;
}

export function Header({ onAdminClick }: HeaderProps = {}) {
  const { cartCount } = useStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-paper/95 backdrop-blur-md shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a 
            href="#hero" 
            onClick={(e) => handleNavClick(e, '#hero')}
            className="text-xl md:text-2xl font-black text-ink"
          >
            Yazan Store
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-sm font-medium text-text-secondary hover:text-ink transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Cart Button */}
            <a
              href="#cart"
              onClick={(e) => handleNavClick(e, '#cart')}
              className="relative w-10 h-10 bg-ink text-paper rounded-full flex items-center justify-center hover:bg-cobalt transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-cobalt text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </a>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <button className="w-10 h-10 flex items-center justify-center">
                  <Menu className="w-6 h-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 bg-paper" dir="rtl">
                <div className="flex flex-col h-full pt-8">
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-xl font-black">Yazan Store</span>
                  </div>
                  <nav className="flex flex-col gap-4">
                    {navLinks.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        onClick={(e) => handleNavClick(e, link.href)}
                        className="text-lg font-medium text-text-secondary hover:text-ink transition-colors py-2"
                      >
                        {link.label}
                      </a>
                    ))}
                  </nav>
                  
                  {/* Admin Access in Mobile Menu */}
                  {onAdminClick && (
                    <div className="mt-auto pb-8 pt-4 border-t border-border">
                      <button
                        onClick={() => {
                          onAdminClick();
                          setIsOpen(false);
                        }}
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-text-secondary hover:text-cobalt hover:bg-cobalt/5 rounded-lg transition-colors"
                      >
                        <Settings className="w-5 h-5" />
                        لوحة التحكم
                      </button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
