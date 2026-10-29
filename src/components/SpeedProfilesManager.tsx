import React, { useState } from 'react';
import { Gauge, Plus, Edit2, Trash2, Check, Sparkles, Zap, Flame } from 'lucide-react';
import { FavoriteSpeedProfile } from '../types';

interface SpeedProfilesManagerProps {
  speedProfiles: FavoriteSpeedProfile[];
  onSaveProfile: (profile: FavoriteSpeedProfile) => void;
  onDeleteProfile: (id: string) => void;
  onSetDefault: (id: string) => void;
}

export const SpeedProfilesManager: React.FC<SpeedProfilesManagerProps> = ({
  speedProfiles,
  onSaveProfile,
  onDeleteProfile,
  onSetDefault,
}) => {
  const [editingProfile, setEditingProfile] = useState<FavoriteSpeedProfile | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const startCreate = () => {
    setEditingProfile({
      id: 'prof-' + Date.now(),
      name: '',
      description: '',
      warmupSpeed: 5.5,
      jogSpeed: 8.0,
      fastRunSpeed: 10.0,
      sprintSpeed: 12.0,
      coolDownSpeed: 4.5,
      defaultIncline: 1.5,
    });
    setIsCreating(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProfile || !editingProfile.name.trim()) return;

    onSaveProfile(editingProfile);
    setEditingProfile(null);
    setIsCreating(false);
  };

  return (
    <div className="space-y-4 text-slate-100">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-1.5">
            <Gauge className="w-5 h-5 text-emerald-400" />
            <span>برامج السرعات المحببة للمشاية</span>
          </h2>
          <p className="text-xs text-slate-400">تخصيص سرعاتك المفضلة للتبديل الفوري بلمسة واحدة</p>
        </div>

        <button
          onClick={startCreate}
          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs flex items-center gap-1 shadow hover:opacity-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>برنامج جديد</span>
        </button>
      </div>

      {/* Profiles Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {speedProfiles.map(p => (
          <div
            key={p.id}
            className={`p-4 rounded-2xl border transition relative flex flex-col justify-between ${
              p.isDefault
                ? 'bg-slate-900 border-emerald-500/50 shadow-md ring-1 ring-emerald-500/30'
                : 'bg-slate-900/80 border-slate-800'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-white">{p.name}</h3>
                  {p.isDefault && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold">
                      الافتراضي
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingProfile(p);
                      setIsCreating(false);
                    }}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                    title="تعديل السرعات"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  {speedProfiles.length > 1 && (
                    <button
                      onClick={() => onDeleteProfile(p.id)}
                      className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10"
                      title="حذف"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-400 mb-3">{p.description || 'برنامج جري متوازن'}</p>

              {/* Speeds Badges */}
              <div className="grid grid-cols-5 gap-1.5 p-2 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
                <div className="p-1 rounded-lg bg-amber-500/10">
                  <span className="text-[9px] text-amber-400 block">إحماء</span>
                  <span className="font-digital text-xs font-bold text-white">{p.warmupSpeed}</span>
                </div>
                <div className="p-1 rounded-lg bg-emerald-500/10">
                  <span className="text-[9px] text-emerald-400 block">هرولة</span>
                  <span className="font-digital text-xs font-bold text-white">{p.jogSpeed}</span>
                </div>
                <div className="p-1 rounded-lg bg-cyan-500/10">
                  <span className="text-[9px] text-cyan-400 block">سريع</span>
                  <span className="font-digital text-xs font-bold text-white">{p.fastRunSpeed}</span>
                </div>
                <div className="p-1 rounded-lg bg-rose-500/10">
                  <span className="text-[9px] text-rose-400 block">سبرنت</span>
                  <span className="font-digital text-xs font-bold text-white">{p.sprintSpeed}</span>
                </div>
                <div className="p-1 rounded-lg bg-slate-800">
                  <span className="text-[9px] text-slate-400 block">تبريد</span>
                  <span className="font-digital text-xs font-bold text-white">{p.coolDownSpeed}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-800/80 text-xs text-slate-400">
              <span className="font-mono">الميل الافتراضي: {p.defaultIncline}%</span>
              {!p.isDefault && (
                <button
                  onClick={() => onSetDefault(p.id)}
                  className="text-emerald-400 text-xs font-semibold hover:underline"
                >
                  تعيين كافتراضي
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* EDIT / CREATE PROFILE MODAL */}
      {editingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700 p-6 text-slate-100 shadow-2xl relative">
            <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-400" />
              <span>{isCreating ? 'إنشاء برنامج سرعات جديد' : 'تعديل السرعات المحببة'}</span>
            </h3>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">اسم البرنامج:</label>
                <input
                  type="text"
                  required
                  value={editingProfile.name}
                  onChange={e => setEditingProfile({ ...editingProfile, name: e.target.value })}
                  placeholder="مثال: ركض حارق للدهون المسائي"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">وصف أو هدف البرنامج:</label>
                <input
                  type="text"
                  value={editingProfile.description}
                  onChange={e => setEditingProfile({ ...editingProfile, description: e.target.value })}
                  placeholder="مثال: للتركيز على استهلاك دهون البطن والخصر"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5">
                <span className="text-[11px] font-bold text-emerald-400 block mb-1">
                  تحديد السرعات (كم / ساعة):
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-amber-400 block mb-0.5">سرعة الإحماء (Warmup):</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="15"
                      value={editingProfile.warmupSpeed}
                      onChange={e => setEditingProfile({ ...editingProfile, warmupSpeed: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-emerald-400 block mb-0.5">سرعة الهرولة (Jogging):</label>
                    <input
                      type="number"
                      step="0.1"
                      min="2"
                      max="18"
                      value={editingProfile.jogSpeed}
                      onChange={e => setEditingProfile({ ...editingProfile, jogSpeed: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-cyan-400 block mb-0.5">سرعة الجري (Fast Run):</label>
                    <input
                      type="number"
                      step="0.1"
                      min="3"
                      max="20"
                      value={editingProfile.fastRunSpeed}
                      onChange={e => setEditingProfile({ ...editingProfile, fastRunSpeed: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-rose-400 block mb-0.5">سرعة السبرنت (HIIT Sprint):</label>
                    <input
                      type="number"
                      step="0.1"
                      min="4"
                      max="22"
                      value={editingProfile.sprintSpeed}
                      onChange={e => setEditingProfile({ ...editingProfile, sprintSpeed: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-0.5">سرعة التبريد (Cool down):</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="10"
                      value={editingProfile.coolDownSpeed}
                      onChange={e => setEditingProfile({ ...editingProfile, coolDownSpeed: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-300 block mb-0.5">زاوية الميل (% Incline):</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="15"
                      value={editingProfile.defaultIncline}
                      onChange={e => setEditingProfile({ ...editingProfile, defaultIncline: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProfile(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold hover:opacity-95"
                >
                  حفظ التعديلات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
