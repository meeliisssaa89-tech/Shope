import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '@/store';

export function Hero() {
  const { sliderImages, settings } = useStore();
  const sectionRef = useRef<HTMLElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const sublineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const thumbnailRef = useRef<HTMLDivElement>(null);
  
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Get active slider images
  const activeSliderImages = sliderImages.filter(img => img.isActive).sort((a, b) => a.order - b.order);
  const currentSliderImage = activeSliderImages[currentSlide] || activeSliderImages[0];

  useEffect(() => {
    // Auto-play entrance animation
    const tl = { current: [] as Animation[] };
    
    if (leftPanelRef.current) {
      const anim = leftPanelRef.current.animate(
        [{ opacity: 0, transform: 'translateX(-12vw)' }, { opacity: 1, transform: 'translateX(0)' }],
        { duration: 900, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'forwards' }
      );
      tl.current.push(anim);
    }

    if (headlineRef.current) {
      const words = headlineRef.current.querySelectorAll('.word');
      words.forEach((word, i) => {
        const anim = word.animate(
          [{ opacity: 0, transform: 'translateY(40px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 700, delay: 200 + i * 60, easing: 'cubic-bezier(0.33, 1, 0.68, 1)', fill: 'forwards' }
        );
        tl.current.push(anim);
      });
    }

    if (sublineRef.current) {
      const anim = sublineRef.current.animate(
        [{ opacity: 0, transform: 'translateY(24px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { duration: 700, delay: 400, easing: 'cubic-bezier(0.33, 1, 0.68, 1)', fill: 'forwards' }
      );
      tl.current.push(anim);
    }

    if (ctaRef.current) {
      const anim = ctaRef.current.animate(
        [{ opacity: 0, transform: 'translateY(24px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { duration: 700, delay: 480, easing: 'cubic-bezier(0.33, 1, 0.68, 1)', fill: 'forwards' }
      );
      tl.current.push(anim);
    }

    if (linkRef.current) {
      const anim = linkRef.current.animate(
        [{ opacity: 0, transform: 'translateY(24px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { duration: 700, delay: 560, easing: 'cubic-bezier(0.33, 1, 0.68, 1)', fill: 'forwards' }
      );
      tl.current.push(anim);
    }

    if (thumbnailRef.current) {
      const anim = thumbnailRef.current.animate(
        [{ opacity: 0, transform: 'scale(0.92)' }, { opacity: 1, transform: 'scale(1)' }],
        { duration: 800, delay: 600, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'forwards' }
      );
      tl.current.push(anim);
    }

    return () => {
      tl.current.forEach(anim => anim.cancel());
    };
  }, []);

  // Auto-slide
  useEffect(() => {
    if (activeSliderImages.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSliderImages.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [activeSliderImages.length]);

  const scrollToProducts = () => {
    const productsSection = document.getElementById('featured-products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % activeSliderImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + activeSliderImages.length) % activeSliderImages.length);
  };

  return (
    <section 
      ref={sectionRef}
      id="hero"
      className="relative w-full min-h-screen bg-paper overflow-hidden"
    >
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Photo Panel - Slider */}
        <div 
          ref={leftPanelRef}
          className="relative w-full lg:w-1/2 h-[50vh] lg:h-screen opacity-0"
        >
          {currentSliderImage ? (
            <img 
              src={currentSliderImage.image}
              alt={currentSliderImage.title || 'Slider'}
              className="w-full h-full object-cover transition-opacity duration-500"
            />
          ) : (
            <img 
              src="https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&h=1200&fit=crop"
              alt="Fashion Model"
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/30 to-transparent" />
          
          {/* Slider Controls */}
          {activeSliderImages.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              
              {/* Slide Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {activeSliderImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentSlide ? 'bg-white w-6' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
          
          {/* Slide Content Overlay */}
          {currentSliderImage?.title && (
            <div className="absolute bottom-16 left-4 right-4 text-white">
              <h2 className="text-2xl font-bold">{currentSliderImage.title}</h2>
              {currentSliderImage.subtitle && (
                <p className="text-white/80">{currentSliderImage.subtitle}</p>
              )}
            </div>
          )}
        </div>

        {/* Right Content Panel */}
        <div 
          ref={rightPanelRef}
          className="relative w-full lg:w-1/2 flex flex-col justify-center px-6 md:px-12 lg:px-16 py-12 lg:py-0"
        >
          {/* Headline */}
          <h1 
            ref={headlineRef}
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-ink leading-tight mb-6"
          >
            <span className="word inline-block opacity-0">{settings.siteName?.split(' ')[0] || 'YAZAN'}</span>{' '}
            <span className="word inline-block opacity-0">{settings.siteName?.split(' ')[1] || 'STORE'}</span>
          </h1>

          {/* Subheadline */}
          <p 
            ref={sublineRef}
            className="text-lg md:text-xl text-text-secondary max-w-md mb-10 opacity-0"
          >
            {settings.siteDescription || 'أزياء وأحذية وإكسسوارات بأسلوب عصري. تشكيلة منتقاة تلائم يومك ولونك.'}
          </p>

          {/* CTA Button */}
          <button 
            ref={ctaRef}
            onClick={scrollToProducts}
            className="btn-primary w-fit gap-2 mb-6 opacity-0"
          >
            <span>تصفح المنتجات</span>
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Micro Link */}
          <a 
            ref={linkRef}
            href="#contact"
            className="inline-flex items-center gap-2 text-ink hover:text-cobalt transition-colors opacity-0"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm font-medium">تواصل معنا</span>
          </a>

          {/* Thumbnail */}
          <div 
            ref={thumbnailRef}
            className="hidden lg:block absolute right-8 bottom-16 w-44 h-56 rounded-lg overflow-hidden shadow-card opacity-0"
          >
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop"
              alt="Style Preview"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
