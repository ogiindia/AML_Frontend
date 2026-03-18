import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
// import { setRuleName } from '../redux/RuleSlice';
import { useDispatch } from 'react-redux';
// import { setRuleData,getRuleData } from '../../../../../app/plugins/plugins/v2/rule/config';

interface RuleFormProps {
  rule: {
    name: string;
    version: string;
    category: string;
    type: 'online' | 'offline';
  };
  onChange: (updated: RuleFormProps['rule']) => void;
  onSubmit: () => void;
}

export const RuleForm: React.FC<RuleFormProps> = ({
  rule,
  onChange,
  onSubmit,
}) => {
  const dispatch = useDispatch();
  const updateField = (field: keyof RuleFormProps['rule'], value: string) => {
    onChange({ ...rule, [field]: value });

    const currentData = null;
    let updatedData = {};

    if (field === 'name') {
      updatedData = { ...currentData, ruleName: value };
    } else if (field === 'version') {
      updatedData = { ...currentData, version: value };
    } else if (field === 'category') {
      updatedData = { ...currentData, ruleCategory: value };
    }

    // setRuleData(updatedData);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Rule Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Rule Name</Label>
          <Input
            placeholder="Enter rule name"
            value={rule.name}
            onChange={(e) => updateField('name', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>priority</Label>
          <Input
            type="number"
            placeholder="e.g., 1"
            value={rule.version}
            onChange={(e) => updateField('version', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Rule Category</Label>
          <Select
            value={rule.category}
            onValueChange={(value) => updateField('category', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="security">Security</SelectItem>
              <SelectItem value="compliance">Compliance</SelectItem>
              <SelectItem value="performance">Performance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* <div className="space-y-2">
          <Label>Rule Type</Label>
          <RadioGroup
            value={rule.type}
            onValueChange={(value) => updateField('type', value)}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="online" id="online" />
              <Label htmlFor="online">Online</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="offline" id="offline" />
              <Label htmlFor="offline">Offline</Label>
            </div>
          </RadioGroup>
        </div> */}
        {/* <Button onClick={onSubmit}>Submit</Button> */}
      </CardContent>
    </Card>
  );
};
