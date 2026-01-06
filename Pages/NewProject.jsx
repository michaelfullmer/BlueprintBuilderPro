import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/lib/base44Client';
import BlueprintGrid from '../components/ui/BlueprintGrid';
import GlassCard from '../components/ui/GlassCard';
import StepIndicator from '../components/wizard/StepIndicator';
import BlueprintUploader from '../components/wizard/BlueprintUploader';
import BlueprintAnalyzer from '../components/wizard/BlueprintAnalyzer';
import MaterialSelector from '../components/wizard/MaterialSelector';
import LocationSelector from '../components/wizard/LocationSelector';
import PhaseBreakdown from '../components/estimate/PhaseBreakdown';
import CostSummary from '../components/estimate/CostSummary';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft, 
  ArrowRight, 
  Save,
  FileText,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function NewProject() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('id');
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedPhase, setExpandedPhase] = useState(null);
  
  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
    blueprint_url: null,
    extracted_data: null,
    material_selections: {},
    location: null,
    phase_estimates: [],
    total_material_cost: 0,
    total_labor_cost: 0,
    total_estimate: 0
  });

  useEffect(() => {
    if (editId) {
      loadProject(editId);
    }
  }, [editId]);

  const loadProject = async (id) => {
    setIsLoading(true);
    try {
      const projects = await base44.entities.Project.filter({ id });
      if (projects && projects[0]) {
        const project = projects[0];
        setProjectData(project);
        // Determine appropriate step based on data completeness
        if (project.phase_estimates?.length > 0) setCurrentStep(5);
        else if (project.material_selections && Object.keys(project.material_selections).length > 0) setCurrentStep(3);
        else if (project.extracted_data) setCurrentStep(2);
      }
    } catch (error) {
      console.error('Failed to load project:', error);
      toast.error('Failed to load project data');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProject = (updates) => {
    setProjectData(prev => ({ ...prev, ...updates }));
  };

  const generateEstimate = async () => {
    setIsGenerating(true);
    
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate a detailed construction cost estimate AND timeline schedule based on this data:

Blueprint Analysis:
- Total Square Footage: ${projectData.extracted_data?.total_sqft || 2000} sqft
- Floors: ${projectData.extracted_data?.floors || 1}
- Rooms: ${JSON.stringify(projectData.extracted_data?.rooms || [])}
- Foundation Type: ${projectData.extracted_data?.foundation_type || 'slab'}
- Roof Type: ${projectData.extracted_data?.roof_type || 'gable'}
- Windows: ${projectData.extracted_data?.windows || 10}
- Doors: ${projectData.extracted_data?.doors || 8}

Material Selections:
${JSON.stringify(projectData.material_selections, null, 2)}

Location: ${projectData.location?.city}, ${projectData.location?.state}
Region Labor Multiplier: ${getRegionMultiplier(projectData.location?.region)}

Generate estimates for these construction phases in order:
1. Foundation & Footers (foundation)
2. Framing (framing)
3. Electrical Rough-In (electrical)
4. Plumbing Rough-In (plumbing)
5. Insulation (insulation)
6. Drywall (drywall)
7. Interior Finishes - paint, flooring, fixtures (interior)
8. Siding & Exterior (siding)
9. Roofing (roofing)
10. Windows & Doors (windows_doors)
11. Landscaping (landscaping)

For each phase, provide:
- List of materials with quantities, unit prices, and totals
- Labor cost estimate based on regional rates
- Duration in days based on industry averages (foundation: 7-14 days, framing: 14-21 days, etc.)
- Dependencies (which phases must complete before this one can start)
- Total for the phase

Use realistic 2024 pricing and standard construction timelines.`,
        response_json_schema: {
          type: "object",
          properties: {
            phases: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  name: { type: "string" },
                  materials: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        brand: { type: "string" },
                        quantity: { type: "number" },
                        unit: { type: "string" },
                        unit_price: { type: "number" },
                        total_price: { type: "number" }
                      }
                    }
                  },
                  materials_cost: { type: "number" },
                  labor_cost: { type: "number" },
                  duration_days: { type: "number" },
                  dependencies: { type: "array", items: { type: "string" } }
                }
              }
            },
            total_material_cost: { type: "number" },
            total_labor_cost: { type: "number" },
            total_estimate: { type: "number" },
            total_duration_days: { type: "number" }
          }
        }
      });

      // Calculate schedule based on phases
      const today = new Date();
      const schedule = {
        start_date: today.toISOString().split('T')[0],
        total_duration_days: result.total_duration_days || result.phases.reduce((sum, p) => sum + (p.duration_days || 0), 0),
        phases: []
      };

      let currentDate = new Date(today);
      result.phases.forEach((phase) => {
        const startDate = new Date(currentDate);
        const endDate = new Date(currentDate);
        endDate.setDate(endDate.getDate() + (phase.duration_days || 7));
        
        schedule.phases.push({
          phase_id: phase.id,
          phase_name: phase.name,
          duration_days: phase.duration_days || 7,
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
          dependencies: phase.dependencies || []
        });
        
        currentDate = new Date(endDate);
        currentDate.setDate(currentDate.getDate() + 1); // 1 day buffer between phases
      });

      schedule.end_date = currentDate.toISOString().split('T')[0];

      updateProject({
        phase_estimates: result.phases,
        total_material_cost: result.total_material_cost,
        total_labor_cost: result.total_labor_cost,
        total_estimate: result.total_estimate,
        schedule: schedule,
        status: 'ready'
      });
      
      setCurrentStep(5);
    } catch (error) {
      console.error('Estimate generation error:', error);
      toast.error('Failed to generate estimate. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const getRegionMultiplier = (region) => {
    const multipliers = {
      northeast: 1.25,
      southeast: 0.95,
      midwest: 1.00,
      southwest: 1.05,
      west: 1.35,
      pacific: 1.50
    };
    return multipliers[region] || 1.00;
  };

  const saveProject = async () => {
    try {
      let project;
      if (editId) {
        project = await base44.entities.Project.update(editId, {
          ...projectData,
          status: projectData.phase_estimates.length > 0 ? 'ready' : 'draft'
        });
        toast.success('Project updated successfully!');
      } else {
        project = await base44.entities.Project.create({
          ...projectData,
          status: projectData.phase_estimates.length > 0 ? 'ready' : 'draft'
        });
        toast.success('Project saved successfully!');
      }
      navigate(createPageUrl(`ProjectDetail?id=${project.id}`));
    } catch (error) {
      toast.error('Failed to save project. Please try again.');
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return projectData.blueprint_url && projectData.name;
      case 2: return projectData.extracted_data;
      case 3: return Object.keys(projectData.material_selections).length >= 3;
      case 4: return projectData.location?.state;
      case 5: return true;
      default: return false;
    }
  };

  const handleNext = () => {
    if (currentStep === 4) {
      generateEstimate();
    } else if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 relative">
      <BlueprintGrid opacity={0.04} />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate(createPageUrl('Home'))}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{editId ? 'Edit Project' : 'New Project'}</h1>
              <p className="text-slate-500">{editId ? 'Update blueprint analysis and estimate' : 'Create a new blueprint analysis and estimate'}</p>
            </div>
          </div>
          
          {projectData.name && (
            <Button variant="outline" onClick={saveProject}>
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
          )}
        </div>

        {/* Step Indicator */}
        <StepIndicator 
          currentStep={currentStep} 
          onStepClick={(step) => step < currentStep && setCurrentStep(step)}
        />

        {/* Step Content */}
        <div className="mt-8">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-slate-900">Upload Your Blueprint</h2>
                  <p className="text-slate-500 mt-2">Start by uploading a photo or scan of your architectural plans</p>
                </div>

                <div className="max-w-xl mx-auto space-y-6">
                  <GlassCard className="p-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Project Name *</Label>
                        <Input
                          id="name"
                          value={projectData.name}
                          onChange={(e) => updateProject({ name: e.target.value })}
                          placeholder="e.g., Smith Residence - Main House"
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Description (Optional)</Label>
                        <Textarea
                          id="description"
                          value={projectData.description}
                          onChange={(e) => updateProject({ description: e.target.value })}
                          placeholder="Brief description of the project..."
                          className="mt-1.5 h-24"
                        />
                      </div>
                    </div>
                  </GlassCard>

                  <BlueprintUploader
                    existingUrl={projectData.blueprint_url}
                    onUploadComplete={(url) => updateProject({ blueprint_url: url })}
                  />
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-slate-900">Review Extracted Data</h2>
                  <p className="text-slate-500 mt-2">Verify the AI-detected elements and make corrections if needed</p>
                </div>

                <BlueprintAnalyzer
                  blueprintUrl={projectData.blueprint_url}
                  existingData={projectData.extracted_data}
                  onAnalysisComplete={(data) => updateProject({ extracted_data: data })}
                />
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-slate-900">Select Materials</h2>
                  <p className="text-slate-500 mt-2">Choose your preferred materials and quality levels for each category</p>
                </div>

                <MaterialSelector
                  extractedData={projectData.extracted_data}
                  existingSelections={projectData.material_selections}
                  onSelectionsChange={(selections) => updateProject({ material_selections: selections })}
                />
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-slate-900">Set Location</h2>
                  <p className="text-slate-500 mt-2">Enter the project location for accurate labor cost estimates</p>
                </div>

                <LocationSelector
                  existingLocation={projectData.location}
                  onLocationChange={(location) => updateProject({ location })}
                />
              </motion.div>
            )}

            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm mb-4">
                    <CheckCircle2 className="w-4 h-4" />
                    Estimate Complete
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Cost Estimate</h2>
                  <p className="text-slate-500 mt-2">Detailed breakdown by construction phase</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <PhaseBreakdown
                      phases={projectData.phase_estimates}
                      expandedPhase={expandedPhase}
                      onTogglePhase={(id) => setExpandedPhase(expandedPhase === id ? null : id)}
                    />
                  </div>
                  <div>
                    <CostSummary
                      estimate={projectData}
                      onExport={() => toast.info('PDF export feature coming soon!')}
                      onShare={() => toast.info('Share feature coming soon!')}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="mt-12 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentStep < 5 ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed() || isGenerating}
              className="bg-teal-500 hover:bg-teal-600"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Estimate...
                </>
              ) : currentStep === 4 ? (
                <>
                  Generate Estimate
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={saveProject}
              className="bg-emerald-500 hover:bg-emerald-600"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Project
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}