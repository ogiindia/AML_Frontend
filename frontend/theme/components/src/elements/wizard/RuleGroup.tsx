import {
  Col,
  LoadingComponent,
  PageCenterLayout,
  Row,
  SimpleCard
} from '@ais/components';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Button, IconButton } from '../Button';
import { OperatorSelector } from './OperatorSelector';
import { RuleCondition } from './RuleCondition';
import { Condition, RuleGroup as GroupType } from './types';
// import { setRuleData,getRuleData } from '../../../../../app/plugins/plugins/v2/rule/config';

interface Props {
  group: GroupType;
  onChange: (updated: GroupType) => void;
  onDelete: () => void;
  depth?: number;
  index?: number;
}

export const RuleGroup: React.FC<Props> = ({
  group,
  onChange,
  onDelete,
  depth = 0,
  index = 0,
  fields = [],
  types = [],
  facts = []
}) => {
  const dispatch = useDispatch();
  const updateCondition = (i: number, updated: Condition) => {
    const newConditions = [...group.conditions];

    newConditions[i] = updated;
    onChange({ ...group, conditions: newConditions });
    //  dispatch(setRuleCondition(newConditions));

    //  setRuleData({
    //     ruleCondition: newConditions,
    //   });

  };

  const deleteCondition = (i: number) => {
    const newConditions = group.conditions.filter((_, idx) => idx !== i);
    onChange({ ...group, conditions: newConditions });
  };

  //  const ruleName = useSelector((state)=>
  //   {console.log("state",state)
  //     state['rule'].ruleName  })
  // console.log("ruleName",ruleName)

  if (types.length > 0 && facts.length > 0) {

    return (
      <Row className={`rule-group  ${depth % 2 === 0 ? 'bg-muted' : 'bg-white'} p-5`}>
        <Col className='p-2'>
          <Row justify='between' align='center'>
            <Col span={'5'}>
              <OperatorSelector
                value={group.type}
                onChange={(type) => onChange({ ...group, type })}
              />

            </Col>
            <Col span='5'>
              <Row align='center' justify='end'>
                <Col span='auto'>
                  <Button icon={'Plus'} variant="outline" label='Add Rule'
                    onClick={() =>
                      onChange({
                        ...group,
                        conditions: [
                          ...group.conditions,
                          { fieldName: '', valueType: 'STRING', operator: '', value: '' },
                        ],
                      })
                    }
                  />
                </Col>
                <Col span='auto'>
                  <Button icon={'Plus'} variant="outline" label='Add Group'
                    onClick={() =>
                      onChange({
                        ...group,
                        conditions: [
                          ...group.conditions,
                          { type: 'AND', conditions: [] },
                        ],
                      })
                    }
                  />
                </Col>
                <Col span='auto'>
                  <IconButton icon='Trash2' onClick={() => onDelete()} variant='destructive' />
                </Col>
              </Row>

            </Col>
          </Row>


          <div className="rule-container p-2">
            <Row align='center'>
              {group.conditions.map((cond, idx) =>
                'type' in cond ? (
                  <Col key={idx}>
                    <RuleGroup
                      key={idx}
                      group={cond as GroupType}
                      onChange={(updated) => {
                        const newConditions = [...group.conditions];
                        newConditions[idx] = updated;
                        onChange({ ...group, conditions: newConditions });
                      }}
                      onDelete={() => deleteCondition(idx)}
                      depth={depth + 1}
                      index={idx}
                      fields={fields}
                      types={types}
                      facts={facts}
                    />
                  </Col>
                ) : (
                  <Col key={idx}>
                    <SimpleCard>
                      <RuleCondition
                        key={idx}
                        fields={fields}
                        types={types}
                        facts={facts}
                        condition={cond as Condition}
                        onChange={(updated) => updateCondition(idx, updated)}
                        onDelete={() => deleteCondition(idx)}
                        depth={depth + 1}
                      />
                    </SimpleCard>
                  </Col>
                ),
              )}
            </Row>

          </div>
        </Col>
      </Row>
    );
  } else {
    return <PageCenterLayout>
      <LoadingComponent />
    </PageCenterLayout>
  }
};
