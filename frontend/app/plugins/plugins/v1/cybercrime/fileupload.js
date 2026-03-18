import React, { useEffect, useState } from 'react';
import Row from 'Row';
import Col from 'Col';
import Heading from 'Heading';
import usePageContext from 'usePageContext';
import RenderForm from 'RenderForm';
import TextBox from 'TextBox';
import Card from 'Card';

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
              title="Upload data"
              subTitle="Upload the transaction data"
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <Card>
              <div className="p-3">
                <RenderForm
                  formFormat={[
                    {
                      data: [
                        {
                          type: 'file',
                          name: 'orgLogo',
                          label: 'File Upload',
                          id: 'ologo',
                          value: 'logo',
                          placeholder: 'upload transaction data',
                          tooltip: 'Please upload it in csv format',
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
      </div>
    </>
  );
};

export default index;
