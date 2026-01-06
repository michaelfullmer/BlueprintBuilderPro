import React, { useState } from 'react';
import GlassCard from '../ui/GlassCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Locate, Building2, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

const regions = [
  { id: 'northeast', name: 'Northeast', laborMultiplier: 1.25, states: ['CT', 'ME', 'MA', 'NH', 'NJ', 'NY', 'PA', 'RI', 'VT'] },
  { id: 'southeast', name: 'Southeast', laborMultiplier: 0.95, states: ['AL', 'FL', 'GA', 'KY', 'MS', 'NC', 'SC', 'TN', 'VA', 'WV'] },
  { id: 'midwest', name: 'Midwest', laborMultiplier: 1.00, states: ['IL', 'IN', 'IA', 'KS', 'MI', 'MN', 'MO', 'NE', 'ND', 'OH', 'SD', 'WI'] },
  { id: 'southwest', name: 'Southwest', laborMultiplier: 1.05, states: ['AZ', 'NM', 'OK', 'TX'] },
  { id: 'west', name: 'West', laborMultiplier: 1.35, states: ['CA', 'CO', 'ID', 'MT', 'NV', 'OR', 'UT', 'WA', 'WY'] },
  { id: 'pacific', name: 'Pacific (HI, AK)', laborMultiplier: 1.50, states: ['AK', 'HI'] }
];

const allStates = [
  { code: 'AL', name: 'Alabama' }, { code: 'AK', name: 'Alaska' }, { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' }, { code: 'CA', name: 'California' }, { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' }, { code: 'DE', name: 'Delaware' }, { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' }, { code: 'HI', name: 'Hawaii' }, { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' }, { code: 'IN', name: 'Indiana' }, { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' }, { code: 'KY', name: 'Kentucky' }, { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' }, { code: 'MD', name: 'Maryland' }, { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' }, { code: 'MN', name: 'Minnesota' }, { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' }, { code: 'MT', name: 'Montana' }, { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' }, { code: 'NH', name: 'New Hampshire' }, { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' }, { code: 'NY', name: 'New York' }, { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' }, { code: 'OH', name: 'Ohio' }, { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' }, { code: 'PA', name: 'Pennsylvania' }, { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' }, { code: 'SD', name: 'South Dakota' }, { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' }, { code: 'UT', name: 'Utah' }, { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' }, { code: 'WA', name: 'Washington' }, { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' }, { code: 'WY', name: 'Wyoming' }
];

export default function LocationSelector({ onLocationChange, existingLocation }) {
  const [location, setLocation] = useState(existingLocation || {
    city: '',
    state: '',
    zip_code: '',
    region: ''
  });

  const handleChange = (field, value) => {
    const newLocation = { ...location, [field]: value };
    
    // Auto-detect region based on state
    if (field === 'state') {
      const region = regions.find(r => r.states.includes(value));
      if (region) {
        newLocation.region = region.id;
      }
    }
    
    setLocation(newLocation);
    if (onLocationChange) onLocationChange(newLocation);
  };

  const selectedRegion = regions.find(r => r.id === location.region);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-teal-400/20 to-cyan-500/20">
            <MapPin className="w-6 h-6 text-teal-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Project Location</h3>
            <p className="text-sm text-slate-500">Enter your location for accurate labor cost estimates</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={location.city}
              onChange={(e) => handleChange('city', e.target.value)}
              placeholder="Enter city name"
              className="mt-1.5"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="state">State</Label>
              <Select value={location.state} onValueChange={(v) => handleChange('state', v)}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {allStates.map((state) => (
                    <SelectItem key={state.code} value={state.code}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="zip">ZIP Code</Label>
              <Input
                id="zip"
                value={location.zip_code}
                onChange={(e) => handleChange('zip_code', e.target.value)}
                placeholder="12345"
                maxLength={5}
                className="mt-1.5"
              />
            </div>
          </div>
        </div>
      </GlassCard>

      {selectedRegion && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-50">
                  <Building2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Detected Region</p>
                  <p className="font-semibold text-slate-900">{selectedRegion.name}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 justify-end">
                  <DollarSign className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-500">Labor Multiplier</span>
                </div>
                <p className="text-2xl font-bold text-slate-900">
                  {selectedRegion.laborMultiplier.toFixed(2)}x
                </p>
              </div>
            </div>
            
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-sm text-slate-600">
                {selectedRegion.laborMultiplier > 1 
                  ? `Labor costs in ${selectedRegion.name} are typically ${Math.round((selectedRegion.laborMultiplier - 1) * 100)}% higher than the national average.`
                  : selectedRegion.laborMultiplier < 1
                    ? `Labor costs in ${selectedRegion.name} are typically ${Math.round((1 - selectedRegion.laborMultiplier) * 100)}% lower than the national average.`
                    : `Labor costs in ${selectedRegion.name} are at the national average.`
                }
              </p>
            </div>
          </GlassCard>
        </motion.div>
      )}

      <GlassCard className="p-6">
        <h4 className="font-semibold text-slate-900 mb-4">Regional Labor Rates Overview</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {regions.map((region) => (
            <button
              key={region.id}
              onClick={() => handleChange('region', region.id)}
              className={`p-3 rounded-xl text-left transition-all ${
                location.region === region.id
                  ? 'bg-amber-100 border-2 border-amber-400'
                  : 'bg-slate-50 border-2 border-transparent hover:border-slate-200'
              }`}
            >
              <p className="font-medium text-slate-900">{region.name}</p>
              <p className="text-sm text-slate-500 mt-1">{region.laborMultiplier}x rate</p>
            </button>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}