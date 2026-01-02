import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import BlueprintGrid from '../components/ui/BlueprintGrid';
import GlassCard from '../components/ui/GlassCard';
import StatCard from '../components/dashboard/StatCard';
import ProjectCard from '../components/dashboard/ProjectCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  FolderOpen, 
  DollarSign, 
  FileCheck,
  Search,
  Sparkles,
  ArrowRight,
  Upload,
  Layers,
  Calculator,
  Building2
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list('-updated_date'),
  });

  const filteredProjects = projects.filter(p => 
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.location?.city?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    totalProjects: projects.length,
    completedEstimates: projects.filter(p => p.status === 'ready' || p.status === 'completed').length,
    totalEstimatedValue: projects.reduce((sum, p) => sum + (p.total_estimate || 0), 0)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 relative">
      <BlueprintGrid opacity={0.04} />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500 rounded-full filter blur-[128px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500 rounded-full filter blur-[128px]" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-teal-300 text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered Blueprint Analysis
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
              Blueprint Builder
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500">
                Pro
              </span>
            </h1>
            
            <p className="mt-6 text-lg text-slate-300 max-w-2xl mx-auto">
              Upload your architectural blueprints and let AI extract dimensions, 
              calculate materials, and generate accurate cost estimates in minutes.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to={createPageUrl('NewProject')}>
                <Button size="lg" className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-teal-500/25">
                  <Plus className="w-5 h-5 mr-2" />
                  New Project
                </Button>
              </Link>
              <Link to={createPageUrl('Projects')}>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-xl">
                  View All Projects
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
          
          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              { icon: Upload, title: 'Upload Blueprint', desc: 'Photo or scan of your plans' },
              { icon: Layers, title: 'AI Analysis', desc: 'Extract dimensions & elements' },
              { icon: Calculator, title: 'Get Estimate', desc: 'Detailed cost breakdown' }
            ].map((feature, i) => (
              <div 
                key={i}
                className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 text-center"
              >
                <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-teal-400/20 to-cyan-500/20 flex items-center justify-center">
                  <feature.icon className="w-7 h-7 text-teal-400" />
                </div>
                <h3 className="mt-4 font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{feature.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard
            icon={FolderOpen}
            label="Total Projects"
            value={stats.totalProjects}
            trend="+2 this month"
            trendUp={true}
          />
          <StatCard
            icon={FileCheck}
            label="Completed Estimates"
            value={stats.completedEstimates}
          />
          <StatCard
            icon={DollarSign}
            label="Total Estimated Value"
            value={`$${stats.totalEstimatedValue.toLocaleString()}`}
          />
        </div>

        {/* Recent Projects */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Recent Projects</h2>
              <p className="text-slate-500 mt-1">Your latest blueprint analyses and estimates</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Link to={createPageUrl('NewProject')}>
                <Button className="bg-teal-500 hover:bg-teal-600">
                  <Plus className="w-4 h-4 mr-2" />
                  New Project
                </Button>
              </Link>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.slice(0, 6).map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <GlassCard className="p-12 text-center">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center">
                <Building2 className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-slate-900">No projects yet</h3>
              <p className="mt-2 text-slate-500">Upload your first blueprint to get started</p>
              <Link to={createPageUrl('NewProject')}>
                <Button className="mt-6 bg-teal-500 hover:bg-teal-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Project
                </Button>
              </Link>
            </GlassCard>
          )}
        </div>

        {filteredProjects.length > 6 && (
          <div className="text-center">
            <Link to={createPageUrl('Projects')}>
              <Button variant="outline" size="lg">
                View All Projects
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}