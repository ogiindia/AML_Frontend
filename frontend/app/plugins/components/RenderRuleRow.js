import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';
import SelectBox from 'SelectBox';
import TextBox from 'TextBox';

export const RenderRuleRow = ({ handleChange, ruleData, deleteCurrentRow }) => {
  React.useEffect(() => {}, []);

  return (
    <>
      <Col lg={12} md={12}>
        <div className="rule-list-view">
          {ruleData.map((obj, index) => {
            return (
              <>
                <Row className={`p-10`}>
                  <Col lg={1} sm={1} md={1} className={'flex-center'}>
                    <span> {index >= 1 ? 'or' : 'is'} </span>
                  </Col>
                  <Col
                    lg={1}
                    sm={1}
                    md={1}
                    className={`flex-center rule-select`}
                  >
                    <SelectBox
                      className={`flex-center`}
                      key={index}
                      name={'ruleConditionType'}
                      value={obj['ruleConditionType']}
                      onChange={(e) =>
                        handleChange(index, 'ruleConditionType', e.target.value)
                      }
                      id={'ruleConditionType'}
                      data={[
                        { name: '', value: '' },
                        { name: '=', value: '=' },
                        { name: '>', value: '>' },
                        { name: '<', value: '<' },
                        { name: '!=', value: '!=' },
                      ]}
                    />
                  </Col>
                  <Col lg={1} sm={1} md={1} />
                  <Col lg={7} md={7} className={`rule-select`}>
                    <TextBox
                      key={index}
                      name={'ruleCondition'}
                      value={obj['ruleCondition']}
                      onChange={(e) =>
                        handleChange(index, 'ruleCondition', e.target.value)
                      }
                      error={''}
                      className={``}
                      placeholder={`Enter the matching value`}
                      id={'ruleCondition'}
                      type={'text'}
                    />
                  </Col>
                  <Col lg={1} md={1} sm={1} />
                  <Col lg={1} md={1} sm={1} className={`flex-center`}>
                    <Trash
                      size={16}
                      className={`cursor-pointer`}
                      onClick={(e) => deleteCurrentRow(obj['id'], e)}
                    />
                  </Col>
                </Row>
              </>
            );
          })}
        </div>
      </Col>
    </>
  );
};
