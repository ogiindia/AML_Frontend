import React from 'react';
import { useState } from 'react';
import { Button } from '../../components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Action } from './types';
import {
 Icons
} from '@ais/components';
import { setRuleAction} from '../../../../../app/core/src/redux/RuleSlice';
import { useDispatch ,useSelector} from 'react-redux';
// import { setRuleData,getRuleData } from '../../../../../app/plugins/plugins/v2/rule/config';
import { Table, Modal } from 'react-bootstrap';
import { SimpleModal } from '../Modal';
import { ButtonBoilerplate } from '../Button/ButtonBoilerplate';


interface Props {
  actions: Action[];
  onChange: (updated: Action[]) => void;
}



export const RuleActions: React.FC<Props> = ({ actions, onChange }) => {
  
  const dispatch = useDispatch();
  const updateAction = (index: number, field: keyof Action, value: string) => {
    const updated = [...actions];
    updated[index][field] = value;
    onChange(updated); 
    // dispatch(setRuleAction(actions));
    // setRuleData({
    //    ruleAction: actions,
    //   });
  };
//  const ruleName = useSelector((state)=>
//     {console.log("state",state)
//       state['rule'].ruleName  })
//   console.log("ruleName",ruleName)

  //  const ruleData = getRuleData();
  // console.log("ruleData",ruleData)


  const removeAction = (index: number) => {
    const updated = actions.filter((_, i) => i !== index);
    onChange(updated);
  };

  

  return (
    <>
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Rule Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {actions.map((action, idx) => (
          <div key={idx} className="space-y-2 border p-4 rounded-md">
            <div className="flex items-start gap-4 flex-wrap">
              {/* Action Type Selector */}
              <div className="flex flex-col">
                <Label className="mb-1">Action Type</Label>
                <Select
                  value={action.type}
                  onValueChange={(value) => updateAction(idx, 'type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select action type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="webhook">Webhook</SelectItem>
                    <SelectItem value="report">Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Conditional Input Field */}
              {action.type === 'webhook' && (
                <div className="flex flex-col flex-1">
                  <Label className="mb-1">Webhook URL</Label>
                  <Input
                    placeholder="Enter webhook URL"
                    value={action.params}
                    onChange={(e) => updateAction(idx, 'params', e.target.value)} />
                </div>
              )}

              {action.type === 'report' && (
                <div className="flex flex-col flex-1">
                  <Label className="mb-1">Report Name</Label>
                  <Input
                    placeholder="Enter report name"
                    value={action.params}
                    onChange={(e) => updateAction(idx, 'params', e.target.value)} />
                </div>
              )}

              {/* Delete Button */}
              <button
                className="text-red-500 mt-6"
                onClick={() => removeAction(idx)}
              >
                <Icons name="Trash2" size={20} />
              </button>
            </div>
          </div>
        ))}

        <Button
          variant="outline"
          onClick={() => onChange([...actions, { type: '', params: '' }])}
        >
          <Icons name="CirclePlus" />
          Add Action
        </Button>
      </CardContent>
    </Card>
    
      </>

  );
};
