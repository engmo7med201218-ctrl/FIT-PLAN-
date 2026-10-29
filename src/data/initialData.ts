import { UserProfile, FavoriteSpeedProfile, WorkoutSchedule, WorkoutLog, WeightLog, HealthBenefit, AppNotification } from '../types';

export const INITIAL_USER_PROFILE: UserProfile = {
  name: 'محمد',
  gender: 'male',
  heightCm: 175,
  startWeightKg: 92.5,
  currentWeightKg: 85.0,
  targetWeightKg: 75.0,
  weeklyTargetMinutes: 150,
  weeklyReminderDay: 5, // الجمعة (Friday)
  weeklyReminderTime: '09:00',
  monthlyReminderDay: 1, // First of every month
  notificationsEnabled: true,
  voiceCoachEnabled: true,
  soundEffectsEnabled: true,
  vibrationEnabled: true,
};

export const INITIAL_SPEED_PROFILES: FavoriteSpeedProfile[] = [
  {
    id: 'fat-burn',
    name: 'برنامج حرق الدهون (Fat Burn)',
    description: 'المنطقة الهوائية المثالية لأكسدة الدهون واستمرارية الطاقة لفترات طويلة',
    warmupSpeed: 5.5,
    jogSpeed: 7.5,
    fastRunSpeed: 9.0,
    sprintSpeed: 10.5,
    coolDownSpeed: 4.5,
    defaultIncline: 1.5,
    isDefault: true,
  },
  {
    id: 'hiit-intervals',
    name: 'سرعات الفواصل الحارقة (HIIT Sprint)',
    description: 'تبادل بين الركض السريع والمشي السريع لمضاعفة حرق السعرات بعد التمرين',
    warmupSpeed: 6.0,
    jogSpeed: 8.5,
    fastRunSpeed: 11.0,
    sprintSpeed: 13.0,
    coolDownSpeed: 5.0,
    defaultIncline: 2.0,
  },
  {
    id: 'endurance-steady',
    name: 'اللياقة والتحمل الهوائي (Endurance)',
    description: 'ركض بسرعة ثابتة ومستقرة لتقوية عضلة القلب ورفع كفاءة الرئتين',
    warmupSpeed: 5.0,
    jogSpeed: 8.0,
    fastRunSpeed: 9.5,
    sprintSpeed: 11.0,
    coolDownSpeed: 4.8,
    defaultIncline: 1.0,
  },
  {
    id: 'incline-power-walk',
    name: 'المشي بالميل العالي (Incline Walk)',
    description: 'حماية المفاصل مع حرق مكثف للسعرات عبر رفع زاوية ميل المشاية',
    warmupSpeed: 4.5,
    jogSpeed: 5.5,
    fastRunSpeed: 6.2,
    sprintSpeed: 7.0,
    coolDownSpeed: 4.0,
    defaultIncline: 5.0,
  },
];

export const INITIAL_SCHEDULES: WorkoutSchedule[] = [
  {
    id: 'sch-1',
    dayOfWeek: 6, // السبت
    time: '18:30',
    targetMinutes: 35,
    speedProfileId: 'fat-burn',
    title: 'جري حرق الدهون وتفريغ طاقة الأسبوع',
    enabled: true,
  },
  {
    id: 'sch-2',
    dayOfWeek: 1, // الإثنين
    time: '19:00',
    targetMinutes: 40,
    speedProfileId: 'hiit-intervals',
    title: 'تمارين الفواصل السريعة HIIT',
    enabled: true,
  },
  {
    id: 'sch-3',
    dayOfWeek: 3, // الأربعاء
    time: '18:30',
    targetMinutes: 35,
    speedProfileId: 'endurance-steady',
    title: 'تمرين زيادة النفس وقوة التحمل',
    enabled: true,
  },
  {
    id: 'sch-4',
    dayOfWeek: 5, // الجمعة
    time: '08:30',
    targetMinutes: 30,
    speedProfileId: 'incline-power-walk',
    title: 'مشي صباحي حارق مع زاوية ميل',
    enabled: true,
  },
];

// Helper to generate past dates
const daysAgo = (days: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
};

const dateStrDaysAgo = (days: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split('T')[0];
};

export const INITIAL_WORKOUT_LOGS: WorkoutLog[] = [
  {
    id: 'w-1',
    date: daysAgo(18),
    durationMinutes: 30,
    distanceKm: 3.6,
    avgSpeedKmH: 7.2,
    maxSpeedKmH: 9.5,
    incline: 1.0,
    caloriesBurned: 290,
    perceivedExertion: 3,
    notes: 'بداية الالتزام بالجدول، النفس كان ممتاز',
    speedProfileName: 'برنامج حرق الدهون',
  },
  {
    id: 'w-2',
    date: daysAgo(15),
    durationMinutes: 35,
    distanceKm: 4.4,
    avgSpeedKmH: 7.5,
    maxSpeedKmH: 10.0,
    incline: 1.5,
    caloriesBurned: 355,
    perceivedExertion: 4,
    notes: 'زدت السرعة في آخر 5 دقائق',
    speedProfileName: 'برنامج حرق الدهون',
  },
  {
    id: 'w-3',
    date: daysAgo(12),
    durationMinutes: 30,
    distanceKm: 3.9,
    avgSpeedKmH: 7.8,
    maxSpeedKmH: 11.0,
    incline: 1.0,
    caloriesBurned: 320,
    perceivedExertion: 4,
    notes: 'فواصل سريعة HIIT',
    speedProfileName: 'سرعات الفواصل الحارقة',
  },
  {
    id: 'w-4',
    date: daysAgo(9),
    durationMinutes: 40,
    distanceKm: 5.2,
    avgSpeedKmH: 7.8,
    maxSpeedKmH: 10.5,
    incline: 1.0,
    caloriesBurned: 430,
    perceivedExertion: 3,
    notes: 'كسرت حاجز الـ 5 كيلومتر لأول مرة!',
    speedProfileName: 'اللياقة والتحمل الهوائي',
  },
  {
    id: 'w-5',
    date: daysAgo(6),
    durationMinutes: 35,
    distanceKm: 4.8,
    avgSpeedKmH: 8.2,
    maxSpeedKmH: 11.5,
    incline: 1.5,
    caloriesBurned: 395,
    perceivedExertion: 4,
    notes: 'طاقة عالية وموسيقى تحفيزية',
    speedProfileName: 'سرعات الفواصل الحارقة',
  },
  {
    id: 'w-6',
    date: daysAgo(3),
    durationMinutes: 42,
    distanceKm: 5.7,
    avgSpeedKmH: 8.1,
    maxSpeedKmH: 11.0,
    incline: 1.5,
    caloriesBurned: 460,
    perceivedExertion: 3,
    notes: 'تحسن ملحوظ في نبضات القلب والتعافي',
    speedProfileName: 'برنامج حرق الدهون',
  },
  {
    id: 'w-7',
    date: daysAgo(1),
    durationMinutes: 45,
    distanceKm: 6.2,
    avgSpeedKmH: 8.3,
    maxSpeedKmH: 12.0,
    incline: 2.0,
    caloriesBurned: 510,
    perceivedExertion: 4,
    notes: 'تمرين أسطوري وتخطي الهدف الأسبوعي',
    speedProfileName: 'اللياقة والتحمل الهوائي',
  },
];

export const INITIAL_WEIGHT_LOGS: WeightLog[] = [
  { id: 'wt-1', date: dateStrDaysAgo(28), weightKg: 92.5, notes: 'الوزن الأولي قبل بداية خطة الجري' },
  { id: 'wt-2', date: dateStrDaysAgo(21), weightKg: 91.0, notes: 'نزول 1.5 كجم في الأسبوع الأول' },
  { id: 'wt-3', date: dateStrDaysAgo(14), weightKg: 89.2, notes: 'الملابس بدأت تصبح أوسع بكثير' },
  { id: 'wt-4', date: dateStrDaysAgo(7), weightKg: 87.1, notes: 'نزول مستمر مع ثبات الكتلة العضلية' },
  { id: 'wt-5', date: dateStrDaysAgo(0), weightKg: 85.0, notes: 'تم كسر حاجز الـ 85 كجم بنجاح! 🎯' },
];

export const HEALTH_BENEFITS: HealthBenefit[] = [
  {
    id: 'hb-1',
    category: 'weight_loss',
    title: 'حرق الدهون المستمر بعد التمرين (تأثير Afterburn)',
    description: 'الجري المتقطع بسرعات متغيرة على المشاية ينشط استهلاك الأكسجين الزائد بعد التمرين (EPOC)، مما يجعل جسمك يستمر في حرق السعرات الحرارية والدهون لمدة تصل إلى 24 ساعة حتى وأنت نائم أو مستريح.',
    highlightStat: 'حرق +15-20% سعرات إضافية أثناء الراحة',
    tag: 'خسارة الوزن السريعة',
  },
  {
    id: 'hb-2',
    category: 'cardio',
    title: 'تقوية عضلة القلب وخفض ضغط الدم',
    description: 'الجري المنتظم على المشاية لمدة 30 دقيقة يحسن قدرة القلب على ضخ الدم بكفاءة، ويقلل الضغط الانقباضي والانبساطي، كما يخفض نسبة الكوليسترول الضار (LDL) ويرفع النافع (HDL).',
    highlightStat: 'انخفاض خطر أمراض القلب بنسبة 45%',
    tag: 'صحة القلب والشرايين',
  },
  {
    id: 'hb-3',
    category: 'mental',
    title: 'إفراز هرمونات السعادة ومحاربة التوتر',
    description: 'يفرز المخ أثناء الركض كميات هائلة من الإندورفين والدوبامين والسيروتونين (المعروف بظاهرة Runner\'s High)، مما يقضي على ضغوط العمل والقلق ويمنحك نوماً عميقاً ومريحاً ليلاً.',
    highlightStat: 'تراجع مستويات هرمون الكورتيزول (التوتر) بنسبة 35%',
    tag: 'المزاج والنوم العميق',
  },
  {
    id: 'hb-4',
    category: 'treadmill_tips',
    title: 'سر حرق 20% سعرات أكثر بدون مسك المقابض',
    description: 'عند الجري أو المشي السريع على المشاية، اترك يديك تتحركان بحرية في حركة بندولية طبيعية وتجنب الاتكاء على المقابض الجانبية. الاتكاء يقلل من وزن جسمك الفعلي ويخفض حرق السعرات بشكل كبير.',
    highlightStat: 'حرق 20% دهون وسعرات أكثر بحركة الذراعين الحرة',
    tag: 'نصيحة ذهبية للمشاية',
  },
  {
    id: 'hb-5',
    category: 'treadmill_tips',
    title: 'محاكاة الجري في الهواء الطلق بميل 1-1.5%',
    description: 'على المشاية لا توجد مقاومة رياح مقابلة لك، لذلك ينصح خبراء الطب الرياضي بضبط ميل المشاية (Incline) على 1.0% إلى 1.5% دائماً. هذا يعادل مقاومة الرياح في الطبيعة ويحمي عضلات الفخذ والمفاصل.',
    highlightStat: 'ميل 1% = مطابقة فيزيائية 100% للجري الخارجي',
    tag: 'كفاءة التمرين',
  },
  {
    id: 'hb-6',
    category: 'muscle',
    title: 'حماية المفاصل وتقوية أوتار الركبة والغضاريف',
    description: 'سير المشاية مزود بأنظمة امتصاص صدمات هيدروليكية ومطاطية متطورة تخفف الضغط على مفصل الركبة والكاحل وأسفل الظهر بنسبة تفوق 40% مقارنة بالجري على الأسفلت القاسي.',
    highlightStat: 'امتصاص 40% من الصدمات الضارة بالمفاصل',
    tag: 'حماية الركبة والمفاصل',
  },
  {
    id: 'hb-7',
    category: 'weight_loss',
    title: 'تحسين حساسية الأنسولين ومنع تخزين الدهون',
    description: 'الركض يفرغ مخازن الجليكوجين في العضلات، مما يجبر الخلايا على امتصاص سكر الدم بدون الحاجة لجرعات أنسولين إضافية، ويوقف الهبوط المفاجئ للسكر الذي يسبب شراهة الحلويات.',
    highlightStat: 'تحسن حساسية الأنسولين بنسبة تزيد عن 50%',
    tag: 'تنظيم السكر والشهية',
  },
  {
    id: 'hb-8',
    category: 'longevity',
    title: 'زيادة اللياقة التنفسية (VO2 Max) وإطالة العمر الصحي',
    description: 'أثبتت الدراسات الطبية في جامعات هارفارد وستانفورد أن ممارسة تمارين المشاية المنتظمة تؤخر مظاهر الشيخوخة الحيوية وتزيد من كفاءة الميتوكوندريا (محطات طاقة الخلايا).',
    highlightStat: 'إضافة 3 إلى 5 سنوات من الصحة والنشاط الحيوي',
    tag: 'الشباب وطول العمر',
  },
];

export const MOTIVATIONAL_QUOTES = [
  'كل دقيقة تقضيها على المشاية تقربك خطوة جبارة من جسد أحلامك وصحتك التي تستحقها!',
  'العرق الذي تبذله اليوم هو بكاء الدهون الزائدة التي تغادر جسدك إلى الأبد.',
  'الفرق بين الشخص الذي ينجح والذي يفشل ليس نقص القوة، بل الإصرار على الصعود للمشاية كل يوم.',
  'لا تنتظر الدافع ليبدأ التمرين.. ابدأ التمرين وسترى كيف يتفجر الدافع والشغف بداخلك!',
  'سرعتك لا تهم، المهم أنك أسرع بكثير من كل شخص ما زال نائماً على الأريكة.',
  'تذكر دائماً لماذا بدأت، والشعور الرائع بالخفة والرشاقة عندما تقف على الميزان.',
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'موعد وزنك الأسبوعي ⚖️',
    message: 'صباح النشاط يا بطل! حان موعد تسجيل وزنك الأسبوعي ومراجعة إنجازك على المشاية.',
    timestamp: daysAgo(1),
    type: 'weekly_weight',
    read: false,
  },
  {
    id: 'notif-2',
    title: 'تذكير تمرين المشاية اليوم 🏃‍♂️',
    message: 'تمرين اليوم الساعة 06:30 م - برنامج حرق الدهون وسرعتك المحببة 7.5 كم/س جاهزة!',
    timestamp: daysAgo(2),
    type: 'workout_reminder',
    read: true,
  },
  {
    id: 'notif-3',
    title: 'سر رياضي: تأثير الحرق المستمر 🔥',
    message: 'هل تعلم أن الجري بسرعات متغيرة يجعلك تحرق الدهون حتى 24 ساعة بعد التمرين؟',
    timestamp: daysAgo(3),
    type: 'benefit_motivation',
    read: true,
  },
  {
    id: 'notif-4',
    title: 'تقريرك الشهري لإنجازات الجري 📊',
    message: 'مبروك! قطعت هذا الشهر أكثر من 28 كم وحرقت أكثر من 2,500 سعرة حرارية، وفقدت 3.2 كجم!',
    timestamp: daysAgo(10),
    type: 'monthly_report',
    read: true,
  },
];
