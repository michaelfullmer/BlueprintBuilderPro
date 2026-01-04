import { useState, useEffect } from 'react';

export default function Settings() {
  const [key, setKey] = useState('');

  useEffect(() => {
    setKey(localStorage.getItem('claude_api_key') || '');
  }, []);

  const saveKey = () => {
    localStorage.setItem('claude_api_key', key.trim());
    alert('API key saved! App will use live mode on next action.');
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>
      <div className="bg-slate-800 rounded-xl p-6">
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Claude API Key (optional)
        </label>
        <input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="sk-ant-..."
          className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
        />
        <p className="text-xs text-slate-400 mt-2">
          Leave blank for mock mode. Key is stored locally only.
        </p>
        <button
          onClick={saveKey}
          className="mt-6 px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition"
        >
          Save Key
        </button>
      </div>
    </div>
  );
}
