import { MessageCircle } from 'lucide-react';
import { useStore } from '@/store';

export function WhatsAppButton() {
  const { settings } = useStore();
  
  const phoneNumber = settings.whatsappNumber || '+201234567890';
  const message = `مرحباً، أريد الاستفسار عن منتجات ${settings.siteName || 'Yazan Store'}`;
  
  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 md:bottom-8 left-4 md:left-8 z-50 w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 animate-float"
      aria-label="تواصل معنا عبر واتساب"
    >
      <MessageCircle className="w-7 h-7" />
    </a>
  );
}
