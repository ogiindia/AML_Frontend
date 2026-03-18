/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */

import api from "@ais/api";
import { Avatar, AvatarFallback, AvatarImage, Col, Heading, InfoItem, NGPLine, Row, Separator, SimpleCard, Subheading, TableLayout } from '@ais/components';
import { SimpleTable } from '@ais/datatable';
import React, { useState } from "react";
import { useLocation } from "react-router";


function ViewCustomers({ isTxn = false }) {
  const { state } = useLocation();
  const [customerDetails, setCustomerDetails] = useState([]);
  const [accountDetails, setAccountDetails] = useState([]);
  const [transactionDetails, setTransactionDetails] = useState([]);

  const [loading, setloading] = React.useState(false);

  React.useEffect(() => {
    loadData();
  }, []);


  const loadData = () => {
    setloading(true);
    api.get('/app/rest/v1/getCustomerDetails', {
      customerId: state ? state.customerId || customerId : customerId
    }).then((res) => {
      debugger;
      setCustomerDetails(res);
    }).catch((err) => {
      console.error("Error fetching customer details:", err);
    });


    api.get('/app/rest/v1/getAccountDetails', {
      customerId: state ? state.customerId || customerId : customerId
    }).then((res) => {
      setAccountDetails(res);
    }).catch((err) => {
      console.error("Error fetching account details:", err);
    });


    api.get('/app/rest/v1/getTransactionDetails', {
      customerId: state ? state.customerId || customerId : customerId
    }).then((res) => {
      setTransactionDetails(res);
    }).catch((err) => {
      console.error("Error fetching transaction details:", err);
    });


    setloading(false);
  };




  const TxnHistoryStructure = {
    queryType: 'listEvents',
    columns: [
      { key: 'id', label: 'ID', type: 'UUID', show: false },
      { key: 'eventName', label: 'Name', type: 'text' },
      { key: 'createdAt', label: 'Created', type: 'date' },
    ],
  };

  // const monthlyTxns = [
  //   { date: 'Jan', deposit: 10, withdraw: 5 },
  //   { date: 'Feb', deposit: 25, withdraw: 15 },
  //   { date: 'Mar', deposit: 40, withdraw: 20 },
  //   { date: 'Apr', deposit: 301, withdraw: 150 },
  //   { date: 'Jun', deposit: 130, withdraw: 60 },
  //   { date: 'Jul', deposit: 245, withdraw: 120 },
  //   { date: 'Aug', deposit: 470, withdraw: 230 },
  //   { date: 'Sep', deposit: 360, withdraw: 180 },
  //   { date: 'Oct', deposit: 150, withdraw: 70 },
  //   { date: 'Nov', deposit: 245, withdraw: 125 },
  //   { date: 'Dec', deposit: 430, withdraw: 210 },
  // ];

  return (
    <TableLayout>
      <Row>
        <Col span='12'>
          <Heading
            title={`View ${isTxn ? 'Transaction Details' : 'Customer'}`}
          // subTitle="Define the rule and then review it"
          />
        </Col>
        <Col span='12'>
          <Row gap={4}>

            <Col span="12">
              <SimpleCard title="Customer Profile">
                <div className="grid grid-cols-5 gap-4 p-4">
                  <InfoItem title={'Customer Id'} className={'mb-2'}>
                    <span>{customerDetails.customerid}</span>
                  </InfoItem>
                  <InfoItem title={'Customer Name'} className={'mb-2'}>
                    <span>{customerDetails.customername}</span>
                  </InfoItem>
                  <InfoItem title={'KYC Status'} className={'mb-2'}>
                    <span className="text-warning">{customerDetails.kycStatus}</span>
                  </InfoItem>
                  <InfoItem title={'First Name'} className={'mb-2'}>
                    <span>{customerDetails.firstname}</span>
                  </InfoItem>
                  <InfoItem title={'Last Name'} className={'mb-2'}>
                    <span>{customerDetails.lastname}</span>
                  </InfoItem>

                  <InfoItem title={'Branch'} className={'mb-2'}>
                    <span>{customerDetails.branch}</span>
                  </InfoItem>
                  <InfoItem title={'DOB'} className={'mb-2'}>
                    <span>{customerDetails.dateofbirth}</span>
                  </InfoItem>
                  <InfoItem title={'Place of Birth'} className={'mb-2'}>
                    <span>{customerDetails.placeofbirth}</span>
                  </InfoItem>
                  <InfoItem title={'Nationality'} className={'mb-2'}>
                    <span>{customerDetails.nationality}</span>
                  </InfoItem>
                  <InfoItem title={'Age'} className={'mb-2'}>
                    <span>{customerDetails.age}</span>
                  </InfoItem>

                  <InfoItem title={'Sex'} className={'mb-2'}>
                    <span>{customerDetails.sex}</span>
                  </InfoItem>
                  <InfoItem title={'PAN No.'} className={'mb-2'}>
                    <span>{customerDetails.panno}</span>
                  </InfoItem>
                  <InfoItem title={'Occupation'} className={'mb-2'}>
                    <span>{customerDetails.occupation}</span>
                  </InfoItem>
                  <InfoItem title={'Address'} className={'mb-2'}>
                    <span>{customerDetails.addressline1}</span>
                  </InfoItem>
                  <InfoItem title={'City'} className={'mb-2'}>
                    <span>{customerDetails.city}</span>
                  </InfoItem>

                  <InfoItem title={'State'} className={'mb-2'}>
                    <span>{customerDetails.state}</span>
                  </InfoItem>
                  <InfoItem title={'Country'} className={'mb-2'}>
                    <span>{customerDetails.country}</span>
                  </InfoItem>
                  <InfoItem title={'Pin Code'} className={'mb-2'}>
                    <span>{customerDetails.pincode}</span>
                  </InfoItem>
                  <InfoItem title={'Mobile No.'} className={'mb-2'}>
                    <span>{customerDetails.mobileno}</span>
                  </InfoItem>
                  <InfoItem title={'Email Id'} className={'mb-2'}>
                    <span>{customerDetails.emailid}</span>
                  </InfoItem>
                </div>
              </SimpleCard>
            </Col>


            <Col span="6" className={'gap-4'}>
              <SimpleCard align="left" title={'Account Activity'}>
                <Row gap="2" direction='col'>
                  <Col span="auto" className={'gap-3 flex mb-6'}>
                    <InfoItem title={'Account number'} className={'mb-2'}>
                      <span>{accountDetails[0]?.accountno}</span>
                    </InfoItem>
                    <InfoItem title={'Instituion'} className={'mb-2'}>
                      <span>{accountDetails[0]?.branchcode}</span>
                    </InfoItem>
                    <InfoItem title={'Account Type'} className={'mb-2'}>
                      <span>{accountDetails[0]?.accounttype}</span>
                    </InfoItem>
                  </Col>
                </Row>
                <Row>

                  <NGPLine
                    lineData={transactionDetails}
                    dataKey={'date'}
                    dataValue={['deposit', 'withdraw']}
                    height={300}
                  />
                </Row>
              </SimpleCard>
            </Col>
          </Row>
        </Col>

        <Row gap={0} className="w-full">
          <Col span={12} md={12} lg={12} sm={12}>
            <SimpleTable
              tableStructure={TxnHistoryStructure}
              title={'Suspicious Txn History'}
            ></SimpleTable>
          </Col>
        </Row>

        <Row gap={0} className="w-full">
          <Col span={12} md={12} lg={12} sm={12}>
            <SimpleTable
              tableStructure={TxnHistoryStructure}
              title={'Rule Audit'}
            ></SimpleTable>
          </Col>
        </Row>

        <Row gap={0} className="w-full">
          <Col span={12} md={12} lg={12} sm={12}>
            <SimpleTable
              tableStructure={TxnHistoryStructure}
              title={'Mandates'}
            ></SimpleTable>
          </Col>
        </Row>

        <Row gap={0} className="w-full">
          <Col span={12} md={12} lg={12} sm={12}>
            <SimpleTable
              tableStructure={TxnHistoryStructure}
              title={'Linked Accounts'}
            ></SimpleTable>
          </Col>
        </Row>
      </Row >
    </TableLayout >
  );
}

export default ViewCustomers;
