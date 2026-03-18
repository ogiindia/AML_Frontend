import React, { useEffect, useState } from 'react';
import Row from 'Row';
import Col from 'Col';
import Steps from 'Steps';
import Heading from 'Heading';
import CustomForm from 'CustomForm';
import yup from 'yup';
import TextBox from 'TextBox';
import Modal from 'Modal';
import SelectBox from 'SelectBox';
import Card from 'Card';
import RenderForm from 'RenderForm';
import { RuleWindow } from '../components/ruleWindow';
import ruleActionsJson from '../json/ruleActionJson.json';

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
      <Row>
        <Col lg={3}>
          <Modal isOpen={enableCondiition} title={'Add Condition'}>
            <>
              <RuleWindow
                data={[]}
                setRuleEnableWindow={(e) => triggerConditionModal(e)}
                appendRuleData={(ruleData) => appendRuleData(ruleData)}
              />
            </>
          </Modal>

          <Steps
            current={current}
            //            onChange={onChange}
            className="steps-menu"
            direction="vertical"
            items={[
              {
                title: 'Add Rule',
                onClick: () => current > 0 && stepsClick(0),
                className: `steps-menu-1 ${
                  current > 0 ? 'title-underline' : ''
                }`,
                description:
                  'Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.',
              },
              {
                title: 'Define rule conditions',
                className: `steps-menu-2 ${
                  current > 1 ? 'title-underline' : ''
                }`,
                onClick: () => current > 1 && stepsClick(1),
                description:
                  'Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.',
              },
              {
                title: 'Define rule actions',
                className: `steps-menu-3 ${
                  current > 2 ? 'title-underline' : ''
                }`,
                onClick: () => current > 2 && stepsClick(2),
                description:
                  'Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.',
              },
              {
                title: 'Review & Create',
                className: `steps-menu-4 ${
                  current > 3 ? 'title-underline' : ''
                }`,
                onClick: () => current > 3 && stepsClick(3),
                description:
                  'Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.',
              },
            ]}
          />
        </Col>
        <Col lg={9}>
          <Heading
            title={'Create Rule'}
            subTitle="Define the rule and then review it"
          />
          {current === 0 && (
            <>
              <CustomForm
                formValues={Tab1InitialValues}
                yupSchemas={Tabl1validationSchema}
                title={'Name and Priority'}
                buttonLabel={'Next'}
                subTitle={
                  'Priority will help the rule engine to priorize the rule.'
                }
                callback={(values, actions) => storeRuleData(values)}
              >
                {(props) => (
                  <>
                    <TextBox
                      key={'rName'}
                      label={'Enter rule Name'}
                      name={'ruleName'}
                      placeholder={'Example, Change password Rule 1'}
                      value={props.values['ruleName']}
                      onChange={props.handleChange}
                      error={
                        props.errors.hasOwnProperty('ruleName') &&
                        props.errors['ruleName']
                      }
                      id={'rName'}
                      tooltip={'Enter a name of the rule'}
                      type={'text'}
                    />

                    <SelectBox
                      key={'ruleKeyType'}
                      label={'Select Event Type'}
                      name={'ruleKeyType'}
                      value={props.values['ruleKeyType']}
                      onChange={props.handleChange}
                      id={'ruleKeyType'}
                      tooltip={'Select one of the rule event type'}
                      data={[
                        { name: '', value: 'Select a Event Type' },
                        { name: 'login', value: 'Login' },
                        { name: 'forgot_password', value: 'Forgot Password' },
                        {
                          name: 'user_registration',
                          value: 'User Registration',
                        },
                      ]}
                    />

                    <SelectBox
                      key={'ruleGroup'}
                      label={'Select Group '}
                      name={'ruleGroup'}
                      value={props.values['ruleGroup']}
                      onChange={props.handleChange}
                      id={'ruleGroup'}
                      tooltip={
                        'Select one of the group applicable to match the rule'
                      }
                      data={[
                        { name: '', value: 'Select a group' },
                        { name: 'group1', value: 'group1' },
                        { name: 'group2', value: 'group2' },
                        {
                          name: 'group3',
                          value: 'group3',
                        },
                      ]}
                    />
                  </>
                )}
              </CustomForm>
            </>
          )}

          {current === 1 && (
            <>
              <Card
                title={'Rule Conditions'}
                buttonLabel={'Next'}
                subTitle={'Create a rule based on conditions'}
                customHeaderComponents={
                  <>
                    <button
                      type="button"
                      onClick={() => triggerConditionModal()}
                      className="btn fis-secondary-outline"
                    >
                      Create Condition
                    </button>
                  </>
                }
                //          callback={(values, actions) => storeRuleData(values)}
              >
                {ruleData['ruleData'] !== undefined &&
                ruleData['ruleData'].length > 0 ? (
                  <>
                    <div>
                      <Row>
                        {ruleData['ruleData'].map((obj, index) => {
                          return (
                            <Col lg={6} md={6}>
                              <Card>
                                <p>
                                  if <strong>{obj['eventType']}</strong>
                                </p>

                                <p>
                                  {obj['ruleData'] !== undefined &&
                                    obj['ruleData'].length > 0 &&
                                    obj['ruleData'].map((subItem, index) => {
                                      return (
                                        <>
                                          <span className="font-size-15">
                                            {index === 0 ? 'is' : 'or'}
                                          </span>{' '}
                                          &nbsp;
                                          <strong>
                                            <span className="font-size-15">
                                              {subItem['ruleConditionType']}{' '}
                                              &nbsp;
                                            </span>
                                            <span>
                                              "{subItem['ruleCondition']}"
                                              &nbsp;
                                            </span>
                                          </strong>
                                        </>
                                      );
                                    })}
                                </p>
                              </Card>
                            </Col>
                          );
                        })}
                      </Row>
                    </div>
                  </>
                ) : (
                  <div className="display-block center flex-center p-10 capitalize">
                    <> no rule added yet!</>
                  </div>
                )}
              </Card>

              <div className="flex-end pr-30 pt-10">
                <button type="button" className="btn btn-outline">
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={() => changeScreen()}
                  className="btn btn-fis-secondary"
                >
                  {'Next'}
                </button>
              </div>
            </>
          )}

          {current === 2 && (
            <>
              <RenderForm
                formData={ruleActionsJson}
                callback={(values, actions) => storeRuleData(values)}
                buttonLabel="Next"
                layout={2}
              />
            </>
          )}

          {current === 3 && (
            <>
              <Card
                title={'Review'}
                buttonLabel={'Next'}
                subTitle={'Review The rule data'}
                //          callback={(values, actions) => storeRuleData(values)}
              >
                <Row>
                  <Col lg={4} md={4} className={`bs-border-right`}>
                    <label className="label"> Rule Name </label>
                    <p>
                      <strong> {ruleData['rName']} </strong>
                    </p>

                    <label className="label"> Event Type </label>
                    <p>
                      <strong> {ruleData['ruleKeyType']} </strong>
                    </p>

                    {ruleData['ruleGroup'] !== '' && (
                      <>
                        <label className="label"> Rule Applicable group </label>
                        <p>
                          <strong> {ruleData['ruleGroup']} </strong>
                        </p>
                      </>
                    )}

                    <label className="label"> Risk Score </label>
                    <p>
                      <strong> {ruleData['rRiskScore']} </strong>
                    </p>
                  </Col>

                  <Col lg={4} md={4} className={`bs-border-right`}>
                    <p className="label"> Condition if </p>

                    {ruleData['ruleData'].map((obj, index) => {
                      return (
                        <>
                          <p>
                            if <strong>{obj['eventType']}</strong>
                            {obj['ruleData'] !== undefined &&
                              obj['ruleData'].length > 0 &&
                              obj['ruleData'].map((subItem, index) => {
                                return (
                                  <>
                                    <span className="font-size-15">
                                      &nbsp;
                                      {index === 0 ? 'is' : 'or'}
                                    </span>{' '}
                                    &nbsp;
                                    <strong>
                                      <span className="font-size-15">
                                        {subItem['ruleConditionType']} &nbsp;
                                      </span>
                                      <span>
                                        "{subItem['ruleCondition']}" &nbsp;
                                      </span>
                                    </strong>
                                  </>
                                );
                              })}
                          </p>
                          {console.warn(ruleData['ruleData'].length)}
                          {console.warn(index)}
                          {ruleData['ruleData'].length - 1 !== index && (
                            <p>
                              {' '}
                              <strong>and</strong>
                            </p>
                          )}
                        </>
                      );
                    })}
                  </Col>

                  <Col lg={4} md={4}>
                    <p className="label"> Rule Actions (then) </p>
                    <p>Risk score beween</p>

                    {ruleData['rsf1'] != 0 && ruleData['rst1'] != 0 && (
                      <p>
                        <strong>{ruleData['rsf1']}</strong> -{' '}
                        <strong>{ruleData['rst1']}</strong> &nbsp;{' '}
                        <span>
                          <strong> {ruleData['rsruleaction1']}</strong>
                        </span>
                      </p>
                    )}

                    {ruleData['rsf2'] != 0 && ruleData['rst2'] != 0 && (
                      <p>
                        <strong>{ruleData['rsf2']}</strong> -{' '}
                        <strong>{ruleData['rst2']}</strong> &nbsp;{' '}
                        <span>
                          <strong> {ruleData['rsruleaction2']}</strong>
                        </span>
                      </p>
                    )}

                    {ruleData['rsf3'] != 0 && ruleData['rst3'] != 0 && (
                      <p>
                        <strong>{ruleData['rsf3']}</strong> -{' '}
                        <strong>{ruleData['rst3']}</strong> &nbsp;{' '}
                        <span>
                          <strong> {ruleData['rsruleaction3']}</strong>
                        </span>
                      </p>
                    )}

                    {ruleData['rsf4'] != 0 && ruleData['rst4'] != 0 && (
                      <p>
                        <strong>{ruleData['rsf4']}</strong> -{' '}
                        <strong>{ruleData['rst4']}</strong> &nbsp;{' '}
                        <span>
                          <strong> {ruleData['rsruleaction4']}</strong>
                        </span>
                      </p>
                    )}
                  </Col>
                </Row>
              </Card>

              <div className="flex-end pr-30 pt-10">
                <button type="button" className="btn btn-outline">
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={() => console.warn(JSON.stringify(ruleData, 2))}
                  className="btn btn-fis-secondary"
                >
                  {'Confirm'}
                </button>
              </div>
            </>
          )}
        </Col>
      </Row>
    </>
  );
};

export default pom;
