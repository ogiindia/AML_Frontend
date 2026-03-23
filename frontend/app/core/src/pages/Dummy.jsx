import api from "@ais/api";
import { Button, Col, CustomCheckbox, CustomTextArea, ReadOnlyField, Row, SimpleCard } from "@ais/components";
import { SimpleTable } from "@ais/datatable";
import { jsonToGraphQLQuery, VariableType } from "@ais/graphql";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import RenderForm from "../utilites/FormElements/RenderForm";

export default function Dummy() {

  const [loading, setloading] = React.useState();
  const [buttonloading, setbuttonloading] = useState(false);
  const [comments, setcomments] = useState("");
  const [issuspicious, setissuspicious] = useState(false);
  const [commentsList, setcommentsList] = useState([]);
  const [currentTransaction, setcurrentTransaction] = useState({});
  const [alertList, setalertList] = useState([]);
  const [customerDetails, setcustomerDetails] = useState({});

  const { state } = useLocation();

  useEffect(() => {

    const gjson = {
      query: {
        __variables: {
          parentId: 'String!',
          // instanceId: 'String!',
          customerId: 'String!',
          txnId: 'String!'
        }, getWorflowHistoryByParentId: {
          __args: {
            id: new VariableType('parentId')
          },
          levelNumber: true,
          approverName: true,
          action: true,
          comment: true,
          createdAt: true
        },

        findTransactionById: {
          __args: {
            id: new VariableType('txnId')
          },
          transactionid: true,
          customerid: true,
          accountno: true,
          branchcode: true,
          transactiontype: true,
          channeltype: true,
          transactiondate: true,
          amount: true,
          depositorwithdrawal: true,
          narration: true
        },
        findAlertsByParentId: {
          __args: {
            parentId: new VariableType('parentId'),
          },
          alertParentId: true,
          alertId: true,
          alertName: true,
          alertDesc: true,
          alertStatus: true,
          accNo: true,
          custId: true,
          transactionId: true,
          riskCategory: true,
        }, findCustomerById: {
          __args: {
            customerId: new VariableType('customerId')
          },

          customerid: true,
          customername: true,
          customertype: true,
          customercategory: true,
          branchcode: true,
          natureofbusiness: true,
          creditrating: true,
          createddatetime: true,
          firstname: true,
          lastname: true,
          dateofbirth: true,
          nationality: true,
          sex: true,
          panno: true,
          occupation: true,
          city: true,
          country: true,
          phoneno: true,
          mobileno: true,
          emailid: true,

        }
      }
    }


    const gql = jsonToGraphQLQuery(gjson);
    console.log(gql);
    api.graphql(gql, { parentId: '5', instanceId: '13', customerId: '8297946610', txnId: 'TRNID4' }).then((res) => {
      const { error, data } = res;

      if (data && "getWorflowHistoryByParentId" in data) {
        // const workflowHistory = data['getWorflowHistoryByParentId'].map((item, _i) => {
        //   item['title'] = `${item['action'].toLowerCase()} by ${item['approverName']}`;
        //   item['description'] = item['comment'];
        //   item['period'] = moment(item['createdAt']).format('DD-MMM-YY hh:mm A');

        //   return item;
        // });
        setcommentsList(data['getWorflowHistoryByParentId']);
      }

      if (data && "findTransactionById" in data) {
        setcurrentTransaction(data['findTransactionById']);
      }

      if (data && "findAlertsByParentId" in data) {
        setalertList(data["findAlertsByParentId"]);
      }

      if (data && "findCustomerById" in data) {
        setcustomerDetails(data['findCustomerById']);
      }

    });


  }, []);


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
            <Row>
              <Col span="12">
                <SimpleCard title={`Customer Details`}
                  customHeaderComponents={(<>
                    <div class="flex items-center space-x-2">
                      <span className={`text-muted-foreground`} >Risk Score</span>
                      <span class="text-sm px-3 py-1 text-red-600 font-semibold bg-red-100 border border-red-300 rounded-full">
                        92 (High)
                      </span>
                    </div>
                  </>)}
                >
                  <Row>
                    {Object.keys(customerDetails).map((cust, index) => {
                      if (customerDetails[cust] != null) {
                        return (
                          <Col span='auto'>
                            <ReadOnlyField title={cust}>
                              <span>{customerDetails[cust]}</span>
                            </ReadOnlyField>
                          </Col>
                        );
                      }
                    })}
                  </Row>
                </SimpleCard>
              </Col>

              <Col span="12">
                <SimpleCard title={`Transaction Details`}>
                  <Row>
                    {Object.keys(currentTransaction).map((cust, index) => {
                      return (
                        <Col span='auto'>
                          <ReadOnlyField title={cust}>
                            <span>{currentTransaction[cust]}</span>
                          </ReadOnlyField>
                        </Col>
                      );
                    })}
                  </Row>

                </SimpleCard>
              </Col>
            </Row>



            {/* <Accordion
              className={`border rounded-lg bg-white shadom-sm`}
              type="single"
              defaultValue={`item-1`}
              collapsible
            >


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
          </Accordion>  */}
          </Col>

          <Col span="12">
            <SimpleCard title={`Alert Details`}>
              <SimpleTable data={alertList} />
            </SimpleCard>
          </Col>

          <Col span="12">
            <SimpleCard title={`Alert Comments`}>
              <SimpleTable data={commentsList} />
            </SimpleCard>
          </Col>


          <Col span="12">
            <SimpleTable title={`Customer Accounts`} />
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
        </Row >
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

  const filterForm = [
    {
      title: 'Filter',
      data: [
        {
          type: 'select',
          name: 'status',
          label: 'Alert Category',
          id: 'status',
          value: '',
          grid: '6',
          hidden: false,
          gqlType: 'string!',
          placeholder: 'Select a Category',
          data: [
            {
              name: 'STR',
              value: 'SUSPICOUS TXN',
            },
            {
              name: 'CTR',
              value: 'CASH TXN',
            },
            {
              name: 'NTR',
              value: 'NON PROFIT ORG TXN',
            },
            {
              name: 'CBWT',
              value: 'CROSS BORDER WITHDRAWAL TXN',
            }, {
              name: 'CFT',
              value: 'COUNTERFIET TXN',
            }, {
              name: 'I4C',
              value: 'I4C',
            },
            {
              name: 'LEA',
              value: 'LEA',
            },

          ],
          // tooltip: 'Please enter a userId',
          validationType: 'string',
          validations: [],
        },
        {
          type: 'daterangepicker',
          name: 'alertdaterange',
          label: 'Alert Duration',
          id: 'alertdaterange',
          value: '',
          grid: '6',
          hidden: false,
          gqlType: 'string!',
          validations: [],

        },
        {
          type: 'date',
          name: 'datepicker',
          label: 'Alert Duration',
          id: 'alertdaterange',
          value: '',
          grid: '6',
          hidden: false,
          gqlType: 'string!',
          validations: [],

        }
      ],
    },
  ];



  return (<>
    <RenderForm
      cancel={false}
      formFormat={filterForm}
      callback={(e, i) => console.log(e, i)}
    />
  </>);

  // return (
  //   <MutedBgLayout>
  //     <Row gap="2">
  //       <Col span="12">
  //         <Row>
  //           <Col span="flex">
  //             <H1>
  //               Transaction Authorization </H1>
  //             <span>
  //               FINSEC Status : <span className={`${state?.alertStatus === 'APPROVED' ? 'text-primary' : state?.alertStatus === "REJECTED" ? 'text-destructive' : 'text-info'}`}>
  //                 {state?.alertStatus}
  //               </span>
  //             </span>
  //           </Col>
  //         </Row>

  //       </Col>
  //       <Col span="12">
  //         <Row>
  //           <Col span="flex">
  //             <SectionCard>
  //               <RiskScoreSlider label="FINSEC Score" score={50} />
  //             </SectionCard>
  //           </Col>
  //           <Col span="flex">
  //             <SectionCard>
  //               <div className="flex items-center justify-between mb-3">
  //                 <span className="text-sm font-medium text-muted-foreground">
  //                   Open
  //                 </span>
  //                 <span className="text-sm font-semibold text-warning">0</span>
  //               </div>
  //             </SectionCard>
  //           </Col>
  //           <Col span="flex">
  //             <SectionCard>
  //               <div className="flex items-center justify-between mb-3">
  //                 <span className="text-sm font-medium text-muted-foreground">
  //                   Closed
  //                 </span>
  //                 <span className="text-sm font-semibold text-destructive">100</span>
  //               </div>

  //             </SectionCard>
  //           </Col>
  //           <Col span="flex">
  //             <SectionCard>
  //               <div className="flex items-center justify-between mb-3">
  //                 <span className="text-sm font-medium text-muted-foreground">
  //                   Clutched
  //                 </span>
  //                 <span className="text-sm font-semibold text-info">5</span>
  //               </div>
  //             </SectionCard>
  //           </Col>
  //         </Row>
  //       </Col>
  //       <Col padding={false} span={'12'}>
  //         {GeneralTabView()}
  //       </Col>
  //     </Row>
  //   </MutedBgLayout>
  // );

}
