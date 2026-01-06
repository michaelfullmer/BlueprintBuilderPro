import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import BlueprintGrid from '../components/ui/BlueprintGrid';
import GlassCard from '../components/ui/GlassCard';
import PhaseBreakdown from '../components/estimate/PhaseBreakdown';
import CostSummary from '../components/estimate/CostSummary';
import TimelineView from '../components/schedule/TimelineView';
import ScheduleSummary from '../components/schedule/ScheduleSummary';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Edit3, 
  Trash2, 
  Share2, 
  Download,
  MapPin,
  Square,
  Layers,
  Home,
  Calendar,
  User,
  MoreHorizontal,
  Image,
  FileText,
  Settings,
  Loader2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const statusConfig = {
  draft: { label: 'Draft', color: 'bg-slate-100 text-slate-700' },
  analyzing: { label: 'Analyzing', color: 'bg-amber-100 text-amber-700' },
  ready: { label: 'Ready', color: 'bg-emerald-100 text-emerald-700' },
  in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
  completed: { label: 'Completed', color: 'bg-purple-100 text-purple-700' }
};

export default function ProjectDetail() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [expandedPhase, setExpandedPhase] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('estimate');

  const { id: routeId } = useParams();
  const urlParams = new URLSearchParams(window.location.search);
  const queryId = urlParams.get('id');
  const projectId = routeId || queryId;

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const projects = await base44.entities.Project.filter({ id: projectId });
      return projects[0];
    },
    enabled: !!projectId
  });

  const deleteMutation = useMutation({
    mutationFn: () => base44.entities.Project.delete(projectId),
    onSuccess: () => {
      toast.success('Project deleted successfully');
      navigate(createPageUrl('Projects'));
    }
  });

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard');
  };

  const handleExport = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 flex items-center justify-center">
        <GlassCard className="p-8 text-center">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="mt-4 text-lg font-semibold text-slate-900">Project not found</h3>
          <Link to={createPageUrl('Projects')}>
            <Button className="mt-4">Back to Projects</Button>
          </Link>
        </GlassCard>
      </div>
    );
  }

  const status = statusConfig[project.status] || statusConfig.draft;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 relative">
      <BlueprintGrid opacity={0.04} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
          <div className="flex items-start gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate(createPageUrl('Projects'))}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900">{project.name}</h1>
                <Badge className={status.color}>{status.label}</Badge>
              </div>
              {project.description && (
                <p className="text-slate-500 mt-1">{project.description}</p>
              )}
              <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                {project.location?.city && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {project.location.city}, {project.location.state}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Created {format(new Date(project.created_date), 'MMM d, yyyy')}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate(createPageUrl(`NewProject?id=${projectId}`))}>
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Project
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.info('Settings coming soon!')}>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeleteDialog(true);
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Project
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <GlassCard className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50">
                <Square className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Total Area</p>
                <p className="font-semibold text-slate-900">
                  {project.extracted_data?.total_sqft?.toLocaleString() || 0} sqft
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-50">
                <Layers className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Floors</p>
                <p className="font-semibold text-slate-900">
                  {project.extracted_data?.floors || 1}
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-50">
                <Home className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Rooms</p>
                <p className="font-semibold text-slate-900">
                  {project.extracted_data?.rooms?.length || 0}
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-50">
                <FileText className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Phases</p>
                <p className="font-semibold text-slate-900">
                  {project.phase_estimates?.length || 0}
                </p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="estimate">Cost Estimate</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="blueprint">Blueprint</TabsTrigger>
            <TabsTrigger value="materials">Materials</TabsTrigger>
            <TabsTrigger value="rooms">Rooms</TabsTrigger>
          </TabsList>

          <TabsContent value="estimate">
            {project.phase_estimates?.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <PhaseBreakdown
                    phases={project.phase_estimates}
                    expandedPhase={expandedPhase}
                    onTogglePhase={(id) => setExpandedPhase(expandedPhase === id ? null : id)}
                  />
                </div>
                <div>
                  <CostSummary
                    estimate={project}
                    onExport={handleExport}
                    onShare={handleShare}
                  />
                </div>
              </div>
            ) : (
              <GlassCard className="p-12 text-center">
                <FileText className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="mt-4 text-lg font-semibold text-slate-900">No estimate yet</h3>
                <p className="text-slate-500 mt-2">Complete the project wizard to generate an estimate</p>
              </GlassCard>
            )}
          </TabsContent>

          <TabsContent value="schedule">
            {project.schedule ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <TimelineView schedule={project.schedule} />
                </div>
                <div>
                  <ScheduleSummary schedule={project.schedule} />
                </div>
              </div>
            ) : (
              <GlassCard className="p-12 text-center">
                <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="mt-4 text-lg font-semibold text-slate-900">No schedule available</h3>
                <p className="text-slate-500 mt-2">Complete the project wizard to generate a timeline</p>
              </GlassCard>
            )}
          </TabsContent>

          <TabsContent value="blueprint">
            <GlassCard className="overflow-hidden">
              {project.blueprint_url ? (
                <div className="aspect-video bg-slate-100">
                  <img 
                    src={project.blueprint_url} 
                    alt="Blueprint"
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-slate-100 flex items-center justify-center">
                  <div className="text-center">
                    <Image className="w-12 h-12 text-slate-300 mx-auto" />
                    <p className="text-slate-500 mt-2">No blueprint uploaded</p>
                  </div>
                </div>
              )}
            </GlassCard>
          </TabsContent>

          <TabsContent value="materials">
            <GlassCard className="p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Material Selections</h3>
              {Object.entries(project.material_selections || {}).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(project.material_selections).map(([category, selection]) => (
                    <div key={category} className="p-4 bg-slate-50 rounded-xl">
                      <p className="text-xs text-slate-500 uppercase tracking-wide">{category}</p>
                      <p className="font-medium text-slate-900 mt-1">{selection.name}</p>
                      {selection.brand && (
                        <p className="text-sm text-slate-600">{selection.brand}</p>
                      )}
                      {selection.color && (
                        <Badge variant="outline" className="mt-2">{selection.color}</Badge>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500">No materials selected</p>
              )}
            </GlassCard>
          </TabsContent>

          <TabsContent value="rooms">
            <GlassCard className="p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Room Details</h3>
              {project.extracted_data?.rooms?.length > 0 ? (
                <div className="grid gap-3">
                  {project.extracted_data.rooms.map((room, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-sm font-medium text-slate-600">
                          {i + 1}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{room.name}</p>
                          <p className="text-sm text-slate-500">{room.length}' x {room.width}'</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-900">{room.sqft} sqft</p>
                        {room.flooring_type && (
                          <Badge variant="outline" className="text-xs mt-1">
                            {room.flooring_type}
                          </Badge>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500">No rooms detected</p>
              )}
            </GlassCard>
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{project.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMutation.mutate()}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
