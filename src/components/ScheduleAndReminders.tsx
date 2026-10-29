import React, { useState } from 'react';
import {
  Bell,
  Calendar,
  Clock,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Send,
  Zap,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
} from 'lucide-react';
import { FavoriteSpeedProfile, UserProfile, WorkoutSchedule, AppNotification } from '../types';
import { NotificationService } from '../utils/notificationService';
import { audioCoach } from '../utils/audioCoach';

interface ScheduleAndRemindersProps {
  schedules: WorkoutSchedule[];
  speedProfiles: FavoriteSpeedProfile[];
  userProfile: UserProfile;
  onUpdateUserProfile: (updated: Partial<UserProfile>) => void;
  onAddSchedule: (schedule: Omit<WorkoutSchedule, 'id'>) => void;
  onDeleteSchedule: (id: string) => void;
  onToggleSchedule: (id: string) => void;
  onTriggerNotification: (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
}

const ARABIC_DAYS = [
  'الأحد',
  'الإثنين',
  'الثلاثاء',
  'الأربعاء',
  'الخميس',
  'الجمعة',
  'السبت',
];

export const ScheduleAndReminders: React.FC<ScheduleAndRemindersProps> = ({
  schedules,
  speedProfiles,
  userProfile,
  onUpdateUserProfile,
  onAddSchedule,
  onDeleteSchedule,
  onToggleSchedule,
  onTriggerNotification,
}) => {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newDay, setNewDay] = useState<number>(1);
  const [newTime, setNewTime] = useState<string>('18:30');
  const [newMinutes, setNewMinutes] = useState<number>(35);
  const [newSpeedProfileId, setNewSpeedProfileId] = useState<string>(speedProfiles[0]?.id || '');
  const [newTitle, setNewTitle] = useState<string>('');

  const [testNotificationSent, setTestNotificationSent] = useState<boolean>(false);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>(
    NotificationService.getPermission()
  );

  // Request browser permission
  const handleRequestPermission = async () => {
    const granted = await NotificationService.requestPermission();
    setPermissionStatus(NotificationService.getPermission());
    if (granted) {
      onUpdateUserProfile({ notificationsEnabled: true });
      audioCoach.playTone(800, 'sine', 0.2);
    }
  };

  // Test send immediate push notification
  const handleSendTestNotification = () => {
    const title = '🏃‍♂️ تذكير: حان موعد تمرين الجري على المشاية!';
    const body = `برنامج السرعة المفضل لديك بانتظارك. اليوم هدفك الجري لمدة 35 دقيقة لحرق المزيد من السعرات والدهون! 💪`;

    // Try native system push
    NotificationService.sendSystemNotification(title, {
      body,
      icon: '/icon.svg',
    });

    // Also dispatch into in-app notifications
    onTriggerNotification({
      title,
      message: body,
      type: 'workout_reminder',
    });

    audioCoach.playSpeedChangeChime();
    audioCoach.vibrate([100, 50, 100]);

    setTestNotificationSent(true);
    setTimeout(() => setTestNotificationSent(false), 3500);
  };

  // Trigger weekly weight reminder test
  const handleSendWeightReminderTest = () => {
    const title = '⚖️ صباح الخير يا بطل! موعد وزنك الأسبوعي';
    const body = `تذكر قياس وزنك في نفس التوقيت صباحاً قبل الإفطار لتسجيل النزول الجديد على التطبيق ومتابعة الرسم البياني! 🎯`;

    NotificationService.sendSystemNotification(title, { body });

    onTriggerNotification({
      title,
      message: body,
      type: 'weekly_weight',
    });

    audioCoach.playTone(600, 'sine', 0.2);
    audioCoach.vibrate([150, 80, 150]);

    setTestNotificationSent(true);
    setTimeout(() => setTestNotificationSent(false), 3500);
  };

  // Handle adding new schedule
  const handleAddNewSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    onAddSchedule({
      dayOfWeek: Number(newDay),
      time: newTime,
      targetMinutes: Number(newMinutes),
      speedProfileId: newSpeedProfileId || speedProfiles[0]?.id || '',
      title: newTitle.trim() || `تمرين ${ARABIC_DAYS[newDay]} على المشاية`,
      enabled: true,
    });

    setNewTitle('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-5 text-slate-100">
      {/* NOTIFICATION PERMISSION & STATUS CARD */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 rounded-3xl p-4 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">تنبيهات وإشعارات الموبايل</h3>
              <p className="text-[11px] text-slate-400">تذكير بالمواعيد، والوزن، والفوائد</p>
            </div>
          </div>

          {permissionStatus === 'granted' ? (
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>مفعلة</span>
            </span>
          ) : (
            <button
              onClick={handleRequestPermission}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-xs font-bold shadow hover:opacity-95 transition"
            >
              تفعيل الإشعارات
            </button>
          )}
        </div>

        {/* Test Notification Trigger Buttons */}
        <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2">
          <button
            onClick={handleSendTestNotification}
            className="py-2 px-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition"
          >
            <Send className="w-3.5 h-3.5 text-emerald-400" />
            <span>تجربة إشعار التمرين</span>
          </button>

          <button
            onClick={handleSendWeightReminderTest}
            className="py-2 px-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition"
          >
            <Send className="w-3.5 h-3.5 text-cyan-400" />
            <span>تجربة إشعار ميزان الوزن</span>
          </button>
        </div>

        {testNotificationSent && (
          <div className="mt-2.5 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs text-center flex items-center justify-center gap-1.5 animate-in fade-in">
            <CheckCircle className="w-4 h-4" />
            <span>تم إرسال التنبيه التجريبي بنجاح! تفقّد شاشة هاتفك أو الإشعارات.</span>
          </div>
        )}
      </div>

      {/* SCHEDULE SETTINGS: WEEKLY & MONTHLY REMINDER DAYS */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 space-y-4">
        <h3 className="text-xs font-bold text-slate-300 flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span>مواعيد التذكيرات الدورية:</span>
        </h3>

        {/* Weekly Weight Check-in Setting */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>تذكير قياس الوزن الأسبوعي</span>
              <span className="text-emerald-400">⚖️</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              كل {ARABIC_DAYS[userProfile.weeklyReminderDay]} الساعة {userProfile.weeklyReminderTime}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={userProfile.weeklyReminderDay}
              onChange={e => onUpdateUserProfile({ weeklyReminderDay: Number(e.target.value) })}
              className="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              {ARABIC_DAYS.map((day, idx) => (
                <option key={idx} value={idx}>
                  {day}
                </option>
              ))}
            </select>

            <input
              type="time"
              value={userProfile.weeklyReminderTime}
              onChange={e => onUpdateUserProfile({ weeklyReminderTime: e.target.value })}
              className="bg-slate-900 border border-slate-700 rounded-xl px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>
        </div>

        {/* Monthly Review Reminder Setting */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>تذكير التقرير والتقييم الشهري</span>
              <span className="text-cyan-400">📊</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              يوم {userProfile.monthlyReminderDay} من كل شهر ميلادي
            </div>
          </div>

          <select
            value={userProfile.monthlyReminderDay}
            onChange={e => onUpdateUserProfile({ monthlyReminderDay: Number(e.target.value) })}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            {[1, 5, 10, 15, 20, 25, 28].map(day => (
              <option key={day} value={day}>
                يوم {day}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* WEEKLY TREADMILL WORKOUT SCHEDULES */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>جدول تمرينات المشاية الأسبوعي</span>
            </h3>
            <p className="text-[11px] text-slate-400">مواعيدك المنظمة مع السرعات المحببة لكل يوم</p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold hover:bg-emerald-500/30 transition flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة موعد</span>
          </button>
        </div>

        {/* List of Scheduled Workouts */}
        <div className="space-y-2.5">
          {schedules.map(sch => {
            const profile = speedProfiles.find(p => p.id === sch.speedProfileId) || speedProfiles[0];

            return (
              <div
                key={sch.id}
                className={`p-3.5 rounded-2xl border transition flex items-center justify-between ${
                  sch.enabled
                    ? 'bg-slate-900/90 border-slate-800'
                    : 'bg-slate-950/60 border-slate-800/40 opacity-55'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center font-bold shrink-0 ${
                      sch.enabled
                        ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    <span className="text-[10px] leading-none mb-0.5">{ARABIC_DAYS[sch.dayOfWeek]}</span>
                    <span className="text-xs font-mono font-bold leading-none">{sch.time}</span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-white">{sch.title}</h4>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                      <span className="text-cyan-400 font-mono font-medium">{sch.targetMinutes} دقيقة</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-medium truncate max-w-[140px]">
                        {profile?.name || 'السرعات المحببة'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onToggleSchedule(sch.id)}
                    className="p-1 text-slate-400 hover:text-white transition"
                    title={sch.enabled ? 'إيقاف التنبيه مؤقتاً' : 'تفعيل التنبيه'}
                  >
                    {sch.enabled ? (
                      <ToggleRight className="w-6 h-6 text-emerald-400" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-slate-600" />
                    )}
                  </button>

                  <button
                    onClick={() => onDeleteSchedule(sch.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                    title="حذف هذا الموعد"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ADD SCHEDULE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-700 p-6 text-slate-100 shadow-2xl relative">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-400" />
              <span>إضافة موعد جري أسبوعي جديد</span>
            </h3>

            <form onSubmit={handleAddNewSchedule} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">اليوم في الأسبوع:</label>
                <select
                  value={newDay}
                  onChange={e => setNewDay(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  {ARABIC_DAYS.map((day, idx) => (
                    <option key={idx} value={idx}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">وقت التنبيه:</label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={e => setNewTime(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">المدة (دقائق):</label>
                  <input
                    type="number"
                    min="10"
                    max="120"
                    value={newMinutes}
                    onChange={e => setNewMinutes(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">برنامج السرعات المحبب:</label>
                <select
                  value={newSpeedProfileId}
                  onChange={e => setNewSpeedProfileId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  {speedProfiles.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.warmupSpeed} ➔ {p.sprintSpeed} كم/س)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">اسم أو وصف الموعد:</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="مثال: جري بعد العمل لتصفية الذهن"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold hover:opacity-95 transition"
                >
                  إضافة للجدول
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
