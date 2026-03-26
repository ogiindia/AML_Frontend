import api from '@ais/api';
import {
    Col,
    Heading,
    MutedBgLayout,
    Row,
    RuleGroup,
    SimpleCard,
    SimpleModal,
    toast,
    Button
} from '@ais/components';
import { jsonToGraphQLQuery, VariableType } from '@ais/graphql';
import { convertGraphQLInputToGroup, convertGroupToGraphQLInput } from '@ais/utils';
import generateQueryFromFormJson from 'generateQueryFromFormJson';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import RenderForm from 'RenderForm';

const initialGroup = { type: 'AND', conditions: [] };
export default function RuleCreate() {
    const [group, setGroup] = React.useState(initialGroup);
    const [showModal, setshowModal] = useState(false);
    const [conditionalFields, setconditionalFields] = useState([]);
    const [formData, setformData] = useState({});
    const [catalogTypesList, setcatalogTypesList] = useState([]);
    const [factList, setfactList] = useState([]);

    const { state } = useLocation();

    const navigate = useNavigate();

    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        //load static objects
        let glJson = {
            query: {
                listCatalogEntity: {
                    name: "id",
                    alias: true,
                    schema: {
                        id: true,
                        schemaName: true,
                        schemaType: true
                    },
                    type: {
                        name: true,
                        fieldType: true,
                        allowedExpressions: {
                            name: "id",
                            exp: true,
                            value: "alias",
                            inputfieldCount: true
                        }
                    }
                },
                listCatalogTypes: {
                    name: true,
                    id: true,
                    fieldType: true,
                    allowedExpressions: {
                        id: true,
                        name: true,
                        exp: true,
                        value: "alias",
                        inputfieldCount: true
                    }
                },
                getFacts: {
                    factId: true,
                    name: "factName",
                    factDatatype: true,
                    value: "factDesc",
                    factType: true,
                }

            }
        }

        const graphqlQuery = jsonToGraphQLQuery(glJson);

        api.graphql(graphqlQuery).then((res) => {
            const { error, data } = res;

            if (data) {
                setconditionalFields(data['listCatalogEntity']);
                setcatalogTypesList(data['listCatalogTypes']);
                setfactList(data['getFacts']);
            }

        });

    }, []);



    useEffect(() => {
        if (state?.id) {
            const rjson = {
                query: {
                    __variables: {
                        id: 'UUID!',
                    },
                    getRuleById: {
                        __args: {
                            id: new VariableType('id')
                        },
                        ruleId: true,
                        ruleName: true,
                        folderId: true,
                        description: true,
                        priority: true,
                        offsetValue: true,
                        offsetUnit: true,
                        alertCategory: true,
                        txnMode: true,
                        ruleMode: true,
                        group: {
                            id: true,
                            type: true,
                            conditions: {
                                condition: {
                                    id: true,
                                    fieldName: true,
                                    operator: true,
                                    valueType: true,
                                    value: true,
                                    fact: true,
                                    conditionType: true,
                                    listType: true,
                                    listField: true,
                                    range: true,
                                    condition: true,
                                },
                                group: {
                                    id: true,
                                    type: true,
                                    conditions: {
                                        condition: {
                                            id: true,
                                            fieldName: true,
                                            operator: true,
                                            valueType: true,
                                            value: true,
                                            fact: true,
                                            conditionType: true,
                                            listType: true,
                                            listField: true,
                                            range: true,
                                            condition: true,
                                        },
                                        group: {
                                            id: true,
                                            type: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            };

            const gql = jsonToGraphQLQuery(rjson);

            api.graphql(gql, { id: state.id }).then(res => {
                const { loading, data, error } = res;

                if (data) {
                    //populate the formData;
                    setformData(data['getRuleById']);

                    console.log(data['getRuleById']['group']);
                    const groups = convertGraphQLInputToGroup(data['getRuleById']['group']);

                    setGroup(groups);
                }
            });
        }

    }, [state]);


    const formFormat = [
        {
            query: 'saveBranchMaster',
            data: [
                {
                    type: 'text',
                    name: 'ruleId',
                    label: 'id',
                    id: 'ruleId',
                    value: '',
                    //   grid: '6',
                    hidden: true,
                    gqlType: 'UUID',
                    disabled: true,
                    //   placeholder: 'eg  : 123',
                    //   tooltip: 'Please enter a userId',
                    validationType: 'string',
                    validations: [],
                },
                {
                    type: 'text',
                    name: 'ruleName',
                    label: 'Rule Name',
                    id: 'ruleName',
                    value: '',
                    grid: '12',
                    //   hidden: true,
                    gqlType: 'String!',
                    //   disabled: true,
                    placeholder: 'eg  : TEST',
                    //   tooltip: 'Please enter a userId',
                    validationType: 'string',
                    validations: [
                        {
                            type: 'required',
                            params: ['This field is required'],
                        },
                    ],
                },
                {
                    type: 'text',
                    name: 'description',
                    label: 'Rule Description',
                    id: 'description',
                    value: '',
                    grid: '12',
                    //   hidden: true,
                    gqlType: 'String!',
                    //   disabled: true,
                    // placeholder: 'eg  : Beach station branch',
                    //   tooltip: 'Please enter a userId',
                    validationType: 'string',
                    validations: [
                    ],
                },
                {
                    type: 'select',
                    name: 'ruleMode',
                    label: 'Rule Mode',
                    id: 'ruleMode',
                    value: '',
                    grid: '6',
                    //   hidden: true,
                    gqlType: 'Boolean!',
                    validationType: 'string',
                    url: "lookupCategory",
                    dataMap: {
                        name: true,
                        value: true
                    },
                    args: {
                        category: 'RULE_MODE'
                    },
                    validations: [
                        {
                            type: 'required',
                            params: ['This field is required'],
                        },
                    ],
                },
                {
                    type: 'select',
                    name: 'txnMode',
                    label: 'Transaction Type',
                    id: 'txnMode',
                    value: '',
                    grid: '6',
                    //   hidden: true,
                    gqlType: 'String!',
                    url: "lookupCategory",
                    dataMap: {
                        name: true,
                        value: true
                    },
                    args: {
                        category: 'TXN_TYPE'
                    },

                },

                {
                    type: 'select',
                    name: 'priority',
                    label: 'Rule Priority',
                    id: 'priority',
                    value: '',
                    grid: '6',
                    //   hidden: true,
                    gqlType: 'Int!',
                    "data": [{
                        name: "1",
                        value: "LOW"
                    }, {
                        name: "2",
                        value: "MEDIUM"
                    }, {
                        name: "3",
                        value: "HIGH"
                    }],
                    //   tooltip: 'Please enter a userId',
                    validationType: 'string',
                    validations: [
                        {
                            type: 'required',
                            params: ['This field is required'],
                        },
                    ],
                }, {
                    type: 'select',
                    name: 'folderId',
                    label: 'Rule Folder',
                    id: 'folderId',
                    value: '',
                    grid: '6',
                    //   hidden: true,
                    gqlType: 'String!',
                    url: "listRuleFolderEntity",
                    customButtons: [{
                        icon: "Plus",
                        render: () => setshowModal(true)
                    }],
                    dataMap: {
                        name: 'id',
                        value: 'folderName'
                    },
                    //   tooltip: 'Please enter a userId',
                    validationType: 'string',
                    validations: [
                        {
                            type: 'required',
                            params: ['This field is required'],
                        },
                    ],
                },
                {
                    type: 'select',
                    name: 'alertCategory',
                    label: 'Alert Category',
                    id: 'alertCategory',
                    value: '',
                    grid: '6',
                    //   hidden: true,
                    gqlType: 'String!',
                    url: "lookupCategory",
                    dataMap: {
                        name: true,
                        value: true
                    },
                    args: {
                        category: 'ALERT_CATEGORY'
                    },
                    //   tooltip: 'Please enter a userId',
                    validationType: 'string',
                    validations: [
                        {
                            type: 'required',
                            params: ['This field is required'],
                        },
                    ],
                },


                {
                    type: 'select',
                    name: 'offsetUnit',
                    label: 'LookBack Unit',
                    id: 'offsetUnit',
                    value: '',
                    grid: '3',
                    //   hidden: true,
                    gqlType: 'String!',
                    url: "lookupCategory",
                    dataMap: {
                        name: true,
                        value: true
                    },
                    args: {
                        category: "LOOKBACK_UNIT"
                    },
                    //   tooltip: 'Please enter a userId',
                    validationType: 'string',
                    validations: [
                        {
                            type: 'required',
                            params: ['This field is required'],
                        },
                    ],
                }, {
                    type: 'number',
                    name: 'offsetValue',
                    label: 'LookBack Value',
                    id: 'offsetValue',
                    value: '',
                    grid: '3',
                    //   hidden: true,
                    gqlType: 'String!',
                    //   tooltip: 'Please enter a userId',
                    validationType: 'string',
                    validations: [
                        {
                            type: 'required',
                            params: ['This field is required'],
                        },
                    ],
                }
            ],
        },
    ];


    const onRuleSubmit = (values) => {
        console.log(values);
        const ruleInput = {
            ruleId: values.ruleId == "" ? null : values['ruleId'],
            ruleName: values.ruleName,
            priority: values.priority,
            description: values.description,
            offsetValue: values.offsetValue,
            offsetUnit: values.offsetUnit,
            alertCategory: values.alertCategory,
            folderId: values['folderId'],
            ruleMode: values['ruleMode'],
            txnMode: values['txnMode'],
            group: convertGroupToGraphQLInput(group)
        };


        console.log(ruleInput);
        const mutation = {
            mutation: {
                __variables: {
                    rule: 'RuleDTOinput!',
                },
                saveRule: {
                    __args: { rule: new VariableType('rule') },
                    // Suppose saveRule returns a boolean
                    id: true
                }
            }
        };

        const gql = jsonToGraphQLQuery(mutation);
        console.log(gql);

        api.graphql(gql, { rule: ruleInput }).then((res) => {
            const { data, error } = res;

            if (data) {
                toast({
                    title: `Rule: ${values.ruleName} Inserted or Updated Successfully`,
                    description: ``,
                    variant: "success"
                });

                navigate(-1);
            }

            if (error) {
                toast({
                    title: `Rule: ${values.ruleName}`,
                    description: `${error}`,
                    variant: "error"
                });
            }
        });

    }


    const folderFormFormat = [{
        query: "saveRuleFolderEntity",
        data: [
            {
                type: 'text',
                name: 'folderName',
                label: 'Folder Name',
                id: 'folderName',
                value: '',
                gqlType: 'String!',
                validationType: 'string',
                validations: [{
                    type: 'required',
                    params: ['This field is required'],
                }],
            },
            {
                type: 'select',
                name: 'parentfolder',
                label: 'Parent Folder',
                id: 'folderName',
                value: '',
                gqlType: 'UUID',
                validationType: 'string',
                url: "listRuleFolderEntity",
                dataMap: {
                    id: true,
                    folderName: true
                },
                validations: [],
            },
        ]
    }]

    useEffect(() => {
        console.log("grp", group);
    }, [group]);
    const handleSyncMappingList = async () => {
        try {
            const res = await api.post('/app/rest/v1/setMappingList');

            console.log("Full response:", res);

            if (!res) {
                toast({ title: 'No response from server', variant: 'validaton' });
                return;
            }
            toast({ title: res, variant: 'success' });

        } catch (err) {
            console.error("Error in Sync Mapping List:", err);
            toast({ title: 'Failed to sync mapping list', description: err?.message || '', variant: 'error' });

        }
    };

    return (
        <>
            <MutedBgLayout>
                <Row>
                    <Col span='12'>
                        <Heading title={`Rule Create`} />
                    </Col>
                    <Col span='12'>
                        <SimpleCard align='start' title={"Rule Details"}>
                            <RenderForm formFormat={formFormat} formData={formData} callback={(values) => onRuleSubmit(values)}>
                                {(props) => (
                                    <>
                                        <SimpleCard align='start' title={
                                            <div style={{ position: "relative", width: "100%" }}>
                                                <span style={{ fontWeight: 600 }}>
                                                    Rule Condition
                                                </span>

                                                <Button
                                                    style={{
                                                        position: "absolute",
                                                        left: '930px',
                                                        top: "50%",
                                                        transform: "translateY(-50%)"
                                                    }}
                                                    className="btn primary"
                                                    onClick={() => setShowConfirm(true)}
                                                >
                                                    Sync Mapping List
                                                </Button>
                                            </div>
                                        }>

                                            <Row>
                                                <Col className='pb-10'>
                                                    <RuleGroup
                                                        fields={conditionalFields}
                                                        types={catalogTypesList}
                                                        group={group}
                                                        facts={factList}
                                                        onChange={setGroup}
                                                        onDelete={() => setGroup(initialGroup)}
                                                        index={0}
                                                    />
                                                </Col>

                                            </Row>

                                        </SimpleCard>
                                        <div className='pb-10' />
                                        {/* <Card title={'Role List'}>
                      <InlineList
                      items={roleItems}
                      callBack={(item) => alert(JSON.stringify(item))}
                      />
                      </Card> */}
                                    </>
                                )}
                            </RenderForm>
                        </SimpleCard>
                    </Col>
                </Row>
                <SimpleModal title={"Create Folder"} isOpen={showModal} handleClose={() => setshowModal(false)} size='md' >
                    <RenderForm formFormat={folderFormFormat}
                        cancelCallback={() => setshowModal(false)}
                        callback={(values) => {

                            const args = {
                                entity: {
                                    folderName: true,
                                    parent: {
                                        id: new VariableType('parentfolder')
                                    }
                                }
                            }

                            const gqlQuery = generateQueryFromFormJson(folderFormFormat, args, true);
                            console.log(gqlQuery);
                            console.log(values);
                            api.graphql(gqlQuery, values).then((res) => {
                                const { loading, data, error } = res;
                                console.log(data);
                                if (error) throw new Error(error);
                                if (data) setshowModal(false);
                            });

                        }} />
                </SimpleModal>


                {showConfirm && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.45)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100
                    }}>
                        <div style={{
                            width: 420, background: 'var(--card)', padding: 18, borderRadius: 8, boxShadow: '0 6px 18px rgba(0,0,0,0.12)'
                        }}
                            onClick={e => e.stopPropagation()}
                            role="dialog"
                            aria-modal="true"
                        >
                            <h4 style={{ margin: 0, marginBottom: 10, fontWeight: 700 }}>Confirm Sync</h4>
                            <div style={{ marginBottom: 16, color: 'oklch(0.16 0 0)' }}>
                                Are you sure you want to Sync the mapping list(s)?
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                                <button type="button" className="btn" onClick={() => setShowConfirm(false)}>Cancel</button>
                                <Button
                                    type="button"
                                    className="btn danger"
                                    onClick={async () => {
                                        try {
                                            await handleSyncMappingList();
                                        } finally {
                                            setShowConfirm(false);
                                        }
                                    }}
                                >
                                    Sync
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </MutedBgLayout>
        </>
    )

}
