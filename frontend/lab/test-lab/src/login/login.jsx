import AIS from '@ais/sdk';
import { useEffect, useState } from 'react';
import { Card, Col, Modal, Row } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router';
import OtpPage from '../pages/OtpPage';
import Logo from '../static/logo.png';

function Login() {
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [responseData, setresponseData] = useState(null);
  const [showModal, setshowModal] = useState(false);
  const [captcha, setcaptcha] = useState('');
  const [loginfailedCount, setloginfailedCount] = useState(0);

  const [modelType, setmodelType] = useState('CAPTCHA');

  const navigate = useNavigate();

  const getCurrentDateTime = () => {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  };

  useEffect(() => {
    // const browserFingerPrint = getBrowserFingerPrint();
    // console.log(browserFingerPrint);

    // const hashedString = async () => {
    //   const str = await convertHASHData(browserFingerPrint);
    //   console.log(str);
    // }
    // (hashedString());

    AIS.pageInit('TLOGIN', 'LOGIN');
  }, []);

  useEffect(() => {
    sessionStorage.setItem('username', email);
  }, [email]);

  const renderPage = () => {
    if (password !== 'admin')
      alert('Login failed please enter a valid email and password');
    // else {

    if (password !== 'admin') {
      setloginfailedCount(loginfailedCount + 1);
    } else {
      const data = {
        eventDetails: {
          data: 'login',
          desc: 'Net Banking Login',
          type:
            //'success'
            password !== 'admin' || loginfailedCount > 2 ? 'failed' : 'success',
        },

        customerDetails: {
          customerName: 'Anand',
          userType: 'retail',
          orgName: 'inbretail',
          userid: email,
          sessionId: sessionStorage.getItem('sessionId'),
        },
        transactionDetails: {
          rrn: '2311786548',
          amount: '0.0',
          ccy: '356',
          dt: getCurrentDateTime(),
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
        .then((response) => {
          if (typeof response === 'string') {
            return response.json();
          } else {
            return response;
          }
        })
        .then((data) => {
          setresponseData(data);
          console.log(data);
          if ('action' in data) {
            if (data['action'] === '50') {
              sessionStorage.setItem('data', JSON.stringify(data));
              setshowModal(true);
              setmodelType('OTP');
            }
            if (data['action'] === '00') navigate('/home');
            if (data['action'] === '150') {
              setshowModal(true);
              setcaptcha('');
              setmodelType('CAPTCHA');
            }
          }
        });

      // fetch('/ngpdev/ais/rulewhiz/v1/takedecision', requestOptions)
      //   .then((response) => response.json())
      //   .then((data) => {
      //     setresponseData(data);
      //     console.log(data);
      //     if ('action' in data) {
      //       if (data['action'] === '00') navigate('/home');
      //       if (data['action'] === '150') {
      //         setshowModal(true);
      //         setcaptcha('');
      //       }
      //     }
      //   });
      //      }
    }
  };

  const triggerLogin = (e) => {
    e.preventDefault();
    console.log(email, password);
    renderPage();
  };

  const doCaptcha = (e) => {
    e.preventDefault();
    console.log(captcha);

    const data = {
      caseId: responseData.caseId,
      captchaCode: captcha,
    };

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };

    fetch(
      responseData.challengeURL.replace('https://aisworld.space', ''),
      requestOptions,
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.status && data.status === 'Success') {
          if (password !== 'admin') setshowModal(true);
          else navigate('/home');
        } else {
          alert('Verification failed');
          //                    setshowModal(false);
        }
      });
  };

  return (
    <>
      <div className={`d-flex justify-content-center align-items-center`}>
        <div className={`container fluid`} style={{ height: '100vh' }}>
          <Row>
            <Col>
              <h3 className={`display-flex justify-content-center`}>
                {' '}
                Internet Banking Simulation Portal{' '}
              </h3>
              <Card
                style={{
                  maxWidth: '500px',
                  position: 'absolute',
                  left: '35%',
                  top: '25%',
                }}
              >
                <div className={`card`}>
                  <p>
                    <img
                      src={Logo}
                      className={`img-fluid`}
                      width={250}
                      alt="login"
                    ></img>
                  </p>

                  <h3 className={`ps-3`}> Login </h3>
                  <Modal
                    show={showModal}
                    onHide={() => setshowModal(!showModal)}
                  >
                    <Modal.Body>
                      {modelType === 'OTP' && (
                        <OtpPage
                          login={true}
                          cancelCallback={() => setshowModal(!showModal)}
                        />
                      )}
                      {responseData &&
                        (responseData.captchaCode || responseData.qrCode) &&
                        modelType === 'CAPTCHA' && (
                          <>
                            <div className={`captcha-block`}>
                              <img
                                alt="captcha-code"
                                src={
                                  responseData.captchaCode ||
                                  responseData.qrCode
                                }
                              />
                              <br />
                              <Form.Control
                                type="text"
                                id="captcha-text"
                                value={captcha}
                                onChange={(e) => setcaptcha(e.target.value)}
                              />
                              <br />
                              <button
                                className={`btn btn-primary`}
                                onClick={(e) => doCaptcha(e)}
                              >
                                Verify
                              </button>
                            </div>
                          </>
                        )}
                    </Modal.Body>
                  </Modal>
                  <div className={`card-body`}>
                    <div>
                      <Form.Label htmlFor="email">customer ID</Form.Label>
                      <Form.Control
                        type="text"
                        id="email"
                        aria-describedby="email"
                        value={email}
                        onChange={(e) => setemail(e.target.value)}
                      />

                      <Form.Label htmlFor="inputPassword5">Password</Form.Label>
                      <Form.Control
                        type="password"
                        id="inputPassword5"
                        aria-describedby="passwordHelpBlock"
                        value={password}
                        onChange={(e) => setpassword(e.target.value)}
                      />
                      <Form.Text id="passwordHelpBlock" muted>
                        Your password must be 8-20 characters long, contain
                        letters and numbers, and must not contain spaces,
                        special characters, or emoji.
                      </Form.Text>
                      <br />
                      <button
                        className={`btn btn-success`}
                        onClick={(e) => triggerLogin(e)}
                      >
                        Login
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
}

export default Login;
