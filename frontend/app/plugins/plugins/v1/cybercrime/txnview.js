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
import Timeline from 'Timeline';

import {
  XCircleFill,
  CheckCircleFill,
  Envelope,
  Paperclip,
} from 'react-bootstrap-icons';

const index = () => {
  const { setCurrentPage } = usePageContext();
  const [selectedRows, setSelectedRows] = useState([]);
  const [tableData, setTableData] = useState([]);

  const [modalisOpen, setmodalisOpen] = useState(false);

  const [modalisOpen2, setmodalisOpen2] = useState(false);

  const [modalisOpen3, setmodalisOpen3] = useState(false);

  const [modalisOpen4, setmodalisOpen4] = useState(false);

  const [timelineData, settimelineData] = useState(null);

  const [currentEmail, setcurrentEmail] = useState('STEP_1');

  const toggleModal = () => {
    setmodalisOpen(!modalisOpen);
  };

  const toggleModal2 = () => {
    setmodalisOpen2(!modalisOpen2);
  };

  const toggleModal3 = () => {
    setmodalisOpen3(!modalisOpen3);
  };

  const toggleModal4 = (d) => {
    setmodalisOpen4(!modalisOpen4);
    setcurrentEmail(d);
  };

  const toggleModal5 = () => {
    setmodalisOpen4(!modalisOpen4);
  };

  const data = {
    borrower: 'DEMO',
    coBorrower: ['demo 2'],
    linkedDevices: [
      {
        type: 'mobilebanking',
        lastLoginAt: '10/10/2024',
        loginIp: '127.0.0.1',
      },
      { type: 'netbanking', lastLoginAt: '14/11/2024', loginIp: '127.0.0.1' },
    ],
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

  const timelineDt = {
    STEP_1: {
      Subject: 'FR-0001/33455-Block the account',
      Sender: 'cybercrime@delhi.gov.in',
      Body: 'please block the account holder account no : 11222456 pan number : 123556789',
      attachments: ['att-1.jpg', 'att-2.jpg'],
      type: 'sender',
    },
    STEP_2: {
      Subject: 'CX1232345567-FR-0001/33455-Block the account',
      Sender: 'bandraBranch@psb.in',
      Body: 'Dear Bandra Branch , please have a look into the below content received from cybercrime and respond to it promptly.please block the account holder account no : 11222456 pan number : 123556789',
      type: 'receiver',
    },
    STEP_3: {
      Subject: 'CX1232345567-FR-0001/33455-Block the account',
      Sender: 'nodaloffice@psb.in',
      Body: 'Dear nodal office , We didnt receive any updates from bandra branch for the respective below email..please reply to the email promptly for the below content please block the account holder account no : 11222456 pan number : 123556789',
      type: 'receiver',
    },
  };

  const clickEvent = (dt) => {
    settimelineData(dt);
  };

  return (
    <>
      <div className="p-4">
        <Modal
          isOpen={modalisOpen4}
          handleClose={toggleModal5}
          close={true}
          title={'Mail Data'}
        >
          <div>
            {timelineDt[currentEmail]['type'] == 'sender' ? (
              <p>Sender : {timelineDt[currentEmail]['Sender']}</p>
            ) : (
              <p>Receiver : {timelineDt[currentEmail]['Sender']}</p>
            )}
            <p>Subject : {timelineDt[currentEmail]['Subject']}</p>

            <p>Body : {timelineDt[currentEmail]['Body']}</p>

            {'attachments' in timelineDt[currentEmail] && (
              <p>
                attachments :
                {timelineDt[currentEmail]['attachments'].map((att, i) => {
                  return (
                    <>
                      <div className="attachment p-2" key={i}>
                        <Paperclip color={'blue'} />
                        <span> {att} </span>
                      </div>
                    </>
                  );
                })}
              </p>
            )}
          </div>
        </Modal>

        <Modal
          isOpen={modalisOpen3}
          handleClose={toggleModal3}
          close={true}
          title={'Case History'}
        >
          <Timeline
            mode={'left'}
            items={[
              {
                children: (
                  <>
                    <div>
                      Mail received and forwarded to Ops team &nbsp;{' '}
                      <Envelope
                        color="blue"
                        style={{ cursor: 'pointer' }}
                        onClick={() => toggleModal4('STEP_1')}
                      />
                      <p>10/11/2024</p>
                    </div>
                  </>
                ),
              },
              {
                children: (
                  <>
                    <div>
                      Ops team Entered the data
                      <p>10/11/2024</p>
                    </div>
                  </>
                ),
              },
              {
                children: (
                  <>
                    <div>
                      Mail Forwared to Branch Based on the IFSC code :
                      IFSC123457 &nbsp;{' '}
                      <Envelope
                        color="blue"
                        style={{ cursor: 'pointer' }}
                        onClick={() => toggleModal4('STEP_2')}
                      />
                      <p>10/11/2024</p>
                    </div>
                  </>
                ),
              },
              {
                children: (
                  <>
                    <div>
                      Mail re-forwared to branch based on the IFSC code :
                      IFSC123457 &nbsp;{' '}
                      <Envelope
                        color="blue"
                        style={{ cursor: 'pointer' }}
                        onClick={() => toggleModal4('STEP_2')}
                      />
                      <p>11/11/2024</p>
                    </div>
                  </>
                ),
              },
              {
                children: (
                  <>
                    <div>
                      Mail re-forwared to branch based on the IFSC code :
                      IFSC123457 &nbsp;{' '}
                      <Envelope
                        color="blue"
                        style={{ cursor: 'pointer' }}
                        onClick={() => toggleModal4('STEP_2')}
                      />
                      <p>13/11/2024</p>
                    </div>
                  </>
                ),
              },
              {
                children: (
                  <>
                    <div>
                      Mail forwarded to Nodal Office &nbsp;{' '}
                      <Envelope
                        color="blue"
                        style={{ cursor: 'pointer' }}
                        onClick={() => toggleModal4('STEP_3')}
                      />
                      <p>14/11/2024</p>
                    </div>
                  </>
                ),
              },
            ]}
          />
        </Modal>

        <Row>
          <Col>
            <Card
              title="Case View : CX1232345567"
              customHeaderComponents={
                <>
                  <div className="p-2">
                    <button
                      onClick={() => toggleModal3()}
                      className="btn btn-outline fis-secondary"
                    >
                      Mail Tracker
                    </button>
                  </div>

                  <div className="p-2">
                    <button className="btn btn-fis-primary">
                      Freeze Account
                    </button>
                  </div>

                  <div className="p-2">
                    <button className="btn btn-fis-secondary">
                      Download transactions
                    </button>
                  </div>
                </>
              }
            ></Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Row>
              <Col sm={9} md={9} lg={9} className="p-2">
                <Card title="case status : IN-PROGRESS">
                  <div className="p-3">
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
                        <div className="p-2">
                          <Row>
                            <Col sm={6} md={6} lg={6}>
                              <ReadOnlyField title={'kycStatus'}>
                                Active
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
                              <a href="#" onClick={() => toggleModal2()}>
                                Linked Devices
                              </a>
                              <Modal
                                isOpen={modalisOpen2}
                                handleClose={toggleModal2}
                                close={true}
                                title={'Linked Devices and their Last Logins'}
                              >
                                <ul>
                                  {data['linkedDevices'].map((m, i) => {
                                    return (
                                      <>
                                        <li key={i}>
                                          {'Last logged in from ' +
                                            m['loginIp'] +
                                            ' at ' +
                                            m['lastLoginAt'] +
                                            ' via ' +
                                            m['type']}
                                        </li>
                                      </>
                                    );
                                  })}
                                </ul>
                              </Modal>
                            </Col>
                          </Row>

                          <ReadOnlyField title={'Full Name'}>
                            Demo Demo
                          </ReadOnlyField>

                          <ReadOnlyField title={'Phone no'}>
                            8764356849 &nbsp;{' '}
                            <span style={{ display: 'inline-flex' }}>
                              <CheckCircleFill color="green" />
                            </span>
                          </ReadOnlyField>

                          <ReadOnlyField title={'Email Address'}>
                            demo@fis.com &nbsp;{' '}
                            <span style={{ display: 'inline-flex' }}>
                              <XCircleFill color="red" />
                            </span>
                          </ReadOnlyField>

                          <ReadOnlyField title={'address'}>
                            Lorem Ipsum is simply dummy text of the printing and
                            typesetting industry.
                          </ReadOnlyField>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Card>
              </Col>

              <Col sm={3} md={3} lg={3} className="p-2">
                <Card>
                  <div className="p-3">
                    <div className="min-height-200 border-1">
                      <img src="./dp-sample.jpg" className="img-fluid"></img>
                    </div>

                    <div>
                      <ReadOnlyField title={'Account created at'}>
                        2022-01-18
                      </ReadOnlyField>

                      <ReadOnlyField title={'Mobile number'}>
                        8124885003
                      </ReadOnlyField>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>

        <div className="p-2"></div>

        <Row>
          <Col sm={12} md={12} lg={12}>
            <Card title="Available KYC details">
              <div className="">
                <table className="table simple-table">
                  <tr className="table-row">
                    <th className="table-cell ps-4">kYC ID </th>
                    <th className="table-cell">Proof Type</th>
                    <th className="table-cell">proof sub-type</th>
                    <th className="table-cell">submitted date</th>
                    <th className="table-cell">Actions</th>
                  </tr>

                  <tr className="table-row">
                    <td className="table-cell ps-4">0001</td>
                    <td className="table-cell">PHOTO</td>
                    <td className="table-cell">PHOTO</td>
                    <td className="table-cell">2022-01-18</td>
                    <td className="table-cell">
                      <button className="btn btn-fis-primary">View</button>
                    </td>
                  </tr>

                  <tr className="table-row">
                    <td className="table-cell ps-4">0002</td>
                    <td className="table-cell">Personal Identity</td>
                    <td className="table-cell">AAdhaar</td>
                    <td className="table-cell">2022-01-18</td>
                    <td className="table-cell">
                      <button className="btn btn-fis-primary">View</button>
                    </td>
                  </tr>

                  <tr className="table-row">
                    <td className="table-cell ps-4">0003</td>
                    <td className="table-cell">Personal Identity</td>
                    <td className="table-cell">PAN CARD</td>
                    <td className="table-cell">2022-01-18</td>
                    <td className="table-cell">
                      <button className="btn btn-fis-primary">View</button>
                    </td>
                  </tr>
                  <tr className="table-row">
                    <td className="table-cell ps-4">0004</td>
                    <td className="table-cell">Address proof</td>
                    <td className="table-cell">Aaadhaar</td>
                    <td className="table-cell">2022-01-18</td>
                    <td className="table-cell">
                      <button className="btn btn-fis-primary">View</button>
                    </td>
                  </tr>
                </table>
              </div>
            </Card>
          </Col>
        </Row>

        <div className="p-2"></div>

        <Row>
          <Col sm={12} md={12} lg={12}>
            <Card title="Top 5 payee's">
              <div className="">
                <table className="table simple-table">
                  <tr className="table-row">
                    <th className="table-cell ps-4">Account no</th>
                    <th className="table-cell">IFSC</th>
                    <th className="table-cell">Total Amount Transferred</th>
                    <th className="table-cell">Last Transaction date</th>
                  </tr>

                  <tr className="table-row">
                    <td className="table-cell ps-4">112234556</td>
                    <td className="table-cell">IFSC123457</td>
                    <td className="table-cell">10000</td>
                    <td className="table-cell">11/10/2024</td>
                  </tr>
                </table>
              </div>
            </Card>
          </Col>
        </Row>

        <div className="p-2"></div>

        <Row>
          <Col sm={12} md={12} lg={12}>
            <Card title="Previously Registered Cases">
              <div className="">
                <table className="table simple-table">
                  <tr className="table-row">
                    <th className="table-cell ps-4">Case no</th>
                    <th className="table-cell">Case Created Date </th>
                    <th className="table-cell">Case Registered State</th>
                    <th className="table-cell">Case Status</th>
                    <th className="table-cell">Account no</th>
                    <th className="table-cell">PAN number</th>
                    <th className="table-cell">Actions</th>
                  </tr>

                  <tr className="table-row">
                    <td className="table-cell ps-4">CX1120055577</td>
                    <td className="table-cell">10/10/2010</td>
                    <td className="table-cell">DELHI</td>
                    <td className="table-cell">Closed</td>
                    <td className="table-cell">11122444566</td>
                    <td className="table-cell">BIACD2200J</td>
                    <td className="table-cell">
                      <button className="btn btn-fis-primary">View</button>
                    </td>
                  </tr>
                </table>
              </div>
            </Card>
          </Col>
        </Row>

        <div className="p-2"></div>
        <Row>
          <Col sm={12} md={12} lg={12}>
            <Card title="Auto Generated Risks ">
              <div className="">
                <table className="table simple-table">
                  <tr className="table-row">
                    <th className="table-cell ps-4">Rule Id</th>
                    <th className="table-cell">Rule Name</th>
                    <th className="table-cell">Rule Triggered Date</th>
                    <th className="table-cell">Risk Score</th>
                    <th className="table-cell">Device FingerPrint</th>
                  </tr>

                  <tr className="table-row">
                    <td className="table-cell ps-4">RD1120055577</td>
                    <td className="table-cell">UPI_TRANS_ABOVE_50K</td>
                    <td className="table-cell">11/10/2024</td>
                    <td className="table-cell">500</td>
                    <td className="table-cell">AO132456786543S</td>
                  </tr>
                </table>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default index;
