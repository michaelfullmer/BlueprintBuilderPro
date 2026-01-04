// src/pages/Settings.jsx

import { useState, useEffect } from 'react';

export default function Settings() {
  const [apiKey, setApiKey] = useState('');

  // Load saved key on mount
  useEffect(() => {
    const saved = localStorage.getItem('claude_api_key') || '';
    setApiKey(saved);
  }, []);

  const saveKey = () => {
    localStorage.setItem('claude_api_key', apiKey.trim());
    alert('API key saved! Live mode will be used on next analysis.');
  };

  const clearKey = () => {
    setApiKey('');
    localStorage.removeItem('claude_api_key');
    alert('API key cleared — back to mock mode.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Settings</h1>
        
        <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-8 border border-slate-700">
          <h2 className="text-xl font-semibold text-white mb-4">Claude API Key</h2>
          <p className="text-slate-300 mb-6">
            Enter your Claude API key for real AI analysis. Leave blank for mock mode (demo data).
          </p>
          
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-ant-api03-..."
            className="w-full px-6 py-4 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#00E5E5] transition text-lg"
          />
          
          <div className="flex gap-4 mt-8">
            <button
              onClick={saveKey}
              className="px-8 py-4 bg-[#00E5E5] text-slate-900 rounded-xl font-semibold hover:bg-[#00E5E5]/80 transition"
            >
              Save Key
            </button>
            <button
              onClick={clearKey}
              className="px-8 py-4 bg-slate-700 text-white rounded-xl font-semibold hover:bg-slate-600 transition"
            >
              Clear Key
            </button>
          </div>
          
          <p className="text-xs text-slate-400 mt-8">
            Your key is stored locally in your browser only — never sent to our servers.
          </p>
        </div>
      </div>
    </div>
  );
}
