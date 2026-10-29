import React from 'react';
import { Bell, CheckCheck, Trash2, X, Scale, Calendar, Sparkles, CheckCircle2 } from 'lucide-react';
import { AppNotification } from '../types';

interface NotificationsModalProps {
  notifications: AppNotification[];
  onClose: () => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onSelectNotification?: (notif: AppNotification) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  notifications,
  onClose,
  onMarkAllAsRead,
  onClearAll,
  onSelectNotification,
}) => {
  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'weekly_weight':
        return <Scale className="w-4 h-4 text-emerald-400" />;
      case 'workout_reminder':
        return <Calendar className="w-4 h-4 text-cyan-400" />;
      case 'benefit_motivation':
        return <Sparkles className="w-4 h-4 text-amber-400" />;
      case 'monthly_report':
        return <CheckCircle2 className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700 p-6 text-slate-100 shadow-2xl relative max-h-[85vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">مركز الإشعارات والتذكيرات</h2>
            <p className="text-xs text-slate-400">تنبيهات مواعيد المشاية ومتابعة الوزن الأسبوعية</p>
          </div>
        </div>

        {/* Action bar */}
        {notifications.length > 0 && (
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs">
            <button
              onClick={onMarkAllAsRead}
              className="text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>تحديد الكل كمقروء</span>
            </button>
            <button
              onClick={onClearAll}
              className="text-slate-500 hover:text-rose-400 flex items-center gap-1 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>مسح السجل</span>
            </button>
          </div>
        )}

        {/* List of notifications */}
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-2.5 pr-1">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">لا توجد إشعارات جديدة حالياً</div>
          ) : (
            notifications.map(n => (
              <div
                key={n.id}
                onClick={() => onSelectNotification && onSelectNotification(n)}
                className={`p-3.5 rounded-2xl border text-right transition cursor-pointer ${
                  n.read
                    ? 'bg-slate-950/60 border-slate-800/80 text-slate-400'
                    : 'bg-slate-800/80 border-emerald-500/40 text-slate-200 ring-1 ring-emerald-500/20'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center">
                      {getIcon(n.type)}
                    </div>
                    <h3 className={`text-xs font-bold ${n.read ? 'text-slate-300' : 'text-white'}`}>
                      {n.title}
                    </h3>
                  </div>

                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                </div>

                <p className="text-xs leading-relaxed pr-9 text-slate-300">
                  {n.message}
                </p>

                <div className="text-[10px] text-slate-500 pr-9 mt-1 font-mono">
                  {new Date(n.timestamp).toLocaleDateString('ar-EG', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 transition"
        >
          إغلاق
        </button>
      </div>
    </div>
  );
};
