import React from 'react';
import GlassCard from '../ui/GlassCard';
import { Calendar, Clock, DollarSign, Layers } from 'lucide-react';

export default function QuickStats({ project }) {
  const schedule = project.schedule;
  const totalWeeks = schedule ? Math.ceil(schedule.total_duration_days / 7) : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <GlassCard className="p-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-50">
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Duration</p>
            <p className="font-semibold text-slate-900 text-sm">
              {schedule?.total_duration_days || 0} days
            </p>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-50">
            <Clock className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Timeline</p>
            <p className="font-semibold text-slate-900 text-sm">
              {totalWeeks} weeks
            </p>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-50">
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Estimate</p>
            <p className="font-semibold text-slate-900 text-sm">
              ${(project.total_estimate || 0).toLocaleString()}
            </p>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-50">
            <Layers className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Phases</p>
            <p className="font-semibold text-slate-900 text-sm">
              {schedule?.phases?.length || 0}
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}