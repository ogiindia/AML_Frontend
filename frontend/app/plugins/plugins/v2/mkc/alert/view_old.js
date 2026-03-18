import api from '@ais/api';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Col,
  CustomCheckbox,
  CustomTextArea,
  H3,
  ReadOnlyField,
  Row,
  SpeedoMeter,
  UnderlinedTabs
} from '@ais/components';
import { SimpleTable } from '@ais/datatable';
import { jsonToGraphQLQuery, VariableType } from '@ais/graphql';
import React, { useState } from 'react';

function AlertView({ instanceId, entityId }) {
  const [loading, setloading] = React.useState();
  const [buttonloading, setbuttonloading] = useState(false);
  const [comments, setcomments] = useState("");
  const [issuspicious, setissuspicious] = useState(false);


  const alertFinderJson = [
    {
      query: 'saveUserProfileWithLogin',
      data: [
        {
          type: 'text',
          name: 'alertId',
          label: 'Alert Id',
          id: 'alertId',
          value: '100',
          grid: '6',
          //   hidden: true,
          gqlType: 'UUID!',
          disabled: true,
          placeholder: 'Enter an alertId to search',
          tooltip: 'Please enter a userId',
          validationType: 'string',
          validations: [],
        },

        {
          type: 'text',
          name: 'txnID',
          label: 'Transaction Id',
          id: 'txnID',
          grid: 6,
          value: '10011123',
          disabled: true,
          placeholder: 'Enter the Transaction Id',
          tooltip: 'Please enter a Transaction Id',
          validationType: 'string',
          validations: [],
        },
        {
          type: 'select',
          name: 'Channel',
          label: 'Transaction Channel',
          gqlType: 'String!',
          id: 'Channel',
          value: 'UPI',
          placeholder: 'Select a Transaction Channel',
          //   tooltip: 'Please enter a valid institution',
          //   url: 'listInstitutionEntity',
          grid: '6',
          //   dataMap: {
          //     institutionId: true,
          //     institutionName: true,
          //   },
          rData: null,
          data: [
            {
              name: 'UPI',
              value: 'Upi',
            },
            {
              name: 'ATM',
              value: 'Atm',
            },
            {
              name: 'BANK_DEPOSIT',
              value: 'Bank Deposit',
            },
          ],
          validationType: 'string',
          validations: [],
        },

        {
          type: 'select',
          name: 'alertCategory',
          label: 'Alert Category',
          gqlType: 'String!',
          id: 'alertCategory',
          value: 'CTR',
          placeholder: 'Select a alert Category',
          //   tooltip:
          //     'Role is responsible for deciding the user is maker or checker',
          grid: '6',
          data: [
            {
              name: 'STR',
              value: 'Suspicious Txn',
            },
            {
              name: 'CTR',
              value: 'Cash Txn',
            },
            {
              name: 'CFC',
              value: 'Counterfiet Txn',
            },
            {
              name: 'NTR',
              value: 'Non Profit Txn',
            },
          ],
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
          name: 'assignedTo',
          label: 'Assinged To',
          gqlType: 'String!',
          id: 'assingedTo',
          value: '',
          placeholder: 'Select a User',
          grid: '6',
          data: [
            {
              name: 'U1',
              value: 'User 01',
            },
            {
              name: 'U2',
              value: 'user 02',
            },
            {
              name: 'U3',
              value: 'User 03',
            },
            {
              name: 'U4',
              value: 'User 04',
            },
          ],
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
          name: 'status',
          label: 'Alert Status',
          gqlType: 'String!',
          id: 'status',
          value: 'UNASSIGNED',
          placeholder: 'Select a status',
          grid: '6',
          data: [
            {
              name: 'UNASSIGNED',
              value: 'Un Assigned',
            },
            {
              name: 'Open',
              value: 'Open',
            },
            {
              name: 'Review',
              value: 'Review',
            },
            {
              name: 'Closed',
              value: 'Closed',
            },
          ],
          validationType: 'string',
          validations: [
            {
              type: 'required',
              params: ['This field is required'],
            },
          ],
        },
      ],
    },
  ];

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

  const TxnDetails = {
    'Transaction Id': 'XXXXXX31',
    Amount: 'John Doe',
    'Transaction Date': 'UNVERIFED',
    'Transaction Time': '12345ASASGDGGDS123',
    Sender: 'John',
    Receiver: 'Doe',
    AISTrustScore: '40',
  };


  const triggerSuspiousButton = () => {

    console.log(instanceId);
    console.log(entityId);
    console.log(comments);
    console.log(issuspicious);
    setbuttonloading(true);

    const gjson = {
      mutation: {
        __variables: {
          parentId: 'String!',
          instanceId: 'String!',
          isApproved: 'Boolean!',
          comments: 'String!'
        },
        updateAlertsViaReview: {
          __args: {
            alert: {
              parentId: new VariableType('parentId'),
              instanceId: new VariableType('instanceId'),
              isApproved: new VariableType('isApproved'),
              comments: new VariableType('comments')
            }
          },
        }
      }
    }

    const graphqlQuery = jsonToGraphQLQuery(gjson);

    api.graphql(graphqlQuery, {
      isApproved: issuspicious,
      instanceId: instanceId,
      parentId: entityId,
      comments: comments
    }).then((res) => {
      const { loading, error, data } = res;
      setbuttonloading(loading);
    });


  }

  function GeneralTabView() {

    return (

      <>
        <Row>
          <Col span="12">
            <Accordion
              className={`border rounded-lg bg-white shadom-sm`}
              type="single"
              defaultValue={`item-1`}
              collapsible
            >
              {/* Customer Details */}

              <AccordionItem key={`item-2`}
                className={`text-xl text-bold border-b`}
                value="item-2"
              >
                <AccordionTrigger className={`px-4 py-3 text-lg font-semibold`}>
                  Customer Details
                </AccordionTrigger>
                <AccordionContent className={`p-4 border-t bg-gray-50`}>
                  <Row gap="0">
                    {Object.keys(custDetails).map((cust, index) => {
                      return (
                        <Col span="3" key={index} sm={3} md={3} lg={3}>
                          {cust === 'AISTrustScore' ? (
                            <SpeedoMeter />
                          ) : (
                            <ReadOnlyField title={cust}>
                              <span>{custDetails[cust]}</span>
                            </ReadOnlyField>
                          )}
                        </Col>
                      );
                    })}
                  </Row>
                </AccordionContent>
              </AccordionItem>

              {/* Transaction Details  */}

              <AccordionItem
                className={`text-xl text-bold border-b`}
                value="item-3"
                key={`item-3`}
              >
                <AccordionTrigger className={`px-4 py-3 text-lg font-semibold`}>
                  Transaction Details
                </AccordionTrigger>
                <AccordionContent className={`p-4 border-t bg-gray-50`}>
                  <Row gap="0">
                    {Object.keys(TxnDetails).map((cust, index) => {
                      return (
                        <Col
                          key={index}
                          gap={0}
                          padding={false}
                          span="3"
                          sm={3}
                          md={3}
                          lg={3}
                        >
                          {cust === 'AISTrustScore' ? (
                            <SpeedoMeter />
                          ) : (
                            <ReadOnlyField title={cust}>
                              <span>{TxnDetails[cust]}</span>
                            </ReadOnlyField>
                          )}
                        </Col>
                      );
                    })}
                  </Row>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Col>

          {/* Transaction List */}
          <Col span="12">
            <Row gap="2" justify="around">
              <Col padding={false} span="5">
                <H3>Last 6 Months Transactions</H3>
                <SimpleTable data={tableData} />
              </Col>
              <Col padding={false} span="5">
                <H3>Last 6 Months Suspicious Txansactions</H3>
                <SimpleTable data={tableData} />
              </Col>
            </Row>
          </Col>

          <Col span='6'>
            <Row>

              <Col span='12'>
                <Row align='center'>
                  <Col span='flex'>
                    <CustomTextArea key={`comments`} id={`comments`} name={`comments`} onChange={e => setcomments(e.target.value)} placeholder="Comments" />
                  </Col>
                  <Col span='auto'>
                    <CustomCheckbox name={`isSuspious`} label={"suspicous"} value={issuspicious} onChange={(e) => setissuspicious(e.target.value)} />
                  </Col>
                </Row>
              </Col>

              <Col span='auto'>
                <Button loading={buttonloading} label={`${issuspicious ? 'Mark as suspicious' : 'Mark as not suspicious'}`} onClick={() => triggerSuspiousButton()} />
              </Col>
            </Row >
          </Col>
        </Row>
      </>
    )
  };


  const tableData = [
    {
      id: '100012312',
      type: 'DEBIT',
      amount: '10000',
      channel: 'UPI',
      date: '2025-May-10 10:15 AM',
    },
    {
      id: '100012312',
      type: 'DEBIT',
      amount: '10000',
      channel: 'UPI',
      date: '2025-May-10 10:15 AM',
    },
    {
      id: '100012312',
      type: 'DEBIT',
      amount: '10000',
      channel: 'UPI',
      date: '2025-May-10 10:15 AM',
    },
    {
      id: '100012312',
      type: 'DEBIT',
      amount: '10000',
      channel: 'UPI',
      date: '2025-May-10 10:15 AM',
    },
    {
      id: '100012312',
      type: 'DEBIT',
      amount: '10000',
      channel: 'UPI',
      date: '2025-May-10 10:15 AM',
    },
  ];

  const tabs = [
    {
      name: 'Alert Details',
      value: 'general',
      content: (
        <Row>
          <Col>
            {GeneralTabView()}
          </Col>
        </Row>
      ),
    },

  ];

  return (
    <Row gap="0">
      <Col padding={false} span={'12'}>
        <UnderlinedTabs tabData={tabs} defaultValue={'general'} />
      </Col>
    </Row>
  );
}

export default AlertView;
