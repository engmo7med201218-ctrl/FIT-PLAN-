import React, { useState } from 'react';
import { TrendingDown, Timer, Gauge, Calendar, Target, Award, ArrowDownRight, Flame } from 'lucide-react';
import { WeightLog, WorkoutLog, UserProfile } from '../types';

interface ProgressChartsProps {
  weightLogs: WeightLog[];
  workoutLogs: WorkoutLog[];
  userProfile: UserProfile;
}

export const ProgressCharts: React.FC<ProgressChartsProps> = ({
  weightLogs,
  workoutLogs,
  userProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'weight' | 'minutes' | 'speed'>('weight');

  // Sort logs chronologically
  const sortedWeightLogs = [...weightLogs].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const sortedWorkoutLogs = [...workoutLogs].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Weight stats
  const startWeight = userProfile.startWeightKg;
  const currentWeight = sortedWeightLogs.length > 0
    ? sortedWeightLogs[sortedWeightLogs.length - 1].weightKg
    : userProfile.currentWeightKg;
  const targetWeight = userProfile.targetWeightKg;
  const totalWeightLost = Math.max(0, startWeight - currentWeight);
  const remainingWeight = Math.max(0, currentWeight - targetWeight);
  const progressPercent = Math.min(
    100,
    Math.round((totalWeightLost / Math.max(1, startWeight - targetWeight)) * 100)
  );

  // Running minutes stats
  const totalMinutesAllTime = workoutLogs.reduce((acc, curr) => acc + curr.durationMinutes, 0);
  const totalCaloriesAllTime = workoutLogs.reduce((acc, curr) => acc + curr.caloriesBurned, 0);
  const totalDistanceAllTime = workoutLogs.reduce((acc, curr) => acc + curr.distanceKm, 0);
  const avgSpeedAllTime = workoutLogs.length > 0
    ? Math.round((workoutLogs.reduce((acc, curr) => acc + curr.avgSpeedKmH, 0) / workoutLogs.length) * 10) / 10
    : 0;

  // Group workout minutes by the last 7 sessions or recent days
  const recentWorkouts = sortedWorkoutLogs.slice(-7);

  // Calculate SVG dimensions for Weight Line Chart
  const svgWidth = 500;
  const svgHeight = 220;
  const paddingX = 45;
  const paddingY = 30;

  // Weight graph bounds
  const minWeight = Math.min(...sortedWeightLogs.map(w => w.weightKg), targetWeight) - 2;
  const maxWeight = Math.max(...sortedWeightLogs.map(w => w.weightKg), startWeight) + 2;

  const getWeightY = (kg: number) => {
    const range = maxWeight - minWeight || 1;
    return svgHeight - paddingY - ((kg - minWeight) / range) * (svgHeight - paddingY * 2);
  };

  const getWeightX = (index: number, count: number) => {
    if (count <= 1) return svgWidth / 2;
    return paddingX + (index / (count - 1)) * (svgWidth - paddingX * 2);
  };

  // Build Weight SVG Path
  const weightPoints = sortedWeightLogs.map((log, idx) => ({
    x: getWeightX(idx, sortedWeightLogs.length),
    y: getWeightY(log.weightKg),
    weight: log.weightKg,
    date: log.date,
    notes: log.notes,
  }));

  const weightPathD = weightPoints.length > 0
    ? weightPoints.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`, '')
    : '';

  const weightAreaD = weightPoints.length > 0
    ? `${weightPathD} L ${weightPoints[weightPoints.length - 1].x} ${svgHeight - paddingY} L ${weightPoints[0].x} ${svgHeight - paddingY} Z`
    : '';

  // Max minutes for bar chart
  const maxMins = Math.max(...recentWorkouts.map(w => w.durationMinutes), 60);

  return (
    <div className="space-y-4 text-slate-100">
      {/* Chart Category Tabs */}
      <div className="flex bg-slate-900 p-1 rounded-2xl border border-slate-800">
        <button
          onClick={() => setActiveTab('weight')}
          className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeTab === 'weight'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <TrendingDown className="w-3.5 h-3.5" />
          <span>نزول الوزن</span>
        </button>

        <button
          onClick={() => setActiveTab('minutes')}
          className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeTab === 'minutes'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Timer className="w-3.5 h-3.5" />
          <span>دقائق الجري</span>
        </button>

        <button
          onClick={() => setActiveTab('speed')}
          className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeTab === 'speed'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Gauge className="w-3.5 h-3.5" />
          <span>تطور السرعات</span>
        </button>
      </div>

      {/* TAB 1: WEIGHT LOSS PROGRESS CHART */}
      {activeTab === 'weight' && (
        <div className="space-y-4">
          {/* Top Weight Progress Metrics */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-center">
              <span className="text-[10px] text-slate-400 block mb-0.5">الوزن الأولي</span>
              <span className="font-digital text-lg font-bold text-slate-300">{startWeight}</span>
              <span className="text-[10px] text-slate-500 block">كجم</span>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-3 text-center relative overflow-hidden">
              <div className="text-[10px] text-emerald-400 font-bold block mb-0.5 flex items-center justify-center gap-0.5">
                <ArrowDownRight className="w-3 h-3" />
                <span>إجمالي النزول</span>
              </div>
              <span className="font-digital text-xl font-black text-emerald-400">-{totalWeightLost.toFixed(1)}</span>
              <span className="text-[10px] text-emerald-500 block">كجم تم حرقها</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-center">
              <span className="text-[10px] text-slate-400 block mb-0.5">الهدف المنشود</span>
              <span className="font-digital text-lg font-bold text-cyan-400">{targetWeight}</span>
              <span className="text-[10px] text-slate-500 block">كجم</span>
            </div>
          </div>

          {/* Goal Completion Progress Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-emerald-400" />
                <span>نسبة إنجاز خطة الوزن:</span>
              </span>
              <span className="font-digital text-sm font-bold text-emerald-400">{progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div
                className="bg-gradient-to-r from-teal-500 via-emerald-400 to-green-300 h-full rounded-full transition-all duration-700 glow-emerald"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-400 mt-2">
              <span>تم خسارة {totalWeightLost.toFixed(1)} كجم</span>
              <span>متبقي {remainingWeight.toFixed(1)} كجم للهدف</span>
            </div>
          </div>

          {/* SVG Weight Curve Line Graph */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <TrendingDown className="w-4 h-4 text-emerald-400" />
                <span>الرسم البياني لتدرج نزول الوزن</span>
              </h3>
              <span className="text-[10px] text-slate-400">آخر التوزينات المسجلة</span>
            </div>

            <div className="w-full overflow-x-auto no-scrollbar">
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto min-w-[340px]">
                <defs>
                  <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line
                  x1={paddingX}
                  y1={getWeightY(targetWeight)}
                  x2={svgWidth - paddingX}
                  y2={getWeightY(targetWeight)}
                  stroke="#06b6d4"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  opacity="0.6"
                />
                <text
                  x={svgWidth - paddingX + 5}
                  y={getWeightY(targetWeight) + 3}
                  fill="#06b6d4"
                  fontSize="9"
                  fontFamily="Cairo"
                >
                  الهدف ({targetWeight} كجم)
                </text>

                <line
                  x1={paddingX}
                  y1={getWeightY(startWeight)}
                  x2={svgWidth - paddingX}
                  y2={getWeightY(startWeight)}
                  stroke="#64748b"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                  opacity="0.4"
                />
                <text
                  x={svgWidth - paddingX + 5}
                  y={getWeightY(startWeight) + 3}
                  fill="#94a3b8"
                  fontSize="9"
                  fontFamily="Cairo"
                >
                  البداية ({startWeight} كجم)
                </text>

                {/* Area under curve */}
                {weightAreaD && <path d={weightAreaD} fill="url(#weightGrad)" />}

                {/* Weight line */}
                {weightPathD && (
                  <path
                    d={weightPathD}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Data Points */}
                {weightPoints.map((pt, i) => (
                  <g key={i}>
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="5.5"
                      fill="#0f172a"
                      stroke="#10b981"
                      strokeWidth="2.5"
                    />
                    <circle cx={pt.x} cy={pt.y} r="2.5" fill="#34d399" />
                    {/* Weight label above point */}
                    <text
                      x={pt.x}
                      y={pt.y - 10}
                      fill="#ffffff"
                      fontSize="10"
                      fontWeight="bold"
                      textAnchor="middle"
                      fontFamily="Chakra Petch"
                    >
                      {pt.weight}
                    </text>
                    {/* Date label at bottom */}
                    <text
                      x={pt.x}
                      y={svgHeight - 10}
                      fill="#94a3b8"
                      fontSize="9"
                      textAnchor="middle"
                      fontFamily="Cairo"
                    >
                      {pt.date.split('-').slice(1).join('/')}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RUNNING MINUTES & WORKOUT VOLUME */}
      {activeTab === 'minutes' && (
        <div className="space-y-4">
          {/* Quick Running Volume Cards */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-center">
              <span className="text-[10px] text-slate-400 block mb-0.5">إجمالي الدقائق</span>
              <span className="font-digital text-xl font-bold text-cyan-400">{totalMinutesAllTime}</span>
              <span className="text-[10px] text-slate-500 block">دقيقة ركض</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-center">
              <span className="text-[10px] text-slate-400 block mb-0.5">إجمالي المسافة</span>
              <span className="font-digital text-xl font-bold text-emerald-400">{totalDistanceAllTime.toFixed(1)}</span>
              <span className="text-[10px] text-slate-500 block">كيلومتر</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-center">
              <span className="text-[10px] text-slate-400 block mb-0.5">سعرات محروقة</span>
              <span className="font-digital text-xl font-bold text-orange-400">{totalCaloriesAllTime}</span>
              <span className="text-[10px] text-slate-500 block">كالوري</span>
            </div>
          </div>

          {/* Bar Chart of Running Minutes by Session */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Timer className="w-4 h-4 text-cyan-400" />
                <span>دقائق الجري في آخر الجلسات المسجلة</span>
              </h3>
              <span className="text-[10px] text-emerald-400 font-mono">الهدف: {userProfile.weeklyTargetMinutes} د/أسبوع</span>
            </div>

            {recentWorkouts.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">لا توجد جلسات مسجلة بعد. ابدأ أول تمرين الآن!</div>
            ) : (
              <div className="space-y-2.5 pt-2">
                {recentWorkouts.map((w, i) => {
                  const percent = Math.min(100, Math.round((w.durationMinutes / maxMins) * 100));
                  const formattedDate = new Date(w.date).toLocaleDateString('ar-EG', {
                    month: 'numeric',
                    day: 'numeric',
                    weekday: 'short',
                  });

                  return (
                    <div key={w.id || i} className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-300 font-medium flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span>{formattedDate}</span>
                          {w.speedProfileName && (
                            <span className="text-[10px] text-slate-500 hidden sm:inline">({w.speedProfileName})</span>
                          )}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-digital text-xs font-bold text-cyan-400">{w.durationMinutes} دقيقة</span>
                          <span className="text-[10px] text-slate-500 font-mono">({w.distanceKm.toFixed(1)} كم)</span>
                        </div>
                      </div>

                      <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800/80">
                        <div
                          className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: SPEED & INTENSITY PROGRESSION */}
      {activeTab === 'speed' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-center">
              <span className="text-[10px] text-slate-400 block mb-0.5">متوسط السرعة العام</span>
              <span className="font-digital text-2xl font-bold text-emerald-400">{avgSpeedAllTime}</span>
              <span className="text-[10px] text-slate-500 block">كم / ساعة</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-center">
              <span className="text-[10px] text-slate-400 block mb-0.5">أعلى سرعة سجلتها</span>
              <span className="font-digital text-2xl font-bold text-purple-400">
                {Math.max(...sortedWorkoutLogs.map(w => w.maxSpeedKmH), 0).toFixed(1)}
              </span>
              <span className="text-[10px] text-slate-500 block">كم / ساعة</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <h3 className="text-xs font-bold text-slate-200 mb-3 flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-emerald-400" />
              <span>سجل تطور السرعات عبر الجلسات</span>
            </h3>

            <div className="space-y-2">
              {recentWorkouts.map((w, idx) => (
                <div
                  key={w.id || idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/70"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-digital font-bold text-xs">
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-200">
                        {new Date(w.date).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' })}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {w.durationMinutes} دقيقة • {w.caloriesBurned} سعرة
                      </div>
                    </div>
                  </div>

                  <div className="text-left font-digital">
                    <span className="text-xs font-bold text-emerald-400">{w.avgSpeedKmH} كم/س</span>
                    <span className="text-[10px] text-slate-500 block">أقصى: {w.maxSpeedKmH}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
