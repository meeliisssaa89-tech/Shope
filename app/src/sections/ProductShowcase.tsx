import { useEffect, useRef, useState } from 'react';
import { Check, Eye, ShoppingBag, Star } from 'lucide-react';
import { useStore } from '@/store';
import { Button } from '@/components/ui/button';

export function ProductShowcase() {
  const { products, addToCart } = useStore();
  const [isAdded, setIsAdded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Get the newest featured product or the first product
  const showcaseProduct = products.find(p => p.isNew && p.featured) || 
                          products.find(p => p.featured) || 
                          products[0];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const imageCard = contentRef.current?.querySelector('.showcase-image');
            const textBlock = contentRef.current?.querySelector('.showcase-text');
            const price = contentRef.current?.querySelector('.showcase-price');
            
            if (imageCard) {
              imageCard.animate(
                [{ opacity: 0, transform: 'translateX(-50vw) scale(0.98)' }, { opacity: 1, transform: 'translateX(0) scale(1)' }],
                { duration: 900, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'forwards' }
              );
            }
            
            if (textBlock) {
              textBlock.animate(
                [{ opacity: 0, transform: 'translateX(50vw)' }, { opacity: 1, transform: 'translateX(0)' }],
                { duration: 900, delay: 150, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'forwards' }
              );
            }
            
            if (price) {
              price.animate(
                [{ opacity: 0, transform: 'translateY(20px)' }, { opacity: 1, transform: 'translateY(0)' }],
                { duration: 600, delay: 400, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'forwards' }
              );
            }
            
            observer.unobserve(section);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const handleAddToCart = () => {
    if (showcaseProduct) {
      addToCart(showcaseProduct);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1500);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-EG').format(price);
  };

  if (!showcaseProduct) return null;

  return (
    <section 
      ref={sectionRef}
      id="showcase"
      className="relative w-full bg-ink py-16 md:py-24"
    >
      <div ref={contentRef} className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Product Image Card */}
          <div className="showcase-image relative aspect-[4/5] bg-white rounded-2xl overflow-hidden shadow-card opacity-0">
            <img 
              src={showcaseProduct.image}
              alt={showcaseProduct.name}
              className="w-full h-full object-cover"
            />
            {showcaseProduct.isNew && (
              <span className="absolute top-6 right-6 bg-cobalt text-white text-sm font-bold px-4 py-2 rounded-full">
                وصل حديثاً
              </span>
            )}
          </div>
          
          {/* Text Block */}
          <div className="showcase-text text-paper opacity-0">
            <span className="inline-block text-text-muted text-sm mb-4">وصل حديثاً</span>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6">
              {showcaseProduct.name}
            </h2>
            
            <p className="text-text-muted text-lg mb-8 max-w-md">
              {showcaseProduct.description}
            </p>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-cobalt text-cobalt" />
                ))}
              </div>
              <span className="text-sm text-text-muted">(128 تقييم)</span>
            </div>
            
            {/* Price */}
            <div className="showcase-price flex items-center gap-4 mb-8 opacity-0">
              <span className="text-4xl font-black text-cobalt">
                {formatPrice(showcaseProduct.price)} ج.م
              </span>
              {showcaseProduct.originalPrice && (
                <span className="text-2xl text-text-muted line-through">
                  {formatPrice(showcaseProduct.originalPrice)} ج.م
                </span>
              )}
            </div>
            
            {/* Actions */}
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={handleAddToCart}
                className={`gap-2 px-8 py-6 text-lg ${isAdded ? 'bg-green-600' : 'bg-cobalt hover:bg-cobalt/90'}`}
              >
                {isAdded ? <Check className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
                <span>{isAdded ? 'تم الإضافة' : 'أضف إلى السلة'}</span>
              </Button>
              
              <Button 
                variant="outline"
                className="gap-2 px-8 py-6 text-lg border-paper/30 text-paper hover:bg-paper/10"
              >
                <Eye className="w-5 h-5" />
                <span>شاهد التفاصيل</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
