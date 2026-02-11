import { Home, Shirt, Footprints, ShoppingBag } from 'lucide-react';
import { useStore } from '@/store';

const navItems = [
  { id: 'home', label: 'الرئيسية', icon: Home, href: '#hero' },
  { id: 'clothes', label: 'ملابس', icon: Shirt, href: '#categories' },
  { id: 'shoes', label: 'أحذية', icon: Footprints, href: '#categories' },
  { id: 'cart', label: 'السلة', icon: ShoppingBag, href: '#cart' },
];

export function BottomNav() {
  const { cartCount } = useStore();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-paper border-t border-gray-200 md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => (
          <a
            key={item.id}
            href={item.href}
            onClick={(e) => handleClick(e, item.href)}
            className="flex flex-col items-center gap-1 py-2 px-4 text-text-secondary hover:text-ink transition-colors"
          >
            <div className="relative">
              <item.icon className="w-5 h-5" />
              {item.id === 'cart' && cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-cobalt text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-xs font-medium">{item.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}
