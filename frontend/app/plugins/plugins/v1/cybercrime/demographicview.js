import React, { useEffect, useState } from 'react';
import Row from 'Row';
import Col from 'Col';
import Heading from 'Heading';
import usePageContext from 'usePageContext';
import Card from 'Card';
import ReadOnlyField from '../../../components/ReadOnlyField';
import PieChart from 'DonutChart';
import BarChart from 'BarChart';
import MiniCard from '../../../components/miniCard';
import Modal from 'Modal';

const index = () => {
  const { setCurrentPage } = usePageContext();
  const [selectedRows, setSelectedRows] = useState([]);
  const [tableData, setTableData] = useState([]);

  const [modalisOpen, setmodalisOpen] = useState(false);

  const toggleModal = () => {
    setmodalisOpen(!modalisOpen);
  };

  const data = {
    borrower: 'DEMO',
    coBorrower: ['demo 2'],
    accountType: 'Saving Account',
    accountBalance: '1000',
    acountOpeningDate: '10/10/10',
    issuedBranch: 'T-NAGAR',
    accountStatus: 'Active',
    accountNo: 'XXXX10',
    mobileNo: 'XXXXX145',
    pan: 'XXXXXXXX',
    kycStatus: 'Completed',
    address:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    email: 'demo@dd.com',
    txnStatus: {
      labels: ['Success', 'Failure'],
      datasets: [
        {
          data: [60, 40],
          backgroundColor: ['#009775', '#4bcd3e'],
        },
      ],
    },
    monthlyTxnStatus: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      // datasets is an array of objects where each object represents a set of data to display corresponding to the labels above. for brevity, we'll keep it at one object
      datasets: [
        {
          label: 'Success',
          data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
          backgroundColor: ['#4bcd3e'],
        },
        {
          label: 'Failure',
          data: [2, 3, 5, 20, 80, 120, 70, 80, 90, 100],
          backgroundColor: ['#8dc63f'],
        },
      ],
    },
  };

  return (
    <>
      <div className="p-4">
        <Row>
          <Col>
            <Heading
              title="Demo Graphic View"
              subTitle="Get to know the demo graphic view based on search criteria"
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <Row>
              <Card
                title="Account Details"
                customHeaderComponents={
                  <>
                    <button className="btn btn-fis-secondary">
                      Freeze Account
                    </button>
                  </>
                }
              >
                <div className="p-2">
                  <Row>
                    <Col sm={6} md={6} lg={6} className="border-right-1">
                      <div className="p-2">
                        <Row>
                          <Col sm={6} md={6} lg={6}>
                            <ReadOnlyField title={'Borrower'}>
                              {data['borrower']}
                            </ReadOnlyField>
                          </Col>
                          <Col
                            sm={6}
                            md={6}
                            lg={6}
                            style={{
                              display: 'flex',
                              justifyContent: 'flex-end',
                              alignItems: 'center',
                            }}
                          >
                            <a href="#" onClick={() => toggleModal()}>
                              + Co-Borrower
                            </a>
                            <Modal
                              isOpen={modalisOpen}
                              handleClose={toggleModal}
                              close={true}
                              title={'Co-Borrower'}
                            >
                              <ul>
                                {data['coBorrower'].map((m, i) => {
                                  return (
                                    <>
                                      <li key={i}>{m}</li>
                                    </>
                                  );
                                })}
                              </ul>
                            </Modal>
                          </Col>
                        </Row>

                        <ReadOnlyField title={'AccountType'}>
                          {data['accountType']}
                        </ReadOnlyField>

                        <ReadOnlyField title={'AccountNo'}>
                          {data['accountNo']}
                        </ReadOnlyField>

                        <ReadOnlyField title={'AccountStatus'}>
                          {data['accountStatus']}
                        </ReadOnlyField>

                        <ReadOnlyField title={'AccountBalance'}>
                          {data['accountBalance']}
                        </ReadOnlyField>
                      </div>
                    </Col>

                    <Col sm={6} md={6} lg={6}>
                      <div className="p-3">
                        <Row>
                          <Heading title="Account Credit/Debit Ratio" />

                          <Col sm={6} md={6} lg={6}>
                            <div className="max-height-300">
                              <PieChart
                                data={data['txnStatus']}
                                options={{
                                  plugins: {
                                    legend: {
                                      display: false,
                                    },
                                  },
                                  cutout: '85%',
                                }}
                              />
                            </div>
                          </Col>

                          <Col sm={6} md={6} lg={6}>
                            <ReadOnlyField title={'Account Opening Date'}>
                              {data['acountOpeningDate']}
                            </ReadOnlyField>

                            <ReadOnlyField title={'Account Opening Branch'}>
                              {data['issuedBranch']}
                            </ReadOnlyField>

                            <ReadOnlyField title={'Account Balance'}>
                              {data['accountBalance']}
                            </ReadOnlyField>
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Card>
            </Row>
          </Col>
        </Row>
        <div className="pb-2"></div>
        <Row>
          <Card title={'Additional Details'}>
            <Row>
              <Col sm={6} md={6} lg={6}>
                <ReadOnlyField title={'Pan'}>{data['pan']}</ReadOnlyField>
              </Col>

              <Col sm={6} md={6} lg={6}>
                <ReadOnlyField title={'kyc Status'}>
                  {data['kycStatus']}
                </ReadOnlyField>
              </Col>
            </Row>
            <Row>
              <Col sm={6} md={6} lg={6}>
                <ReadOnlyField title={'Mobile Number'}>
                  {data['mobileNo']}
                </ReadOnlyField>
              </Col>
              <Col sm={6} md={6} lg={6}>
                <ReadOnlyField title={'Email'}>{data['email']}</ReadOnlyField>
              </Col>
            </Row>
            <Col>
              <ReadOnlyField title={'Address'}>{data['address']}</ReadOnlyField>
            </Col>
          </Card>
        </Row>
        <div className="pb-2"></div>
        <Heading title={'Spending Analysis'} />
        <Row>
          <MiniCard title={'Total Credits'}>10000</MiniCard>
          <MiniCard title={'Total Debits'}>1000</MiniCard>
          <MiniCard title={'Average Monthly Spending'}> 10000 </MiniCard>
          <MiniCard title={'Average Monthly Income'}> 20000 </MiniCard>
          <MiniCard title={'Transaction Count'}>200 </MiniCard>
          <MiniCard title={'Largest Transactions'}> 20000(credit) </MiniCard>
          <MiniCard title={'Recurring Transactions'}> 2 </MiniCard>
          <MiniCard title={'Involved Channels'}>4 </MiniCard>
        </Row>

        <Row>
          <Col sm={6} md={6} lg={6}>
            <Card title="Average Channel Statistics (monthly)">
              <div className="">
                <table className="table simple-table">
                  <tr className="table-row">
                    <th className="table-cell ps-4">Channel</th>
                    <th className="table-cell">Count</th>
                    <th className="table-cell">Success</th>
                    <th className="table-cell">Failure</th>
                  </tr>
                  <tr className="table-row">
                    <td className="table-cell ps-4">ATM</td>
                    <td className="table-cell">1000</td>
                    <td className="table-cell">1000</td>
                    <td className="table-cell">0</td>
                  </tr>

                  <tr className="table-row">
                    <td className="table-cell ps-4">UPI</td>
                    <td className="table-cell">1000</td>
                    <td className="table-cell">1000</td>
                    <td className="table-cell">0</td>
                  </tr>

                  <tr className="table-row">
                    <td className="table-cell ps-4">IB</td>
                    <td className="table-cell">1000</td>
                    <td className="table-cell">1000</td>
                    <td className="table-cell">0</td>
                  </tr>

                  <tr className="table-row">
                    <td className="table-cell ps-4">MB</td>
                    <td className="table-cell">1000</td>
                    <td className="table-cell">1000</td>
                    <td className="table-cell">0</td>
                  </tr>

                  <tr className="table-row">
                    <td className="table-cell ps-4">MB</td>
                    <td className="table-cell">1000</td>
                    <td className="table-cell">1000</td>
                    <td className="table-cell">0</td>
                  </tr>

                  <tr className="table-row">
                    <td className="table-cell ps-4">MB</td>
                    <td className="table-cell">1000</td>
                    <td className="table-cell">1000</td>
                    <td className="table-cell">0</td>
                  </tr>
                </table>
              </div>
            </Card>
          </Col>
          <Col sm={6} md={6} lg={6} className="ps-2">
            <div className="max-height-200">
              <Card title="Monthly Spendings">
                <BarChart data={data['monthlyTxnStatus']} />
              </Card>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default index;
