import AIS from '@ais/sdk';
import { getCurrentDateTime } from '@ais/sdk/deviceInfo';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Card, Col, Form, Modal, Row } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router';

function Home() {
  const [accountNo, setaccountNo] = useState('');
  const [amount, setamount] = useState(0);
  const [dateTime, setdateTime] = useState(new moment(new Date()));
  const [txnType, settxnType] = useState('IMPS');
  const [ipv4, setipv4] = useState('134.238.19.218');
  const [showModal, setshowModal] = useState(false);
  const [deviceFingerPrint, setdeviceFingerPrint] = useState(
    '26461727-82d1-4cc4-9c64-caf893a31213',
  );

  const [urlToLoad, seturlToLoad] = useState(null);

  const navigate = useNavigate();

  const { state } = useLocation();

  const format = 'HH:mm';

  useEffect(() => {
    // const deviceId = getBrowserFingerPrint();
    // hashString(deviceId).then(res => {
    //   setdeviceFingerPrint(res);
    // })
  }, []);

  useEffect(() => {
    // console.log(getBrowser());
    // console.log(getCurrentDateTime(dateTime));
  }, [dateTime]);

  useEffect(() => {
    if (ipv4) {
      localStorage.setItem('ipv4', ipv4);
    }
  }, [ipv4]);

  useEffect(() => {
    console.log(state);
    if (
      state?.status === 'success' ||
      state?.status === 'failed' ||
      state?.status === 'denied'
    ) {
      setshowModal(true);
    }
  }, [state]);

  const triggerLogin = (e) => {
    e.preventDefault();
    console.log(accountNo, amount, txnType);

    const data = {
      eventDetails: {
        data: 'payments',
        desc: 'Mobile Device Registration',
        type: txnType.toLowerCase(),
      },
      // deviceDetails: {
      //   hardwareId: deviceFingerPrint || '26461727-82d1-4cc4-9c64-caf893a31213',
      //   deviceId: '1234567890987',
      //   screenSize: '1080x2177',
      //   language: 'en',
      //   deviceModel: 'samsung',
      //   deviceFingerPrint: deviceFingerPrint,
      //   channel: 'web',
      //   ip: ipv4,
      //   region: 'india',
      //   mobileNumber: '8879873728',
      //   sdkVersion: '1.0',
      //   dt: '20231128130500000',
      // },
      sdkDetails: {},
      customerDetails: {
        customerName: 'Anand',
        userType: 'retail',
        orgName: 'inbretail',
        userid: sessionStorage.getItem('username') || 'e5614002',
        sessionId: sessionStorage.getItem('sessionId'),
      },
      senderDetails: {
        accountNumber: accountNo,
        accountType: 'savings',
        ifscCode: 'PYTM0123456',
        countryCode: '356',
        transactionType: 'IMPS',
      },
      receiverDetails: {
        accountNumber: '989786782901',
        accountType: 'savings',
        ifscCode: 'PYTM0123456',
        countryCode: '356',
        transactionType: 'IMPS',
      },
      transactionDetails: {
        amount: amount,
        ccy: '356',
        dt: getCurrentDateTime(dateTime.toDate()),
        rrn: '2311786552',
      },
    };

    console.log(data);

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };

    AIS.apiCall(
      '/ngpdev/ais/dev/rulewhiz/v1/takedecision',
      'POST',
      requestOptions.body,
    )
      .then((response) => response)
      .then((data) => {
        console.log(data);
        if ('action' in data) {
          if (data['action'] === '50') {
            sessionStorage.setItem('data', JSON.stringify(data));
            navigate('/verifyOtp');
          }

          if (data['action'] === '70') {
            sessionStorage.setItem('data', JSON.stringify(data));
            navigate('/kba');
          }

          if (data['action'] === '60') {
            sessionStorage.setItem('data', JSON.stringify(data));
            navigate('/verifyTotp');
          }

          if (data['action'] === '00') {
            sessionStorage.setItem('data', JSON.stringify(data));

            alert(data.ruleName);

            navigate('/home', {
              state: {
                status: 'success',
              },
            });
          }

          if (data['action'] === '99') {
            sessionStorage.setItem('data', JSON.stringify(data));

            alert(data.ruleName);

            navigate('/home', {
              state: {
                status: 'denied',
              },
            });
          }
        }
      });
  };

  return (
    <>
      <div className={`d-flex justify-content-center align-items-center`}>
        <div className={`container fluid`} style={{ height: '100vh' }}>
          <div className={`d-flex justify-flex-end`}>
            <span>Welcome , Sara (989786782901)</span>
          </div>

          <Modal show={showModal} onHide={() => setshowModal(!showModal)}>
            <Modal.Body>
              <>
                {state && state.status && (
                  <strong>
                    <h3>Challenge Status : {state.status}</h3>
                  </strong>
                )}
              </>
            </Modal.Body>
          </Modal>
          <Row>
            <Col>
              {state && state.status && (
                <strong>
                  <h3>Challenge Status : {state.status}</h3>
                </strong>
              )}

              <h3 className={`display-flex justify-content-center`}>
                {' '}
                Internet Banking Simulation Portal{' '}
              </h3>
              <Row>
                <Col>
                  <Card>
                    <div className={`card`}>
                      <p> &nbsp; &nbsp; Fund Transfer</p>
                      <div className={`card-body`}>
                        <div>
                          <Form.Label htmlFor="accountNo">
                            Account No
                          </Form.Label>

                          <Form.Select
                            name="accountno"
                            onChange={(e) => setaccountNo(e.target.value)}
                            value={accountNo}
                            aria-label="Default select example"
                          >
                            <option>Select a Beneficiary</option>
                            <option value="945874648092983">
                              John (945874648092983)
                            </option>
                            <option value="982376858564835">
                              Bob (982376858564835)
                            </option>
                            <option value="872387236495906">
                              Mark (872387236495906)
                            </option>
                            <option value="983473465894948">
                              Tom (983473465894948)
                            </option>
                            <option value="989273892736565">
                              Alice (989273892736565)
                            </option>
                          </Form.Select>
                          {/* <Form.Control
                            type="number"
                            id="accountNo"
                            aria-describedby="accountNo"
                            value={accountNo}
                            onChange={(e) => setaccountNo(e.target.value)}
                          /> */}

                          <Form.Label htmlFor="accountNo">Amount</Form.Label>
                          <Form.Control
                            type="number"
                            id="amount"
                            aria-describedby="amount"
                            value={amount}
                            onChange={(e) => setamount(e.target.value)}
                          />
                          <Row>
                            <Col>
                              <Form.Label htmlFor="ipv4">
                                Transaction Time
                              </Form.Label>
                              <Form.Control
                                type="time"
                                value={moment(dateTime).format(format)}
                                onChange={(e) =>
                                  setdateTime(moment(e.target.value, format))
                                }
                              />
                            </Col>
                            <Col>
                              <Form.Label htmlFor="ipv4">Ipv4</Form.Label>

                              <Form.Select
                                name="ip"
                                onChange={(e) => setipv4(e.target.value)}
                                value={ipv4}
                                aria-label="IP"
                              >
                                <option value="134.238.19.218">
                                  Corporate - (134.238.19.218)
                                </option>
                                <option value="49.37.213.237">
                                  Reliance JIO Network (49.37.213.237)
                                </option>
                                <option value="152.58.252.41">
                                  Airtel Mobile Network (152.58.252.41)
                                </option>
                                <option value="185.220.101.7">
                                  {' '}
                                  Outside India (185.220.101.7)
                                </option>
                              </Form.Select>
                            </Col>
                          </Row>

                          <Form.Label htmlFor="inputPassword5">
                            Transaction Type
                          </Form.Label>
                          <Form.Select
                            aria-label="Default select example"
                            value={txnType}
                            onChange={(e) => settxnType(e.target.value)}
                          >
                            <option>Transaction Type</option>
                            <option value="IMPS">IMPS</option>
                            <option value="NEFT">NEFT</option>
                            <option value="RTGS">RTGS</option>
                            <option value="changepin">CHANGE PIN</option>
                          </Form.Select>
                          <br />
                          <button
                            className={`btn btn-info`}
                            onClick={(e) => triggerLogin(e)}
                          >
                            Trigger
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Col>
                <Col>
                  <Card>
                    <div className={`card`}>
                      <p> &nbsp; &nbsp; Active Memento Rules List</p>
                      <div className={`card-body`}>
                        <table className={`full-width table`}>
                          <thead>
                            <tr>
                              <th>Rule</th>
                              <th>score</th>
                              <th>Action</th>
                            </tr>
                          </thead>

                          <tbody>
                            <tr
                              className={`${amount > 0 && amount <= 1000 && 'isActive'}`}
                            >
                              <td>Transaction Amount Less Than 1000</td>
                              <td>0</td>
                              <td>No Action</td>
                            </tr>

                            <tr
                              className={`${amount > 1000 && amount <= 10000 && 'isActive'}`}
                            >
                              <td>
                                Transaction Amount Between 1000 between 10,000
                              </td>
                              <td>60</td>
                              <td>KBA</td>
                            </tr>

                            <tr
                              className={`${amount > 10000 && amount <= 50000 && 'isActive'}`}
                            >
                              <td>
                                Transaction Amount Between 10,000 between 50,000
                              </td>
                              <td>80</td>
                              <td>TOTP</td>
                            </tr>

                            <tr
                              className={`${amount > 50000 && amount <= 100000 && 'isActive'}`}
                            >
                              <td>
                                Transaction Amount Between 50,000 between
                                1,00,000
                              </td>
                              <td>95</td>
                              <td>OTP</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
}

export default Home;
