import React, { useState, useEffect } from 'react';
import {
  X,
  Smartphone,
  QrCode,
  Download,
  Share2,
  PlusSquare,
  Copy,
  Check,
  Zap,
  WifiOff,
  Flame,
  Bell,
  Sun,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import QRCode from 'qrcode';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface MobileInstallHubModalProps {
  onClose: () => void;
}

export const MobileInstallHubModal: React.FC<MobileInstallHubModalProps> = ({ onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'qr' | 'guide'>('qr');

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://ais-pre-y65czhklpipb3fzsuqwofy-209330249942.europe-west1.run.app';

  useEffect(() => {
    QRCode.toDataURL(currentUrl, {
      width: 280,
      margin: 1.5,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then(url => setQrCodeDataUrl(url))
      .catch(() => {});
  }, [currentUrl]);

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 text-slate-100 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 my-auto">
        {/* Glow Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500" />

        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-slate-950 font-black shadow-lg glow-emerald">
              <Smartphone className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <span>تثبيت التطبيق على الموبايل</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                  PWA Mobile
                </span>
              </h2>
              <p className="text-xs text-slate-400">تحويل الموقع إلى تطبيق هاتف كامل وخفيف</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 space-y-4 max-h-[75vh] overflow-y-auto no-scrollbar">
          {/* Status Alert if already running in standalone */}
          {isInstalled && (
            <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center gap-2.5 text-xs">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <p className="font-bold">التطبيق مثبت بالفعل على جهازك!</p>
                <p className="text-[11px] text-emerald-400/80">أنت تستخدم وضع التطبيق الكامل (Standalone Mobile Mode)</p>
              </div>
            </div>
          )}

          {/* Quick Tabs: QR Code Scan vs Installation Steps */}
          <div className="flex items-center p-1 rounded-2xl bg-slate-950 border border-slate-800">
            <button
              onClick={() => setSelectedTab('qr')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                selectedTab === 'qr'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>امسح بالهاتف (QR)</span>
            </button>

            <button
              onClick={() => setSelectedTab('guide')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                selectedTab === 'guide'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>طريقة التثبيت السريعة</span>
            </button>
          </div>

          {/* TAB 1: QR CODE FOR MOBILE SCAN */}
          {selectedTab === 'qr' && (
            <div className="space-y-4 text-center">
              <div className="p-4 rounded-3xl bg-slate-950 border border-slate-800/90 flex flex-col items-center justify-center">
                <p className="text-xs text-slate-300 mb-3 font-semibold">
                  وجّه كاميرا هاتفك (آيفون أو أندرويد) نحو الرمز لفتحه وتثبيته فوراً:
                </p>

                {qrCodeDataUrl ? (
                  <div className="p-3 bg-white rounded-2xl shadow-xl border-4 border-emerald-500/30 inline-block animate-in zoom-in-95">
                    <img
                      src={qrCodeDataUrl}
                      alt="رابط تطبيق الموبايل QR"
                      className="w-48 h-48 sm:w-56 sm:h-56 object-contain rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="w-48 h-48 bg-slate-800 rounded-2xl flex items-center justify-center animate-pulse text-xs text-slate-500">
                    جاري توليد رمز الاستجابة السريعة...
                  </div>
                )}

                <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>يفتح التطبيق مباشرة في متصفح هاتفك</span>
                </div>
              </div>

              {/* Direct Install Button if Chrome Android or installable */}
              {isInstallable && (
                <button
                  onClick={install}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 text-slate-950 font-black text-sm shadow-xl glow-emerald active:scale-98 transition flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5 stroke-[2.5]" />
                  <span>تثبيت التطبيق الآن على هذا الجهاز</span>
                </button>
              )}

              {/* Copy URL Row */}
              <div className="flex items-center gap-2 p-2 rounded-2xl bg-slate-950 border border-slate-800">
                <input
                  type="text"
                  readOnly
                  value={currentUrl}
                  className="flex-1 bg-transparent px-2 text-xs text-slate-400 font-mono truncate focus:outline-none"
                  dir="ltr"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition flex items-center gap-1 shrink-0"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>تم النسخ!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>نسخ الرابط</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: STEP-BY-STEP INSTALLATION GUIDE */}
          {selectedTab === 'guide' && (
            <div className="space-y-4">
              {/* Android Card */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-bold text-emerald-400">
                    <Smartphone className="w-4 h-4" />
                    <span>هواتف أندرويد (Chrome / Samsung)</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400">
                    تثبيت مباشر
                  </span>
                </div>
                <div className="text-xs text-slate-300 space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                    <p>افتح الرابط في متصفح Chrome أو Samsung Internet.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                    <p>اضغط على زر <strong className="text-white">"تثبيت التطبيق"</strong> الظاهر بالأعلى أو في خيارات المتصفح (⋮) ➔ <strong>تثبيت التطبيق</strong>.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                    <p>سيظهر التطبيق كأيقونة على شاشتك الرئيسية ويعمل بملء الشاشة بدون أشرطة متصفح!</p>
                  </div>
                </div>

                {isInstallable && (
                  <button
                    onClick={install}
                    className="w-full mt-2 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 hover:bg-emerald-400 transition"
                  >
                    <Download className="w-4 h-4" />
                    <span>تثبيت الآن على هاتفك</span>
                  </button>
                )}
              </div>

              {/* iOS iPhone / iPad Card */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-bold text-cyan-400">
                    <Smartphone className="w-4 h-4" />
                    <span>هواتف آيفون (Apple Safari)</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-400">
                    iOS PWA
                  </span>
                </div>
                <div className="text-xs text-slate-300 space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                    <p>
                      افتح الرابط في متصفح <strong className="text-white">Safari</strong> واضغط زر المشاركة (Share)
                      <Share2 className="w-3.5 h-3.5 inline mx-1 text-cyan-400" />
                      في أسفل الشاشة.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                    <p>
                      مرر للأسفل واضغط على <strong className="text-white">"إضافة إلى الصفحة الرئيسية"</strong>
                      <PlusSquare className="w-3.5 h-3.5 inline mx-1 text-cyan-400" />
                      (Add to Home Screen).
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                    <p>اضغط <strong className="text-white">"إضافة" (Add)</strong> بالأعلى لتجد تطبيق جري المشاية على شاشة الآيفون الرسمية!</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mobile App Exclusive Features Grid */}
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80">
            <h4 className="text-xs font-bold text-slate-200 mb-2 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>ميزات تطبيق الموبايل المدمجة:</span>
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
              <div className="flex items-center gap-1.5">
                <WifiOff className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>يعمل بدون إنترنت (Offline)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>شاشة لا تنطفئ أثناء الجري</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>تنبيهات وتذكيرات للجري</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <span>مدرب صوتي عربي واهتزاز</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            لا يشغل مساحة من ذاكرة الهاتف (~1MB فقط)
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
