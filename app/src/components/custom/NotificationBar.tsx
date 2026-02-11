import { useStore } from '@/store';
import { Truck } from 'lucide-react';

export function NotificationBar() {
  const { announcements } = useStore();
  
  const activeAnnouncement = announcements.find(a => a.isActive);
  
  if (!activeAnnouncement) return null;

  return (
    <div className="w-full bg-ink text-paper py-2.5 px-4 text-center">
      <div className="flex items-center justify-center gap-2 text-xs md:text-sm font-medium">
        <Truck className="w-4 h-4" />
        <span>{activeAnnouncement.message}</span>
      </div>
    </div>
  );
}
