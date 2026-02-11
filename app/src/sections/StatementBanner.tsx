import { useEffect, useRef } from 'react';

export function StatementBanner() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const sublineRef = useRef<HTMLParagraphElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Trigger animations
            if (headlineRef.current) {
              headlineRef.current.animate(
                [{ opacity: 0, transform: 'translateY(18vh) scale(0.98)' }, { opacity: 1, transform: 'translateY(0) scale(1)' }],
                { duration: 800, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'forwards' }
              );
            }
            if (sublineRef.current) {
              sublineRef.current.animate(
                [{ opacity: 0, transform: 'translateY(10vh)' }, { opacity: 1, transform: 'translateY(0)' }],
                { duration: 700, delay: 150, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'forwards' }
              );
            }
            if (labelRef.current) {
              labelRef.current.animate(
                [{ opacity: 0, transform: 'translateY(24px)' }, { opacity: 1, transform: 'translateY(0)' }],
                { duration: 600, delay: 300, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'forwards' }
              );
            }
            if (linkRef.current) {
              linkRef.current.animate(
                [{ opacity: 0, transform: 'translateY(24px)' }, { opacity: 1, transform: 'translateY(0)' }],
                { duration: 600, delay: 400, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'forwards' }
              );
            }
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
      className="relative w-full min-h-[60vh] md:min-h-[70vh] bg-paper flex flex-col items-center justify-center px-6 py-20"
    >
      {/* Headline */}
      <h2 
        ref={headlineRef}
        className="text-3xl md:text-5xl lg:text-6xl font-black text-ink text-center mb-6 opacity-0"
      >
        اختياراتك بأسلوب عصري
      </h2>

      {/* Subline */}
      <p 
        ref={sublineRef}
        className="text-lg md:text-xl text-text-secondary text-center max-w-2xl opacity-0"
      >
        تشكيلة منتقاة تلائم يومك ولونك. كل قطعة تروي قصة أناقة وفخامة.
      </p>

      {/* Bottom Label */}
      <span 
        ref={labelRef}
        className="absolute left-6 md:left-12 bottom-8 text-sm text-text-muted opacity-0"
      >
        Yazan Store — 2026
      </span>

      {/* Bottom Link */}
      <a 
        ref={linkRef}
        href="#featured-products"
        className="absolute right-6 md:right-12 bottom-8 text-sm text-ink hover:text-cobalt transition-colors font-medium opacity-0"
      >
        اكتشف المزيد
      </a>
    </section>
  );
}
