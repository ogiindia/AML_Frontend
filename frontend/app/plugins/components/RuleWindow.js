import { Col, Row } from '@ais/components';
import Divider from 'Divider';
import React, { useEffect, useState } from 'react';
import SelectBox from 'SelectBox';
import { RenderRuleRow } from './RenderRuleRow';

export const RuleWindow = ({ data, setRuleEnableWindow, appendRuleData }) => {
  const [eventType, setEventType] = React.useState('');
  const [ruleData, setRuleData] = useState([]);
  const [showRuleBlock, setShowRuleBlock] = useState(false);

  const handleChange = (index, field, value) => {
    setRuleData((prevState) => {
      const newData = [...prevState];
      newData[index][field] = value;
      return newData;
    });
  };

  const deleteCurrentRow = (index, e) => {
    if (ruleData.length > 1) {
      console.warn(index);
      const arry = ruleData.filter((obj) => obj['id'] != index);
      console.warn(arry);
      setRuleData(arry);
    }
  };

  const handleEventTypeChange = (event) => {
    setEventType(event.target.value);
    setRuleData([
      {
        id: Math.random(1, 99),
        ruleCondition: '',
        ruleConditionType: '',
      },
    ]);
    setShowRuleBlock(true);
  };

  useEffect(() => {
    setRuleData(data);
  }, [data]);

  const sendCallBack = () => {
    setRuleData([
      ...ruleData,
      {
        id: Math.random(1, 99),
        ruleCondition: '',
        ruleConditionType: '',
      },
    ]);
  };

  const triggereventDestroy = () => {
    setRuleEnableWindow(false);
  };

  const submitCallback = () => {
    var data = {
      eventType: eventType,
      ruleData: ruleData,
    };
    appendRuleData(data);
    setRuleEnableWindow(false);
  };

  return (
    <>
      <Row>
        <Col lg={6} md={6}>
          <SelectBox
            key={'ruleEventType'}
            label={'Select a condition Parameter'}
            name={'eventType'}
            value={eventType}
            onChange={(event) => handleEventTypeChange(event)}
            id={'ruleEventType'}
            tooltip={'Select one of the event type'}
            data={[
              { name: '', value: 'Select a condition parameter' },
              { name: 'customer_name', value: 'customer_name' },
              { name: 'device_id', value: 'device_id' },
              { name: 'ip', value: 'ip' },
            ]}
          />
        </Col>
      </Row>
      {showRuleBlock && (
        <>
          <RenderRuleRow
            ruleData={ruleData}
            handleChange={handleChange}
            deleteCurrentRow={deleteCurrentRow}
          />
          <Row>
            <Col className={`flex-start`}>
              <button
                onClick={() => sendCallBack()}
                className={`btn fis-outline`}
              >
                {' '}
                Add New Value{' '}
              </button>
            </Col>
          </Row>
        </>
      )}

      <Divider />

      <div className="flex-end pr-30 pt-10">
        <button
          type="button"
          onClick={() => triggereventDestroy()}
          className="btn btn-outline"
        >
          Cancel
        </button>
        <button
          type="submit"
          onClick={() => submitCallback()}
          className="btn btn-fis-secondary"
        >
          {'Confirm'}
        </button>
      </div>
    </>
  );
};
