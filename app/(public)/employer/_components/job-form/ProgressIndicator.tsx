import React from 'react';

interface ProgressIndicatorProps {
  currentStep: number
  totalSteps: number
}

const STEP_LABELS = ['Job Details', 'Responsibilities', 'Application', 'Review']

export default function ProgressIndicator({
  currentStep,
  totalSteps,
}: ProgressIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-center gap-0 md:gap-4 mb-4 w-full max-w-3xl mx-auto">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const step = index + 1;
          return (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center min-w-[64px]">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all shadow-sm border-2 ${
                    step <= currentStep
                      ? 'bg-primary text-white border-primary'
                      : 'bg-[#f0f2f4] dark:bg-slate-700 text-[#617589] border-[#617589] dark:border-slate-700'
                  }`}
                >
                  {step < currentStep ? (
                    <span className="material-symbols-outlined">check</span>
                  ) : (
                    step
                  )}
                </div>
                <span className="mt-2 text-xs text-[#617589] dark:text-slate-400 text-center w-24 truncate">
                  {STEP_LABELS[index]}
                </span>
              </div>
              {step < totalSteps && (
                <div
                  className={`flex-1 h-1 mx-1 md:mx-2 transition-all ${
                    step < currentStep
                      ? 'bg-primary'
                      : 'bg-[#f0f2f4] dark:bg-slate-700'
                  }`}
                  style={{ minWidth: 32 }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  )
}
