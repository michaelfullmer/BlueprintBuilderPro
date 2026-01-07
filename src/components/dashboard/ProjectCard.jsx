import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/lib/utils';
import GlassCard from '../ui/GlassCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  MapPin, 
  DollarSign, 
  ChevronRight,
  Clock,
  CheckCircle2,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';

const statusConfig = {
  draft: { label: 'Draft', icon: FileText, color: 'bg-slate-100 text-slate-600' },
  analyzing: { label: 'Analyzing', icon: Loader2, color: 'bg-amber-100 text-amber-700', spin: true },
  ready: { label: 'Ready', icon: CheckCircle2, color: 'bg-emerald-100 text-emerald-700' },
  in_progress: { label: 'In Progress', icon: Clock, color: 'bg-blue-100 text-blue-700' },
  completed: { label: 'Completed', icon: CheckCircle2, color: 'bg-purple-100 text-purple-700' }
};

export default function ProjectCard({ project }) {
  const navigate = useNavigate();
  const status = statusConfig[project.status] || statusConfig.draft;
  const StatusIcon = status.icon;

  return (
    <GlassCard className="overflow-hidden group">
      <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden">
        {project.blueprint_url ? (
          <img 
            src={project.blueprint_url} 
            alt={project.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <FileText className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm text-slate-400 mt-2">No blueprint uploaded</p>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <Badge className={`absolute top-3 right-3 ${status.color} border-0`}>
          <StatusIcon className={`w-3 h-3 mr-1 ${status.spin ? 'animate-spin' : ''}`} />
          {status.label}
        </Badge>
      </div>
      
      <div className="p-5">
        <h3 className="font-semibold text-lg text-slate-900 group-hover:text-teal-600 transition-colors">
          {project.name}
        </h3>
        
        {project.location?.city && (
          <div className="flex items-center gap-1.5 mt-2 text-sm text-slate-500">
            <MapPin className="w-3.5 h-3.5" />
            <span>{project.location.city}, {project.location.state}</span>
          </div>
        )}
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
          <div>
            {project.total_estimate ? (
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-slate-900">
                  {project.total_estimate.toLocaleString()}
                </span>
              </div>
            ) : (
              <span className="text-sm text-slate-400">No estimate yet</span>
            )}
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-teal-600 hover:text-teal-700 hover:bg-teal-50"
            onClick={() => navigate(createPageUrl(`ProjectDetail?id=${project.id}`))}
          >
            View Details
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        
        <p className="text-xs text-slate-400 mt-3">
          Updated {format(new Date(project.updated_date), 'MMM d, yyyy')}
        </p>
      </div>
    </GlassCard>
  );
}