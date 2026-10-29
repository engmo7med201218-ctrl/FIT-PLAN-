import React, { useState } from 'react';
import { Download, Share2, PlusSquare, X, Smartphone, CheckCircle2, QrCode } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  onOpenHub?: () => void;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ onOpenHub }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  const handleClick = async () => {
    if (isInstallable) {
      await install();
    } else if (onOpenHub) {
      onOpenHub();
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      setShowIOSGuide(true);
    }
  };

  // If already installed in standalone mode, show subtle badge
  if (isInstalled) {
    return (
      <button
        onClick={onOpenHub || handleClick}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20 transition"
        title="التطبيق مثبت على جهازك"
      >
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        <span className="hidden sm:inline">تطبيق هاتف</span>
        <span className="sm:hidden">مثبت</span>
      </button>
    );
  }

  // Chromium / Android flow
  if (isInstallable) {
    return (
      <button
        onClick={handleClick}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-xs font-bold shadow-md hover:from-emerald-400 hover:to-teal-400 active:scale-95 transition"
      >
        <Download className="w-3.5 h-3.5 stroke-[2.5]" />
        <span>تثبيت التطبيق</span>
      </button>
    );
  }

  // Default flow: Opens mobile installation hub or iOS guide
  return (
    <>
      <button
        onClick={handleClick}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold hover:bg-emerald-500/30 active:scale-95 transition"
        title="تحميل التطبيق على الهاتف"
      >
        <Smartphone className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">تثبيت على الموبايل</span>
        <span className="sm:hidden">تثبيت</span>
      </button>

      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-6 text-slate-100 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setShowIOSGuide(false)}
              className="absolute top-4 left-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">تثبيت التطبيق على الآيفون</h3>
                <p className="text-xs text-slate-400">بدون الحاجة لمتجر App Store</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 font-bold">1</div>
                <div className="flex-1">
                  اضغط على زر <strong className="text-white">المشاركة (Share)</strong>
                  <Share2 className="w-4 h-4 inline-block mx-1 text-blue-400" />
                  في شريط سفاري السفلي.
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-bold">2</div>
                <div className="flex-1">
                  مرر للأسفل واضغط على <strong className="text-white">إضافة إلى الشاشة الرئيسية</strong>
                  <PlusSquare className="w-4 h-4 inline-block mx-1 text-emerald-400" />
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 font-bold">3</div>
                <div className="flex-1">
                  اضغط <strong className="text-white">إضافة (Add)</strong> بالأعلى لتجد أيقونة التطبيق على شاشة موبايلك!
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-sm shadow hover:opacity-95"
            >
              فهمت، حسناً
            </button>
          </div>
        </div>
      )}
    </>
  );
};
