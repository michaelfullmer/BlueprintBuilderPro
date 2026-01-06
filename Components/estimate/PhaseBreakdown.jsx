import React from 'react';
import GlassCard from '../ui/GlassCard';
import { Badge } from '@/components/ui/badge';
import { 
  Shovel, 
  Home, 
  Zap, 
  Droplets,
  Thermometer,
  PaintBucket,
  DoorOpen,
  Triangle,
  Building2,
  TreePine,
  ChevronDown,
  ChevronUp,
  Package,
  DollarSign,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const phaseIcons = {
  foundation: Shovel,
  framing: Home,
  electrical: Zap,
  plumbing: Droplets,
  insulation: Thermometer,
  drywall: Building2,
  interior: PaintBucket,
  siding: Building2,
  roofing: TriangleIcon,
  windows_doors: DoorOpen,
  landscaping: TreePine
};

function TriangleIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 20h18L12 4z"/>
    </svg>
  );
}

const phaseNames = {
  foundation: 'Foundation & Footers',
  framing: 'Framing',
  electrical: 'Electrical Rough-In',
  plumbing: 'Plumbing Rough-In',
  insulation: 'Insulation',
  drywall: 'Drywall',
  interior: 'Interior Finishes',
  siding: 'Siding & Exterior',
  roofing: 'Roofing',
  windows_doors: 'Windows & Doors',
  landscaping: 'Landscaping'
};

export default function PhaseBreakdown({ phases, expandedPhase, onTogglePhase }) {
  const totalMaterials = phases.reduce((sum, p) => sum + p.materials_cost, 0);
  const totalLabor = phases.reduce((sum, p) => sum + p.labor_cost, 0);

  return (
    <div className="space-y-4">
      {phases.map((phase, index) => {
        const Icon = phaseIcons[phase.id] || Package;
        const isExpanded = expandedPhase === phase.id;
        const percentage = ((phase.materials_cost + phase.labor_cost) / (totalMaterials + totalLabor)) * 100;

        return (
          <motion.div
            key={phase.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <GlassCard className="overflow-hidden">
              <button
                onClick={() => onTogglePhase(phase.id)}
                className="w-full p-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    phase.status === 'completed' ? 'bg-emerald-100 text-emerald-600' :
                    phase.status === 'in_progress' ? 'bg-amber-100 text-amber-600' :
                    'bg-slate-100 text-slate-600'
                  )}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-slate-900">
                      {phaseNames[phase.id] || phase.name}
                    </h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-slate-500">
                        {phase.materials?.length || 0} materials
                      </span>
                      <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-400">{percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-xl font-bold text-slate-900">
                      ${(phase.materials_cost + phase.labor_cost).toLocaleString()}
                    </p>
                    <div className="flex items-center justify-end gap-3 text-xs text-slate-500 mt-1">
                      <span>Materials: ${phase.materials_cost.toLocaleString()}</span>
                      <span>•</span>
                      <span>Labor: ${phase.labor_cost.toLocaleString()}</span>
                      {phase.duration_days && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {phase.duration_days} days
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 pt-0 border-t border-slate-100">
                      <div className="mt-4 space-y-2">
                        <div className="grid grid-cols-12 gap-4 text-xs font-medium text-slate-500 uppercase tracking-wider px-3">
                          <div className="col-span-5">Material</div>
                          <div className="col-span-2 text-right">Qty</div>
                          <div className="col-span-2 text-right">Unit Price</div>
                          <div className="col-span-3 text-right">Total</div>
                        </div>
                        
                        {phase.materials?.map((material, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.03 }}
                            className="grid grid-cols-12 gap-4 items-center p-3 rounded-lg hover:bg-slate-50 transition-colors"
                          >
                            <div className="col-span-5">
                              <p className="font-medium text-slate-900">{material.name}</p>
                              {material.brand && (
                                <p className="text-xs text-slate-500">{material.brand}</p>
                              )}
                            </div>
                            <div className="col-span-2 text-right">
                              <span className="font-medium text-slate-700">{material.quantity}</span>
                              <span className="text-xs text-slate-500 ml-1">{material.unit}</span>
                            </div>
                            <div className="col-span-2 text-right text-slate-600">
                              ${material.unit_price?.toFixed(2)}
                            </div>
                            <div className="col-span-3 text-right font-semibold text-slate-900">
                              ${material.total_price?.toLocaleString()}
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-100">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-slate-50 rounded-xl">
                            <div className="flex items-center gap-2">
                              <Package className="w-4 h-4 text-slate-500" />
                              <span className="text-sm text-slate-600">Materials Subtotal</span>
                            </div>
                            <p className="text-xl font-bold text-slate-900 mt-1">
                              ${phase.materials_cost.toLocaleString()}
                            </p>
                          </div>
                          <div className="p-4 bg-slate-50 rounded-xl">
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-slate-500" />
                              <span className="text-sm text-slate-600">Labor Estimate</span>
                            </div>
                            <p className="text-xl font-bold text-slate-900 mt-1">
                              ${phase.labor_cost.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>
          </motion.div>
        );
      })}
    </div>
  );
}