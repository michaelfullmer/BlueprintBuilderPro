import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import GlassCard from '../ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Loader2, 
  CheckCircle2, 
  Edit3, 
  Save,
  Home,
  Layers,
  Square,
  Triangle,
  AlertCircle,
  Plus,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function BlueprintAnalyzer({ blueprintUrl, onAnalysisComplete, existingData }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [extractedData, setExtractedData] = useState(existingData || null);
  const [editMode, setEditMode] = useState({});
  const [error, setError] = useState(null);
  const [useOpenRouter, setUseOpenRouter] = useState(false);
  const [statusMessages, setStatusMessages] = useState([]);

  const fetchWithTimeout = async (url, options = {}, ms = 15000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), ms);
    try {
      const resp = await fetch(url, { ...options, signal: controller.signal });
      return resp;
    } finally {
      clearTimeout(id);
    }
  };

  const requestWithRetries = async (fn, attempts = 3, baseDelayMs = 2000) => {
    let lastErr;
    for (let i = 0; i < attempts; i++) {
      try {
        return await fn();
      } catch (e) {
        lastErr = e;
        const isTimeout = e?.name === 'AbortError' || String(e?.message || '').toLowerCase().includes('timeout') || String(e?.message || '').includes('ERR_ABORTED');
        if (!isTimeout || i === attempts - 1) throw e;
        await new Promise(r => setTimeout(r, baseDelayMs * (i + 1)));
      }
    }
    throw lastErr;
  };

  const logMessage = (msg) => {
    setStatusMessages((prev) => [...prev, msg]);
    try {
      toast.message(msg);
    } catch {}
  };

  useEffect(() => {
    if (blueprintUrl && !existingData) {
      analyzeBlueprint();
    }
  }, [blueprintUrl]);

  const analyzeBlueprint = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setError(null);
    setStatusMessages([]);
    let progressInterval;

    try {
      progressInterval = setInterval(() => {
        setAnalysisProgress(p => Math.min(p + Math.random() * 15, 90));
      }, 500);

      const provider = localStorage.getItem('ai_provider') || 'google';
      
      let result;

      logMessage('Calling backend analysis');
      const resp = await requestWithRetries(
        () => fetchWithTimeout('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            blueprintUrl,
            provider,
            googleKey: localStorage.getItem('google_api_key') || undefined,
            openRouterKey: localStorage.getItem('openrouter_api_key') || undefined,
            openRouterModel: localStorage.getItem('openrouter_model') || undefined
          })
        }, 45000),
        2,
        1500
      );
      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        if (errData?.details?.length) {
          errData.details.forEach(d => logMessage(`Provider ${d.provider} failed: ${d.message}`));
        }
        throw new Error(errData.error || 'Backend analyze error');
      }
      const data = await resp.json();
      result = data.result;
      if (data.provider) logMessage(`Completed with: ${data.provider}`);

      setAnalysisProgress(100);
      
      await new Promise(r => setTimeout(r, 500));
      setExtractedData(result);
      
      if (onAnalysisComplete) {
        onAnalysisComplete(result);
      }
    } catch (err) {
      console.error('Blueprint analysis failed:', err);
      toast.error(`Analysis failed: ${err.message}`);
      setAnalysisProgress(p => Math.max(p, 95));
      setError(`Failed to analyze blueprint: ${err.message || 'Unknown error'}`);
    } finally {
      if (progressInterval) clearInterval(progressInterval);
      setIsAnalyzing(false);
    }
  };

  const updateField = (path, value) => {
    const newData = { ...extractedData };
    const keys = path.split('.');
    let current = newData;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    setExtractedData(newData);
    if (onAnalysisComplete) onAnalysisComplete(newData);
  };

  const toggleEdit = (field) => {
    setEditMode(prev => ({ ...prev, [field]: !prev[field] }));
  };

  if (isAnalyzing) {
    return (
      <GlassCard className="p-8 max-w-2xl mx-auto">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="42"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="6"
              />
              <circle
                cx="48"
                cy="48"
                r="42"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={264}
                strokeDashoffset={264 - (analysisProgress / 100) * 264}
                className="transition-all duration-300"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#14b8a6" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-slate-900">{Math.round(analysisProgress)}%</span>
            </div>
          </div>
          
          <h3 className="mt-6 text-lg font-semibold text-slate-900">Analyzing Blueprint</h3>
          <p className="text-sm text-slate-500 mt-2">
            Our AI is extracting dimensions, rooms, and structural elements...
          </p>
          
          <div className="mt-6 space-y-2">
            {['Detecting walls and rooms', 'Measuring dimensions', 'Identifying structural elements', 'Calculating areas'].map((step, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.5 }}
                className="flex items-center gap-2 text-sm text-slate-600"
              >
                {analysisProgress > (i + 1) * 20 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
                )}
                {step}
              </motion.div>
            ))}
          </div>
          <div className="mt-4 text-xs text-slate-500">
            {statusMessages.length > 0 ? statusMessages[statusMessages.length - 1] : 'Preparing providers...'}
          </div>
        </div>
      </GlassCard>
    );
  }

  if (error) {
    return (
      <GlassCard className="p-8 max-w-2xl mx-auto">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-rose-500 mx-auto" />
          <h3 className="mt-4 text-lg font-semibold text-slate-900">Analysis Failed</h3>
          <p className="text-sm text-slate-500 mt-2">{error}</p>
          <div className="mt-4 space-y-1">
            {statusMessages.map((m, i) => (
              <div key={i} className="text-xs text-slate-500">{m}</div>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Button onClick={analyzeBlueprint} className="bg-amber-500 hover:bg-amber-600">
              Try Again
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                try {
                  localStorage.setItem('prefer_base_llm', 'true');
                  localStorage.setItem('enable_external_llm', 'false');
                } catch {}
                analyzeBlueprint();
              }}
            >
              Use Base Provider
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                try {
                  localStorage.setItem('enable_external_llm', 'true');
                  localStorage.setItem('prefer_base_llm', 'false');
                } catch {}
                analyzeBlueprint();
              }}
            >
              Enable External Providers
            </Button>
          </div>
        </div>
      </GlassCard>
    );
  }

  if (!extractedData) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50">
              <Square className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Total Area</p>
              <div className="flex items-center gap-1">
                {editMode.sqft ? (
                  <Input
                    type="number"
                    value={extractedData.total_sqft}
                    onChange={(e) => updateField('total_sqft', parseFloat(e.target.value))}
                    onBlur={() => toggleEdit('sqft')}
                    className="w-20 h-7 text-sm"
                    autoFocus
                  />
                ) : (
                  <span className="font-semibold text-slate-900">
                    {extractedData.total_sqft?.toLocaleString()} sqft
                  </span>
                )}
                <button onClick={() => toggleEdit('sqft')} className="text-slate-400 hover:text-teal-500">
                  <Edit3 className="w-3 h-3" />
                </button>
              </div>
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
              <div className="flex items-center gap-1">
                {editMode.floors ? (
                  <Input
                    type="number"
                    value={extractedData.floors}
                    onChange={(e) => updateField('floors', parseInt(e.target.value))}
                    onBlur={() => toggleEdit('floors')}
                    className="w-16 h-7 text-sm"
                    autoFocus
                  />
                ) : (
                  <span className="font-semibold text-slate-900">{extractedData.floors}</span>
                )}
                <button onClick={() => toggleEdit('floors')} className="text-slate-400 hover:text-teal-500">
                  <Edit3 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-50">
              <Home className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Foundation</p>
              <span className="font-semibold text-slate-900 text-sm capitalize">
                {extractedData.foundation_type?.replace('_', ' ')}
              </span>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-50">
              <Triangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Roof Type</p>
              <span className="font-semibold text-slate-900 text-sm capitalize">
                {extractedData.roof_type?.replace('_', ' ')}
              </span>
            </div>
          </div>
        </GlassCard>
      </div>

      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900">Rooms Detected</h3>
          <Badge variant="secondary" className="bg-teal-100 text-teal-700">
            {extractedData.rooms?.length || 0} rooms
          </Badge>
        </div>
        
        <div className="grid gap-3">
          {extractedData.rooms?.map((room, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-sm font-medium text-slate-600">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-slate-900">{room.name}</p>
                  <p className="text-xs text-slate-500">{room.length}' x {room.width}'</p>
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
      </GlassCard>

      <div className="grid md:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Openings</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Windows</span>
              <span className="font-semibold text-slate-900">{extractedData.windows}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Doors</span>
              <span className="font-semibold text-slate-900">{extractedData.doors}</span>
            </div>
            {extractedData.garage_bays > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Garage Bays</span>
                <span className="font-semibold text-slate-900">{extractedData.garage_bays}</span>
              </div>
            )}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Special Features</h3>
          <div className="flex flex-wrap gap-2">
            {extractedData.special_features?.map((feature, i) => (
              <Badge key={i} variant="secondary" className="bg-slate-100">
                {feature}
              </Badge>
            ))}
            {(!extractedData.special_features || extractedData.special_features.length === 0) && (
              <p className="text-sm text-slate-500">No special features detected</p>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
