export type Condition = {
  field: string;
  operator: string;
  value: string;
};

export type RuleGroup = {
  type: 'AND' | 'OR' | 'NOT';
  conditions: (Condition | RuleGroup)[];
};

export type Action = {
  type: string;
  params: string;
};
