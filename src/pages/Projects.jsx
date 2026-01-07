import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/lib/utils';
import { base44 } from '@/lib/base44Client';
import { useQuery } from '@tanstack/react-query';
import BlueprintGrid from '@/components/ui/BlueprintGrid';
import GlassCard from '@/components/ui/GlassCard';
import ProjectCard from '@/components/dashboard/ProjectCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Search, 
  Filter, 
  Grid3X3, 
  List,
  ArrowUpDown,
  Building2,
  FolderOpen
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Projects() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('-updated_date');
  const [viewMode, setViewMode] = useState('grid');

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects', sortBy],
    queryFn: () => base44.entities.Project.list(sortBy),
  });

  const filteredProjects = projects.filter(p => {
    const matchesSearch = 
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location?.city?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 relative">
      <BlueprintGrid opacity={0.04} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Projects</h1>
            <p className="text-slate-500 mt-1">Manage all your blueprint analyses and estimates</p>
          </div>
          
          <Link to={createPageUrl('NewProject')}>
            <Button className="bg-teal-500 hover:bg-teal-600">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <GlassCard className="p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="analyzing">Analyzing</SelectItem>
                  <SelectItem value="ready">Ready</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-44">
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="-updated_date">Recently Updated</SelectItem>
                  <SelectItem value="-created_date">Recently Created</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="-name">Name Z-A</SelectItem>
                  <SelectItem value="-total_estimate">Highest Estimate</SelectItem>
                  <SelectItem value="total_estimate">Lowest Estimate</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="icon"
                  className={viewMode === 'grid' ? 'bg-teal-500 hover:bg-teal-600' : ''}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="icon"
                  className={viewMode === 'list' ? 'bg-teal-500 hover:bg-teal-600' : ''}
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Projects Grid/List */}
        {isLoading ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <GlassCard key={i} className="h-80 animate-pulse">
                <div className="aspect-video bg-slate-200" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-slate-200 rounded w-3/4" />
                  <div className="h-4 bg-slate-200 rounded w-1/2" />
                </div>
              </GlassCard>
            ))}
          </div>
        ) : filteredProjects.length > 0 ? (
          <motion.div
            layout
            className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}
          >
            {filteredProjects.map((project, i) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <GlassCard className="p-12 text-center">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center">
              <FolderOpen className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="mt-6 text-lg font-semibold text-slate-900">No projects found</h3>
            <p className="mt-2 text-slate-500">
              {searchQuery || statusFilter !== 'all' 
                ? 'Try adjusting your filters'
                : 'Create your first project to get started'}
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <Link to={createPageUrl('NewProject')}>
                <Button className="mt-6 bg-teal-500 hover:bg-teal-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Project
                </Button>
              </Link>
            )}
          </GlassCard>
        )}

        {/* Stats Footer */}
        {filteredProjects.length > 0 && (
          <div className="mt-8 flex items-center justify-center gap-8 text-sm text-slate-500">
            <span>Showing {filteredProjects.length} of {projects.length} projects</span>
            <span>•</span>
            <span>Total Value: ${filteredProjects.reduce((sum, p) => sum + (p.total_estimate || 0), 0).toLocaleString()}</span>
          </div>
        )}
      </div>
    </div>
  );
}