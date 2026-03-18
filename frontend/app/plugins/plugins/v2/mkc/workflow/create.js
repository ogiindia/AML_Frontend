import api from '@ais/api';
import {
  CancelButton,
  Col,
  CustomInput,
  CustomSelect,
  H1,
  H3,
  Icons,
  LoadingComponent,
  MutedBgLayout,
  NewButton,
  PageCenterLayout,
  Row,
  SimpleCard,
  Subheading,
  SubmitButton,
  toast,
} from '@ais/components';
import { jsonToGraphQLQuery, VariableType } from '@ais/graphql';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { useLocation } from 'react-router';

function WorkflowCreate() {
  const [approvalSteps, setapprovalSteps] = React.useState([
    {
      approverType: 'USER',
      approverId: '0',
      levelNumber: 1
    },
  ]);

  const [workflowType, setworkflowType] = useState('SINGLE');

  const [modulesList, setmodulesList] = useState([]);
  const [usersList, setusersList] = useState([]);
  const [groupsList, setgroupsList] = useState([]);
  const [loading, setloading] = useState(false);
  const [workflowname, setworkflowname] = useState("");
  const [selectedModule, setselectedModule] = useState('0');
  const [selectedId, setselectedId] = useState(null);

  const navigate = useNavigate();

  const { state } = useLocation();

  useEffect(() => {
    if (state?.id) {
      const gjson = {
        query: {
          __variables: {
            id: 'Long!'
          },
          findWorkflowEntitybyId: {
            __args: {
              id: new VariableType('id')
            },
            name: true,
            id: true,
            entityType: true,
            workflowType: true,
            approvers: {
              id: true,
              approverId: true,
              approverType: true,
              levelNumber: true
            }
          }
        }
      }
      const graphqlQuery = jsonToGraphQLQuery(gjson);

      api.graphql(graphqlQuery, { id: state.id }).then((res) => {
        const { loading, error, data } = res;

        setloading(loading);
        if (error) {
          toast({
            title: "Error Retriving Fields,Please try again later.",
            Variant: "error"
          });
        }

        if (data) {
          if ("findWorkflowEntitybyId" in data) {
            const { approvers, workflowType, name, id, entityType } = data['findWorkflowEntitybyId'];

            setapprovalSteps(approvers);
            setworkflowType(workflowType);
            setworkflowname(name);
            setselectedModule(entityType);
            setselectedId(id);
          }
        }
      });

    }
  }, [state]);

  useEffect(() => {
    setloading(true);
    const gjson = {
      query: {
        listEntityMaster: {
          name: "id",
          value: "entityName"
        },
        listUserProfile: {
          name: "id",
          value: "username"
        },
        listGroupEntity: {
          name: "id",
          value: "groupName"
        }

      }
    };

    const graphqlQuery = jsonToGraphQLQuery(gjson);

    api.graphql(graphqlQuery).then((res) => {
      const { loading, error, data } = res;

      setloading(loading);
      if (error) {
        toast({
          title: "Error Retriving Fields,Please try again later.",
          Variant: "error"
        });
      }

      if (data) {
        if ("listGroupEntity" in data) setgroupsList(data['listGroupEntity']);
        if ("listUserProfile" in data) setusersList(data['listUserProfile']);
        if ("listEntityMaster" in data) setmodulesList(data['listEntityMaster']);
      }
    });

  }, []);

  const triggerNewClick = () => {
    setapprovalSteps((prevUsers) => [
      ...prevUsers,
      { approverType: '', approverId: '0', levelNumber: (prevUsers.length || 0) + 1 },
    ]);
  };

  const triggerRemoveStep = (index) => {

    setapprovalSteps((prevUsers) => {
      if (prevUsers.length <= 1) return prevUsers;

      return prevUsers.filter((_, idx) => idx !== index).map((step, idx) => ({
        ...step,
        levelNumber: idx + 1,
      }));
    });
  };



  const triggereApprovalType = (e, index) => {
    console.log(e);
    console.log(index);
    const { name, value } = e.target;

    setapprovalSteps((prevSteps) => {
      const updatedSteps = [...prevSteps];
      updatedSteps[index] = {
        ...updatedSteps[index],
        [name]: value,
      };
      console.log(updatedSteps);
      return updatedSteps;
    });
  };


  const saveWorkflowClick = () => {
    console.log(workflowname);
    console.log(workflowType);
    console.log(selectedModule);
    console.log(approvalSteps);


    const gjson = {
      mutation: {
        __variables: {
          approvers: '[WorkflowApproverEntityinput]',
          entityType: 'String!',
          name: 'String!',
          workflowType: 'String!',
          id: 'Long'
        },
        saveWorkflowEntity: {
          __args: {
            entity: {
              name: new VariableType('name'),
              entityType: new VariableType('entityType'),
              approvers: new VariableType('approvers'),
              workflowType: new VariableType('workflowType'),
              id: new VariableType('id')
            }
          },
          id: true
        }
      }
    }


    const graphqlQuery = jsonToGraphQLQuery(gjson);

    api.graphql(graphqlQuery, { id: selectedId, name: workflowname, entityType: selectedModule, approvers: approvalSteps, workflowType: workflowType }).then((res) => {
      const { loading, error, data } = res;

      if (error) {
        toast({
          title: "Error Inserting or updating Workflow,Please try again later.",
          Variant: "error"
        });
      }


      if (data) {
        toast({
          title: `Workflow : ${workflowname} inserted or updated successfully`,
          Variant: "success"
        });
        navigate(-1);
      }

    });

  }

  if (loading) return <PageCenterLayout><LoadingComponent></LoadingComponent></PageCenterLayout>
  else return (
    <MutedBgLayout>
      <Row justify="between" align="center">
        <Col>
          <Row gap="0" justify="between" align="center">
            <Col span={`5`}>
              <H1>Create Workflow</H1>
              <Subheading>
                Define the approval process for this entity
              </Subheading>
            </Col>
            <Col span={`6`} className="flex justify-end">
              <CancelButton onClick={() => navigate(-1)} label={`Cancel`}></CancelButton>
              <SubmitButton onClick={() => saveWorkflowClick()} label={`Save Workflow`}></SubmitButton>
            </Col>
          </Row>
        </Col>

        <Col>
          <SimpleCard>
            <Row>
              <Col span={`5`}>
                <CustomInput onChange={e => setworkflowname(e.target.value)} value={workflowname} name={`workflow_name`} label={`Workflow Name`} />
              </Col>
              <Col span={'5'}>
                <CustomSelect
                  label={`Workflow Type`}
                  name={`workflow_type`}
                  value={workflowType}
                  onChange={(e) => {
                    const { name, value } = e.target;
                    setworkflowType(value);
                  }}
                  data={[
                    {
                      name: 'SINGLE',
                      value: 'Single',
                    },
                    {
                      name: 'MULTIPLE',
                      value: 'Multiple',
                    },
                  ]}
                />
              </Col>
              <Col span={`12`}>
                <CustomSelect
                  label={`Modules`}
                  name={`modules`}
                  value={selectedModule}
                  onChange={e => setselectedModule(e.target.value)}
                  data={modulesList}
                />
              </Col>
            </Row>
          </SimpleCard>
        </Col>
        <Col>
          <Row align="center" justify="around" className="p-2">
            <Col span={`${workflowType === 'MULTIPLE' ? '6' : '12'}`}>
              <H3>Approval Steps</H3>
            </Col>
            {workflowType === 'MULTIPLE' && (
              <Col span="5" className="flex justify-end">
                <Row gap="2" justify="end" align="center">
                  <Col span="auto">
                    <NewButton
                      onClick={() => triggerNewClick()}
                      label={'Add Step'}
                    />
                  </Col>
                </Row>
              </Col>
            )}
          </Row>

          <Row>
            {approvalSteps.length > 0 &&
              approvalSteps.map((item, __index) => {
                return (
                  <Col span="12">
                    <SimpleCard key={`${__index + 1}`}>
                      <Row gap="0" align="center">
                        <Col span="1">
                          <Icons
                            className={`cursor-pointer`}
                            name={`EllipsisVertical`}
                            size={`20`}
                          />
                        </Col>
                        <Col span="11">
                          <Row gap="0" align="center" justify="around">
                            <Col span="11">
                              <h6>Step {item.levelNumber}</h6>
                            </Col>
                            <Col span={'1'} className={`flex justify-end`}>
                              <div onClick={(e) => triggerRemoveStep(__index)}>
                                <Icons name={`Trash2`} size={`15`} className={`cursor-pointer`} />
                              </div>
                            </Col>

                            <Col padding={false} span="5">
                              <CustomSelect
                                label={`Approval Type`}
                                name={`approverType`}
                                value={item.approverType}
                                onChange={(e) =>
                                  triggereApprovalType(e, __index)
                                }
                                data={[
                                  {
                                    name: 'USER',
                                    value: 'User',
                                  },
                                  {
                                    name: 'GROUP',
                                    value: 'User Groups',
                                  },
                                ]}
                              />
                            </Col>

                            <Col padding={false} span="5">
                              {item['approverType'] === 'USER' ? (
                                <CustomSelect
                                  label={`Select User`}
                                  name={`approverId`}
                                  value={item.approverId.toString()}
                                  onChange={(e) =>
                                    triggereApprovalType(e, __index)
                                  }
                                  data={usersList}
                                />
                              ) : (
                                <CustomSelect
                                  label={`Select Group`}
                                  name={`approverId`}
                                  value={item.approverId.toString()}
                                  onChange={(e) =>
                                    triggereApprovalType(e, __index)
                                  }
                                  data={groupsList}
                                />
                              )}
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </SimpleCard>
                  </Col>
                );
              })}
          </Row>
        </Col>
      </Row>
    </MutedBgLayout>
  );
}

export default WorkflowCreate;
