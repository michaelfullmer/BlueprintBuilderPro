import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = [
  { id: 1, name: 'Upload', description: 'Blueprint photo' },
  { id: 2, name: 'Review', description: 'Confirm elements' },
  { id: 3, name: 'Materials', description: 'Select options' },
  { id: 4, name: 'Location', description: 'Set region' },
  { id: 5, name: 'Estimate', description: 'View results' }
];

export default function StepIndicator({ currentStep, onStepClick }) {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between max-w-3xl mx-auto px-4">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <button
              onClick={() => onStepClick && step.id < currentStep && onStepClick(step.id)}
              disabled={step.id > currentStep}
              className={cn(
                "flex flex-col items-center transition-all duration-300 group",
                step.id <= currentStep ? "cursor-pointer" : "cursor-not-allowed"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300",
                step.id < currentStep && "bg-emerald-500 text-white",
                step.id === currentStep && "bg-gradient-to-br from-teal-400 to-cyan-500 text-white shadow-lg shadow-teal-200/50",
                step.id > currentStep && "bg-slate-100 text-slate-400 border border-slate-200"
              )}>
                {step.id < currentStep ? (
                  <Check className="w-5 h-5" />
                ) : (
                  step.id
                )}
              </div>
              <div className="mt-2 text-center hidden sm:block">
                <p className={cn(
                  "text-sm font-medium transition-colors",
                  step.id === currentStep ? "text-slate-900" : "text-slate-500"
                )}>
                  {step.name}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{step.description}</p>
              </div>
            </button>
            
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-2 sm:mx-4 relative">
                <div className="absolute inset-0 bg-slate-200 rounded-full" />
                <div 
                  className={cn(
                    "absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-500",
                    step.id < currentStep ? "w-full" : "w-0"
                  )} 
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}