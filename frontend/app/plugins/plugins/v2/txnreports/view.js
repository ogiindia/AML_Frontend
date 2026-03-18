import api from '@ais/api';
import {
  Col,
  CustomTextArea,
  FullWidthSubmitButton,
  H1,
  H3,
  KeyvalueBlock,
  Label,
  MutedBgLayout,
  ReadOnlyField,
  RiskScoreSlider,
  Row,
  SimpleCard,
  TableCard,
  Timeline
} from '@ais/components';
import { SimpleTable, SpaciousTable } from '@ais/datatable';
import { jsonToGraphQLQuery, VariableType } from '@ais/graphql';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';


// const timeline = [
//   {
//     title: 'Scheduled For Review',
//     // company: 'TechCorp Solutions',
//     period: '2025-Nov-12 12:00 AM',
//     description: 'The Transaction matched in 10 rules and scheduled for review',
//     // technologies: ['React', 'Node.js', 'TypeScript', 'AWS', 'MongoDB'],
//   },
//   {
//     title: 'Reviewed By John',
//     // company: 'Digital Innovations Inc',
//     period: '2025-Nov-12 12:30 AM',
//     description: 'comments : the transaction looks suspicious',
//     // technologies: ['React', 'Express.js', 'PostgreSQL', 'Docker', 'Redis'],
//   },
//   {
//     title: 'Commented By Doe',
//     // company: 'WebTech Studios',
//     period: '2025-Nov-12 12:45 PM',
//     description: 'Added Comments : the transaction was done in odd hours ',
//     // technologies: ['React', 'JavaScript', 'SASS', 'Webpack', 'Jest'],
//   },
// ];

function MKCView() {
  const [loading, setloading] = React.useState();

  const [timeline, settimeline] = useState([]);

  const [currentTransaction, setcurrentTransaction] = useState({});

  const { state } = useLocation();

  const [alertList, setalertList] = useState([]);
  const [custRuleCount, setCustRuleCount] = useState([]);
  console.log(state);

  useEffect(() => {
    const gjson = {
      query: {
        __variables: {
          id: 'String!',
          txnId: 'String!',
        },
        getWorflowHistoryByParentId: {
          __args: {
            id: new VariableType('id')
          },
          levelNumber: true,
          approverName: true,
          action: true,
          comment: true,
          createdAt: true
        },

        findTransactionEntitybyId: {
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
          transactiontime: true,
          amount: true,
          depositorwithdrawal: true,
          narration: true
        },
        findAlertsByParentId: {
          __args: {
            parentId: new VariableType('id'),
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
          ruleId: true,
          thresholdValue: true,
          factName: true,
          factName: true
        }
      }
    }



    const gql = jsonToGraphQLQuery(gjson);
    console.log(gql);
    api.graphql(gql, { id: state.parentid, txnId: state.transactionid }).then((res) => {
      const { error, data } = res;
      if (error) {

      }

      if (data && "getWorflowHistoryByParentId" in data) {
        const workflowHistory = data['getWorflowHistoryByParentId'].map((item, _i) => {
          item['title'] = `${item['action'].toLowerCase()} by ${item['approverName']}`;
          item['description'] = item['comment'];
          item['period'] = moment(item['createdAt']).format('DD-MMM-YY hh:mm A');

          return item;
        });
        settimeline(workflowHistory);
      }

      if (data && "findTransactionEntitybyId" in data) {
        setcurrentTransaction(data['findTransactionEntitybyId']);
      }

      if (data && "findAlertsByParentId" in data) {
        setalertList(data["findAlertsByParentId"]);
      }
    });

  }, []);

  return (
    <MutedBgLayout>
      <Row gap="2">
        <Col span="12">
          <H1>Transaction View</H1><span>
          </span>
        </Col>
        <Col span="8" className="tab-layout">
          <Row>
            <Col span='12'>
              {/* <UnderlinedTabs tabData={tabs} defaultValue={'txn_details'} /> */}
              <SimpleCard>
                <Row>
                  {currentTransaction && Object.keys(currentTransaction).map((cust, index) => {
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
            <Col span='12'>
              <SimpleCard padding={false}>
                <SpaciousTable data={alertList} />
              </SimpleCard>
            </Col>
          </Row>
        </Col>

        <Col span="3">
          <Row>
            <Col span='flex'>
              <SimpleCard gap={'2'} >
                <Row>
                  <Col span='12'>
                    <H3>Risk Ratio</H3>
                  </Col>
                  <Col>
                    <KeyvalueBlock label={"STR"} value={alertList.filter(item => item.riskCategory === "STR").length || 0} />
                  </Col>
                  <Col>
                    <KeyvalueBlock label={"CTR"} value={alertList.filter(item => item.riskCategory === "CTR").length || 0} />
                  </Col>
                  <Col>
                    <KeyvalueBlock label={"CBWT"} value={alertList.filter(item => item.riskCategory === "CBWT").length || 0} />
                  </Col>
                  <Col>
                    <KeyvalueBlock label={"NTR"} value={alertList.filter(item => item.riskCategory === "NTR").length || 0} />
                  </Col>
                  <Col>
                    <RiskScoreSlider label={`MLScore`} sliderOnly={false} score={80} />
                  </Col>

                </Row>
              </SimpleCard>
            </Col>


            <Col span="12">
              <Timeline data={timeline} />
            </Col>
          </Row>
        </Col>
      </Row>
    </MutedBgLayout>
  );
}

export default MKCView;
