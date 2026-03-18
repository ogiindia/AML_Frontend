/* eslint-disable react-hooks/rules-of-hooks */

import Card from 'Card';
import Heading from 'Heading';
import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import RenderForm from 'RenderForm';

import usePageContext from 'usePageContext';

const index = () => {
  const { setCurrentPage } = usePageContext();
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

    //   setCurrentPage("v1-cybercrime-accountview");
  };

  return (
    <>
      <div className="p-4">
        <Row>
          <Col>
            <Heading
              title="Reports"
              subTitle="General reports can be downloaded here"
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <Row>
              <Col sm={8} md={8} lg={8}>
                <Card>
                  <div className="p-3">
                    <RenderForm
                      formFormat={[
                        {
                          data: [
                            {
                              type: 'select',
                              name: 'reportId',
                              label: 'Report',
                              id: 'reportId',
                              value: '',
                              placeholder: 'Select a report',
                              rData: null,
                              data: [
                                {
                                  value: 'Report 1',
                                  name: '01',
                                },
                                {
                                  value: 'Report 2',
                                  name: '02',
                                },
                                {
                                  value:
                                    'Report 3',
                                  name: '03',
                                },
                              ],
                              validationType: 'string',
                              validations: [],
                            },

                            {
                              type: 'date',
                              name: 'sdate',
                              label: 'Start Date',
                              id: 'sdate',
                              className: 'no-wrap',
                              value: '',
                              grid: 6,
                              validationType: 'string',
                              validations: [],
                            },

                            {
                              type: 'date',
                              name: 'edate',
                              label: 'End Date',
                              id: 'edate',
                              className: 'no-wrap',
                              value: '',
                              grid: 6,
                              validationType: 'string',
                              validations: [],
                            },

                            {
                              type: 'text',
                              name: 'accNo',
                              label: 'Customer ID (optional)',
                              id: 'accNo',
                              value: '',
                              validationType: 'string',
                              validations: [],
                            },
                          ],
                        },
                      ]}
                      formData
                      callback={callback}
                      cancel={false}
                    ></RenderForm>
                  </div>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default index;
