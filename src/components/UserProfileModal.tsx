import React, { useState } from 'react';
import { User, Target, Volume2, Bell, Vibrate, Check, X, RotateCcw, Shield } from 'lucide-react';
import { UserProfile } from '../types';

interface UserProfileModalProps {
  userProfile: UserProfile;
  onSave: (updated: UserProfile) => void;
  onClose: () => void;
  onResetData: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  userProfile,
  onSave,
  onClose,
  onResetData,
}) => {
  const [formData, setFormData] = useState<UserProfile>({ ...userProfile });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700 p-6 text-slate-100 shadow-2xl relative max-h-[90vh] overflow-y-auto no-scrollbar">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">الملف الشخصي وأهداف الرشاقة</h2>
            <p className="text-xs text-slate-400">ضبط الطول والوزن المستهدف وتفضيلات المدرب</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Name & Gender */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">الاسم أو اللقب:</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">الطول (سم):</label>
              <input
                type="number"
                min="100"
                max="250"
                value={formData.heightCm}
                onChange={e => setFormData({ ...formData, heightCm: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 font-digital"
              />
            </div>
          </div>

          {/* Weight targets */}
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <Target className="w-4 h-4" />
              <span>خطة خسارة الوزن:</span>
            </span>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-300 text-[11px] mb-0.5">الوزن الأولي عند البداية:</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={formData.startWeightKg}
                    onChange={e => setFormData({ ...formData, startWeightKg: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 font-digital text-sm"
                  />
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-500">كجم</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 text-[11px] mb-0.5">الوزن المستهدف (الهدف):</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={formData.targetWeightKg}
                    onChange={e => setFormData({ ...formData, targetWeightKg: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-cyan-400 font-digital text-sm font-bold"
                  />
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-500">كجم</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 text-[11px] mb-0.5">هدف دقائق الجري أسبوعياً:</label>
              <div className="flex items-center gap-2">
                {[120, 150, 180, 210].map(mins => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setFormData({ ...formData, weeklyTargetMinutes: mins })}
                    className={`flex-1 py-1.5 rounded-lg border text-center transition ${
                      formData.weeklyTargetMinutes === mins
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                        : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {mins} د
                  </button>
                ))}
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">
                توصي منظمة الصحة العالمية بـ 150 دقيقة كارديو أسبوعياً لحرق الدهون والحفاظ على صحة القلب.
              </span>
            </div>
          </div>

          {/* Sound, voice and vibration options */}
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2.5">
            <span className="text-xs font-bold text-slate-300 block mb-1">تفضيلات المدرب الصوتي والتنبيه:</span>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-slate-300">المدرب الصوتي باللغة العربية (Voice Coach)</span>
              <input
                type="checkbox"
                checked={formData.voiceCoachEnabled}
                onChange={e => setFormData({ ...formData, voiceCoachEnabled: e.target.checked })}
                className="w-4 h-4 accent-emerald-500"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-slate-300">نغمات العد التنازلي والمحطات الرياضية</span>
              <input
                type="checkbox"
                checked={formData.soundEffectsEnabled}
                onChange={e => setFormData({ ...formData, soundEffectsEnabled: e.target.checked })}
                className="w-4 h-4 accent-emerald-500"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-slate-300">الاهتزاز على الموبايل عند تغيير السرعة</span>
              <input
                type="checkbox"
                checked={formData.vibrationEnabled}
                onChange={e => setFormData({ ...formData, vibrationEnabled: e.target.checked })}
                className="w-4 h-4 accent-emerald-500"
              />
            </label>
          </div>

          {/* Submit & Reset actions */}
          <div className="pt-2 space-y-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-sm shadow hover:opacity-95 transition flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>حفظ الإعدادات</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (window.confirm('هل أنت متأكد من إعادة تعيين البيانات التجريبية للمشاية والوزن؟')) {
                  onResetData();
                  onClose();
                }
              }}
              className="w-full py-2 rounded-xl bg-slate-800/80 text-rose-400 font-semibold text-xs hover:bg-rose-500/10 transition flex items-center justify-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>استعادة البيانات النموذجية الافتراضية</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
