import React, { useState, useEffect } from 'react';
import {
  Home,
  Gauge,
  TrendingDown,
  Calendar,
  Sparkles,
  Scale,
  Bell,
  Settings,
  Play,
  Flame,
  Timer,
  Target,
  ArrowDownRight,
  Plus,
  Zap,
  CheckCircle2,
  Clock,
  Heart,
  Smartphone,
  QrCode,
  Sun,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import {
  UserProfile,
  FavoriteSpeedProfile,
  WorkoutSchedule,
  WorkoutLog,
  WeightLog,
  AppNotification,
} from './types';
import {
  INITIAL_USER_PROFILE,
  INITIAL_SPEED_PROFILES,
  INITIAL_SCHEDULES,
  INITIAL_WORKOUT_LOGS,
  INITIAL_WEIGHT_LOGS,
  INITIAL_NOTIFICATIONS,
  HEALTH_BENEFITS,
  MOTIVATIONAL_QUOTES,
} from './data/initialData';
import { LiveTreadmillConsole } from './components/LiveTreadmillConsole';
import { ProgressCharts } from './components/ProgressCharts';
import { ScheduleAndReminders } from './components/ScheduleAndReminders';
import { SpeedProfilesManager } from './components/SpeedProfilesManager';
import { HealthBenefitsSection } from './components/HealthBenefitsSection';
import { WeightAndWorkoutsLog } from './components/WeightAndWorkoutsLog';
import { UserProfileModal } from './components/UserProfileModal';
import { NotificationsModal } from './components/NotificationsModal';
import { PWAInstallButton } from './components/PWAInstallButton';
import { MobileFrameWrapper } from './components/MobileFrameWrapper';
import { MobileInstallHubModal } from './components/MobileInstallHubModal';
import { MobileQuickActionSheet } from './components/MobileQuickActionSheet';
import { OfflineStatusBanner } from './components/OfflineStatusBanner';
import { useWakeLock } from './hooks/useWakeLock';
import { NotificationService } from './utils/notificationService';
import { audioCoach } from './utils/audioCoach';

type ActiveTab = 'home' | 'console' | 'charts' | 'schedule' | 'speeds' | 'benefits' | 'logs';

export default function App() {
  // Persistence with localStorage
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('treadmill_user_profile');
    return saved ? JSON.parse(saved) : INITIAL_USER_PROFILE;
  });

  const [speedProfiles, setSpeedProfiles] = useState<FavoriteSpeedProfile[]>(() => {
    const saved = localStorage.getItem('treadmill_speed_profiles');
    return saved ? JSON.parse(saved) : INITIAL_SPEED_PROFILES;
  });

  const [schedules, setSchedules] = useState<WorkoutSchedule[]>(() => {
    const saved = localStorage.getItem('treadmill_schedules');
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULES;
  });

  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>(() => {
    const saved = localStorage.getItem('treadmill_workout_logs');
    return saved ? JSON.parse(saved) : INITIAL_WORKOUT_LOGS;
  });

  const [weightLogs, setWeightLogs] = useState<WeightLog[]>(() => {
    const saved = localStorage.getItem('treadmill_weight_logs');
    return saved ? JSON.parse(saved) : INITIAL_WEIGHT_LOGS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('treadmill_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Current active view
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');

  // Modals state
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState<boolean>(false);
  const [showInstallHubModal, setShowInstallHubModal] = useState<boolean>(false);
  const [showQuickActions, setShowQuickActions] = useState<boolean>(false);

  // Active workout running tracking (for Dynamic Island & background activity pill)
  const [activeWorkoutInfo, setActiveWorkoutInfo] = useState<{
    isRunning: boolean;
    speed: number;
    secondsElapsed: number;
    calories: number;
  } | null>(null);

  // Wake Lock for mobile screen
  const { isActive: isWakeLockActive, toggleWakeLock } = useWakeLock();

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('treadmill_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('treadmill_speed_profiles', JSON.stringify(speedProfiles));
  }, [speedProfiles]);

  useEffect(() => {
    localStorage.setItem('treadmill_schedules', JSON.stringify(schedules));
  }, [schedules]);

  useEffect(() => {
    localStorage.setItem('treadmill_workout_logs', JSON.stringify(workoutLogs));
  }, [workoutLogs]);

  useEffect(() => {
    localStorage.setItem('treadmill_weight_logs', JSON.stringify(weightLogs));
  }, [weightLogs]);

  useEffect(() => {
    localStorage.setItem('treadmill_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Derived stats
  const currentWeight = weightLogs.length > 0
    ? weightLogs[weightLogs.length - 1].weightKg
    : userProfile.currentWeightKg;
  const totalWeightLost = Math.max(0, userProfile.startWeightKg - currentWeight);
  const remainingWeight = Math.max(0, currentWeight - userProfile.targetWeightKg);
  const progressPercent = Math.min(
    100,
    Math.round((totalWeightLost / Math.max(1, userProfile.startWeightKg - userProfile.targetWeightKg)) * 100)
  );

  // Weekly minutes sum (past 7 days)
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const weeklyMinutesLogged = workoutLogs
    .filter(w => new Date(w.date) >= oneWeekAgo)
    .reduce((acc, curr) => acc + curr.durationMinutes, 0);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Handlers
  const handleSaveWorkout = (newLogData: Omit<WorkoutLog, 'id'>) => {
    const newWorkout: WorkoutLog = {
      id: 'w-' + Date.now(),
      ...newLogData,
    };
    setWorkoutLogs(prev => [...prev, newWorkout]);
    setActiveWorkoutInfo(null);
    setActiveTab('charts');
  };

  const handleAddWeightLog = (newWeightData: Omit<WeightLog, 'id'>) => {
    const newLog: WeightLog = {
      id: 'wt-' + Date.now(),
      ...newWeightData,
    };
    setWeightLogs(prev => [...prev, newLog]);
    setUserProfile(prev => ({ ...prev, currentWeightKg: newWeightData.weightKg }));
  };

  const handleDeleteWeightLog = (id: string) => {
    setWeightLogs(prev => prev.filter(w => w.id !== id));
  };

  const handleDeleteWorkoutLog = (id: string) => {
    setWorkoutLogs(prev => prev.filter(w => w.id !== id));
  };

  const handleAddSchedule = (scheduleData: Omit<WorkoutSchedule, 'id'>) => {
    const newSch: WorkoutSchedule = {
      id: 'sch-' + Date.now(),
      ...scheduleData,
    };
    setSchedules(prev => [...prev, newSch]);
  };

  const handleDeleteSchedule = (id: string) => {
    setSchedules(prev => prev.filter(s => s.id !== id));
  };

  const handleToggleSchedule = (id: string) => {
    setSchedules(prev =>
      prev.map(s => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const handleSaveSpeedProfile = (profile: FavoriteSpeedProfile) => {
    setSpeedProfiles(prev => {
      const exists = prev.some(p => p.id === profile.id);
      if (exists) {
        return prev.map(p => (p.id === profile.id ? profile : p));
      } else {
        return [...prev, profile];
      }
    });
  };

  const handleDeleteSpeedProfile = (id: string) => {
    setSpeedProfiles(prev => prev.filter(p => p.id !== id));
  };

  const handleSetDefaultSpeedProfile = (id: string) => {
    setSpeedProfiles(prev =>
      prev.map(p => ({ ...p, isDefault: p.id === id }))
    );
  };

  const handleTriggerNotification = (notifData: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: AppNotification = {
      id: 'notif-' + Date.now(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notifData,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleResetData = () => {
    setUserProfile(INITIAL_USER_PROFILE);
    setSpeedProfiles(INITIAL_SPEED_PROFILES);
    setSchedules(INITIAL_SCHEDULES);
    setWorkoutLogs(INITIAL_WORKOUT_LOGS);
    setWeightLogs(INITIAL_WEIGHT_LOGS);
    setNotifications(INITIAL_NOTIFICATIONS);
    localStorage.clear();
  };

  // Find today's workout in schedule
  const todayDayIndex = new Date().getDay(); // 0-6
  const todaysSchedule = schedules.find(s => s.dayOfWeek === todayDayIndex && s.enabled);
  const defaultProfile = speedProfiles.find(p => p.isDefault) || speedProfiles[0];

  return (
    <MobileFrameWrapper
      activeWorkoutInfo={activeWorkoutInfo}
      onOpenInstallModal={() => setShowInstallHubModal(true)}
      onOpenQuickActions={() => setShowQuickActions(true)}
    >
      <div className="flex flex-col min-h-full bg-slate-950 text-slate-100 pb-24 selection:bg-emerald-500 selection:text-slate-950 relative">
        {/* Offline Connectivity Banner */}
        <OfflineStatusBanner />

        {/* If live treadmill console is active, show full immersion console */}
        {activeTab === 'console' ? (
          <LiveTreadmillConsole
            userProfile={userProfile}
            speedProfiles={speedProfiles}
            onSaveWorkout={handleSaveWorkout}
            onCancel={() => {
              setActiveWorkoutInfo(null);
              setActiveTab('home');
            }}
            onMinimize={() => setActiveTab('home')}
            onWorkoutTick={info => setActiveWorkoutInfo(info)}
            initialSpeedProfileId={todaysSchedule?.speedProfileId || defaultProfile?.id}
            initialTargetMinutes={todaysSchedule?.targetMinutes || 30}
          />
        ) : (
          <>
            {/* MOBILE APP HEADER */}
            <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-slate-950 shadow-md glow-emerald">
                  <Gauge className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h1 className="text-sm font-black text-white leading-tight">جري المشاية</h1>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                      Mobile App
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">تنظيم الجري وخسارة الوزن</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Mobile Quick Action Sheet Trigger */}
                <button
                  onClick={() => setShowQuickActions(true)}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 hover:text-amber-300 hover:bg-slate-800 transition"
                  title="إجراءات الموبايل السريعة"
                >
                  <Zap className="w-4 h-4 fill-amber-400/20" />
                </button>

                {/* PWA Install Button */}
                <PWAInstallButton onOpenHub={() => setShowInstallHubModal(true)} />

                {/* Notifications Button */}
                <button
                  onClick={() => setShowNotificationsModal(true)}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 relative transition"
                  title="الإشعارات والتذكيرات"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[9px] flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Profile & Settings Button */}
                <button
                  onClick={() => setShowSettingsModal(true)}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition"
                  title="الملف الشخصي والإعدادات"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </header>

            {/* MAIN SCREEN ROUTING */}
            <main className="flex-1 p-4 space-y-4 animate-in fade-in">
              {/* ACTIVE WORKOUT FLOATING MINI-PLAYER (If console is minimized) */}
              {activeWorkoutInfo && activeWorkoutInfo.isRunning && (
                <div
                  onClick={() => setActiveTab('console')}
                  className="bg-emerald-500/20 border-2 border-emerald-500/70 rounded-2xl p-3 flex items-center justify-between cursor-pointer shadow-lg glow-emerald animate-pulse hover:bg-emerald-500/30 transition"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-400 text-slate-950 flex items-center justify-center font-black">
                      <Play className="w-4 h-4 fill-slate-950" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-white flex items-center gap-2">
                        <span>تمرين المشاية جاري بالخلفية</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/40 text-emerald-200 font-digital" dir="ltr">
                          {Math.floor(activeWorkoutInfo.secondsElapsed / 60)}:{(activeWorkoutInfo.secondsElapsed % 60).toString().padStart(2, '0')}
                        </span>
                      </p>
                      <p className="text-[11px] text-emerald-300">
                        السرعة: {activeWorkoutInfo.speed.toFixed(1)} كم/س | السعرات: {activeWorkoutInfo.calories} Kcal
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-300 flex items-center gap-1">
                    <span>فتح اللوحة</span>
                    <span>➔</span>
                  </span>
                </div>
              )}

              {/* VIEW 1: HOME DASHBOARD */}
              {activeTab === 'home' && (
                <div className="space-y-4">
                  {/* User Greeting & Today Status */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-black text-white flex items-center gap-1.5">
                        <span>مرحباً {userProfile.name}</span>
                        <span className="text-emerald-400">🏃‍♂️</span>
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {todaysSchedule
                          ? `اليوم موعد جري: ${todaysSchedule.targetMinutes} دقيقة (${todaysSchedule.time})`
                          : 'يوم رائع للركض وحرق السعرات على المشاية!'}
                      </p>
                    </div>

                    <button
                      onClick={() => setActiveTab('schedule')}
                      className="text-xs text-emerald-400 font-semibold hover:underline flex items-center gap-1"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>الجدول</span>
                    </button>
                  </div>

                  {/* BIG HERO CARD: START TREADMILL WORKOUT */}
                  <div className="relative bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800 rounded-3xl p-5 text-slate-950 shadow-2xl overflow-hidden glow-emerald">
                    <div className="absolute -top-12 -right-12 w-44 h-44 bg-white/10 rounded-full blur-xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col justify-between min-h-[140px]">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="px-2.5 py-1 rounded-full bg-slate-950/20 text-white backdrop-blur-sm text-[11px] font-bold">
                            جاهز للمشاية الآن
                          </span>
                          <h3 className="text-xl font-black text-white mt-2 leading-tight">
                            {todaysSchedule ? todaysSchedule.title : defaultProfile.name}
                          </h3>
                          <p className="text-xs text-white/80 mt-1">
                            السرعات المحببة: {defaultProfile.warmupSpeed} ➔ {defaultProfile.sprintSpeed} كم/س
                          </p>
                        </div>

                        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0">
                          <Gauge className="w-7 h-7" />
                        </div>
                      </div>

                      <div className="pt-4 flex items-center gap-2">
                        <button
                          onClick={() => {
                            audioCoach.vibrate(100);
                            setActiveTab('console');
                          }}
                          className="flex-1 py-3 px-4 rounded-2xl bg-white text-slate-950 font-black text-sm shadow-xl hover:bg-slate-100 active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Play className="w-5 h-5 fill-current" />
                          <span>تشغيل لوحة المشاية الذكية</span>
                        </button>

                        <button
                          onClick={() => setActiveTab('speeds')}
                          className="p-3 rounded-2xl bg-slate-950/25 hover:bg-slate-950/40 text-white transition"
                          title="تغيير برنامج السرعات المحببة"
                        >
                          <Zap className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* MOBILE APP PWA INSTALL & SMARTPHONE HUB CARD */}
                  <div className="relative bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-500/30 rounded-3xl p-4 shadow-lg overflow-hidden">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-black shadow-md shrink-0">
                          <Smartphone className="w-6 h-6 stroke-[2.5]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-black text-white">تطبيق الموبايل المستقل</h4>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                              PWA App
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-300 mt-0.5">
                            ثبّته على هاتفك واجري بدون إنترنت وشاشة لا تنطفئ!
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => setShowInstallHubModal(true)}
                        className="px-3.5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs shadow hover:bg-emerald-400 active:scale-95 transition flex items-center gap-1.5 shrink-0"
                      >
                        <QrCode className="w-4 h-4" />
                        <span>تثبيت / QR</span>
                      </button>
                    </div>
                  </div>

                  {/* QUICK STATS CARDS: WEIGHT LOSS & RUNNING MINUTES */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Weight Card */}
                    <div
                      onClick={() => setActiveTab('charts')}
                      className="bg-slate-900 border border-slate-800 rounded-3xl p-4 flex flex-col justify-between cursor-pointer hover:border-slate-700 transition"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                          <Scale className="w-3.5 h-3.5 text-emerald-400" />
                          <span>خسارة الوزن</span>
                        </span>
                        <ArrowDownRight className="w-4 h-4 text-emerald-400" />
                      </div>

                      <div>
                        <div className="font-digital text-2xl font-black text-emerald-400">
                          -{totalWeightLost.toFixed(1)} <span className="text-xs font-normal text-slate-400">كجم</span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1">
                          الوزن: {currentWeight} كجم (الهدف: {userProfile.targetWeightKg})
                        </div>
                      </div>

                      {/* Mini progress bar */}
                      <div className="mt-3 w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Weekly Minutes Card */}
                    <div
                      onClick={() => setActiveTab('charts')}
                      className="bg-slate-900 border border-slate-800 rounded-3xl p-4 flex flex-col justify-between cursor-pointer hover:border-slate-700 transition"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                          <Timer className="w-3.5 h-3.5 text-cyan-400" />
                          <span>دقائق هذا الأسبوع</span>
                        </span>
                        <span className="text-[10px] text-cyan-400 font-mono">
                          {Math.round((weeklyMinutesLogged / userProfile.weeklyTargetMinutes) * 100)}%
                        </span>
                      </div>

                      <div>
                        <div className="font-digital text-2xl font-black text-cyan-400">
                          {weeklyMinutesLogged}{' '}
                          <span className="text-xs font-normal text-slate-400">/ {userProfile.weeklyTargetMinutes} د</span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1">
                          {weeklyMinutesLogged >= userProfile.weeklyTargetMinutes
                            ? 'حققت الهدف الأسبوعي! 🎯'
                            : `متبقي ${userProfile.weeklyTargetMinutes - weeklyMinutesLogged} دقيقة`}
                        </div>
                      </div>

                      {/* Mini progress bar */}
                      <div className="mt-3 w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-cyan-400 h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(100, (weeklyMinutesLogged / userProfile.weeklyTargetMinutes) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* QUICK ACTIONS ROW */}
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setActiveTab('logs')}
                      className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 active:scale-95 transition flex flex-col items-center justify-center text-center gap-1.5 text-xs text-slate-300"
                    >
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                        <Scale className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-[11px]">تسجيل وزن اليوم</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('schedule')}
                      className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 active:scale-95 transition flex flex-col items-center justify-center text-center gap-1.5 text-xs text-slate-300"
                    >
                      <div className="w-8 h-8 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-[11px]">مواعيد التذكير</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('speeds')}
                      className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 active:scale-95 transition flex flex-col items-center justify-center text-center gap-1.5 text-xs text-slate-300"
                    >
                      <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center">
                        <Gauge className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-[11px]">السرعات المفضلة</span>
                    </button>
                  </div>

                  {/* FEATURED HEALTH BENEFIT CARD */}
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
                          <Flame className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-orange-400">تذكير بفوائد الجري وخسارة الدهون</span>
                      </div>
                      <button
                        onClick={() => setActiveTab('benefits')}
                        className="text-[11px] text-slate-400 hover:text-white"
                      >
                        المزيد ➔
                      </button>
                    </div>

                    <h4 className="text-xs font-bold text-white mb-1">{HEALTH_BENEFITS[0].title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed mb-2">{HEALTH_BENEFITS[0].description}</p>
                    <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{HEALTH_BENEFITS[0].highlightStat}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW 2: PROGRESS CHARTS */}
              {activeTab === 'charts' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-white flex items-center gap-1.5">
                        <TrendingDown className="w-5 h-5 text-emerald-400" />
                        <span>الرسوم البيانية لمتابعة التقدم</span>
                      </h2>
                      <p className="text-xs text-slate-400">متابعة خسارة الوزن، ودقائق الجري والسرعات</p>
                    </div>
                  </div>

                  <ProgressCharts
                    weightLogs={weightLogs}
                    workoutLogs={workoutLogs}
                    userProfile={userProfile}
                  />
                </div>
              )}

              {/* VIEW 3: SCHEDULES & NOTIFICATIONS */}
              {activeTab === 'schedule' && (
                <ScheduleAndReminders
                  schedules={schedules}
                  speedProfiles={speedProfiles}
                  userProfile={userProfile}
                  onUpdateUserProfile={up => setUserProfile(prev => ({ ...prev, ...up }))}
                  onAddSchedule={handleAddSchedule}
                  onDeleteSchedule={handleDeleteSchedule}
                  onToggleSchedule={handleToggleSchedule}
                  onTriggerNotification={handleTriggerNotification}
                />
              )}

              {/* VIEW 4: SPEED PROFILES MANAGER */}
              {activeTab === 'speeds' && (
                <SpeedProfilesManager
                  speedProfiles={speedProfiles}
                  onSaveProfile={handleSaveSpeedProfile}
                  onDeleteProfile={handleDeleteSpeedProfile}
                  onSetDefault={handleSetDefaultSpeedProfile}
                />
              )}

              {/* VIEW 5: HEALTH BENEFITS & MOTIVATION */}
              {activeTab === 'benefits' && <HealthBenefitsSection />}

              {/* VIEW 6: LOGS HISTORY */}
              {activeTab === 'logs' && (
                <WeightAndWorkoutsLog
                  weightLogs={weightLogs}
                  workoutLogs={workoutLogs}
                  userProfile={userProfile}
                  onAddWeightLog={handleAddWeightLog}
                  onDeleteWeightLog={handleDeleteWeightLog}
                  onAddWorkoutLog={handleSaveWorkout}
                  onDeleteWorkoutLog={handleDeleteWorkoutLog}
                />
              )}
            </main>

            {/* MOBILE BOTTOM NAVIGATION BAR */}
            <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-2 max-w-xl mx-auto pb-safe">
              <div className="flex items-center justify-around">
                <button
                  onClick={() => {
                    audioCoach.vibrate(30);
                    setActiveTab('home');
                  }}
                  className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition ${
                    activeTab === 'home' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Home className="w-5 h-5 mb-0.5" />
                  <span className="text-[10px]">الرئيسية</span>
                </button>

                <button
                  onClick={() => {
                    audioCoach.vibrate(30);
                    setActiveTab('charts');
                  }}
                  className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition ${
                    activeTab === 'charts' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <TrendingDown className="w-5 h-5 mb-0.5" />
                  <span className="text-[10px]">الرسوم</span>
                </button>

                {/* Center Treadmill Live Console Button */}
                <button
                  onClick={() => {
                    audioCoach.vibrate(60);
                    setActiveTab('console');
                  }}
                  className="flex flex-col items-center justify-center -mt-5"
                >
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 flex items-center justify-center text-slate-950 shadow-xl glow-emerald active:scale-95 transition">
                    <Gauge className="w-7 h-7 stroke-[2.5]" />
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 mt-1">المشاية</span>
                </button>

                <button
                  onClick={() => {
                    audioCoach.vibrate(30);
                    setActiveTab('schedule');
                  }}
                  className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition ${
                    activeTab === 'schedule' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Calendar className="w-5 h-5 mb-0.5" />
                  <span className="text-[10px]">المواعيد</span>
                </button>

                <button
                  onClick={() => {
                    audioCoach.vibrate(30);
                    setActiveTab('benefits');
                  }}
                  className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition ${
                    activeTab === 'benefits' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sparkles className="w-5 h-5 mb-0.5" />
                  <span className="text-[10px]">الفوائد</span>
                </button>

                <button
                  onClick={() => {
                    audioCoach.vibrate(30);
                    setActiveTab('logs');
                  }}
                  className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition ${
                    activeTab === 'logs' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Scale className="w-5 h-5 mb-0.5" />
                  <span className="text-[10px]">السجل</span>
                </button>
              </div>
            </nav>
          </>
        )}

        {/* USER PROFILE MODAL */}
        {showSettingsModal && (
          <UserProfileModal
            userProfile={userProfile}
            onSave={updated => setUserProfile(updated)}
            onClose={() => setShowSettingsModal(false)}
            onResetData={handleResetData}
          />
        )}

        {/* NOTIFICATIONS MODAL */}
        {showNotificationsModal && (
          <NotificationsModal
            notifications={notifications}
            onClose={() => setShowNotificationsModal(false)}
            onMarkAllAsRead={() =>
              setNotifications(prev => prev.map(n => ({ ...n, read: true })))
            }
            onClearAll={() => setNotifications([])}
            onSelectNotification={notif => {
              setNotifications(prev =>
                prev.map(n => (n.id === notif.id ? { ...n, read: true } : n))
              );
              if (notif.type === 'weekly_weight') {
                setActiveTab('logs');
              } else if (notif.type === 'workout_reminder') {
                setActiveTab('console');
              } else if (notif.type === 'monthly_report') {
                setActiveTab('charts');
              } else if (notif.type === 'benefit_motivation') {
                setActiveTab('benefits');
              }
              setShowNotificationsModal(false);
            }}
          />
        )}

        {/* MOBILE INSTALLATION HUB MODAL (QR Code & Native Install) */}
        {showInstallHubModal && (
          <MobileInstallHubModal onClose={() => setShowInstallHubModal(false)} />
        )}

        {/* MOBILE QUICK ACTION SHEET */}
        <MobileQuickActionSheet
          isOpen={showQuickActions}
          onClose={() => setShowQuickActions(false)}
          onStartWorkout={() => setActiveTab('console')}
          onOpenWeightLog={() => setActiveTab('logs')}
          onOpenSchedule={() => setActiveTab('schedule')}
          onOpenInstallHub={() => setShowInstallHubModal(true)}
          isWakeLockActive={isWakeLockActive}
          onToggleWakeLock={toggleWakeLock}
        />
      </div>
    </MobileFrameWrapper>
  );
}
