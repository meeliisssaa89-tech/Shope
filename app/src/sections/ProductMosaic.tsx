import { useEffect, useRef } from 'react';
import { useStore } from '@/store';
import { ProductCard } from '@/components/custom/ProductCard';

export function ProductMosaic() {
  const { products } = useStore();
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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
                [{ opacity: 0, transform: 'translateY(60px) scale(0.98)' }, { opacity: 1, transform: 'translateY(0) scale(1)' }],
                { duration: 700, delay: i * 80, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'forwards' }
              );
            });
            observer.unobserve(section);
          }
        });
      },
      { threshold: 0.05 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="products"
      className="relative w-full bg-paper py-16 md:py-24"
    >
      <div ref={contentRef} className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="mb-12">
          <h2 className="animate-item opacity-0 text-3xl md:text-4xl lg:text-5xl font-black text-ink mb-4">
            اختر. أضف. ارتدِ.
          </h2>
          <p className="animate-item opacity-0 text-lg text-text-secondary max-w-2xl">
            كل قطعة مختارة بعناية لتناسب إطلالتك. استعرض، اختر مقاسك، واطلب بكل سهولة.
          </p>
        </div>

        {/* Mosaic Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, index) => (
            <div 
              key={product.id}
              className={`animate-item opacity-0 ${
                index === 0 ? 'col-span-2 row-span-2' : ''
              } ${
                index === 5 ? 'col-span-2' : ''
              }`}
            >
              <ProductCard 
                product={product} 
                variant={index === 0 ? 'default' : 'compact'} 
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
