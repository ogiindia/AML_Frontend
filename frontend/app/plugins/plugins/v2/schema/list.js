/* eslint-disable no-unused-vars */
import api from '@ais/api';
import {
  Button,
  Col,
  CustomInput,
  CustomSelect,
  H1,
  H3,
  MutedBgLayout,
  NewButton,
  Row,
  SimpleCard,
  Subheading,
  toast
} from '@ais/components';
import { jsonToGraphQLQuery, VariableType } from '@ais/graphql';
import React, { useEffect, useState } from 'react';
import FieldRow from '../../../components/FieldRow';


function SchemaList() {
  React.useEffect(() => {
    console.log('into schemaList');
  }, []);
  const [selectedSchema, setselectedSchema] = useState(null);
  const [schemaName, setschemaName] = useState('');
  const [catalogTypes, setcatalogTypes] = useState([]);
  const [schemaMaster, setschemaMaster] = useState([]);
  const [fieldMaster, setfieldMaster] = useState([]);


  useEffect(() => {
    let glJson = {
      query: {
        __variables: {
          type: 'String!'
        },
        listCatalogTypes: {
          id: true,
          name: true
        },
        listSchemaMasterByType: {
          __args: {
            type: new VariableType('type')
          },
          id: true,
          schemaName: true
        }
      }
    }

    const graphqlQuery = jsonToGraphQLQuery(glJson);

    api.graphql(graphqlQuery, { type: "SCHEMA" }).then((res) => {
      const { data } = res;

      if (data && data['listCatalogTypes'] !== null) {
        let arr = [];
        data['listCatalogTypes'].map((item, _i) => {
          arr.push({
            name: item['id'],
            value: item['name']
          })
        });
        setcatalogTypes(arr);
      }

      if (data && data['listSchemaMasterByType'] !== null) {

        let arr = [];
        data['listSchemaMasterByType'].map((item, _i) => {
          arr.push({
            name: item['id'],
            value: item['schemaName']
          })
        });


        setschemaMaster(arr);
      }
    });
  }, []);


  const loadTableData = () => {
    const query = {
      query: {
        __variables: {
          id: 'UUID!',
        },
        deleteInstitutionEntity: {
          __args: {
            id: new VariableType('id'),
          },
        },
      },
    };

    const gql = jsonToGraphQLQuery(query);
    console.log(gql);
    api.graphql(gql, { id: id }).then((res) => {
      console.log(res);
    });
  };


  const saveSchemaOnclick = () => {
    const { name, value } = selectedSchema;
    console.log(name);

    let glJson = {
      mutation: {
        __variables: {
          entities: '[CatalogEntityinput]!',
          schemaId: 'Long!'
        },
        saveCatalogs: {
          __args: {
            entities: new VariableType('entities'),
            schemaId: new VariableType('schemaId')
          },
          id: true,
        },
      }
    }

    const graphqlQuery = jsonToGraphQLQuery(glJson);
    console.log(graphqlQuery);

    api.graphql(graphqlQuery, { entities: fieldMaster, schemaId: name }).then((res) => {
      const { error, data } = res;

      if (data) {
        toast({
          title: `Schema : ${value}`,
          description: `Schema Inserted or Updated Successfully`,
          variant: "success"
        });
      }

      if (error) {
        toast({
          title: `Schema: ${value}`,
          description: `Error inserting or updated the schema may be it is referencing in the schema ${error}`,
          variant: "error"
        });
      }

      // if (data && data['listCatalogTypes'] !== null) {
      //   let arr = [];
      //   data['listCatalogTypes'].map((item, _i) => {
      //     arr.push({
      //       name: item['id'],
      //       value: item['name']
      //     })
      //   });
      //   setcatalogTypes(arr);
      // }

      // if (data && data['listSchemaMasterByType'] !== null) {

      //   let arr = [];
      //   data['listSchemaMasterByType'].map((item, _i) => {
      //     arr.push({
      //       name: item['id'],
      //       value: item['schemaName']
      //     })
      //   });


      // setschemaMaster(arr);
      // }
    });


  }

  const selectOnclick = (e) => {
    const { value } = e.target;

    console.log(schemaMaster);
    console.log('name', value);
    const schema = schemaMaster.find((item) => parseInt(item.name) === parseInt(value));
    console.log("selected Schema ", schema);
    setselectedSchema(schema);

    let glJson = {
      query: {
        __variables: {
          id: 'Long!',
        },
        findCatalogBySchemaMaster: {
          __args: {
            schemaId: new VariableType('id'),

          },
          id: true,
          name: true,
          active: true,
          alias: true,
          type: {
            id: true
          }
        }
      }
    }

    const graphqlQuery = jsonToGraphQLQuery(glJson);

    api.graphql(graphqlQuery, { id: value }).then((res) => {
      const { data } = res;
      if (data && data['findCatalogBySchemaMaster']) setfieldMaster(data['findCatalogBySchemaMaster']);
    });

  };


  // const FieldRow = React.memo(function FieldRow({  }) {
  //   const isCustomFunction = fieldType === 'CUSTOM_FUNCTION';


  // }
  // );


  const createSchema = () => {
    let glJson = {
      mutation: {
        __variables: {
          schemaName: 'String!',
        },
        saveSchemaMaster: {
          __args: {
            entity: {
              schemaName: new VariableType('schemaName'),
            }
          },
          id: true
        },
      },
    };


    const graphqlQuery = jsonToGraphQLQuery(glJson);

    api.graphql(graphqlQuery, { schemaName: schemaName }).then((res) => {
      const { loading, data, error } = res;


      if (data) {
        // roleBasedNavigate("/schema/list");
      }

    });

    console.log(graphqlQuery);

  }

  return (
    <>
      <MutedBgLayout>
        <Row>
          <Col span="12">
            <H1>Schema Manager</H1>
            <Subheading>
              Create new schema or select an existing one to edit.
            </Subheading>
          </Col>

          <Col span={'12'}>
            <SimpleCard>
              <Row>
                <Col span="6" padding={false}>
                  <H3>Create new Schema</H3>
                  <Row className="flex-1" align="center" justify="between">
                    <Col span="8" padding={false}>
                      <CustomInput
                        id="schemaName"
                        gap={0}
                        name={`schemaName`}
                        value={schemaName || ''}
                        onChange={(e) => {
                          const { value } = e.target;
                          setschemaName(value)
                        }}
                        placeholder="Enter a schema name"
                      ></CustomInput>
                    </Col>
                    <Col span="3" padding={false}>
                      <NewButton onClick={() => createSchema()}>Create</NewButton>
                    </Col>
                  </Row>
                </Col>

                <Col span="5" padding={false}>
                  <H3>Choose Existing Schema</H3>
                  <CustomSelect
                    // url="listSchemaMaster"
                    name="schema"
                    data={schemaMaster}
                    placeholder={'Select a schema'}
                    onChange={(e) => selectOnclick(e)}
                  ></CustomSelect>
                </Col>
              </Row>
            </SimpleCard>
          </Col>
        </Row>

        <Row>
          <Col span={'12'}>
            <SimpleCard padding={false}>
              {/* Header Row */}
              <Row>
                <Col>
                  <H3>
                    Schema Fields :{' '}
                    <span className={`bold`}>{selectedSchema?.value}</span>
                  </H3>
                </Col>
              </Row>

              <Row
                padding={false}
                gap={'0'}
                className={`bg-muted border-b p-2 m-2`}
              >
                <Col span={'2'} className={`justify-center flex p-2`}>
                  Field Name
                </Col>
                <Col span={'2'} className={`justify-center flex p-2`}>
                  Field Type
                </Col>
                <Col span={'2'} className={`justify-center flex p-2`}>
                  Alias
                </Col>
                <Col span={'2'} className={`justify-center flex p-2`}>
                  Active
                </Col>
                <Col span={'1'} className={`justify-center flex p-2`}>
                  Actions
                </Col>

                {fieldMaster.length > 0 && fieldMaster.map((item, _id) => (
                  <Col key={_id} span={`12`} padding={false}>
                    <FieldRow
                      index={_id}
                      fieldName={item['name']}
                      id={item['id']}
                      fieldType={item?.type?.id.toString()}
                      alias={item['alias']}
                      active={item['active']}
                      setfieldMaster={setfieldMaster}
                      catalogTypes={catalogTypes}
                    />
                  </Col>
                ))}

                {/* <Col span={`12`} padding={false}>
                  <FieldRow
                    fieldName={`name`}
                    fieldType={`CUSTOM_FUNCTION`}
                    alias={`Full Name`}
                    active={true}
                  />
                </Col>
                <Col span={`12`} padding={false}>
                  <FieldRow
                    fieldName={`age`}
                    fieldType={`NUMBER`}
                    alias={`Age`}
                    active={true}
                  />
                </Col>*/}
              </Row>

              <Row justify="between" className={`bg-muted p-2 m-2`}>
                <Col span={'auto'}>
                  <Button label={`Add Field`} onClick={() => {
                    setfieldMaster(prev => {
                      return [...prev, {
                        name: null,
                        type: {
                          id: ''
                        },
                        active: true,
                        alias: null
                      }]
                    });
                  }} icon={`Plus`} />
                </Col>

                <Col span={'auto'}>
                  <Button onClick={() => saveSchemaOnclick()} label={`Save Schema`} />
                </Col>
              </Row>
            </SimpleCard>
          </Col>
        </Row>

        <Row>
          <Col span={'12'}>
            <SimpleCard>
              <Row align="center">
                <Col span={'12'} padding={false}>
                  <H3>Upload static Data</H3>
                  <Subheading>
                    Upload a CSV or JSON file to associate static data with this
                    schema. This can be used for populating dropdowns or
                    providing default values.
                  </Subheading>
                </Col>
                <Col span={'auto'}>
                  <CustomInput gap={0} type="file" className="cursor-pointer" />
                </Col>
                <Col span={`auto`}>
                  <Button label={`upload`}>Upload</Button>
                </Col>
              </Row>
            </SimpleCard>
          </Col>
        </Row>
      </MutedBgLayout>
    </>
  );
}

export default SchemaList;
