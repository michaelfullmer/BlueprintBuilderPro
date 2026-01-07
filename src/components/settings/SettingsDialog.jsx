import React, { useState, useEffect } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Save, Key } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SettingsDialog({ open, onOpenChange }) {
  const [provider, setProvider] = useState('openrouter');
  const [apiKey, setApiKey] = useState('');
  const [googleKey, setGoogleKey] = useState('');
  const [model, setModel] = useState('');
  
  useEffect(() => {
    if (open) {
      const storedProvider = localStorage.getItem('ai_provider') || 'openrouter';
      setProvider(storedProvider);
      
      const storedKey = localStorage.getItem('openrouter_api_key');
      if (storedKey) setApiKey(storedKey);
      
      const storedGoogleKey = localStorage.getItem('google_api_key');
      if (storedGoogleKey) setGoogleKey(storedGoogleKey);

      const storedModel = localStorage.getItem('openrouter_model');
      if (storedModel) setModel(storedModel);
    }
  }, [open]);

  const handleSave = () => {
    localStorage.setItem('ai_provider', provider);
    localStorage.setItem('openrouter_api_key', apiKey);
    localStorage.setItem('google_api_key', googleKey);
    localStorage.setItem('openrouter_model', model || 'qwen/qwen2.5-vl-32b-instruct:free');
    localStorage.setItem('use_openrouter', 'true'); // Always true if we are using this dialog
    onOpenChange(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md"
          >
            <GlassCard className="relative p-6">
              <button 
                onClick={() => onOpenChange(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <Key className="w-5 h-5 text-slate-600" />
                </div>
                <h2 className="text-xl font-semibold text-slate-900">AI Settings</h2>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="provider">AI Provider</Label>
                  <select
                    id="provider"
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="openrouter">OpenRouter (Free Models)</option>
                    <option value="google">Google Gemini (Free Tier)</option>
                  </select>
                </div>

                {provider === 'openrouter' ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="apiKey">OpenRouter API Key</Label>
                      <Input
                        id="apiKey"
                        type="password"
                        placeholder="sk-or-..."
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                      />
                      <p className="text-xs text-slate-500">
                        Get a free key at openrouter.ai
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="model">Model</Label>
                      <Input
                        id="model"
                        type="text"
                        placeholder="qwen/qwen2.5-vl-32b-instruct:free"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                      />
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="googleKey">Google Gemini API Key</Label>
                    <Input
                      id="googleKey"
                      type="password"
                      placeholder="AIza..."
                      value={googleKey}
                      onChange={(e) => setGoogleKey(e.target.value)}
                    />
                    <p className="text-xs text-slate-500">
                      Get a free key at aistudio.google.com
                    </p>
                  </div>
                )}
                
                <div className="flex justify-end pt-4">
                  <Button onClick={handleSave} className="bg-slate-900 text-white hover:bg-slate-800">
                    <Save className="w-4 h-4 mr-2" />
                    Save Settings
                  </Button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
