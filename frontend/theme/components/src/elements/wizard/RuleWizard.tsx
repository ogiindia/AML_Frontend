import React, { useState } from 'react';
import { RuleActions } from './RuleActions';
import { Transaction} from './Transaction'
import { RuleGroup } from './RuleGroup';
import { RuleForm } from './RuleInfo';
import { Stepper } from './Stepper';
import { Action, RuleGroup as GroupType } from './types';
import {
  EditButton,
} from '@ais/components';
import {RulesAdded} from "./RulesAdded"


const steps = [
  { title: 'Add Rule', description: 'Define rule type and metadata.' },
  { title: 'Define Conditions', description: 'Set up conditions using logic.' },
  { title: 'Define Actions', description: 'Specify actions to trigger.' },
  // { title: 'Transaction Details' },
  // {title: 'Rules Added'}
];

const initialGroup: GroupType = { type: 'AND', conditions: [] };

export const RuleEngineWizard: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [group, setGroup] = useState<GroupType>(initialGroup);
  const [actions, setActions] = useState<Action[]>([]);
  const [rule, setrule] = useState({});
  const [review, setReview] = useState(false)

  const completeStep = () => {
    if (!completedSteps.includes(activeStep)) {
      setCompletedSteps([...completedSteps, activeStep]);
    }
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
    if(activeStep === 2){
       setReview(true)
        setActiveStep(3)
    }
  };
  return (
    <div className="grid grid-cols-12 gap-6 min-h-[90vh] p-6">
      <div className="col-span-3">
        <Stepper
          steps={steps.map((s, i) => ({
            ...s,
            completed: completedSteps.includes(i),
            active: i === activeStep,
          }))}
          onStepClick={setActiveStep}
        />
      </div>
    <div className="col-span-9">
  {activeStep === 0 && (
    <>
      <RuleForm rule={rule} onChange={setrule} />
      <div className="mt-4 text-right flex justify-end">
        <EditButton
          type="button"
          onClick={() => completeStep()}
          className="px-4 py-2"
          label="next"
        />
      </div>
    </>
  )}

  {activeStep === 1 && (
    <>
      <RuleGroup
        group={group}
        onChange={setGroup}
        onDelete={() => setGroup(initialGroup)}
        index={0}
      />
      <div className="mt-4 text-right flex justify-end">
        <EditButton
          type="button"
          onClick={() => completeStep()}
          className="px-4 py-2"
          label="next"
        />
      </div>
    </>
  )}

  {activeStep === 2 && (
    <>
      <RuleActions actions={actions} onChange={setActions} />
      <div className="mt-4 text-right flex justify-end">
        <EditButton
          type="button"
          onClick={() => completeStep()}
          className="px-4 py-2"
          label="next"
        />
      </div>
    </>
  )}

{/* {activeStep === 3 && (
    <>
      <Transaction actions={actions} onChange={setActions} />
      <div className="mt-4 text-right flex justify-end">
        <EditButton
          type="button"
          onClick={() => completeStep()}
          className="px-4 py-2"
          label="next"
        />
      </div>
    </>
  )} */}
{/* {activeStep === 3 && (
    <>
      <RulesAdded actions={actions} onChange={setActions} />
      <div className="mt-4 text-right flex justify-end">
        <EditButton
          type="button"
          onClick={() => completeStep()}
          className="px-4 py-2"
          label="next"
        />
      </div>
    </>
  )} */}

  {review && activeStep != 2    && activeStep != 1 && activeStep != 0 &&(
  <div>
    <pre>{JSON.stringify(group, null, 2)}</pre>
    <pre>{JSON.stringify(actions, null, 2)}</pre>
    <div className="mt-7">
      <EditButton
        type="button"
        onClick={() => completeStep()}
        className="px-4 py-2"
        label="save"
      />
    </div>
  </div>
)}
</div>
    </div>
  );
};
