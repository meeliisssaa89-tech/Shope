import { useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useStore } from '@/store';

export function CategoryTriptych() {
  const { categories } = useStore();
  const sectionRef = useRef<HTMLElement>(null);
  const panelsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const panels = panelsRef.current?.querySelectorAll('.category-panel');
            panels?.forEach((panel, i) => {
              panel.animate(
                [{ opacity: 0.6, transform: 'translateY(100vh)' }, { opacity: 1, transform: 'translateY(0)' }],
                { duration: 900, delay: i * 150, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'forwards' }
              );
            });
            
            const texts = panelsRef.current?.querySelectorAll('.category-text');
            texts?.forEach((text, i) => {
              text.animate(
                [{ opacity: 0, transform: 'scale(0.92)' }, { opacity: 1, transform: 'scale(1)' }],
                { duration: 700, delay: 400 + i * 100, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'forwards' }
              );
            });
            
            observer.unobserve(section);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const activeCategories = categories.filter(c => c.isActive !== false);

  return (
    <section 
      ref={sectionRef}
      id="categories"
      className="relative w-full bg-paper py-16 md:py-24"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-10">
        <h2 className="text-3xl md:text-4xl font-black text-ink text-center">
          تسوق حسب القسم
        </h2>
      </div>
      
      <div 
        ref={panelsRef}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-0 max-w-7xl mx-auto px-4 md:px-8"
      >
        {activeCategories.map((category) => (
          <div
            key={category.id}
            className="category-panel group relative h-[50vh] md:h-[70vh] overflow-hidden cursor-pointer opacity-0"
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img 
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-ink/50 group-hover:bg-ink/40 transition-colors duration-500" />
            </div>
            
            {/* Content */}
            <div className="category-text relative h-full flex flex-col items-center justify-center text-paper opacity-0">
              <h3 className="text-3xl md:text-4xl font-black mb-2">{category.name}</h3>
              <p className="text-sm text-paper/70 mb-4">{category.productCount || 0} منتج</p>
              <span className="inline-flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all">
                عرض المنتجات
                <ArrowLeft className="w-4 h-4" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
