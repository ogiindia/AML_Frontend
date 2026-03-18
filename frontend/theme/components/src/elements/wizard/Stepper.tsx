import React from 'react';

interface Step {
  title: string;
  description: string;
  completed: boolean;
  active: boolean;
}

interface StepperProps {
  steps: Step[];
  onStepClick: (index: number) => void;
}

export const Stepper: React.FC<StepperProps> = ({ steps, onStepClick }) => {
  return (
    <div className="flex flex-col gap-6">
      {steps.map((step, index) => (
        <div
          key={index}
          className="flex items-start gap-3 cursor-pointer"
          onClick={() => onStepClick(index)}
        >
          <div className="mt-1">
            {step.completed ? (
              <span className="text-green-500">✔</span>
            ) : step.active ? (
              <span className="text-green-500">●</span>
            ) : (
              <span className="text-gray-400">○</span>
            )}
          </div>
          <div>
            <h4
              className={`font-semibold ${step.active ? 'text-green-500' : 'text-gray-700'}`}
            >
              {step.title}
            </h4>
            <p className="text-sm text-gray-500">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
