import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  Square,
  Flame,
  Gauge,
  Timer,
  TrendingUp,
  Volume2,
  VolumeX,
  Sparkles,
  Check,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  Zap,
  Sun,
  Minimize2,
  Smartphone,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FavoriteSpeedProfile, UserProfile, WorkoutLog } from '../types';
import { audioCoach } from '../utils/audioCoach';
import { useWakeLock } from '../hooks/useWakeLock';

interface LiveTreadmillConsoleProps {
  userProfile: UserProfile;
  speedProfiles: FavoriteSpeedProfile[];
  onSaveWorkout: (log: Omit<WorkoutLog, 'id'>) => void;
  onCancel: () => void;
  onMinimize?: () => void;
  onWorkoutTick?: (info: { isRunning: boolean; speed: number; secondsElapsed: number; calories: number }) => void;
  initialSpeedProfileId?: string;
  initialTargetMinutes?: number;
}

export const LiveTreadmillConsole: React.FC<LiveTreadmillConsoleProps> = ({
  userProfile,
  speedProfiles,
  onSaveWorkout,
  onCancel,
  onMinimize,
  onWorkoutTick,
  initialSpeedProfileId,
  initialTargetMinutes = 30,
}) => {
  const { isActive: isWakeLockActive, toggleWakeLock, requestWakeLock, releaseWakeLock } = useWakeLock();

  // Find initial profile or fallback
  const defaultProfile =
    speedProfiles.find(p => p.id === initialSpeedProfileId) ||
    speedProfiles.find(p => p.isDefault) ||
    speedProfiles[0];

  const [selectedProfile, setSelectedProfile] = useState<FavoriteSpeedProfile>(defaultProfile);
  const [targetMinutes, setTargetMinutes] = useState<number>(initialTargetMinutes);

  // Treadmill console state
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [currentSpeed, setCurrentSpeed] = useState<number>(defaultProfile.warmupSpeed);
  const [currentIncline, setCurrentIncline] = useState<number>(defaultProfile.defaultIncline);
  const [totalDistanceKm, setTotalDistanceKm] = useState<number>(0);
  const [caloriesBurned, setCaloriesBurned] = useState<number>(0);
  const [maxSpeedRecorded, setMaxSpeedRecorded] = useState<number>(defaultProfile.warmupSpeed);

  // Audio & Voice toggles
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(userProfile.voiceCoachEnabled);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(userProfile.soundEffectsEnabled);

  // Countdown state
  const [countdown, setCountdown] = useState<number | null>(null);

  // Completion modal state
  const [showCompletionModal, setShowCompletionModal] = useState<boolean>(false);
  const [workoutRating, setWorkoutRating] = useState<number>(4);
  const [workoutNotes, setWorkoutNotes] = useState<string>('');

  // Refs for timing
  const timerRef = useRef<number | null>(null);
  const speedRef = useRef<number>(currentSpeed);
  speedRef.current = currentSpeed;
  const inclineRef = useRef<number>(currentIncline);
  inclineRef.current = currentIncline;

  // Calculation of calories per second based on ACSM formula
  // Speed in m/min = speed_kmh * 1000 / 60 = speed_kmh * 16.667
  // VO2 (ml/kg/min) for running = (0.2 * speed_m_min) + (0.9 * speed_m_min * grade) + 3.5
  // Kcal/min = (VO2 * weightKg) / 200
  const calculateCalorieBurnPerSecond = useCallback((speedKmh: number, inclinePercent: number): number => {
    const weight = userProfile.currentWeightKg || 80;
    const speedMMin = speedKmh * (1000 / 60);
    const gradeFraction = inclinePercent / 100;
    // For speeds >= 7 km/h use running equation, for walking use walking equation
    const vo2 = speedKmh >= 7.0
      ? 0.2 * speedMMin + 0.9 * speedMMin * gradeFraction + 3.5
      : 0.1 * speedMMin + 1.8 * speedMMin * gradeFraction + 3.5;

    const kcalPerMin = (vo2 * weight) / 200;
    return kcalPerMin / 60;
  }, [userProfile.currentWeightKg]);

  // Main workout tick
  useEffect(() => {
    if (isRunning && !isPaused) {
      timerRef.current = window.setInterval(() => {
        setSecondsElapsed(prev => {
          const nextSec = prev + 1;

          // Check for milestone voice cues (every 5 minutes)
          if (nextSec > 0 && nextSec % 300 === 0 && voiceEnabled) {
            const mins = Math.floor(nextSec / 60);
            audioCoach.speakArabic(`عاش يا بطل! أكملت ${mins} دقيقة بنجاح، استمر!`);
          }

          // Target time reached chime
          if (nextSec === targetMinutes * 60) {
            if (soundEnabled) audioCoach.playVictoryChime();
            if (voiceEnabled) audioCoach.speakArabic(`أحسنت! حققت هدف التمرين ${targetMinutes} دقيقة! يمكنك التبريد الآن.`);
            audioCoach.vibrate([200, 100, 200, 100, 400]);
          }

          return nextSec;
        });

        // Update distance: km = speed_kmh * (1 hr / 3600 sec)
        const distanceIncrement = speedRef.current / 3600;
        setTotalDistanceKm(prev => prev + distanceIncrement);

        // Update calories
        const calIncrement = calculateCalorieBurnPerSecond(speedRef.current, inclineRef.current);
        setCaloriesBurned(prev => prev + calIncrement);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, isPaused, targetMinutes, voiceEnabled, soundEnabled, calculateCalorieBurnPerSecond]);

  // Track max speed
  useEffect(() => {
    if (currentSpeed > maxSpeedRecorded) {
      setMaxSpeedRecorded(currentSpeed);
    }
  }, [currentSpeed, maxSpeedRecorded]);

  // Synchronize active workout info to parent (Dynamic Island, etc.)
  useEffect(() => {
    onWorkoutTick?.({
      isRunning,
      speed: currentSpeed,
      secondsElapsed,
      calories: Math.round(caloriesBurned),
    });
  }, [isRunning, currentSpeed, secondsElapsed, caloriesBurned, onWorkoutTick]);

  // Start with countdown
  const handleStartWorkout = () => {
    requestWakeLock().catch(() => {});
    if (soundEnabled) audioCoach.playCountdownBeep(false);
    setCountdown(3);

    const countInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev === null) return null;
        if (prev > 1) {
          if (soundEnabled) audioCoach.playCountdownBeep(false);
          return prev - 1;
        } else if (prev === 1) {
          if (soundEnabled) audioCoach.playCountdownBeep(true);
          if (voiceEnabled) audioCoach.speakArabic('انطلق! ابدأ الجري');
          audioCoach.vibrate(200);
          clearInterval(countInterval);
          setIsRunning(true);
          setIsPaused(false);
          return null;
        }
        return null;
      });
    }, 1000);
  };

  const handlePauseResume = () => {
    if (isPaused) {
      if (soundEnabled) audioCoach.playTone(600, 'sine', 0.15);
      if (voiceEnabled) audioCoach.speakArabic('استئناف الجري');
      setIsPaused(false);
    } else {
      if (soundEnabled) audioCoach.playTone(400, 'sine', 0.15);
      if (voiceEnabled) audioCoach.speakArabic('توقف مؤقت');
      setIsPaused(true);
    }
  };

  const handleFinishWorkout = () => {
    setIsRunning(false);
    setIsPaused(false);
    if (soundEnabled) audioCoach.playVictoryChime();
    if (voiceEnabled) audioCoach.speakArabic('ألف مبروك! أنهيت تمرين الجري بنجاح');
    audioCoach.vibrate([200, 150, 300]);

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#06b6d4', '#f59e0b', '#3b82f6'],
      });
    } catch {
      // Ignore
    }

    setShowCompletionModal(true);
  };

  const setSpeedValue = (newSpeed: number, label?: string) => {
    const clamped = Math.max(1.0, Math.min(20.0, Math.round(newSpeed * 10) / 10));
    setCurrentSpeed(clamped);
    if (soundEnabled) audioCoach.playSpeedChangeChime();
    if (voiceEnabled && label) {
      audioCoach.speakArabic(`${label}، السرعة ${clamped}`);
    }
    audioCoach.vibrate(60);
  };

  const setInclineValue = (newIncline: number) => {
    const clamped = Math.max(0, Math.min(15, Math.round(newIncline * 10) / 10));
    setCurrentIncline(clamped);
    if (soundEnabled) audioCoach.playTone(500, 'sine', 0.1);
  };

  const handleSaveAndClose = () => {
    const durationMinutes = Math.max(1, Math.round(secondsElapsed / 60));
    const avgSpeed = durationMinutes > 0 ? Math.round((totalDistanceKm / (durationMinutes / 60)) * 10) / 10 : currentSpeed;

    onSaveWorkout({
      date: new Date().toISOString(),
      durationMinutes,
      distanceKm: Math.round(totalDistanceKm * 100) / 100,
      avgSpeedKmH: avgSpeed || currentSpeed,
      maxSpeedKmH: maxSpeedRecorded,
      incline: currentIncline,
      caloriesBurned: Math.round(caloriesBurned),
      perceivedExertion: workoutRating,
      notes: workoutNotes.trim() || undefined,
      speedProfileName: selectedProfile.name,
    });
  };

  // Format MM:SS
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Speed favorites shortcuts from selected profile
  const speedShortcuts = [
    { label: 'إحماء', speed: selectedProfile.warmupSpeed, color: 'from-amber-500/20 to-amber-600/20 text-amber-400 border-amber-500/40' },
    { label: 'هرولة', speed: selectedProfile.jogSpeed, color: 'from-emerald-500/20 to-teal-600/20 text-emerald-400 border-emerald-500/40' },
    { label: 'جري سريع', speed: selectedProfile.fastRunSpeed, color: 'from-cyan-500/20 to-blue-600/20 text-cyan-400 border-cyan-500/40' },
    { label: 'سبرنت HIIT', speed: selectedProfile.sprintSpeed, color: 'from-rose-500/20 to-pink-600/20 text-rose-400 border-rose-500/40' },
    { label: 'تبريد', speed: selectedProfile.coolDownSpeed, color: 'from-slate-700 to-slate-800 text-slate-300 border-slate-600' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 p-4 pb-20 max-w-xl mx-auto animate-in fade-in">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Gauge className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white leading-tight">لوحة تحكم المشاية</h1>
            <p className="text-[11px] text-slate-400">تحكم مباشر بالسرعات والوقت</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Wake Lock Screen On Toggle */}
          <button
            onClick={toggleWakeLock}
            className={`p-2 rounded-xl border text-xs transition flex items-center gap-1 ${
              isWakeLockActive
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-sm'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-white'
            }`}
            title={isWakeLockActive ? 'مانع نوم الشاشة نشط' : 'إبقاء شاشة الموبايل مضاءة'}
          >
            <Sun className="w-4 h-4" />
          </button>

          {/* Voice Coach Toggle */}
          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`p-2 rounded-xl border text-xs transition ${
              voiceEnabled ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
            title="المدرب الصوتي"
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Minimize Console Button (Allows running in background) */}
          {isRunning && onMinimize && (
            <button
              onClick={onMinimize}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition"
              title="تصغير اللوحة والاستمرار في الجري بالخلفية"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          )}

          {!isRunning && (
            <button
              onClick={onCancel}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition"
            >
              إلغاء
            </button>
          )}
        </div>
      </div>

      {/* Program Selector (if not running) */}
      {!isRunning && (
        <div className="mb-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 space-y-3">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>اختر برنامج السرعات المحببة:</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {speedProfiles.map(p => (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedProfile(p);
                  setCurrentSpeed(p.warmupSpeed);
                  setCurrentIncline(p.defaultIncline);
                }}
                className={`p-2.5 rounded-xl text-right border transition text-xs flex flex-col justify-between ${
                  selectedProfile.id === p.id
                    ? 'bg-emerald-500/15 border-emerald-500/60 text-white font-bold shadow-sm'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="font-bold text-[13px]">{p.name}</div>
                <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">{p.description}</div>
                <div className="text-[10px] text-emerald-400 mt-2 font-mono">
                  {p.warmupSpeed} ➔ {p.sprintSpeed} كم/س
                </div>
              </button>
            ))}
          </div>

          {/* Target duration selector */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs text-slate-300 font-medium">الهدف الزمني المفضل:</span>
            <div className="flex items-center gap-1.5">
              {[20, 30, 40, 45, 60].map(mins => (
                <button
                  key={mins}
                  onClick={() => setTargetMinutes(mins)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                    targetMinutes === mins
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {mins} د
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TREADMILL DIGITAL CONSOLE DASHBOARD */}
      <div className="relative bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-slate-800 rounded-3xl p-5 shadow-2xl mb-4 overflow-hidden">
        {/* Glow ambient background effect */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-40 bg-emerald-500/10 blur-3xl pointer-events-none rounded-full" />

        {/* Console Header Status */}
        <div className="flex items-center justify-between mb-4 relative z-10">
          <span className="px-2.5 py-0.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isRunning && !isPaused ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
            {isRunning ? (isPaused ? 'توقف مؤقت' : 'تمرين جاري الآن') : 'جاهز للبدء'}
          </span>
          <span className="text-xs text-slate-400 font-medium">{selectedProfile.name}</span>
        </div>

        {/* Huge Digital Timer */}
        <div className="text-center py-2 relative z-10">
          <div className="text-[11px] tracking-widest uppercase text-slate-400 font-medium mb-0.5 flex items-center justify-center gap-1">
            <Timer className="w-3.5 h-3.5 text-cyan-400" />
            <span>وقت الجري المنقضي</span>
          </div>
          <div className="font-digital text-5xl sm:text-6xl font-bold tracking-wider text-cyan-400 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            {formatTime(secondsElapsed)}
          </div>
          {/* Target Progress Bar */}
          <div className="mt-2 w-full bg-slate-800 h-2 rounded-full overflow-hidden max-w-xs mx-auto">
            <div
              className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full transition-all duration-500 rounded-full"
              style={{ width: `${Math.min(100, (secondsElapsed / (targetMinutes * 60)) * 100)}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            الهدف: {targetMinutes} دقيقة ({Math.round((secondsElapsed / (targetMinutes * 60)) * 100)}%)
          </div>
        </div>

        {/* Dual Primary Gauges: Speed & Calories */}
        <div className="grid grid-cols-2 gap-3 mt-4 relative z-10">
          {/* Speed Display */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 text-center">
            <div className="text-[11px] text-slate-400 font-medium flex items-center justify-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-emerald-400" />
              <span>السرعة الحالية</span>
            </div>
            <div className="font-digital text-4xl font-bold text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.4)] my-1">
              {currentSpeed.toFixed(1)}
            </div>
            <div className="text-[11px] text-slate-500 font-mono">كم / ساعة</div>
          </div>

          {/* Calories Burned */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 text-center">
            <div className="text-[11px] text-slate-400 font-medium flex items-center justify-center gap-1">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span>السعرات المحروقة</span>
            </div>
            <div className="font-digital text-4xl font-bold text-orange-400 drop-shadow-[0_0_12px_rgba(249,115,22,0.4)] my-1">
              {Math.round(caloriesBurned)}
            </div>
            <div className="text-[11px] text-slate-500 font-mono">سعرة حرارية (Kcal)</div>
          </div>
        </div>

        {/* Secondary Gauges: Distance & Incline */}
        <div className="grid grid-cols-2 gap-3 mt-3 relative z-10">
          {/* Distance */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">المسافة المقطوعة</span>
              <span className="font-digital text-xl font-bold text-white">{totalDistanceKm.toFixed(2)}</span>
            </div>
            <span className="text-xs text-slate-500 font-bold">كم</span>
          </div>

          {/* Incline */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">زاوية الميل (Incline)</span>
              <span className="font-digital text-xl font-bold text-white">{currentIncline.toFixed(1)}</span>
            </div>
            <span className="text-xs text-slate-500 font-bold">%</span>
          </div>
        </div>
      </div>

      {/* QUICK PRESET SPEED BUTTONS (السرعات المحببة) */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>السرعات المحببة للاختيار السريع:</span>
          </span>
          <span className="text-[10px] text-slate-500">نقرة واحدة لضبط المشاية</span>
        </div>

        <div className="grid grid-cols-5 gap-1.5">
          {speedShortcuts.map(item => (
            <button
              key={item.label}
              onClick={() => setSpeedValue(item.speed, item.label)}
              className={`p-2 rounded-xl border text-center transition flex flex-col items-center justify-center bg-gradient-to-b ${item.color} ${
                Math.abs(currentSpeed - item.speed) < 0.1
                  ? 'ring-2 ring-emerald-400 scale-[1.03] shadow-lg font-bold'
                  : 'hover:opacity-90 active:scale-95'
              }`}
            >
              <span className="text-[10px] font-medium leading-none mb-1 line-clamp-1">{item.label}</span>
              <span className="font-digital text-base font-bold leading-tight">{item.speed}</span>
              <span className="text-[9px] opacity-70">كم/س</span>
            </button>
          ))}
        </div>
      </div>

      {/* FINE-TUNE CONTROLS: SPEED & INCLINE STEPPERS */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {/* Speed Adjustment (+ / -) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-300">تعديل السرعة</span>
            <span className="font-mono text-xs text-emerald-400 font-bold">{currentSpeed.toFixed(1)}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setSpeedValue(currentSpeed - 0.5)}
              className="py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 font-bold text-sm hover:bg-slate-700 active:scale-95 flex items-center justify-center gap-1"
            >
              <ChevronDown className="w-4 h-4 text-rose-400" />
              <span>-0.5</span>
            </button>
            <button
              onClick={() => setSpeedValue(currentSpeed + 0.5)}
              className="py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 font-bold text-sm hover:bg-slate-700 active:scale-95 flex items-center justify-center gap-1"
            >
              <ChevronUp className="w-4 h-4 text-emerald-400" />
              <span>+0.5</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2">
            <button
              onClick={() => setSpeedValue(currentSpeed - 0.1)}
              className="py-1 rounded-lg bg-slate-800/60 border border-slate-700/60 text-slate-400 font-mono text-[11px] hover:text-white"
            >
              -0.1
            </button>
            <button
              onClick={() => setSpeedValue(currentSpeed + 0.1)}
              className="py-1 rounded-lg bg-slate-800/60 border border-slate-700/60 text-slate-400 font-mono text-[11px] hover:text-white"
            >
              +0.1
            </button>
          </div>
        </div>

        {/* Incline Adjustment */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-300">درجة الميل (Incline)</span>
            <span className="font-mono text-xs text-cyan-400 font-bold">{currentIncline.toFixed(1)}%</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setInclineValue(currentIncline - 0.5)}
              className="py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 font-bold text-sm hover:bg-slate-700 active:scale-95 flex items-center justify-center gap-1"
            >
              <ChevronDown className="w-4 h-4 text-rose-400" />
              <span>-0.5%</span>
            </button>
            <button
              onClick={() => setInclineValue(currentIncline + 0.5)}
              className="py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 font-bold text-sm hover:bg-slate-700 active:scale-95 flex items-center justify-center gap-1"
            >
              <ChevronUp className="w-4 h-4 text-cyan-400" />
              <span>+0.5%</span>
            </button>
          </div>

          {/* Quick incline buttons */}
          <div className="grid grid-cols-3 gap-1 mt-2">
            {[0, 1.5, 3.0].map(inc => (
              <button
                key={inc}
                onClick={() => setInclineValue(inc)}
                className={`py-1 rounded-lg border text-[10px] font-mono transition ${
                  Math.abs(currentIncline - inc) < 0.1
                    ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-400 font-bold'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-white'
                }`}
              >
                {inc}%
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* WORKOUT ACTION CONTROLS */}
      <div className="mt-auto pt-2">
        {!isRunning ? (
          <button
            onClick={handleStartWorkout}
            disabled={countdown !== null}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-black text-lg shadow-xl hover:opacity-95 active:scale-98 transition flex items-center justify-center gap-2 glow-emerald cursor-pointer"
          >
            <Play className="w-6 h-6 fill-current" />
            <span>{countdown !== null ? `استعد... ${countdown}` : 'ابدأ تمرين الجري الآن'}</span>
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handlePauseResume}
              className={`py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 border transition ${
                isPaused
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 hover:bg-emerald-400'
                  : 'bg-amber-500/20 text-amber-400 border-amber-500/40 hover:bg-amber-500/30'
              }`}
            >
              {isPaused ? <Play className="w-5 h-5 fill-current" /> : <Pause className="w-5 h-5" />}
              <span>{isPaused ? 'استئناف الجري' : 'توقف مؤقت'}</span>
            </button>

            <button
              onClick={handleFinishWorkout}
              className="py-3.5 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 hover:bg-rose-500/30 font-bold text-sm flex items-center justify-center gap-2 transition"
            >
              <Square className="w-5 h-5 fill-current" />
              <span>إنهاء وحفظ التمرين</span>
            </button>
          </div>
        )}
      </div>

      {/* FULL COMPLETION MODAL */}
      {showCompletionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700 p-6 shadow-2xl relative text-right space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-400 mb-2 glow-emerald">
                <Sparkles className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-black text-white">عاش يا بطل! تمرين ممتاز 🎉</h2>
              <p className="text-xs text-slate-400 mt-1">تم إكمال تمرين الجري على المشاية بنجاح باهر</p>
            </div>

            {/* Workout Summary Stats Grid */}
            <div className="grid grid-cols-2 gap-2.5 p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
              <div className="p-2 text-center">
                <span className="text-[10px] text-slate-400 block">الوقت المنقضي</span>
                <span className="font-digital text-xl font-bold text-cyan-400">
                  {Math.round(secondsElapsed / 60)} دقيقة
                </span>
              </div>
              <div className="p-2 text-center">
                <span className="text-[10px] text-slate-400 block">المسافة الإجمالية</span>
                <span className="font-digital text-xl font-bold text-emerald-400">
                  {totalDistanceKm.toFixed(2)} كم
                </span>
              </div>
              <div className="p-2 text-center">
                <span className="text-[10px] text-slate-400 block">السعرات المحروقة</span>
                <span className="font-digital text-xl font-bold text-orange-400">
                  {Math.round(caloriesBurned)} سعرة
                </span>
              </div>
              <div className="p-2 text-center">
                <span className="text-[10px] text-slate-400 block">أقصى سرعة بلغتها</span>
                <span className="font-digital text-xl font-bold text-purple-400">
                  {maxSpeedRecorded.toFixed(1)} كم/س
                </span>
              </div>
            </div>

            {/* Perceived Exertion Rating (1-5) */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                ما هو تقييمك لجهدك في هذا التمرين؟
              </label>
              <div className="flex justify-between gap-1.5">
                {[
                  { val: 1, label: 'خفيف جداً' },
                  { val: 2, label: 'مريح' },
                  { val: 3, label: 'متوسط وحارق' },
                  { val: 4, label: 'تحدي قوي' },
                  { val: 5, label: 'أقصى طاقة' },
                ].map(item => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => setWorkoutRating(item.val)}
                    className={`flex-1 py-2 px-1 rounded-xl text-center border text-[11px] font-semibold transition ${
                      workoutRating === item.val
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                        : 'bg-slate-800/80 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div>{item.val}★</div>
                    <div className="text-[9px] mt-0.5 opacity-80">{item.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                ملاحظات أو شعورك اليوم (اختياري):
              </label>
              <input
                type="text"
                value={workoutNotes}
                onChange={e => setWorkoutNotes(e.target.value)}
                placeholder="مثال: النفس كان منتظم، زدت السرعة في آخر دقيقتين..."
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Submit / Save Button */}
            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={handleSaveAndClose}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-sm shadow hover:opacity-95 transition flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>حفظ في سجل الجري</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
