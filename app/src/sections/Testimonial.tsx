import { useEffect, useRef } from 'react';
import { Quote } from 'lucide-react';

export function Testimonial() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const quote = contentRef.current?.querySelector('.testimonial-quote');
            const attribution = contentRef.current?.querySelector('.testimonial-attribution');
            const bottomElements = contentRef.current?.querySelectorAll('.testimonial-bottom');
            
            if (quote) {
              quote.animate(
                [{ opacity: 0, transform: 'translateY(12vh) scale(0.98)' }, { opacity: 1, transform: 'translateY(0) scale(1)' }],
                { duration: 800, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'forwards' }
              );
            }
            
            if (attribution) {
              attribution.animate(
                [{ opacity: 0, transform: 'translateY(6vh)' }, { opacity: 1, transform: 'translateY(0)' }],
                { duration: 700, delay: 200, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'forwards' }
              );
            }
            
            bottomElements?.forEach((el, i) => {
              el.animate(
                [{ opacity: 0, transform: 'translateY(20px)' }, { opacity: 1, transform: 'translateY(0)' }],
                { duration: 600, delay: 400 + i * 100, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'forwards' }
              );
            });
            
            observer.unobserve(section);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="testimonial"
      className="relative w-full bg-paper py-16 md:py-24"
    >
      <div ref={contentRef} className="max-w-4xl mx-auto px-4 md:px-8 text-center">
        {/* Quote Icon */}
        <div className="flex justify-center mb-8">
          <Quote className="w-12 h-12 text-cobalt" />
        </div>
        
        {/* Quote */}
        <blockquote className="testimonial-quote text-2xl md:text-3xl lg:text-4xl font-bold text-ink leading-relaxed mb-8 opacity-0">
          "طلبت جاكيت وبنطال، الجودة أعلى من توقعاتي والتغليف أنيق. بأطلب تاني قريب."
        </blockquote>
        
        {/* Attribution */}
        <cite className="testimonial-attribution not-italic text-lg text-text-secondary opacity-0">
          — سارة، القاهرة
        </cite>
        
        {/* Bottom Elements */}
        <div className="flex justify-between items-center mt-16 pt-8 border-t border-gray-200">
          <span className="testimonial-bottom text-sm text-text-muted opacity-0">
            Yazan Store
          </span>
          <a 
            href="#"
            className="testimonial-bottom text-sm text-ink hover:text-cobalt transition-colors font-medium opacity-0"
          >
            اقرأ المزيد من الآراء
          </a>
        </div>
      </div>
    </section>
  );
}
