import React from 'react';
import GlassCard from '../ui/GlassCard';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, 
  Package, 
  Hammer, 
  TrendingUp, 
  Download,
  Share2,
  Printer
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function CostSummary({ estimate, onExport, onShare }) {
  const contingency = estimate.total_estimate * 0.10;
  const grandTotal = estimate.total_estimate + contingency;

  return (
    <GlassCard className="p-6 sticky top-6">
      <h3 className="font-semibold text-slate-900 mb-6">Cost Summary</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <span className="font-medium text-slate-700">Materials</span>
          </div>
          <span className="text-xl font-bold text-slate-900">
            ${estimate.total_material_cost?.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100">
              <Hammer className="w-5 h-5 text-purple-600" />
            </div>
            <span className="font-medium text-slate-700">Labor</span>
          </div>
          <span className="text-xl font-bold text-slate-900">
            ${estimate.total_labor_cost?.toLocaleString()}
          </span>
        </div>

        <div className="border-t border-slate-200 pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600">Subtotal</span>
            <span className="font-semibold text-slate-900">
              ${estimate.total_estimate?.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600">Contingency (10%)</span>
            <span className="font-semibold text-slate-900">
              ${contingency.toLocaleString()}
            </span>
          </div>
        </div>

        <motion.div 
          className="p-5 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl text-white"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-100 text-sm">Grand Total</p>
              <p className="text-3xl font-bold mt-1">
                ${grandTotal.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <TrendingUp className="w-8 h-8" />
            </div>
          </div>
        </motion.div>

        <div className="text-center text-xs text-slate-500 pt-2">
          Estimates based on current market prices
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <Button 
          className="w-full bg-slate-900 hover:bg-slate-800"
          onClick={onExport}
        >
          <Download className="w-4 h-4 mr-2" />
          Export PDF Report
        </Button>
        
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={onShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="outline">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
        </div>
      </div>
    </GlassCard>
  );
}