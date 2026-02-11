import { useEffect, useRef, useState } from 'react';
import { Send, Instagram, FileText, Shield, Facebook } from 'lucide-react';
import { useStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export function Contact() {
  const { settings } = useStore();
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const headline = contentRef.current?.querySelector('.contact-headline');
            const copy = contentRef.current?.querySelector('.contact-copy');
            const form = contentRef.current?.querySelector('.contact-form');
            const image = contentRef.current?.querySelector('.contact-image');
            
            if (headline) {
              headline.animate(
                [{ opacity: 0, transform: 'translateY(40px)' }, { opacity: 1, transform: 'translateY(0)' }],
                { duration: 700, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'forwards' }
              );
            }
            
            if (copy) {
              copy.animate(
                [{ opacity: 0, transform: 'translateY(30px)' }, { opacity: 1, transform: 'translateY(0)' }],
                { duration: 700, delay: 100, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'forwards' }
              );
            }
            
            if (form) {
              const fields = form.querySelectorAll('.form-field');
              fields.forEach((field, i) => {
                field.animate(
                  [{ opacity: 0, transform: 'translateX(-30px)' }, { opacity: 1, transform: 'translateX(0)' }],
                  { duration: 600, delay: 200 + i * 100, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'forwards' }
                );
              });
            }
            
            if (image) {
              image.animate(
                [{ opacity: 0, transform: 'translateX(60px) scale(0.98)' }, { opacity: 1, transform: 'translateX(0) scale(1)' }],
                { duration: 800, delay: 300, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'forwards' }
              );
            }
            
            observer.unobserve(section);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section 
      ref={sectionRef}
      id="contact"
      className="relative w-full bg-ink py-16 md:py-24"
    >
      <div ref={contentRef} className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column - Form */}
          <div>
            <h2 className="contact-headline text-3xl md:text-4xl font-black text-paper mb-4 opacity-0">
              تواصل معنا
            </h2>
            <p className="contact-copy text-text-muted text-lg mb-8 max-w-md opacity-0">
              عندك سؤال أو طلب خاص؟ املأ النموذج ونرد عليك في أقرب وقت.
            </p>
            
            <form onSubmit={handleSubmit} className="contact-form space-y-6">
              <div className="form-field space-y-2 opacity-0">
                <Label htmlFor="name" className="text-paper">الاسم</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="أدخل اسمك"
                  className="bg-ink border-paper/20 text-paper placeholder:text-text-muted"
                  required
                />
              </div>
              
              <div className="form-field space-y-2 opacity-0">
                <Label htmlFor="email" className="text-paper">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  className="bg-ink border-paper/20 text-paper placeholder:text-text-muted"
                  required
                />
              </div>
              
              <div className="form-field space-y-2 opacity-0">
                <Label htmlFor="message" className="text-paper">الرسالة</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="اكتب رسالتك هنا..."
                  rows={5}
                  className="bg-ink border-paper/20 text-paper placeholder:text-text-muted resize-none"
                  required
                />
              </div>
              
              <Button 
                type="submit"
                className="form-field w-full gap-2 bg-cobalt hover:bg-cobalt/90 opacity-0"
              >
                <Send className="w-4 h-4" />
                <span>إرسال</span>
              </Button>
            </form>

            {/* Contact Info */}
            <div className="mt-8 space-y-3">
              {settings.phoneNumber && (
                <p className="text-text-muted">
                  <span className="text-paper">الهاتف:</span> {settings.phoneNumber}
                </p>
              )}
              {settings.email && (
                <p className="text-text-muted">
                  <span className="text-paper">البريد:</span> {settings.email}
                </p>
              )}
              {settings.address && (
                <p className="text-text-muted">
                  <span className="text-paper">العنوان:</span> {settings.address}
                </p>
              )}
            </div>
          </div>
          
          {/* Right Column - Image */}
          <div className="contact-image hidden lg:block relative opacity-0">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=1000&fit=crop"
                alt="Contact"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-paper/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-text-muted hover:text-paper transition-colors flex items-center gap-2">
                <Shield className="w-4 h-4" />
                سياسة الاستبدال
              </a>
              <a href="#" className="text-sm text-text-muted hover:text-paper transition-colors flex items-center gap-2">
                <FileText className="w-4 h-4" />
                الشروط
              </a>
              {settings.socialLinks.instagram && (
                <a 
                  href={settings.socialLinks.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-text-muted hover:text-paper transition-colors flex items-center gap-2"
                >
                  <Instagram className="w-4 h-4" />
                  إنستغرام
                </a>
              )}
              {settings.socialLinks.facebook && (
                <a 
                  href={settings.socialLinks.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-text-muted hover:text-paper transition-colors flex items-center gap-2"
                >
                  <Facebook className="w-4 h-4" />
                  فيسبوك
                </a>
              )}
            </div>
            <p className="text-sm text-text-muted">
              © 2026 {settings.siteName || 'Yazan Store'}. جميع الحقوق محفوظة.
            </p>
          </div>
        </footer>
      </div>
    </section>
  );
}
