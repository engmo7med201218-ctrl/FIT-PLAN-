import React from 'react';
import {
  X,
  Play,
  Scale,
  Calendar,
  Sun,
  Volume2,
  Smartphone,
  Flame,
  Zap,
  Sparkles,
} from 'lucide-react';
import { audioCoach } from '../utils/audioCoach';

interface MobileQuickActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onStartWorkout: () => void;
  onOpenWeightLog: () => void;
  onOpenSchedule: () => void;
  onOpenInstallHub: () => void;
  isWakeLockActive: boolean;
  onToggleWakeLock: () => void;
}

export const MobileQuickActionSheet: React.FC<MobileQuickActionSheetProps> = ({
  isOpen,
  onClose,
  onStartWorkout,
  onOpenWeightLog,
  onOpenSchedule,
  onOpenInstallHub,
  isWakeLockActive,
  onToggleWakeLock,
}) => {
  if (!isOpen) return null;

  const handleTestCoach = () => {
    audioCoach.vibrate([100, 50, 100]);
    audioCoach.playCountdownBeep(true);
    audioCoach.speakArabic('أهلاً بك في تطبيق جري المشاية! تمرين اليوم في انتظارك.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-t-[32px] sm:rounded-3xl p-5 text-slate-100 shadow-2xl relative animate-in slide-in-from-bottom-6 sm:zoom-in-95">
        {/* Mobile Swipe Grab Handle */}
        <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mb-4" />

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">إجراءات الموبايل السريعة</h3>
              <p className="text-[11px] text-slate-400">وصول فوري لأهم أدوات الجري والمشاية</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Action Grid */}
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          {/* Start Running */}
          <button
            onClick={() => {
              audioCoach.vibrate(100);
              onClose();
              onStartWorkout();
            }}
            className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex flex-col items-start gap-2 shadow-lg active:scale-95 transition"
          >
            <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Play className="w-4 h-4 fill-white" />
            </div>
            <div className="text-right">
              <p className="text-xs font-black">بدء الجري فوراً</p>
              <p className="text-[10px] text-white/80">تشغيل لوحة المشاية الذكية</p>
            </div>
          </button>

          {/* Quick Weight Record */}
          <button
            onClick={() => {
              audioCoach.vibrate(100);
              onClose();
              onOpenWeightLog();
            }}
            className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-white flex flex-col items-start gap-2 hover:border-slate-700 active:scale-95 transition"
          >
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
            <div className="text-right">
              <p className="text-xs font-black">تسجيل وزن اليوم</p>
              <p className="text-[10px] text-slate-400">تحديث متابعة خسارة الدهون</p>
            </div>
          </button>

          {/* Wake Lock Toggle */}
          <button
            onClick={() => {
              audioCoach.vibrate(100);
              onToggleWakeLock();
            }}
            className={`p-3.5 rounded-2xl border text-white flex flex-col items-start gap-2 active:scale-95 transition ${
              isWakeLockActive
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                isWakeLockActive ? 'bg-amber-500/30 text-amber-300' : 'bg-slate-800 text-slate-400'
              }`}
            >
              <Sun className="w-4 h-4" />
            </div>
            <div className="text-right">
              <p className="text-xs font-black">
                {isWakeLockActive ? 'الشاشة لا تنطفئ (مفعل)' : 'إبقاء الشاشة مضاءة'}
              </p>
              <p className="text-[10px] text-slate-400">منع نوم الهاتف أثناء الجري</p>
            </div>
          </button>

          {/* Test Coach Voice */}
          <button
            onClick={handleTestCoach}
            className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-white flex flex-col items-start gap-2 hover:border-slate-700 active:scale-95 transition"
          >
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Volume2 className="w-4 h-4" />
            </div>
            <div className="text-right">
              <p className="text-xs font-black">اختبار المدرب الصوتي</p>
              <p className="text-[10px] text-slate-400">صوت تحفيزي عربي وهزاز</p>
            </div>
          </button>
        </div>

        {/* Install on Mobile Banner */}
        <button
          onClick={() => {
            onClose();
            onOpenInstallHub();
          }}
          className="w-full p-3 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-cyan-500/15 border border-emerald-500/30 flex items-center justify-between text-xs font-bold text-emerald-400 hover:border-emerald-500/50 transition"
        >
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span>تثبيت التطبيق على هاتفك (Android / iOS)</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
            رمز QR ➔
          </span>
        </button>
      </div>
    </div>
  );
};
