import React, { useState } from 'react';
import GlassCard from '../ui/GlassCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Clock, 
  ChevronLeft, 
  ChevronRight,
  Play,
  Pause,
  CheckCircle2
} from 'lucide-react';
import { format, addDays, differenceInDays, parseISO } from 'date-fns';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const phaseColors = {
  foundation: 'bg-teal-500',
  framing: 'bg-blue-500',
  electrical: 'bg-yellow-500',
  plumbing: 'bg-cyan-500',
  insulation: 'bg-green-500',
  drywall: 'bg-purple-500',
  interior: 'bg-pink-500',
  siding: 'bg-orange-500',
  roofing: 'bg-teal-600',
  windows_doors: 'bg-indigo-500',
  landscaping: 'bg-emerald-500'
};

export default function TimelineView({ schedule }) {
  const [viewMode, setViewMode] = useState('month'); // 'week', 'month', 'quarter'
  
  if (!schedule || !schedule.phases) {
    return (
      <GlassCard className="p-8 text-center">
        <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
        <p className="mt-4 text-slate-500">No schedule data available</p>
      </GlassCard>
    );
  }

  const startDate = parseISO(schedule.start_date);
  const endDate = parseISO(schedule.end_date);
  const totalDays = differenceInDays(endDate, startDate);
  
  // Calculate completion percentage (for demo - would track actual progress in real app)
  const today = new Date();
  const daysPassed = Math.max(0, Math.min(totalDays, differenceInDays(today, startDate)));
  const completionPercentage = Math.round((daysPassed / totalDays) * 100);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Start Date</p>
              <p className="font-semibold text-slate-900">
                {format(startDate, 'MMM d, yyyy')}
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-50">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">End Date</p>
              <p className="font-semibold text-slate-900">
                {format(endDate, 'MMM d, yyyy')}
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-teal-50">
              <Clock className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Total Duration</p>
              <p className="font-semibold text-slate-900">
                {schedule.total_duration_days} days
              </p>
              <p className="text-xs text-slate-500">
                ~{Math.round(schedule.total_duration_days / 7)} weeks
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-50">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Progress</p>
              <p className="font-semibold text-slate-900">{completionPercentage}%</p>
              <div className="w-full h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Gantt Chart */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-slate-900">Project Timeline</h3>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-slate-600 px-3">
              {format(startDate, 'MMM yyyy')} - {format(endDate, 'MMM yyyy')}
            </span>
            <Button variant="outline" size="sm">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Timeline Grid */}
        <div className="space-y-2">
          {/* Header - Weeks */}
          <div className="flex items-center mb-4">
            <div className="w-48 flex-shrink-0" />
            <div className="flex-1 flex">
              {Array.from({ length: Math.ceil(totalDays / 7) }).map((_, i) => (
                <div key={i} className="flex-1 text-center">
                  <span className="text-xs text-slate-500">Week {i + 1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Phase Rows */}
          {schedule.phases.map((phase, index) => {
            const phaseStart = parseISO(phase.start_date);
            const phaseEnd = parseISO(phase.end_date);
            const phaseDuration = differenceInDays(phaseEnd, phaseStart);
            const phaseStartOffset = differenceInDays(phaseStart, startDate);
            
            const leftPercentage = (phaseStartOffset / totalDays) * 100;
            const widthPercentage = (phaseDuration / totalDays) * 100;

            return (
              <motion.div
                key={phase.phase_id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center py-2 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <div className="w-48 flex-shrink-0 pr-4">
                  <p className="font-medium text-slate-900 text-sm capitalize">
                    {phase.phase_name || phase.phase_id.replace(/_/g, ' ')}
                  </p>
                  <p className="text-xs text-slate-500">
                    {phase.duration_days} days
                  </p>
                </div>
                
                <div className="flex-1 relative h-10">
                  {/* Timeline bar */}
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${widthPercentage}%` }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={cn(
                      "absolute top-1/2 -translate-y-1/2 h-8 rounded-lg shadow-sm group cursor-pointer",
                      phaseColors[phase.phase_id] || 'bg-slate-400'
                    )}
                    style={{ left: `${leftPercentage}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 rounded-lg" />
                    
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                      <div className="bg-slate-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap">
                        <p className="font-medium">
                          {format(phaseStart, 'MMM d')} - {format(phaseEnd, 'MMM d, yyyy')}
                        </p>
                        <p className="text-slate-300">{phase.duration_days} days</p>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900" />
                      </div>
                    </div>
                  </motion.div>
                </div>

                <div className="w-32 flex-shrink-0 text-right pl-4">
                  <p className="text-xs text-slate-500">
                    {format(phaseStart, 'MMM d')} - {format(phaseEnd, 'MMM d')}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </GlassCard>

      {/* Phase Details List */}
      <GlassCard className="p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Phase Details</h3>
        <div className="space-y-3">
          {schedule.phases.map((phase, index) => {
            const phaseStart = parseISO(phase.start_date);
            const phaseEnd = parseISO(phase.end_date);
            
            return (
              <div
                key={phase.phase_id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white shadow-sm text-sm font-medium text-slate-600">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 capitalize">
                      {phase.phase_name || phase.phase_id.replace(/_/g, ' ')}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {phase.duration_days} days
                      </span>
                      <span className="text-xs text-slate-500">
                        {format(phaseStart, 'MMM d')} - {format(phaseEnd, 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {phase.dependencies?.length > 0 && (
                    <Badge variant="outline" className="text-xs">
                      After: {phase.dependencies.map(d => d.replace(/_/g, ' ')).join(', ')}
                    </Badge>
                  )}
                  <div 
                    className={cn(
                      "w-3 h-3 rounded-full",
                      phaseColors[phase.phase_id] || 'bg-slate-400'
                    )} 
                  />
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* Critical Path Info */}
      <GlassCard className="p-6 bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-teal-100">
            <Clock className="w-5 h-5 text-teal-700" />
          </div>
          <div>
            <h4 className="font-semibold text-teal-900">Critical Path</h4>
            <p className="text-sm text-teal-700 mt-1">
              Foundation → Framing → Roofing → Windows/Doors → Interior Finishes
            </p>
            <p className="text-xs text-teal-600 mt-2">
              These phases are on the critical path. Delays here will impact the overall project timeline.
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}