import { useEffect, useState } from 'react';
import yup from 'yup';

const Tabl1validationSchema = yup.object().shape({
  ruleName: yup.string().min(2, 'Too Short !').max(20, 'To Long'),
  rulePriority: yup.number().moreThan(0),
});

let Tab1InitialValues = {
  ruleName: '',
  ruleEventType: '',
  ruleGroup: '',
};

const pom = () => {
  const [current, setCurrent] = useState(0);
  const [ruleData, setruleData] = useState({
    ruleData: [],
  });
  const [enableCondiition, setEnableConditions] = useState(false);
  const [enableRuleWindow, setRuleEnableWindow] = useState(false);
  const [ruleActons, setRuleActions] = useState('');

  const stepsClick = (e) => {
    setCurrent(e);
  };

  useEffect(() => {
    console.warn(ruleData);
  }, [ruleData]);

  const appendRuleData = (ruled) => {
    setruleData((prevState) => {
      const data = { ...prevState };
      const ruledt = data['ruleData'];
      data['ruleData'] = [...ruledt, ruled];
      return data;
    });
  };

  const storeRuleData = (values) => {
    setruleData({
      ...values,
      ...ruleData,
    });
    setCurrent(current + 1);
  };

  const changeScreen = () => {
    setCurrent(current + 1);
  };

  const triggereventChange = () => {
    setRuleEnableWindow(true);
  };

  const triggerConditionModal = (event) => {
    setEnableConditions(!enableCondiition);
    console.warn(event);
    //setEventType(event.target.value);
  };

  return (
    <>
      <div>
        <img
          src={'./496143_563974.png'}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </>
  );
};

export default pom;
