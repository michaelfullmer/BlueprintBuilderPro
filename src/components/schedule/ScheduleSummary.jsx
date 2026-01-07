import React from 'react';
import GlassCard from '../ui/GlassCard';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Play
} from 'lucide-react';
import { format, parseISO, differenceInDays } from 'date-fns';
import { motion } from 'framer-motion';

export default function ScheduleSummary({ schedule }) {
  if (!schedule) return null;

  const startDate = parseISO(schedule.start_date);
  const endDate = parseISO(schedule.end_date);
  const totalWeeks = Math.ceil(schedule.total_duration_days / 7);
  const totalMonths = Math.ceil(schedule.total_duration_days / 30);

  // Group phases by duration
  const shortPhases = schedule.phases.filter(p => p.duration_days <= 7);
  const mediumPhases = schedule.phases.filter(p => p.duration_days > 7 && p.duration_days <= 21);
  const longPhases = schedule.phases.filter(p => p.duration_days > 21);

  return (
    <GlassCard className="p-6 sticky top-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 rounded-lg bg-gradient-to-br from-blue-400/20 to-purple-500/20">
          <Calendar className="w-5 h-5 text-blue-600" />
        </div>
        <h3 className="font-semibold text-slate-900">Schedule Overview</h3>
      </div>

      {/* Timeline Summary */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
          <div>
            <p className="text-xs text-blue-600 font-medium">Project Duration</p>
            <p className="text-2xl font-bold text-blue-900 mt-1">
              {schedule.total_duration_days}
            </p>
            <p className="text-xs text-blue-700">days</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-blue-900">{totalWeeks} weeks</p>
            <p className="text-xs text-blue-600">≈ {totalMonths} months</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-2">
              <Play className="w-4 h-4 text-emerald-500" />
              <span className="text-xs text-slate-600">Start</span>
            </div>
            <p className="font-semibold text-slate-900 mt-1 text-sm">
              {format(startDate, 'MMM d, yyyy')}
            </p>
          </div>
          
          <div className="p-3 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-500" />
              <span className="text-xs text-slate-600">End</span>
            </div>
            <p className="font-semibold text-slate-900 mt-1 text-sm">
              {format(endDate, 'MMM d, yyyy')}
            </p>
          </div>
        </div>
      </div>

      {/* Phase Count by Duration */}
      <div className="space-y-3 mb-6 pb-6 border-b border-slate-200">
        <h4 className="text-sm font-medium text-slate-700">Phases by Duration</h4>
        
        <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-sm text-slate-700">Quick (≤1 week)</span>
          </div>
          <span className="font-semibold text-slate-900">{shortPhases.length}</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-cyan-50 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-500" />
            <span className="text-sm text-slate-700">Medium (1-3 weeks)</span>
          </div>
          <span className="font-semibold text-slate-900">{mediumPhases.length}</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-sm text-slate-700">Long (&gt;3 weeks)</span>
          </div>
          <span className="font-semibold text-slate-900">{longPhases.length}</span>
        </div>
      </div>

      {/* Longest Phases */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-slate-700">Longest Phases</h4>
        {schedule.phases
          .sort((a, b) => b.duration_days - a.duration_days)
          .slice(0, 3)
          .map((phase, i) => (
            <motion.div
              key={phase.phase_id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
            >
              <span className="text-sm text-slate-700 capitalize">
                {phase.phase_name || phase.phase_id.replace(/_/g, ' ')}
              </span>
              <Badge variant="secondary" className="bg-slate-200 text-slate-700">
                {phase.duration_days}d
              </Badge>
            </motion.div>
          ))}
      </div>

      {/* Weather Considerations */}
      <div className="mt-6 p-4 bg-teal-50 border border-teal-200 rounded-xl">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-teal-900">Weather Buffer</p>
            <p className="text-xs text-teal-700 mt-1">
              Add 10-15% time for weather delays on exterior work phases
            </p>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}