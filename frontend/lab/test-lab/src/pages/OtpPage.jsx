import { useEffect, useRef, useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router';

function OtpPage({ login = false, cancelCallback }) {
  const [OtpData, setOtpData] = useState(null);

  const [otp1, setotp1] = useState();
  const [otp2, setotp2] = useState();
  const [otp3, setotp3] = useState();
  const [otp4, setotp4] = useState();
  const [otp5, setotp5] = useState();
  const [otp6, setotp6] = useState();

  const navigate = useNavigate();

  const [focusIndex, setfocusIndex] = useState(-1);

  useEffect(() => {
    const data = sessionStorage.getItem('data');
    if (data) {
      const parsedData = JSON.parse(data);

      alert('Risk Score received is : ' + parsedData.ruleName);
      setOtpData(parsedData);
    }
  }, []);

  const ref0 = useRef();
  const ref1 = useRef();
  const ref2 = useRef();
  const ref3 = useRef();
  const ref4 = useRef();
  const ref5 = useRef();
  const ref6 = useRef();

  useEffect(() => {
    if (focusIndex) {
      console.log(focusIndex);
      switch (focusIndex) {
        case 1:
          ref1.current.focus();
          break;
        case 2:
          ref2.current.focus();
          break;
        case 3:
          ref3.current.focus();
          break;
        case 4:
          ref4.current.focus();
          break;
        case 5:
          ref5.current.focus();
          break;
        default:
          break;
      }
    }
  }, [focusIndex]);

  const storeOtp = (e, index) => {
    let value = e.target.value;
    if (value > 10) value = value % 10;

    switch (index) {
      case 1:
        setotp1(value);
        setfocusIndex(index);
        return;
      case 2:
        setotp2(value);
        setfocusIndex(index);
        return;
      case 3:
        setotp3(value);
        setfocusIndex(index);
        return;
      case 4:
        setotp4(value);
        setfocusIndex(index);
        return;
      case 5:
        setotp5(value);
        setfocusIndex(index);
        return;
      case 6:
        setotp6(value);
        setfocusIndex(index);
        return;
      default:
        return;
    }
  };

  const triggerVerify = (e) => {
    e.preventDefault();
    console.log(otp1, otp2, otp3, otp4, otp5, otp6);

    const challengeUrl = OtpData.challengeURL;

    if (challengeUrl) {
      const data = {
        caseId: OtpData.caseId,
        otp: otp1 + otp2 + otp3 + otp4 + otp5 + otp6,
      };

      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      };

      fetch(challengeUrl.replace('https://aisworld.space', ''), requestOptions)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (data.status) navigate('/home', { state: data });
        });
    }
  };

  return (
    <>
      <>
        <div className="container">
          <div className="wrapper">
            <div className="title">
              <span>Step Up Verification</span>
            </div>
            <br />
            <br />
            <div>
              <p>
                We have sent a verification code to your register mobile number
                -{'xxxxxxxx68 '}
              </p>
              <p />
            </div>

            <Row>
              <Col>
                <Form.Label htmlFor="otp">Verification Code</Form.Label>
                <Row>
                  <Col md={2} lg={2} style={{ width: '90px' }}>
                    <Form.Control
                      type="number"
                      id="otp1"
                      aria-describedby="otp1"
                      value={otp1}
                      onChange={(e) => storeOtp(e, 1)}
                      ref={ref0}
                    />
                  </Col>
                  <Col md={2} lg={2} style={{ width: '90px' }}>
                    <Form.Control
                      type="number"
                      id="otp1"
                      aria-describedby="otp1"
                      value={otp2}
                      onChange={(e) => storeOtp(e, 2)}
                      ref={ref1}
                    />
                  </Col>
                  <Col md={2} lg={2} style={{ width: '90px' }}>
                    <Form.Control
                      type="number"
                      id="otp1"
                      aria-describedby="otp1"
                      value={otp3}
                      onChange={(e) => storeOtp(e, 3)}
                      ref={ref2}
                    />
                  </Col>
                  <Col md={2} lg={2} style={{ width: '90px' }}>
                    <Form.Control
                      type="number"
                      id="otp1"
                      aria-describedby="otp1"
                      value={otp4}
                      onChange={(e) => storeOtp(e, 4)}
                      ref={ref3}
                    />
                  </Col>

                  <Col md={2} lg={2} style={{ width: '90px' }}>
                    <Form.Control
                      type="number"
                      id="otp1"
                      aria-describedby="otp1"
                      value={otp5}
                      onChange={(e) => storeOtp(e, 5)}
                      ref={ref4}
                    />
                  </Col>

                  <Col md={2} lg={2} style={{ width: '90px' }}>
                    <Form.Control
                      type="number"
                      id="otp1"
                      aria-describedby="otp1"
                      value={otp6}
                      onChange={(e) => storeOtp(e, 6)}
                      ref={ref5}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
            <br />
            <br />
            <div className="button">
              <button
                type="submit"
                className="btn btn-info"
                onClick={(e) => {
                  triggerVerify(e);
                }}
              >
                Verify
              </button>
              &nbsp; &nbsp;
              <button
                type="submit"
                className="btn"
                onClick={(e) => {
                  if (login && cancelCallback) {
                    cancelCallback();
                  } else {
                    navigate('/home', { state: { status: 'failed' } });
                  }
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
        {/* Display error message if OTP is invalid */}
      </>
    </>
  );
}

export default OtpPage;
