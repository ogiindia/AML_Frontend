import React, { useEffect, useState } from 'react';
import Row from 'Row';
import Col from 'Col';
import Heading from 'Heading';
import usePageContext from 'usePageContext';
import RenderForm from 'RenderForm';
import TextBox from 'TextBox';
import Card from 'Card';
import WithSession from 'WithSession';

const index = ({ username }) => {
  const { setCurrentPage, setPageData } = usePageContext();
  const [selectedRows, setSelectedRows] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [modalisOpen, setmodalisOpen] = useState(false);
  const [formData, setformData] = useState([]);

  const toggleModal = () => {
    setmodalisOpen(!modalisOpen);
  };

  const callback = (values, actions) => {
    console.debug(values);

    // sendData.post("/app/rest/v1.0/group/save", values).then((d) => {
    //   console.log(d);
    // });

    setPageData({
      values,
    });

    setCurrentPage('v1-cybercrime-accountview');
  };

  return (
    <>
      <div className="p-4">
        <Row>
          <Col>
            <Heading
              title={`Search Customer Details ${username}`}
              subTitle="Search the account based on the below filters"
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <RenderForm
              formFormat={[]}
              formData
              callback={callback}
              cancel={false}
            >
              {(props) => {
                return (
                  <>
                    <Row>
                      <Col sm={6} md={6} lg={6}>
                        <div className="form-group">
                          <label> Search by </label>

                          <div className="form-check">
                            <input
                              type="radio"
                              className="form-check-input checked"
                              name="rad"
                              value="Mobile Number"
                            />
                            <label> Mobile Number </label>
                          </div>

                          <div className="form-check">
                            <input
                              type="radio"
                              name="rad"
                              className="form-check-input"
                              value="account Number"
                            />
                            <label> account Number </label>
                          </div>
                          <div className="form-check">
                            <input
                              type="radio"
                              name="rad"
                              className="form-check-input"
                              value="Transaction ID"
                            />
                            <label>Transaction Id </label>
                          </div>

                          <div className="form-check">
                            <input
                              type="radio"
                              name="rad"
                              className="form-check-input"
                              value="Acknowledgement No"
                            />
                            <label>Acknowledgement No </label>
                          </div>

                          <div className="form-check">
                            <input
                              type="radio"
                              name="rad"
                              className="form-check-input"
                              value="pan Number"
                            />
                            <label> Pan number </label>
                          </div>
                        </div>

                        <TextBox
                          key={'mNumber'}
                          label={''}
                          name={'mobileNo'}
                          placeholder={'Enter the details'}
                          value={props.values['mobileNo']}
                          onChange={props.handleChange}
                          error={
                            props.errors.hasOwnProperty('mobileNo') &&
                            props.errors['mobileNo']
                          }
                          id={'mNumber'}
                          tooltip={'Enter a mobile number'}
                          type={'text'}
                        />
                      </Col>
                    </Row>
                  </>
                );
              }}
            </RenderForm>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default WithSession(index);
