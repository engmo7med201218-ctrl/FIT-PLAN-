import React, { useState } from 'react';
import {
  Heart,
  Flame,
  Brain,
  Shield,
  Sparkles,
  Zap,
  Quote,
  Lightbulb,
  CheckCircle2,
  Share2,
  Shuffle,
} from 'lucide-react';
import { HealthBenefit } from '../types';
import { HEALTH_BENEFITS, MOTIVATIONAL_QUOTES } from '../data/initialData';

interface HealthBenefitsSectionProps {
  onShareQuote?: (quote: string) => void;
}

export const HealthBenefitsSection: React.FC<HealthBenefitsSectionProps> = ({ onShareQuote }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [quoteIndex, setQuoteIndex] = useState<number>(0);
  const [copiedQuote, setCopiedQuote] = useState<boolean>(false);

  const currentQuote = MOTIVATIONAL_QUOTES[quoteIndex % MOTIVATIONAL_QUOTES.length];

  const handleNextQuote = () => {
    setQuoteIndex(prev => (prev + 1) % MOTIVATIONAL_QUOTES.length);
  };

  const handleCopyQuote = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentQuote);
      setCopiedQuote(true);
      setTimeout(() => setCopiedQuote(false), 2000);
    }
  };

  const filteredBenefits = selectedCategory === 'all'
    ? HEALTH_BENEFITS
    : HEALTH_BENEFITS.filter(b => b.category === selectedCategory);

  const getCategoryIcon = (cat: HealthBenefit['category']) => {
    switch (cat) {
      case 'weight_loss':
        return <Flame className="w-4 h-4 text-orange-400" />;
      case 'cardio':
        return <Heart className="w-4 h-4 text-rose-400" />;
      case 'mental':
        return <Brain className="w-4 h-4 text-purple-400" />;
      case 'muscle':
        return <Shield className="w-4 h-4 text-emerald-400" />;
      case 'longevity':
        return <Sparkles className="w-4 h-4 text-cyan-400" />;
      case 'treadmill_tips':
        return <Lightbulb className="w-4 h-4 text-amber-400" />;
      default:
        return <Zap className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="space-y-4 text-slate-100">
      {/* MOTIVATIONAL QUOTE CARD OF THE DAY */}
      <div className="relative bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-950 border border-emerald-500/30 rounded-3xl p-5 shadow-xl overflow-hidden glow-emerald">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between mb-3 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Quote className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-emerald-400">حكمة اليوم الرياضية للتحفيز</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopyQuote}
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs transition"
              title="نسخ الحكمة"
            >
              {copiedQuote ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handleNextQuote}
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs transition flex items-center gap-1"
              title="حكمة أخرى"
            >
              <Shuffle className="w-3.5 h-3.5 text-emerald-400" />
            </button>
          </div>
        </div>

        <p className="text-sm font-semibold leading-relaxed text-slate-100 relative z-10">
          &ldquo;{currentQuote}&rdquo;
        </p>
      </div>

      {/* FILTER CHIPS */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {[
          { id: 'all', label: 'جميع الفوائد' },
          { id: 'weight_loss', label: 'خسارة الدهون 🔥' },
          { id: 'treadmill_tips', label: 'أسرار المشاية 💡' },
          { id: 'cardio', label: 'صحة القلب ❤️' },
          { id: 'mental', label: 'المزاج والتوتر 🧠' },
          { id: 'muscle', label: 'حماية المفاصل 🛡️' },
          { id: 'longevity', label: 'الشباب واللياقة ⚡' },
        ].map(chip => (
          <button
            key={chip.id}
            onClick={() => setSelectedCategory(chip.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === chip.id
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* SCIENTIFIC BENEFITS CARDS LIST */}
      <div className="space-y-3">
        {filteredBenefits.map(benefit => (
          <div
            key={benefit.id}
            className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 hover:border-slate-700 transition space-y-2 relative"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">
                  {getCategoryIcon(benefit.category)}
                </div>
                <h3 className="text-sm font-bold text-white">{benefit.title}</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-400 font-medium whitespace-nowrap">
                {benefit.tag}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed pr-10">
              {benefit.description}
            </p>

            {/* Scientific highlight stat badge */}
            <div className="pt-2 border-t border-slate-800/60 flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>{benefit.highlightStat}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
