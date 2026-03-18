/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import api from '@ais/api';
import {
  Col,
  Row,
  SimpleCard,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableLayout,
  TableRow,
} from '@ais/components';
import { VariableType, jsonToGraphQLQuery } from '@ais/graphql';
import { flattenArray, groupby } from '@ais/utils';
import Card from 'Card';
import Heading from 'Heading';
import RenderForm from 'RenderForm';
import React, { useEffect, useState } from 'react';
import { CheckCircleFill, XCircleFill } from 'react-bootstrap-icons';
import ReadOnlyField from '../../../components/ReadOnlyField';

function ViewCustomers() {
  const [data, setdata] = React.useState(true);

  const [loading, setloading] = useState(false);
  const [error, seterror] = useState(false);
  const [initalValues, setinitalValues] = useState([]);

  // const [formValues, setformValues] = useState(initalValues);

  const loadData = () => {
    setloading(true);
    let graph = {
      query: {
        __variables: {
          type: 'String!',
        },
        listEventsEntity: {
          eventName: true,
          id: true,
        },
        findEventMetaByMetaType: {
          __args: {
            metaType: new VariableType('type'),
          },
          metaName: true,
          metaValue: true,
          id: true,
          event: {
            id: true,
          },
        },
      },
    };

    const gql = jsonToGraphQLQuery(graph);
    console.log(gql);
    api.graphql(gql, { type: 'challenge' }).then((res) => {
      const { loading, data, error } = res;

      setloading(loading);
      seterror(error);
      console.log(res);
      if (data) {
        let dta = data.listEventsEntity;
        const flatternedArray = flattenArray(data.findEventMetaByMetaType);
        let values = groupby(flatternedArray, 'event.id');

        if (Array.isArray(dta) && dta.length > 0) {
          const arr = dta.map((dt, index) => {
            const jJson = {};
            console.log(dt.id);
            if (dt.id in values) {
              const sortedArray = values[dt.id];
              if (Array.isArray(sortedArray)) {
                const d = sortedArray.map((ddata) => {
                  return (jJson[ddata['metaName']] = JSON.parse(
                    ddata['metaValue'],
                  ));
                });
              }
            }

            return {
              name: dt.eventName,
              value: dt.eventName,
              id: dt.id,
            };
          });

          setinitalValues(arr);
        }
      }
    });

    setloading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const custDetails = {
    customerId: 'XXXXXX31',
    FullName: 'John Doe',
    customerStatus: 'UNVERIFED',
    deviceId: '12345ASASGDGGDS123',
    lastAccessed: '2025-04-12 12:00:00 PM',
    SessionDuration: '2mins',
    deviceType: 'IOS',
    AISTrustScore: '40',
  };

  const behaviourDetails = {
    'Unusual Login frequency': false,
    'Login from unfamiler IP': false,
    'Unusual Large amount transfer': true,
    'New beneficiary followed by large Transaction': true,
    'Frequent re-install of mobile app': true,
  };

  const auditLog = [
    {
      deviceID: '12345ASASGDGGDS123',
      transactionType: 'APP-REGISTER',
      'transaction At': '12/04/25 12:00:00PM',
    },
    {
      deviceID: '12345ASASGDGGDS123',
      transactionType: 'LOGIN',
      'transaction At': '12/04/25 12:00:00PM',
    },
    {
      deviceID: '12345ASASGDGGDS123',
      transactionType: 'NEFT',
      'transaction At': '12/04/25 1:00:00PM',
    },
    {
      deviceID: '12345ASASGDGGDS123',
      transactionType: 'VIEW-BALANCE',
      'transaction At': '12/04/25 2:00:00PM',
    },
    {
      deviceID: '12345ASASGDGGDS123',
      transactionType: 'ADD BENEFICIARY',
      'transaction At': '12/04/25 2:00:00PM',
    },
    {
      deviceID: '12345ASASGDGGDS123',
      transactionType: 'NEFT',
      'transaction At': '12/04/25 2:00:00PM',
    },
    {
      deviceID: '12345ASASGDGGDS123',
      transactionType: 'APP-REGISTER',
      'transaction At': '12/04/25 12:00:00PM',
    },
    {
      deviceID: '12345ASASGDGGDS123',
      transactionType: 'APP-REGISTER',
      'transaction At': '12/04/25 12:00:00PM',
    },
    {
      deviceID: '12345ASASGDGGDS123',
      transactionType: 'APP-REGISTER',
      'transaction At': '12/04/25 12:00:00PM',
    },
    {
      deviceID: '12345ASASGDGGDS123',
      transactionType: 'APP-REGISTER',
      'transaction At': '12/04/25 12:00:00PM',
    },
    {
      deviceID: '12345ASASGDGGDS123',
      transactionType: 'APP-REGISTER',
      'transaction At': '12/04/25 12:00:00PM',
    },
    {
      deviceID: '12345ASASGDGGDS123',
      transactionType: 'APP-REGISTER',
      'transaction At': '12/04/25 12:00:00PM',
    },
    {
      deviceID: '12345ASASGDGGDS123',
      transactionType: 'APP-REGISTER',
      'transaction At': '12/04/25 12:00:00PM',
    },
    {
      deviceID: '12345ASASGDGGDS123',
      transactionType: 'APP-REGISTER',
      'transaction At': '12/04/25 12:00:00PM',
    },
    {
      deviceID: '12345ASASGDGGDS123',
      transactionType: 'APP-REGISTER',
      'transaction At': '12/04/25 12:00:00PM',
    },
  ];

  return (
    <TableLayout>
      <Row>
        <Heading
          title={'View Customer'}
          // subTitle="Define the rule and then review it"
        />

        <Row>
          <Col span="auto">
            <SimpleCard>
              <Row>
                {Object.keys(custDetails).map((cust, index) => {
                  return (
                    <Col span="3" sm={3} md={3} lg={3}>
                      <ReadOnlyField title={cust}>
                        <span>{custDetails[cust]}</span>
                      </ReadOnlyField>
                    </Col>
                  );
                })}
              </Row>
            </SimpleCard>
          </Col>
        </Row>

        <Row className="w-full" gap="0">
          {initalValues.length > 0 && (
            <Col sm={6} md={6} lg={6} span="6" padding={false}>
              <div className="p-2">
                <SimpleCard title={'Disable Event (For next hour)'}>
                  <div className={'p-2'}>
                    <RenderForm
                      error={error}
                      loading={loading}
                      cancel={false}
                      formFormat={[
                        {
                          data: [
                            {
                              type: 'select',
                              name: 'eventId',
                              label: 'Event Type',
                              id: 'eventId',
                              value: '',
                              placeholder: 'Select an event',
                              rData: null,
                              data: initalValues,
                              validationType: 'string',
                              validations: [],
                            },
                          ],
                        },
                      ]}
                      // formData={}
                      //                        callback={callback}
                    />
                  </div>
                </SimpleCard>
              </div>
            </Col>
          )}

          <Col sm={6} md={6} lg={6} span="6" padding={false}>
            <div className="pt-2">
              <SimpleCard title={'Change User Status'}>
                <div className={'p-2'}>
                  <RenderForm
                    error={error}
                    loading={loading}
                    cancel={false}
                    formFormat={[
                      {
                        data: [
                          {
                            type: 'select',
                            name: 'eventId',
                            label: 'User Status',
                            id: 'eventId',
                            value: '',
                            placeholder: 'Select an status',
                            rData: null,
                            data: [
                              {
                                value: 'Verified',
                                name: '01',
                              },
                              {
                                value: 'Un-Verified',
                                name: '02',
                              },
                              {
                                value: 'Bound',
                                name: '03',
                              },
                              {
                                value: 'Un-Bound',
                                name: '03',
                              },
                              {
                                value: 'Bound',
                                name: '03',
                              },
                              {
                                value: 'Locked',
                                name: '03',
                              },
                              {
                                value: 'Unlocked',
                                name: '03',
                              },
                            ],
                            validationType: 'string',
                            validations: [],
                          },
                        ],
                      },
                    ]}
                    // formData={}
                    //                        callback={callback}
                  />
                </div>
              </SimpleCard>
            </div>
          </Col>
        </Row>

        <Row gap="1" className="w-full">
          <Col sm={4} md={4} lg={4} span="4">
            <div className="p-2">
              <div className="max-height-300 overflow-scroll">
                {Object.keys(behaviourDetails).map((bd, _index) => {
                  return (
                    <>
                      <div id={_index} className={'p-2'}>
                        <Card>
                          <div className="p-2">
                            <div className="flex">
                              <div className="flex-center">
                                {behaviourDetails[bd] === true ? (
                                  <CheckCircleFill
                                    color="green"
                                    size={30}
                                  ></CheckCircleFill>
                                ) : (
                                  <XCircleFill
                                    color="red"
                                    size={30}
                                  ></XCircleFill>
                                )}
                              </div>
                              <div className="flex-center">
                                <span className="p-2">{bd}</span>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </div>
                    </>
                  );
                })}
              </div>
            </div>
          </Col>

          <Col sm={8} md={8} lg={8} span="auto">
            <div className="p-2 max-height-300 overflow-scroll">
              <Card title="Customer Audit Log">
                <Table className="table">
                  <TableHead>
                    <TableRow>
                      <TableHead scope="col">DeviceID</TableHead>
                      <TableHead scope="col">Device Type</TableHead>
                      <TableHead scope="col">Date Time</TableHead>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {auditLog.map((audit, _index) => {
                      return (
                        <TableRow>
                          {Object.keys(audit).map((item, _index) => {
                            return <TableCell>{audit[item]}</TableCell>;
                          })}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Card>
            </div>
          </Col>
        </Row>
      </Row>
    </TableLayout>
  );
}

export default ViewCustomers;
