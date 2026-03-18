import {
  Button,
  Col,
  CustomInput,
  CustomSelect,
  Row
} from '@ais/components';
import React, { useEffect, useState } from 'react';
import { IconButton } from '../Button';
import { Condition } from './types';



interface Props {
  condition: Condition;
  onChange: (updated: Condition) => void;
  onDelete: () => void;
  depth?: number;
}

export const RuleCondition: React.FC<Props> = ({
  condition,
  onChange,
  onDelete,
  depth = 0,
  fields = [],
  types = [],
  facts = []
}) => {
  const [fieldType, setFieldType] = useState("");
  const [conditionType, setconditionType] = useState("SCHEMA");
  const [conditionalFields, setfields] = useState(fields);
  const [operatorTypes, setoperatorTypes] = useState([]);
  const [operatorCount, setoperatorCount] = useState(Array.from({ length: 0 }));
  const [showconditionblock, setshowconditionblock] = useState(false);


  const populateFields = () => {
    const filterFields = fields.filter((obj) => obj['schema']['schemaType'] === conditionType);
    setfields(filterFields.map((obj, _index) => {
      obj['value'] = `${obj.schema?.schemaName}.${obj.alias}`;
      return obj;
    }));
  }

  useEffect(() => {
    console.log(conditionType);
    if (conditionType) {
      populateFields()
    }
  }, [conditionType]);

  useEffect(() => {
    populateFields()
  }, [fields]);

  useEffect(() => {
    if (!condition) return;


    if ("condition" in condition && condition['condition'] != undefined) setshowconditionblock(true);
    const type = types.find((it) => it.name === condition.valueType);
    console.log(type);
    setFieldType(type?.fieldType);

    if (condition.conditionType) {
      // console.log(condition.conditionType);
      setconditionType(condition.conditionType);
    }
    if (condition.conditionType === "FACTS") {
      const fact = facts.find((f) => f.name === condition.fact);
      applyFactstoOperator(fact, condition);
    } else {
      const field = fields.find((f) => Number(f.name) === Number(condition.fieldName));

      setoperatorTypes(field?.type?.allowedExpressions);
      if (condition.operator) {
        const operator = field?.type?.allowedExpressions.find((o) => Number(o.name) === Number(condition.operator));
        console.log(operator);
        if (operator) setoperatorCount(Array.from({ length: operator.inputfieldCount }))
      }
    }
  }, [condition]);


  // useEffect(() => {
  //   console.log("into condition.field");
  //   console.log(condition.field);
  //   const field = fields.find((f) => f.name === condition.field);
  //   if (field) setFieldType(field.type);
  // }, [condition.field]);


  const applyFactstoOperator = (fact: any, condition: any) => {
    if (fact) {
      const type = types.find((t) => t.name === fact.factDatatype);
      console.log(type);
      if (type) {
        // setFieldType(fact?.fieldType);
        const allowedExpressions = type?.allowedExpressions;

        if (condition.operator) {
          console.log(condition.operator);

          const operator = allowedExpressions.find((o) => {
            return Number(o.id) === Number(condition.operator)
          });
          console.log(operator);
          if (operator) setoperatorCount(Array.from({ length: operator.inputfieldCount }))
        }

        if (allowedExpressions.length > 0) {
          const operators = allowedExpressions.map((it) => {
            it['name'] = it['id']
            return it;
          });
          setoperatorTypes(operators);
        } else {
          setoperatorTypes([]);
        }

      }
    }
  }

  const handleFactChange = (factName: String) => {
    const fact = facts.find((f) => f.name === factName);
    onChange({
      ...condition,
      fact: factName,
      valueType: fact?.factDatatype,
    });

  }

  const operatorClick = (operator: String) => {
    onChange({ ...condition, operator: operator, value: [] });
    const type = operatorTypes.find((t) => Number(t.name) === Number(operator));

    setoperatorCount(Array.from({ length: Number(type.inputfieldCount) }));
  }




  const handleFieldChange = (fieldName: any) => {
    const field = fields.find((f) => Number(f.name) === Number(fieldName));
    if (field) {
      if (conditionType === "SCHEMA") {
        // setFieldType(field?.type?.fieldType);
        setoperatorTypes(field?.type?.allowedExpressions);
        onChange({
          ...condition,
          //  conditionType: conditionType,
          fieldName: fieldName,
          valueType: field?.type?.name,
          // operator: field?.type?.allowedExpressions[0].value,
          // value: '',
        });
      } else {
        onChange({
          ...condition,
          //  conditionType: conditionType,
          fieldName: fieldName,
          // operator: field?.type?.allowedExpressions[0].value,
          // value: '',
        });
      }



    }
  };

  return (
    <Row gap='1' align={'stretch'} justify='between' className='rule-condition'>

      <span className={`text-muted-foreground`}> if </span>
      <Col span='11'>
        <Row align='end' gap={'2'}>
          <Col span='12'>
            <Row gap={'0'}>
              {/* facts , schema,list */}
              <Col span={`flex`}>
                <CustomSelect name='condition_type'
                  placeholder='Select a Condition'
                  value={condition.conditionType}
                  defaultValue={conditionType}
                  onChange={(e) => onChange({ ...condition, conditionType: e.target.value })
                  }
                  data={[{
                    name: "FACTS",
                    value: "Facts"
                  }, {
                    name: "SCHEMA",
                    value: "Schema"
                  }, {
                    name: "LIST",
                    value: "List"
                  }]} />
              </Col>

              {conditionType === "FACTS" && (
                <Col span={`flex`}>
                  <CustomSelect
                    placeholder='Select an Function'
                    // onChange={(e) => onChange({ ...condition, fact: e.target.value })}
                    onChange={(e) => handleFactChange(e.target.value)}
                    value={condition.fact}
                    url="getFacts"
                    dataMap={{
                      name: 'factName',
                      value: 'factDesc'
                    }
                    }
                  />
                </Col>
              )}

              {conditionType === "LIST" && (
                <Col span='flex'>
                  <CustomSelect name='extendedList'
                    value={condition.listType}
                    onChange={(e) => onChange({ ...condition, listType: e.target.value })}
                    placeholder='Select a list' data={[{
                      name: "POLITICALLY_EXPOSED",
                      value: "Politically Exposed"
                    }, {
                      name: "HIGH_RISK_COUNTRIES",
                      value: "High Risk Countries"
                    }]} />
                </Col>
              )}
            </Row>
          </Col>

          <Col span={`12`}>
            <Row gap={`0`} align={`center`} justify={`around`}>

              {
                conditionType === "LIST" && (
                  <Col span='flex'>
                    <CustomSelect name='external_fields'
                      value={condition.listField}
                      onChange={(e) => onChange({ ...condition, listField: e.target.value })}
                      data={[{
                        name: "COUNTRY_NAME",
                        value: "COUNTRY_NAME"
                      }]} />
                  </Col>
                )
              }

              {/* linked list operator ?? */}
              {conditionType === "LIST" && (
                <Col span={`flex`}>
                  <CustomSelect value=
                    {condition.operator}
                    placeholder='Select an operator'
                    onChange={(e) => onChange({ ...condition, operator: e.target.value })}
                    data={operatorTypes} />
                </Col>
              )}


              {/* Field mapping for FACT & Schema loads from fields array */}
              <Col span='flex'>
                <CustomSelect name='field_mapping' key={"field_mapping"} id={`field_mapping`}
                  onChange={(e) => handleFieldChange(e.target.value)}
                  value={condition.fieldName}
                  placeholder='Select a Field'
                  data={fields} />
              </Col>

              {/* operator selection based on field for FACT and SCHEMA */}
              {conditionType !== "LIST" && (

                <Col span='flex'>
                  <CustomSelect value=
                    {condition.operator}
                    placeholder='Select an operator'
                    onChange={(e) => operatorClick(e.target.value)}
                    data={operatorTypes} />
                </Col>
              )}

              {/* Value to be validated against the field and operator only for FACT and SCHEMA */}
              {conditionType !== "LIST" && operatorCount.map((_, _i) => (
                <>
                  <Col span='flex'>

                    {rendervalueBlock(_i, fieldType, onChange, condition)}
                  </Col>
                </>
              ))}






            </Row>
          </Col>
          {conditionType === "FACTS" && (
            <Col span={`12`}>
              <Row justify={`end`}>
                <Col span={'auto'}>
                  <Button icon={`${showconditionblock ? 'ToggleLeft' : 'ToggleRight'}`} label="Toggle Condition" variant="link" onClick={() => setshowconditionblock(!showconditionblock)} />
                </Col>
              </Row>
              {(showconditionblock && (
                <Row>
                  <Col span={`flex`}>
                    <CustomInput gap={"0"} placeholder="range"
                      name={`range`}
                      type={`number`}
                      value={condition.range ? condition?.range[0] : ''}
                      onChange={(e) => {
                        const next = "range" in condition ? [...condition.range] : [];   // copy
                        next[0] = e.target.value;           // update specific index
                        onChange({ ...condition, range: next });

                      }} />
                  </Col>
                  <Col span={`flex`}>
                    <CustomInput gap={"0"} placeholder="range"
                      name={`range`}
                      type={`number`}
                      value={condition.range ? condition?.range[1] : ''}
                      onChange={(e) => {
                        const next = "range" in condition ? [...condition.range] : [];   // copy
                        next[1] = e.target.value;           // update specific index
                        onChange({ ...condition, range: next });

                      }} />
                  </Col>
                  <Col span={`flex`}>
                    <CustomSelect value=
                      {condition.condition}
                      placeholder='Select an condition'
                      onChange={(e) => onChange({ ...condition, condition: e.target.value })}
                      // data={[{
                      //   name: "cond 1",
                      //   value: "Cond 1"
                      // }, {
                      //   name: "Cond 2",
                      //   value: "Cond 2"
                      // }]}
                      url="getFactsConditions"
                      dataMap={{
                        name: "name",
                        value: "name"
                      }
                      }

                    />
                  </Col>
                </Row>
              ))
              }
            </Col>
          )}

        </Row>
      </Col >

      <Col span='flex'>
        <IconButton variant={`destructive`} icon={'Trash2'} onClick={onDelete} />
      </Col>
    </Row >
  );


  function rendervalueBlock(_i, fieldType, onChange, condition) {
    switch (fieldType) {

      case "CHECKBOX":
        return (
          <CustomSelect gap={"0"} placeholder="Value"
            name={`value`}
            data={[{
              name: "True",
              value: "True"
            }, {
              name: "False",
              value: "False"
            }]}
            value={condition?.value[_i] || ''}
            onChange={(e) => {
              const next = [...condition.value];   // copy
              next[_i] = e.target.value;           // update specific index
              onChange({ ...condition, value: next });

            }} />
        )

      default:
        return (
          <CustomInput gap={"0"} placeholder="Value"
            name={`value`}
            type={(fieldType || '').toLowerCase()}
            value={condition?.value[_i] || ''}
            onChange={(e) => {
              const next = [...condition.value];   // copy
              next[_i] = e.target.value;           // update specific index
              onChange({ ...condition, value: next });

            }} />
        )
    }
  }

};

