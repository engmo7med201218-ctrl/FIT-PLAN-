import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineStatusBanner: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="sticky top-0 z-40 bg-amber-500/90 backdrop-blur-md text-slate-950 px-4 py-1.5 flex items-center justify-between text-xs font-bold shadow-md animate-in slide-in-from-top">
      <div className="flex items-center gap-2">
        <WifiOff className="w-4 h-4" />
        <span>وضع الموبايل بدون إنترنت (Offline) — جميع بياناتك وسجلات الجري تُحفظ في هاتفك</span>
      </div>
      <span className="text-[10px] bg-slate-950/20 px-2 py-0.5 rounded-full font-black">
        محفوظ محلياً
      </span>
    </div>
  );
};
