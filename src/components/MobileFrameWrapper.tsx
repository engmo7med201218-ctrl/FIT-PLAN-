import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Maximize2,
  Minimize2,
  Wifi,
  Battery,
  Signal,
  QrCode,
  Volume2,
  Lock,
  Play,
  RotateCcw,
  Sparkles,
  Gauge,
  Flame,
} from 'lucide-react';

interface MobileFrameWrapperProps {
  children: React.ReactNode;
  activeWorkoutInfo?: {
    isRunning: boolean;
    speed: number;
    secondsElapsed: number;
    calories: number;
  } | null;
  onOpenInstallModal: () => void;
  onOpenQuickActions: () => void;
}

export const MobileFrameWrapper: React.FC<MobileFrameWrapperProps> = ({
  children,
  activeWorkoutInfo,
  onOpenInstallModal,
  onOpenQuickActions,
}) => {
  // Mobile Frame view mode on desktop: 'phone' (simulated phone frame) or 'full' (responsive)
  const [viewMode, setViewMode] = useState<'phone' | 'full'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('treadmill_view_mode');
      if (saved === 'phone' || saved === 'full') return saved;
      // Default to phone frame on desktop screens (>= 768px) to provide instant mobile app vibe
      return window.innerWidth >= 768 ? 'phone' : 'full';
    }
    return 'phone';
  });

  const [currentTime, setCurrentTime] = useState<string>('09:41');

  // Clock for mobile status bar
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleViewMode = () => {
    const nextMode = viewMode === 'phone' ? 'full' : 'phone';
    setViewMode(nextMode);
    localStorage.setItem('treadmill_view_mode', nextMode);
  };

  const formatTimer = (totalSeconds: number): string => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start relative overflow-x-hidden">
      {/* DESKTOP TOP BAR CONTROLS (Only visible on screens >= 768px) */}
      <div className="hidden md:flex items-center justify-between w-full max-w-5xl px-6 py-3 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 z-30 mb-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-slate-950 font-black shadow-md">
            <Gauge className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-white">جري المشاية</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                Mobile App Edition
              </span>
            </div>
            <p className="text-[11px] text-slate-400">تطبيق الهاتف الذكي لتنظيم الجري والمشاية وخسارة الوزن</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Switch Phone Frame / Full Responsive */}
          <button
            onClick={handleToggleViewMode}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700/80 text-xs font-bold text-slate-200 hover:text-white hover:bg-slate-700 transition shadow-sm"
            title="تبديل وضع العرض بين إطار الموبايل وملء الشاشة"
          >
            {viewMode === 'phone' ? (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>عرض كملء الشاشة</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span>عرض داخل هاتف ذكي (Phone Shell)</span>
              </>
            )}
          </button>

          {/* QR Code / Install on Mobile Button */}
          <button
            onClick={onOpenInstallModal}
            className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-xs font-black shadow-md hover:from-emerald-400 hover:to-teal-400 active:scale-95 transition"
          >
            <QrCode className="w-4 h-4" />
            <span>تثبيت على هاتفك (QR)</span>
          </button>
        </div>
      </div>

      {/* RENDER IN PHONE FRAME OR FULLSCREEN */}
      {viewMode === 'phone' ? (
        <div className="w-full flex-1 flex flex-col items-center justify-center p-0 md:p-6 md:pb-12">
          {/* Realistic Smartphone Hardware Shell */}
          <div className="relative w-full max-w-[420px] bg-slate-950 md:rounded-[52px] md:shadow-[0_0_60px_-15px_rgba(16,185,129,0.3)] md:border-[10px] md:border-slate-800/95 overflow-hidden flex flex-col min-h-screen md:min-h-[850px] md:max-h-[92vh] ring-1 ring-slate-700/40">
            {/* Phone Hardware Side Buttons Effect (Hidden on small screens) */}
            <div className="hidden md:block absolute -right-[13px] top-28 w-1 h-12 bg-slate-700 rounded-r-md" />
            <div className="hidden md:block absolute -left-[13px] top-24 w-1 h-10 bg-slate-700 rounded-l-md" />
            <div className="hidden md:block absolute -left-[13px] top-38 w-1 h-10 bg-slate-700 rounded-l-md" />

            {/* MOBILE SYSTEM STATUS BAR (Time, Dynamic Island / Notch, Battery, Signal) */}
            <div className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md px-5 pt-3 pb-1 flex items-center justify-between text-xs select-none">
              {/* Left: Clock */}
              <span className="font-semibold text-[13px] text-white tracking-tight font-digital" dir="ltr">
                {currentTime}
              </span>

              {/* Center: Interactive Dynamic Island / Camera Notch */}
              <div className="relative flex items-center justify-center">
                {activeWorkoutInfo && activeWorkoutInfo.isRunning ? (
                  /* Dynamic Island expands when runner is active */
                  <div className="h-6 px-3 rounded-full bg-slate-900 border border-emerald-500/50 flex items-center gap-2 shadow-lg glow-emerald animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-[10px] font-bold text-emerald-400 font-digital" dir="ltr">
                      {formatTimer(activeWorkoutInfo.secondsElapsed)}
                    </span>
                    <span className="text-[10px] text-white font-black" dir="ltr">
                      {activeWorkoutInfo.speed.toFixed(1)} km/h
                    </span>
                  </div>
                ) : (
                  /* Standard Minimal Dynamic Island Pill */
                  <div className="h-5 w-24 rounded-full bg-slate-900/90 border border-slate-800/80 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-950 mr-2 border border-slate-800" />
                    <div className="w-2 h-2 rounded-full bg-emerald-500/80" />
                  </div>
                )}
              </div>

              {/* Right: Mobile Carrier Icons */}
              <div className="flex items-center gap-1.5 text-slate-300" dir="ltr">
                <Signal className="w-3.5 h-3.5 text-slate-300" />
                <Wifi className="w-3.5 h-3.5 text-slate-300" />
                <div className="flex items-center gap-0.5">
                  <span className="text-[10px] font-bold text-white">92%</span>
                  <Battery className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                </div>
              </div>
            </div>

            {/* Scrollable Mobile Screen Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col">
              {children}
            </div>

            {/* Phone Home Swipe Bar / Gesture Indicator */}
            <div className="relative w-full bg-slate-950 py-1.5 flex items-center justify-center select-none pointer-events-none z-50">
              <div className="w-32 h-1 bg-slate-600/70 rounded-full" />
            </div>
          </div>
        </div>
      ) : (
        /* Fullscreen View with max-w-xl responsive container */
        <div className="w-full max-w-xl mx-auto flex-1 flex flex-col min-h-screen">
          {children}
        </div>
      )}
    </div>
  );
};
