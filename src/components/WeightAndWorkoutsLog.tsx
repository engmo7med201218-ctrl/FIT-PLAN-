import React, { useState } from 'react';
import {
  Scale,
  Calendar,
  Plus,
  Trash2,
  TrendingDown,
  TrendingUp,
  Clock,
  Flame,
  Award,
  Check,
  ChevronRight,
  Filter,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { WeightLog, WorkoutLog, UserProfile } from '../types';
import { audioCoach } from '../utils/audioCoach';

interface WeightAndWorkoutsLogProps {
  weightLogs: WeightLog[];
  workoutLogs: WorkoutLog[];
  userProfile: UserProfile;
  onAddWeightLog: (log: Omit<WeightLog, 'id'>) => void;
  onDeleteWeightLog: (id: string) => void;
  onAddWorkoutLog: (log: Omit<WorkoutLog, 'id'>) => void;
  onDeleteWorkoutLog: (id: string) => void;
}

export const WeightAndWorkoutsLog: React.FC<WeightAndWorkoutsLogProps> = ({
  weightLogs,
  workoutLogs,
  userProfile,
  onAddWeightLog,
  onDeleteWeightLog,
  onAddWorkoutLog,
  onDeleteWorkoutLog,
}) => {
  const [activeTab, setActiveTab] = useState<'weight' | 'workouts'>('weight');

  // New weight modal state
  const [showWeightModal, setShowWeightModal] = useState<boolean>(false);
  const [inputWeight, setInputWeight] = useState<string>(
    weightLogs[weightLogs.length - 1]?.weightKg?.toString() || userProfile.currentWeightKg?.toString() || '85.0'
  );
  const [weightDate, setWeightDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [weightNotes, setWeightNotes] = useState<string>('');

  // Manual workout modal state
  const [showWorkoutModal, setShowWorkoutModal] = useState<boolean>(false);
  const [manualMinutes, setManualMinutes] = useState<number>(30);
  const [manualDistance, setManualDistance] = useState<number>(3.8);
  const [manualSpeed, setManualSpeed] = useState<number>(7.6);
  const [manualCalories, setManualCalories] = useState<number>(320);
  const [manualIncline, setManualIncline] = useState<number>(1.5);
  const [manualDate, setManualDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [manualNotes, setManualNotes] = useState<string>('');

  // Submit Weight
  const handleSaveWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const weightNum = parseFloat(inputWeight);
    if (isNaN(weightNum) || weightNum <= 0) return;

    // Check if this is a weight drop compared to latest
    const lastWeight = weightLogs[weightLogs.length - 1]?.weightKg;
    if (lastWeight && weightNum < lastWeight) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch {
        // Safe
      }
      audioCoach.playVictoryChime();
    } else {
      audioCoach.playTone(600, 'sine', 0.2);
    }

    onAddWeightLog({
      date: weightDate,
      weightKg: Math.round(weightNum * 10) / 10,
      notes: weightNotes.trim() || undefined,
    });

    setWeightNotes('');
    setShowWeightModal(false);
  };

  // Submit Manual Workout
  const handleSaveWorkout = (e: React.FormEvent) => {
    e.preventDefault();
    audioCoach.playVictoryChime();

    onAddWorkoutLog({
      date: new Date(manualDate).toISOString(),
      durationMinutes: Number(manualMinutes),
      distanceKm: Number(manualDistance),
      avgSpeedKmH: Number(manualSpeed),
      maxSpeedKmH: Number(manualSpeed) + 1.5,
      incline: Number(manualIncline),
      caloriesBurned: Number(manualCalories),
      perceivedExertion: 3,
      notes: manualNotes.trim() || undefined,
      speedProfileName: 'تسجيل يدوي سريع',
    });

    setShowWorkoutModal(false);
    setManualNotes('');
  };

  // Calculate BMI
  const heightInMeters = (userProfile.heightCm || 175) / 100;
  const currentLatestWeight = weightLogs[weightLogs.length - 1]?.weightKg || userProfile.currentWeightKg;
  const bmi = Math.round((currentLatestWeight / (heightInMeters * heightInMeters)) * 10) / 10;

  const getBMICategory = (bmiVal: number) => {
    if (bmiVal < 18.5) return { label: 'وزن منخفض', color: 'text-amber-400' };
    if (bmiVal < 25) return { label: 'وزن مثالي ورائع', color: 'text-emerald-400' };
    if (bmiVal < 30) return { label: 'زيادة طفيفة بالوزن', color: 'text-yellow-400' };
    return { label: 'سمنة - جاري التخلص منها', color: 'text-orange-400' };
  };

  const bmiInfo = getBMICategory(bmi);

  return (
    <div className="space-y-4 text-slate-100">
      {/* BMI & HEALTH STATUS BANNER */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">مؤشر كتلة الجسم (BMI):</span>
              <span className="font-digital text-base font-bold text-white">{bmi}</span>
            </div>
            <div className={`text-xs font-bold mt-0.5 ${bmiInfo.color}`}>{bmiInfo.label}</div>
          </div>
        </div>

        <div className="text-left font-digital">
          <span className="text-[10px] text-slate-400 block">الوزن الحالي</span>
          <span className="text-lg font-bold text-emerald-400">{currentLatestWeight} كجم</span>
        </div>
      </div>

      {/* TABS SELECTOR */}
      <div className="flex bg-slate-900 p-1 rounded-2xl border border-slate-800">
        <button
          onClick={() => setActiveTab('weight')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeTab === 'weight'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>سجل التوزينات الأسبوعية ({weightLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('workouts')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeTab === 'workouts'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>سجل جلسات المشاية ({workoutLogs.length})</span>
        </button>
      </div>

      {/* WEIGHT LOGS TAB */}
      {activeTab === 'weight' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">تاريخ قياسات الوزن:</span>
            <button
              onClick={() => setShowWeightModal(true)}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs flex items-center gap-1 shadow hover:opacity-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>تسجيل وزن جديد</span>
            </button>
          </div>

          <div className="space-y-2">
            {[...weightLogs].reverse().map((log, index, arr) => {
              // Calculate difference from previous older entry
              const prevOlder = arr[index + 1];
              const diff = prevOlder ? Math.round((log.weightKg - prevOlder.weightKg) * 10) / 10 : null;

              return (
                <div
                  key={log.id}
                  className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between hover:border-slate-700 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-300">
                      <Scale className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-digital text-base font-bold text-white">{log.weightKg} كجم</span>
                        {diff !== null && (
                          <span
                            className={`text-[11px] font-bold font-mono px-1.5 py-0.5 rounded-md flex items-center gap-0.5 ${
                              diff < 0
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : diff === 0
                                ? 'bg-slate-800 text-slate-400'
                                : 'bg-rose-500/20 text-rose-400'
                            }`}
                          >
                            {diff < 0 ? <TrendingDown className="w-3 h-3" /> : diff > 0 ? <TrendingUp className="w-3 h-3" /> : null}
                            <span>{diff > 0 ? `+${diff}` : diff} كجم</span>
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {log.date} {log.notes && `• ${log.notes}`}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteWeightLog(log.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                    title="حذف هذا القياس"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* WORKOUTS LOGS TAB */}
      {activeTab === 'workouts' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">جلسات الجري المنجزة:</span>
            <button
              onClick={() => setShowWorkoutModal(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-emerald-400 hover:bg-slate-700 font-bold text-xs flex items-center gap-1 transition"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>تسجيل يدوي سريع</span>
            </button>
          </div>

          <div className="space-y-2">
            {[...workoutLogs].reverse().map(w => (
              <div
                key={w.id}
                className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">
                        {new Date(w.date).toLocaleDateString('ar-EG', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      {w.speedProfileName && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 border border-emerald-500/30">
                          {w.speedProfileName}
                        </span>
                      )}
                    </div>
                    {w.notes && <p className="text-xs text-slate-400 mt-1">{w.notes}</p>}
                  </div>

                  <button
                    onClick={() => onDeleteWorkoutLog(w.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition"
                    title="حذف هذا التمرين"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Workout metrics bar */}
                <div className="grid grid-cols-4 gap-2 mt-3 p-2 rounded-xl bg-slate-950/70 border border-slate-800/80 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">المدة</span>
                    <span className="font-digital font-bold text-cyan-400">{w.durationMinutes} د</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">المسافة</span>
                    <span className="font-digital font-bold text-emerald-400">{w.distanceKm} كم</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">متوسط السرعة</span>
                    <span className="font-digital font-bold text-white">{w.avgSpeedKmH} كم/س</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">السعرات</span>
                    <span className="font-digital font-bold text-orange-400">{w.caloriesBurned}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RECORD NEW WEIGHT MODAL */}
      {showWeightModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-700 p-6 text-slate-100 shadow-2xl relative">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Scale className="w-5 h-5 text-emerald-400" />
              <span>تسجيل وزن جديد على الميزان</span>
            </h3>

            <form onSubmit={handleSaveWeight} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">الوزن الحالي (كجم):</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="30"
                    max="250"
                    required
                    value={inputWeight}
                    onChange={e => setInputWeight(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-digital text-lg focus:outline-none focus:border-emerald-500 pl-12"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">كجم</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">تاريخ القياس:</label>
                <input
                  type="date"
                  value={weightDate}
                  onChange={e => setWeightDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">ملاحظات (اختياري):</label>
                <input
                  type="text"
                  value={weightNotes}
                  onChange={e => setWeightNotes(e.target.value)}
                  placeholder="مثال: قياس صباحي قبل الإفطار"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowWeightModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold hover:opacity-95"
                >
                  تأكيد وحفظ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RECORD MANUAL WORKOUT MODAL */}
      {showWorkoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-700 p-6 text-slate-100 shadow-2xl relative">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-400" />
              <span>تسجيل تمرين مشاية يدوي</span>
            </h3>

            <form onSubmit={handleSaveWorkout} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">المدة (دقائق):</label>
                  <input
                    type="number"
                    min="1"
                    max="300"
                    value={manualMinutes}
                    onChange={e => {
                      const mins = Number(e.target.value);
                      setManualMinutes(mins);
                      setManualCalories(Math.round(mins * 9.5));
                      setManualDistance(Math.round((mins * 0.12) * 10) / 10);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 font-digital"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">المسافة (كم):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={manualDistance}
                    onChange={e => setManualDistance(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 font-digital"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">السرعة (كم/س):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={manualSpeed}
                    onChange={e => setManualSpeed(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 font-digital"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">السعرات (Kcal):</label>
                  <input
                    type="number"
                    value={manualCalories}
                    onChange={e => setManualCalories(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 font-digital"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">تاريخ التمرين:</label>
                <input
                  type="date"
                  value={manualDate}
                  onChange={e => setManualDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">ملاحظات:</label>
                <input
                  type="text"
                  value={manualNotes}
                  onChange={e => setManualNotes(e.target.value)}
                  placeholder="مثال: ركض ممتاز وسرعة ثابتة"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowWorkoutModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold hover:opacity-95"
                >
                  حفظ التمرين
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
