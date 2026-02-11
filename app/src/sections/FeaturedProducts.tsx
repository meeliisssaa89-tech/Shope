import { useEffect, useRef } from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useStore } from '@/store';
import { ProductCard } from '@/components/custom/ProductCard';

export function FeaturedProducts() {
  const { products } = useStore();
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const featuredProducts = products.filter(p => p.featured);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elements = contentRef.current?.querySelectorAll('.animate-item');
            elements?.forEach((el, i) => {
              el.animate(
                [{ opacity: 0, transform: 'translateY(40px)' }, { opacity: 1, transform: 'translateY(0)' }],
                { duration: 700, delay: i * 100, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'forwards' }
              );
            });
            observer.unobserve(section);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="featured-products"
      className="relative w-full bg-ink py-16 md:py-24"
    >
      <div ref={contentRef} className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div className="animate-item opacity-0">
            <div className="flex items-center gap-2 text-cobalt mb-3">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-semibold">منتجات مميزة</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-paper">
              تشكيلة مختارة
            </h2>
            <p className="text-text-muted mt-3 max-w-md">
              قطع أساسية بجودة عالية، مختارة لتناسب كل يوم.
            </p>
          </div>
          <a 
            href="#products"
            className="animate-item opacity-0 inline-flex items-center gap-2 text-paper hover:text-cobalt transition-colors mt-6 md:mt-0"
          >
            <span className="font-medium">عرض الكل</span>
            <ArrowLeft className="w-4 h-4" />
          </a>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {featuredProducts.map((product, index) => (
            <div 
              key={product.id} 
              className="animate-item opacity-0"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ProductCard product={product} variant="compact" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
