import { useEffect, useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router';

function KbaPage() {
  const [OtpData, setOtpData] = useState(null);

  const [questionData, setquestionData] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const data = sessionStorage.getItem('data');
    if (data) {
      const parsedData = JSON.parse(data);

      alert('Risk Score received is : ' + parsedData.ruleName);

      setOtpData(parsedData);
    }
  }, []);

  const MatchObj = (arr, value) => {
    let hasMatch = false;
    if (Array.isArray(arr)) {
      for (var index = 0; index < arr.length; ++index) {
        var data = arr[index];

        if (data.id === value) {
          hasMatch = true;
          return index;
        }
      }
    }
    return null;
  };

  const updateQuestion = (id, question, value) => {
    const tempData = questionData;
    if (id) {
      setquestionData((prevState) => {
        console.log(id);

        const index = MatchObj(prevState, id);

        console.log('index : ' + index);
        if (index != null) {
          prevState[index]['ans'] = value;
          console.log(prevState);
          return prevState;
        } else {
          prevState.push({
            id,
            label: question,
            ans: value,
          });
        }
        console.log(prevState);
        return prevState;
      });
    }

    //        setquestionData(data);
  };

  const triggerVerify = (e) => {
    e.preventDefault();

    console.log(questionData);

    const challengeUrl = OtpData.challengeURL;

    if (challengeUrl) {
      const data = {
        caseId: OtpData.caseId,
        questionList: questionData,
        //      otp: otp1 + otp2 + otp3 + otp4 + otp5 + otp6
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
              <p></p>
              <p />
            </div>

            <Row>
              <Col>
                <Form.Label htmlFor="otp">
                  Knowledge Base verification
                </Form.Label>
                <Row>
                  {OtpData &&
                    OtpData.questionlist.map((questions, index) => {
                      return (
                        <>
                          <Col md={12} lg={12} key={index}>
                            <Form.Label htmlFor="otp">
                              {questions.label}
                            </Form.Label>
                            <Form.Control
                              type={questions.type}
                              id={'otp1' + index}
                              aria-describedby="otp1"
                              //    value={otp1}
                              onChange={(e) =>
                                updateQuestion(
                                  questions.id,
                                  questions.label,
                                  e.target.value,
                                )
                              }
                            />
                          </Col>
                        </>
                      );
                    })}
                </Row>
              </Col>
            </Row>
            <br />
            <br />
            <div className="button">
              <button
                type="submit"
                className="btn btn-info"
                onClick={(e) => triggerVerify(e)}
              >
                Verify
              </button>
              &nbsp; &nbsp;
              <button
                type="submit"
                className="btn"
                onClick={(e) =>
                  navigate('/home', { state: { status: 'failed' } })
                }
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

export default KbaPage;
