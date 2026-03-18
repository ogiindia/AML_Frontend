// plugin/ruleStore.js

let ruleData = {
  ruleName: '',
  version: '',
  ruleCategory: null,
  ruleAction: [],
  ruleCondition: [],
};

export const setRuleData = (Data) => {
  ruleData = { ...ruleData, ...Data };
};

export const getRuleData = () => ruleData;
