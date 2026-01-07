import React from 'react';
import GlassCard from '../ui/GlassCard';
import { cn } from '@/lib/utils';

export default function StatCard({ icon: Icon, label, value, trend, trendUp, className }) {
  return (
    <GlassCard className={cn("p-6", className)}>
      <div className="flex items-start justify-between">
        <div className="p-3 rounded-xl bg-gradient-to-br from-teal-400/10 to-cyan-500/10 border border-teal-200/30">
          <Icon className="w-5 h-5 text-teal-600" />
        </div>
        {trend && (
          <span className={cn(
            "text-xs font-medium px-2 py-1 rounded-full",
            trendUp ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
          )}>
            {trend}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
      </div>
    </GlassCard>
  );
}