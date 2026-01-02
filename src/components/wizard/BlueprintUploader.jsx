import React, { useState, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import GlassCard from '../ui/GlassCard';
import { Button } from '@/components/ui/button';
import { 
  Upload, 
  Camera, 
  FileImage, 
  X, 
  Loader2,
  ZoomIn,
  RotateCw,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function BlueprintUploader({ onUploadComplete, existingUrl }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState(existingUrl || null);
  const [error, setError] = useState(null);
  const [imageQuality, setImageQuality] = useState(null);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateImage = (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Please upload a JPG, PNG, WebP, or PDF file');
    }
    if (file.size > 50 * 1024 * 1024) {
      throw new Error('File size must be under 50MB');
    }
    return true;
  };

  const analyzeImageQuality = async (url) => {
    // Simulate image quality analysis
    await new Promise(r => setTimeout(r, 1000));
    const score = Math.random() * 40 + 60; // 60-100
    return {
      score: Math.round(score),
      status: score > 80 ? 'excellent' : score > 60 ? 'good' : 'poor',
      suggestions: score < 80 ? ['Ensure better lighting', 'Hold camera steady'] : []
    };
  };

  const handleFile = async (file) => {
    try {
      setError(null);
      validateImage(file);
      setIsUploading(true);
      
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setUploadedUrl(file_url);
      
      const quality = await analyzeImageQuality(file_url);
      setImageQuality(quality);
      
      if (onUploadComplete) {
        onUploadComplete(file_url);
      }
    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  };

  const removeImage = () => {
    setUploadedUrl(null);
    setImageQuality(null);
    if (onUploadComplete) onUploadComplete(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {!uploadedUrl ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300 cursor-pointer",
                isDragging 
                  ? "border-teal-400 bg-teal-50/50" 
                  : "border-slate-200 hover:border-teal-300 hover:bg-slate-50/50",
                isUploading && "pointer-events-none opacity-50"
              )}
            >
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleInputChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isUploading}
              />
              
              <div className="text-center">
                {isUploading ? (
                  <>
                    <Loader2 className="w-16 h-16 mx-auto text-teal-500 animate-spin" />
                    <p className="mt-4 text-lg font-medium text-slate-700">Uploading blueprint...</p>
                    <p className="text-sm text-slate-500 mt-1">Please wait while we process your file</p>
                  </>
                ) : (
                  <>
                    <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-teal-400/20 to-cyan-500/20 flex items-center justify-center">
                      <Upload className="w-10 h-10 text-teal-600" />
                    </div>
                    <p className="mt-6 text-lg font-medium text-slate-700">
                      Drop your blueprint here
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                      or click to browse files
                    </p>
                    <div className="flex items-center justify-center gap-4 mt-6">
                      <span className="flex items-center gap-1.5 text-xs text-slate-400">
                        <FileImage className="w-4 h-4" /> JPG, PNG, WebP
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-slate-400">
                        <FileImage className="w-4 h-4" /> PDF
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-rose-700">{error}</p>
                  <p className="text-xs text-rose-500 mt-1">Please try again with a different file</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <GlassCard className="overflow-hidden">
              <div className="relative aspect-[4/3] bg-slate-100">
                <img 
                  src={uploadedUrl} 
                  alt="Uploaded blueprint"
                  className="w-full h-full object-contain"
                />
                <div className="absolute top-3 right-3 flex gap-2">
                  <Button 
                    size="icon" 
                    variant="secondary"
                    className="bg-white/90 backdrop-blur-sm hover:bg-white"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="secondary"
                    className="bg-white/90 backdrop-blur-sm hover:bg-white"
                  >
                    <RotateCw className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="destructive"
                    onClick={removeImage}
                    className="bg-rose-500/90 backdrop-blur-sm hover:bg-rose-500"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {imageQuality && (
                <div className="p-4 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className={cn(
                        "w-5 h-5",
                        imageQuality.status === 'excellent' ? 'text-emerald-500' :
                        imageQuality.status === 'good' ? 'text-amber-500' : 'text-rose-500'
                      )} />
                      <span className="text-sm font-medium text-slate-700">
                        Image Quality: {imageQuality.status.charAt(0).toUpperCase() + imageQuality.status.slice(1)}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">{imageQuality.score}%</span>
                  </div>
                  {imageQuality.suggestions.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {imageQuality.suggestions.map((s, i) => (
                        <li key={i} className="text-xs text-slate-500 flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-slate-400" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-6 flex items-center justify-center gap-6">
        <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-teal-600 transition-colors">
          <Camera className="w-4 h-4" />
          <span>Use Camera</span>
        </button>
        <span className="w-px h-4 bg-slate-200" />
        <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-teal-600 transition-colors">
          <FileImage className="w-4 h-4" />
          <span>Sample Blueprint</span>
        </button>
      </div>
    </div>
  );
}