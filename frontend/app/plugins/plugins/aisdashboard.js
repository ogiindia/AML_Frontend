import { Card, Col, Row, SimpleLayout } from '@ais/components';
import CategoryScale from 'CategoryScale';
import Chart from 'Chart';
import Heading from 'Heading';
import WithSession from 'WithSession';
import React from 'react';
import Histogram from '../components/charts/Histogram';
import LineChart from '../components/charts/LineChart';
import PieChart from '../components/charts/PieChart';
import StackChart from '../components/charts/StackChart';

Chart.register(CategoryScale);
function Flow({ appPrimaryColor, appSecondaryColor }) {
  const riskTransactions = [
    {
      key: 'Login',
      value: 100,
    },
    { key: 'NEFT', value: 120 },
    { key: 'IMPS', value: 40 },
    { key: 'NEFT', value: 50 },
    { key: 'IMPS', value: 100 },
    { key: 'ADD_BENEFICIARY', value: 10 },
  ];

  const riskScoreTransaction = [
    {
      key: 'day 1',
      value: 20,
    },
    { key: 'day 2', value: 100 },
    { key: 'day 3', value: 50 },
  ];

  const riskByChannel = [
    { key: 'IB', value: 30 },
    { key: 'MB', value: 70 },
  ];

  const challengeTriggeredVsCompleted = [
    {
      key: 'LOGIN',
      category: 'completed',
      value: 90,
    },
    {
      key: 'LOGIN',
      category: 'triggered',
      value: 100,
    },

    { key: 'ADD_BENEFICIARY', category: 'triggered', value: 50 },
    { key: 'ADD_BENEFICIARY', category: 'completed', value: 30 },
  ];

  React.useEffect(() => {
    console.log(appPrimaryColor, appSecondaryColor);
  }, [appPrimaryColor, appSecondaryColor]);

  return (
    <SimpleLayout>
      <Heading title="Dashboard" subTitle="Overview of 1 day data">
        <div className={`flex-end`}>
          {/* <div>
            <label>
              Filter : <People />
            </label>
            <select aria-label="Default select example">
              <option>Open this select menu</option>
              <option value="1">One</option>
              <option value="2">Two</option>
              <option value="3">Three</option>
            </select>
          </div> */}
        </div>
      </Heading>

      <Row>
        <Col span="12" padding={false}>
          <Heading title={`Risk analysis`}></Heading>
        </Col>
        <Col span="auto" md={4} lg={4}>
          <Card>
            <Histogram
              data={riskTransactions}
              backgroundColor={appPrimaryColor}
              hoverBackgroundColor={appSecondaryColor}
              label={'Risk Score Distribution'}
            />
          </Card>
        </Col>
        <Col span="auto" md={4} lg={4}>
          <Card>
            <LineChart
              data={riskScoreTransaction}
              backgroundColor={appPrimaryColor}
              hoverBackgroundColor={appSecondaryColor}
              label={'Risk Trend Over time'}
            />
          </Card>
        </Col>
        <Col span="auto" md={4} lg={4}>
          <Card>
            <PieChart
              data={riskByChannel}
              backgroundColor={appPrimaryColor}
              hoverBackgroundColor={appSecondaryColor}
              label={'Risk By Channel'}
            />
          </Card>
        </Col>
      </Row>

      <Row>
        <Col span="12">
          <Heading title={`Challenge Response Graphs`}></Heading>
        </Col>
        <Col span="auto" md={6} lg={6}>
          <Card>
            <StackChart
              data={challengeTriggeredVsCompleted}
              backgroundColor={appPrimaryColor}
              hoverBackgroundColor={appSecondaryColor}
              label={' Challenges Triggered vs. Completed'}
            />
          </Card>
        </Col>
        <Col span="auto" md={6} lg={6}>
          <Card>
            <LineChart
              data={riskScoreTransaction}
              backgroundColor={appPrimaryColor}
              hoverBackgroundColor={appSecondaryColor}
              label={'Challenge Type Usage'}
            />
          </Card>
        </Col>
      </Row>

      <Row>
        <Col span="12">
          <Heading title={`Transaction Analysis Graphs`}></Heading>
        </Col>
        <Col span="auto" md={4} lg={4}>
          <Card>
            <Histogram
              data={riskTransactions}
              backgroundColor={appPrimaryColor}
              hoverBackgroundColor={appSecondaryColor}
              label={'Transaction Volume by Channel'}
            />
          </Card>
        </Col>
        <Col span="auto" md={4} lg={4}>
          <Card>
            <LineChart
              data={riskScoreTransaction}
              backgroundColor={appPrimaryColor}
              hoverBackgroundColor={appSecondaryColor}
              label={'Transaction Amount Distribution'}
            />
          </Card>
        </Col>
        <Col span="auto" md={4} lg={4}>
          <Card>
            <LineChart
              data={riskScoreTransaction}
              backgroundColor={appPrimaryColor}
              hoverBackgroundColor={appSecondaryColor}
              label={'Transaction Patterns by Time of Day'}
            />
          </Card>
        </Col>
      </Row>

      <Row>
        <Col span="12">
          <Heading title={`Device intelligence Graph`}></Heading>
        </Col>
        <Col span="auto" md={6} lg={6}>
          <Card>
            <Histogram
              data={riskTransactions}
              backgroundColor={appPrimaryColor}
              hoverBackgroundColor={appSecondaryColor}
              label={'New User vs Old User'}
            />
          </Card>
        </Col>
        <Col span="auto" md={6} lg={6}>
          <Card>
            <LineChart
              data={riskScoreTransaction}
              backgroundColor={appPrimaryColor}
              hoverBackgroundColor={appSecondaryColor}
              label={'Normal User vs Bot User'}
            />
          </Card>
        </Col>
      </Row>

      {/* <Row>
        <Heading title={`User Behavior Insights`}></Heading>
        <Col span='auto' md={4} lg={4}>
          <Card cardBodyClassName={`chart-block-250px`}>
            <Histogram
              data={riskTransactions}
              backgroundColor={appPrimaryColor}
              hoverBackgroundColor={appSecondaryColor}
              label={'Login Pattern'}
            />
          </Card>
        </Col>
        <Col span='auto' md={4} lg={4}>
          <Card cardBodyClassName={`chart-block-250px`}>
            <LineChart
              data={riskScoreTransaction}
              backgroundColor={appPrimaryColor}
              hoverBackgroundColor={appSecondaryColor}
              label={'Failed Login Attempts'}
            />
          </Card>
        </Col>
        <Col span='auto' md={4} lg={4}>
          <Card cardBodyClassName={`chart-block-250px`}>
            <LineChart
              data={riskScoreTransaction}
              backgroundColor={appPrimaryColor}
              hoverBackgroundColor={appSecondaryColor}
              label={'User Risk Segmentation'}
            />
          </Card>
        </Col>
      </Row> */}
    </SimpleLayout>
  );
}

export default WithSession(Flow);
