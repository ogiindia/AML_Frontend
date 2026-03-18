import React from 'react';
import { Button } from '../../components/ui/button';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export const OperatorSelector: React.FC<Props> = ({ value, onChange }) => {
  const operators = ['AND', 'OR'];

  return (
    <div className="flex gap-3 p-2 rounded">
      {operators.map((op) => (
        <Button
          key={op}
          type="button"
          // className={`px-3 py-1 rounded text-sm font-medium ${value === op ? 'bg-primary-600 text-white' : 'bg-white text-gray-700'
          //   }`}
          // variant={`${value === op ? 'primary' : 'secondary'}`}
          className={`px-3 ${value === op ? 'bg-primary' : 'bg-white text-gray-700'}`}
          onClick={() => onChange(op)}
          label={op}
        >
          {op}
        </Button>
      ))}
    </div>
  );
};
