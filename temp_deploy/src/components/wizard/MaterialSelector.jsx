import React, { useState } from 'react';
import GlassCard from '../ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Check,
  Home,
  Layers,
  Square,
  Paintbrush,
  Lightbulb,
  Droplets,
  Wind,
  Hammer,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const materialCategories = [
  {
    id: 'siding',
    name: 'Siding',
    icon: Home,
    options: [
      { id: 'vinyl', name: 'Vinyl Siding', tier: 'budget', price: 3.50, unit: 'sqft', brands: ['CertainTeed', 'Alside', 'Kaycan'], colors: ['White', 'Gray', 'Beige', 'Blue'] },
      { id: 'hardie', name: 'Hardie Board', tier: 'mid_range', price: 8.00, unit: 'sqft', brands: ['James Hardie'], colors: ['Arctic White', 'Cobblestone', 'Evening Blue', 'Khaki Brown'] },
      { id: 'brick', name: 'Brick Veneer', tier: 'premium', price: 15.00, unit: 'sqft', brands: ['Boral', 'General Shale'], colors: ['Red', 'Brown', 'Gray', 'Mixed'] },
      { id: 'wood', name: 'Wood Clapboard', tier: 'premium', price: 12.00, unit: 'sqft', brands: ['Cedar', 'Redwood'], colors: ['Natural', 'Stained', 'Painted'] },
      { id: 'stucco', name: 'Stucco', tier: 'mid_range', price: 7.00, unit: 'sqft', brands: ['Parex', 'LaHabra'], colors: ['Sand', 'Desert Tan', 'White', 'Terra Cotta'] }
    ]
  },
  {
    id: 'roofing',
    name: 'Roofing',
    icon: Triangle,
    options: [
      { id: 'asphalt', name: 'Asphalt Shingles', tier: 'budget', price: 3.00, unit: 'sqft', warranty: '25 years', brands: ['GAF', 'Owens Corning', 'CertainTeed'], colors: ['Black', 'Charcoal', 'Weathered Wood', 'Slate'] },
      { id: 'metal', name: 'Metal Roofing', tier: 'mid_range', price: 8.50, unit: 'sqft', warranty: '50 years', brands: ['Fabral', 'Classic Metal'], colors: ['Galvalume', 'Black', 'Bronze', 'Forest Green'], energyEfficient: true },
      { id: 'tile', name: 'Clay Tiles', tier: 'premium', price: 15.00, unit: 'sqft', warranty: '75 years', brands: ['Ludowici', 'US Tile'], colors: ['Terra Cotta', 'Brown', 'Gray'] },
      { id: 'slate', name: 'Slate', tier: 'luxury', price: 25.00, unit: 'sqft', warranty: '100+ years', brands: ['Vermont Slate', 'SlateTec'], colors: ['Black', 'Gray', 'Green', 'Purple'] }
    ]
  },
  {
    id: 'flooring',
    name: 'Flooring',
    icon: Square,
    options: [
      { id: 'carpet', name: 'Carpet', tier: 'budget', price: 4.00, unit: 'sqft', brands: ['Shaw', 'Mohawk', 'Stainmaster'] },
      { id: 'laminate', name: 'Laminate', tier: 'budget', price: 3.50, unit: 'sqft', brands: ['Pergo', 'Quick-Step', 'Mohawk'] },
      { id: 'vinyl_plank', name: 'Vinyl Plank', tier: 'mid_range', price: 5.00, unit: 'sqft', brands: ['COREtec', 'Shaw Floorté', 'Lifeproof'] },
      { id: 'tile', name: 'Ceramic Tile', tier: 'mid_range', price: 6.00, unit: 'sqft', brands: ['Daltile', 'Florida Tile', 'Marazzi'] },
      { id: 'hardwood', name: 'Hardwood', tier: 'premium', price: 10.00, unit: 'sqft', brands: ['Bruce', 'Kahrs', 'Carlisle'], species: ['Oak', 'Maple', 'Walnut', 'Hickory'] }
    ]
  },
  {
    id: 'windows',
    name: 'Windows',
    icon: Layers,
    options: [
      { id: 'vinyl', name: 'Vinyl Windows', tier: 'budget', price: 350, unit: 'window', brands: ['Simonton', 'Milgard', 'American Craftsman'], energyRating: 'Energy Star' },
      { id: 'wood', name: 'Wood Windows', tier: 'premium', price: 800, unit: 'window', brands: ['Marvin', 'Andersen', 'Pella'], energyRating: 'Energy Star Plus' },
      { id: 'fiberglass', name: 'Fiberglass Windows', tier: 'mid_range', price: 600, unit: 'window', brands: ['Marvin Integrity', 'Pella Impervia'], energyRating: 'Energy Star' },
      { id: 'aluminum', name: 'Aluminum Windows', tier: 'budget', price: 400, unit: 'window', brands: ['Kawneer', 'Milgard'] }
    ]
  },
  {
    id: 'insulation',
    name: 'Insulation',
    icon: Wind,
    options: [
      { id: 'fiberglass', name: 'Fiberglass Batts', tier: 'budget', price: 0.50, unit: 'sqft', rValue: 'R-13 to R-38', brands: ['Owens Corning', 'Johns Manville'] },
      { id: 'cellulose', name: 'Blown Cellulose', tier: 'mid_range', price: 1.20, unit: 'sqft', rValue: 'R-3.5 per inch', brands: ['GreenFiber', 'Nu-Wool'] },
      { id: 'spray_foam', name: 'Spray Foam', tier: 'premium', price: 2.50, unit: 'sqft', rValue: 'R-6 per inch', brands: ['Icynene', 'BASF'] }
    ]
  },
  {
    id: 'paint',
    name: 'Paint',
    icon: Paintbrush,
    options: [
      { id: 'builder', name: 'Builder Grade', tier: 'budget', price: 25, unit: 'gallon', brands: ['Valspar', 'Glidden'] },
      { id: 'premium', name: 'Premium', tier: 'mid_range', price: 45, unit: 'gallon', brands: ['Sherwin-Williams', 'Benjamin Moore'] },
      { id: 'designer', name: 'Designer', tier: 'luxury', price: 85, unit: 'gallon', brands: ['Farrow & Ball', 'Fine Paints of Europe'] }
    ]
  },
  {
    id: 'fixtures',
    name: 'Fixtures',
    icon: Lightbulb,
    options: [
      { id: 'budget', name: 'Budget Fixtures', tier: 'budget', price: 1500, unit: 'bathroom', brands: ['Delta', 'Moen Basics', 'American Standard'] },
      { id: 'mid_range', name: 'Mid-Range Fixtures', tier: 'mid_range', price: 3500, unit: 'bathroom', brands: ['Kohler', 'Moen', 'Pfister'] },
      { id: 'premium', name: 'Premium Fixtures', tier: 'premium', price: 8000, unit: 'bathroom', brands: ['Grohe', 'Brizo', 'Hansgrohe'] }
    ]
  }
];

const tierColors = {
  budget: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  mid_range: 'bg-blue-100 text-blue-700 border-blue-200',
  premium: 'bg-purple-100 text-purple-700 border-purple-200',
  luxury: 'bg-amber-100 text-amber-700 border-amber-200'
};

const tierLabels = {
  budget: 'Budget-Friendly',
  mid_range: 'Mid-Range',
  premium: 'Premium',
  luxury: 'Luxury'
};

function Triangle(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 20h18L12 4z" />
    </svg>
  );
}

export default function MaterialSelector({ extractedData, onSelectionsChange, existingSelections }) {
  const [selections, setSelections] = useState(existingSelections || {});
  const [activeCategory, setActiveCategory] = useState('siding');
  const [expandedOption, setExpandedOption] = useState(null);

  const handleSelection = (categoryId, option) => {
    const newSelections = {
      ...selections,
      [categoryId]: {
        ...option,
        category: categoryId
      }
    };
    setSelections(newSelections);
    if (onSelectionsChange) onSelectionsChange(newSelections);
  };

  const handleSubOption = (categoryId, field, value) => {
    const newSelections = {
      ...selections,
      [categoryId]: {
        ...selections[categoryId],
        [field]: value
      }
    };
    setSelections(newSelections);
    if (onSelectionsChange) onSelectionsChange(newSelections);
  };

  const currentCategory = materialCategories.find(c => c.id === activeCategory);
  const CategoryIcon = currentCategory?.icon || Home;

  return (
    <div className="max-w-5xl mx-auto">
      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="flex flex-wrap justify-center gap-2 bg-transparent h-auto p-2">
          {materialCategories.map((category) => {
            const Icon = category.icon;
            const isSelected = selections[category.id];
            return (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className={cn(
                  "px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all data-[state=active]:bg-white data-[state=active]:shadow-lg",
                  isSelected && "ring-2 ring-teal-400 ring-offset-2"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{category.name}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-emerald-500" />}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {materialCategories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-6">
            <div className="grid gap-4">
              {category.options.map((option) => (
                <GlassCard
                  key={option.id}
                  className={cn(
                    "cursor-pointer transition-all hover:border-teal-400/50",
                    selections[category.id]?.id === option.id ? "ring-2 ring-teal-400 ring-offset-2 border-teal-400" : "hover:shadow-md"
                  )}
                  onClick={() => handleSelection(category.id, option)}
                >
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-slate-900">{option.name}</h4>
                        <Badge variant="secondary" className={tierColors[option.tier]}>
                          {tierLabels[option.tier]}
                        </Badge>
                      </div>
                      <div className="text-sm text-slate-500 mt-1">
                        ${option.price.toFixed(2)} / {option.unit}
                      </div>
                    </div>
                    {selections[category.id]?.id === option.id && (
                      <div className="w-6 h-6 rounded-full bg-teal-400 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </GlassCard>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
