import { useEffect, useRef } from 'react';
import { Truck, Shield, RefreshCw } from 'lucide-react';

const features = [
  {
    icon: Truck,
    title: 'توصيل سريع',
    description: 'نوصل طلباتك خلال 1–3 أيام إلى باب منزلك.',
  },
  {
    icon: Shield,
    title: 'جودة مضمونة',
    description: 'نختار كل قطعة بعناية فائقة لضمان أفضل جودة.',
  },
  {
    icon: RefreshCw,
    title: 'استبدال سهل',
    description: 'غير مقاسك خلال 14 يوم بدون أي تعقيدات.',
  },
];

export function ValueProps() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const heading = contentRef.current?.querySelector('.value-heading');
            const cards = contentRef.current?.querySelectorAll('.value-card');
            
            if (heading) {
              heading.animate(
                [{ opacity: 0, transform: 'translateY(40px)' }, { opacity: 1, transform: 'translateY(0)' }],
                { duration: 700, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'forwards' }
              );
            }
            
            cards?.forEach((card, i) => {
              card.animate(
                [{ opacity: 0, transform: 'translateY(80px) rotate(-1deg)' }, { opacity: 1, transform: 'translateY(0) rotate(0)' }],
                { duration: 700, delay: 150 + i * 100, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'forwards' }
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

  return (
    <section 
      ref={sectionRef}
      id="value-props"
      className="relative w-full bg-paper py-16 md:py-24"
    >
      <div ref={contentRef} className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Heading */}
        <h2 className="value-heading text-3xl md:text-4xl font-black text-ink text-center mb-12 opacity-0">
          لماذا تختار Yazan Store؟
        </h2>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="value-card group bg-white rounded-2xl p-8 shadow-card card-hover opacity-0"
            >
              <div className="w-14 h-14 bg-ink rounded-xl flex items-center justify-center mb-6 group-hover:bg-cobalt transition-colors duration-300">
                <feature.icon className="w-7 h-7 text-paper" />
              </div>
              <h3 className="text-xl font-bold text-ink mb-3">{feature.title}</h3>
              <p className="text-text-secondary">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
