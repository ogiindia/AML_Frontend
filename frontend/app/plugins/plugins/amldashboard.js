
import api from "@ais/api";
import {
  Col,
  IconButton,
  MutedBgLayout,
  NGPBar,
  NGPHeatMap,
  NGPLine,
  NGPMultiBar,
  NGPPieRoundedCorner,
  NGPRadar,
  Row,
  SectionCard,
  SimpleCard
} from '@ais/components';
import CategoryScale from 'CategoryScale';
import Chart from 'Chart';
import Heading from 'Heading';
import WithSession from 'WithSession';
import useModalHost from 'useModalHost';
import React, { useState } from "react";
import { useLocation } from "react-router";

Chart.register(CategoryScale);
function Flow({ appPrimaryColor, appSecondaryColor }) {
  const { state } = useLocation();
  const [pieRuleData, setPieRuleData] = useState([]);
  const [recurrCustomerData, setRecurrCustomerData] = useState([]);
  const [repeatCustomerData, setRepeatCustomerData] = useState([]);
  const [suspiciousTxnCount, setSuspiciousTxnCount] = useState([]);
  const [topBranchCount, setTopBranchCount] = useState([]);
  const [ruleVsTrans, setRuleVsTrans] = useState([]);


  const [loading, setloading] = React.useState(false);

  // const radarData = [
  //   { channel: 'UPI', transactions: 120 },
  //   { channel: 'ATM', transactions: 98 },
  //   { channel: 'CC', transactions: 86 },
  //   { channel: 'MB', transactions: 99 },
  //   { channel: 'IB', transactions: 85 },
  // ];


  React.useEffect(() => {
    console.log(appPrimaryColor, appSecondaryColor);
    loadData();
  }, [appPrimaryColor, appSecondaryColor]);





  const loadData = () => {
    setloading(true);


    api.get('/app/rest/v1/getDashboardRuleCount')
      .then((res) => {
        setPieRuleData(res);
      })
      .catch((err) => {
        console.error("Error fetching dashboard rule count:", err);
      });


    api.get('/app/rest/v1/getRecurringCustomerCount')
      .then((res) => {
        setRecurrCustomerData(res);
      })
      .catch((err) => {
        console.error("Error fetching recurring customer count:", err);
      });

    api.get('/app/rest/v1/getRepeatedCustomerCount')
      .then((res) => {
        setRepeatCustomerData(res);
      })
      .catch((err) => {
        console.error("Error fetching repeated customer count:", err);
      });

    api.get('/app/rest/v1/getSuspiciousTxnCount')
      .then((res) => {
        setSuspiciousTxnCount(res);
      })
      .catch((err) => {
        console.error("Error fetching suspicious transaction count:", err);
      });

    api.get('/app/rest/v1/getTopBranchCount')
      .then((res) => {
        setTopBranchCount(res);
      })
      .catch((err) => {
        console.error("Error fetching top branch count:", err);
      });

    api.get('/app/rest/v1/getRuleVsTransaction')
      .then((res) => {
        setRuleVsTrans(res);
      })
      .catch((err) => {
        console.error("Error fetching rule vs transaction data:", err);
      });




    setloading(false);
  };

  // const ruleVsTrans = [
  //   { date: 'Jan', count: 10 },
  //   { date: 'Feb', count: 25 },
  //   { date: 'Mar', count: 40 },
  //   { date: 'Apr', count: 301 },
  //   { date: 'Jun', count: 130 },
  //   { date: 'Jul', count: 245 },
  //   { date: 'Aug', count: 470 },
  //   { date: 'Sep', count: 360 },
  //   { date: 'Oct', count: 150 },
  //   { date: 'Nov', count: 245 },
  //   { date: 'Dec', count: 430 },
  // ];

  const { showPluginModal } = useModalHost();
  return (
    <MutedBgLayout>
      <Heading
        className={`p-2`}
        title="Dashboard"
        subTitle="Your Day At Glance"
      >

      </Heading>

      <Row gap="0" nowrap={false}>
        <Col span="flex" padding={false} className="p-2">
          <SectionCard gap="0" title="STR" subtitle="Suspicious Transaction Report">
            <div className="text-2xl font-bold text-destructive">{pieRuleData.find(item => item.name === "STR")?.value || 0}</div>
          </SectionCard>
        </Col>

        <Col span="flex" padding={false} className="p-2">
          <SectionCard gap="0" title="CTR" subtitle={`Cash Transaction Report`}>
            <div className="text-2xl font-bold text-primary">{pieRuleData.find(item => item.name === "CTR")?.value || 0}</div>
            {/* <p className="text-muted-foreground text-primary text-xs">
              -5% from last month
            </p> */}
          </SectionCard>
        </Col>
        <Col span="flex" padding={false} className="p-2">
          <SectionCard gap="0" title="NTR" subtitle={`Non-profit Org Transaction Report`}>
            <div className="text-2xl font-bold text-warning">{pieRuleData.find(item => item.name === "NTR")?.value || 0}</div>
            {/* <p className="text-muted-foreground text-warning text-xs">
              +10.1% from last month
            </p> */}
          </SectionCard>
        </Col>

        <Col span="flex" padding={false} className="p-2">
          <SectionCard className={`flex-col`} gap="0" title="CBWTR" subtitle={`Cross Border Transaction Report`}>
            <div className="text-2xl font-bold text-info">{pieRuleData.find(item => item.name === "CBWT")?.value || 0} </div>
            {/* <p className="text-muted-foreground text-primary text-xs">
              -5% from last month
            </p> */}
          </SectionCard>
        </Col>


      </Row>

      {/* <Row>
        <Col span='12'>
          <SimpleCard align='start' title={`Top 10 Reported Customers`} subtitle={`No:of Customers repeatedly reported in GOVT Channels`} customHeaderComponents={(<>
            <IconButton icon={"Eye"} label={"View"} variant={`secondary`} onClick={() => showPluginModal('v2-customers-recurring-customer-list', { size: 'lg' })} />
          </>)}>
            <NGPMultiBar barData={barData} colorIndex={1} />
          </SimpleCard>
        </Col>
      </Row> */}

      <Row gap='0'>
        <Col span='6'>
          <SimpleCard align='start' title={`Recurring customer patterns`} subtitle={`No:of Customers who's txn accounted in multiple alert category`} customHeaderComponents={(<>
            {/* <IconButton icon={"Eye"} label={"View"} variant={`secondary`} onClick={() => showPluginModal('v2-customers-recurring-customer-list', { size: 'lg' })} /> */}
          </>)}>
            <NGPBar barData={recurrCustomerData} colorIndex={1} />
          </SimpleCard>
        </Col>

        <Col span='6'>
          <SimpleCard align='start' title={`Repeated customers`} subtitle={`No:of Customers who's txn accounted in multiple days`}
            customHeaderComponents={(<>  {/* <IconButton icon={"Eye"} label={"View"} onClick={() => showPluginModal('v2-customers-repeated-customer-list', { size: 'lg' })} variant={`secondary`} /> */}</>)}
          >
            <NGPBar barData={repeatCustomerData} colorIndex={2} />
          </SimpleCard>
        </Col>
      </Row>

      <Row gap={0}>
        <Col span="4" gap={0}>
          <SimpleCard title="Suspicious Txn Count">
            <NGPRadar radarData={suspiciousTxnCount} />
          </SimpleCard>
        </Col>
        <Col span="8" gap={0}>
          <SimpleCard title="Top 10 Suspicious Account Branches">
            <NGPBar barData={topBranchCount} />
          </SimpleCard>
        </Col>
      </Row>

      <Row gap={0}>
        <Col span="8" gap={0}>
          <SimpleCard title="Rule vs Transactions">
            <NGPLine lineData={ruleVsTrans} />
          </SimpleCard>
        </Col>
        <Col span="4" gap={0}>
          <SimpleCard title="Risk Ratio">
            <NGPPieRoundedCorner pieData={pieRuleData} />
          </SimpleCard>
        </Col>
      </Row>

      <Row gap={0}>
        <Col span="12" gap={0}>
          <SimpleCard title="Suspicious Transaction HeatMap">
            <NGPHeatMap />
          </SimpleCard>
        </Col>
      </Row>
    </MutedBgLayout>
  );
}

export default WithSession(Flow);
