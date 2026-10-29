/**
 * Application types for Treadmill & Weight Loss Coach
 */

export interface UserProfile {
  name: string;
  gender: 'male' | 'female';
  heightCm: number;
  startWeightKg: number;
  targetWeightKg: number;
  currentWeightKg: number;
  weeklyTargetMinutes: number;
  weeklyReminderDay: number; // 0=Sunday, 5=Friday, 6=Saturday
  weeklyReminderTime: string; // e.g. "09:00"
  monthlyReminderDay: number; // 1-28
  notificationsEnabled: boolean;
  voiceCoachEnabled: boolean;
  soundEffectsEnabled: boolean;
  vibrationEnabled: boolean;
}

export interface FavoriteSpeedProfile {
  id: string;
  name: string;
  description: string;
  warmupSpeed: number; // km/h
  jogSpeed: number;    // km/h
  fastRunSpeed: number;// km/h
  sprintSpeed: number; // km/h
  coolDownSpeed: number;// km/h
  defaultIncline: number; // percentage %
  isDefault?: boolean;
}

export interface WorkoutSchedule {
  id: string;
  dayOfWeek: number; // 0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday
  time: string;      // "18:30"
  targetMinutes: number;
  speedProfileId: string;
  title: string;
  enabled: boolean;
}

export interface WorkoutLog {
  id: string;
  date: string; // ISO date
  durationMinutes: number;
  distanceKm: number;
  avgSpeedKmH: number;
  maxSpeedKmH: number;
  incline: number;
  caloriesBurned: number;
  perceivedExertion: number; // 1 (Very easy) to 5 (Maximum effort)
  notes?: string;
  speedProfileName?: string;
}

export interface WeightLog {
  id: string;
  date: string; // YYYY-MM-DD
  weightKg: number;
  notes?: string;
}

export interface HealthBenefit {
  id: string;
  category: 'weight_loss' | 'cardio' | 'mental' | 'muscle' | 'longevity' | 'treadmill_tips';
  title: string;
  description: string;
  highlightStat: string;
  tag: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'weekly_weight' | 'monthly_report' | 'workout_reminder' | 'benefit_motivation';
  read: boolean;
}
