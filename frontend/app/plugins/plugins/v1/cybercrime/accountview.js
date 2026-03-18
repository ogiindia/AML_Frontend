import React, { useEffect, useState } from 'react';
import Row from 'Row';
import Col from 'Col';
import Heading from 'Heading';
import usePageContext from 'usePageContext';
import RenderForm from 'RenderForm';
import TextBox from 'TextBox';
import Card from 'Card';
import ReadOnlyField from '../../../components/ReadOnlyField';
import loadData from 'loadData';
const index = ({ values }) => {
  const { setCurrentPage } = usePageContext();
  const [selectedRows, setSelectedRows] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [modalisOpen, setmodalisOpen] = useState(false);
  const [formData, setformData] = useState([]);

  const [data, setdata] = useState([]);

  const toggleModal = () => {
    setmodalisOpen(!modalisOpen);
  };

  useEffect(() => {
    loadData
      .get('/app/rest/v1.0/service/account/' + values['mobileNo'], {})
      .then((res) => {
        setdata(res['accountList']);
      });
  }, [values]);

  const showDemoView = () => {
    setCurrentPage('v1-cybercrime-demographicview');
  };

  // const data = [{
  //     "accoutType": "SAVINGS",
  //     "accountNo": "123456789",
  //     "currentAmount": "2000000",
  //     "status": "KYC PENDING",
  //     "click": "true"
  // }, {
  //     "accoutType": "CURRENT",
  //     "accountNo": "123456789",
  //     "currentAmount": "200000",
  //     "status": "Kyc Completed",
  //     "click": "true"
  // }, {
  //     "accoutType": "CREDITCARD",
  //     "accountNo": "123456789",
  //     "currentAmount": "2000000",
  //     "status": "active",
  //     "click": "true"
  // }, {
  //     "accoutType": "HOUSINGLOAN",
  //     "accountNo": "123456789",
  //     "currentAmount": "2000000",
  //     "status": "Partially / Fully Dispursed",
  //     "click": "true"
  // }];

  return (
    <>
      <div className="p-4">
        <Row>
          <Col>
            <Heading
              title="Accounts List"
              subTitle="click on the each individual account for demographic view"
            />
          </Col>
        </Row>
        <Row>
          <Col>
            {data.map((d, i) => {
              return (
                <>
                  <Card>
                    <div className="p-4">
                      <Row>
                        <Col sm={6} md={6} lg={6} className="flex-start">
                          <p className="uppercase highlight-primary">
                            {d.accoutType}
                          </p>
                        </Col>

                        <Col sm={6} md={6} lg={6} className="flex-end">
                          <p className="uppercase highlight-secondary">
                            {d.status}
                          </p>
                        </Col>
                      </Row>

                      <Row>
                        <Col sm={4} md={4} lg={4} className="flex-start">
                          <ReadOnlyField
                            title={'ACCOUNT NO'}
                            className={'uppercase'}
                          >
                            <h4 className="bold">{d.accountNo}</h4>
                          </ReadOnlyField>
                        </Col>

                        <Col sm={4} md={4} lg={4} className="flex-center">
                          <ReadOnlyField
                            title={'AMOUNT'}
                            className={'uppercase'}
                          >
                            <h4 className="bold">{d.currentAmount}</h4>
                          </ReadOnlyField>
                        </Col>
                        <Col
                          sm={4}
                          md={4}
                          lg={4}
                          className="flex-end flex-center"
                        >
                          <button
                            type="button"
                            onClick={() => showDemoView()}
                            className="btn btn-outline-primary"
                          >
                            {'View Details'}
                          </button>
                        </Col>
                      </Row>
                    </div>
                  </Card>
                  <div className="pb-2"></div>
                </>
              );
            })}
          </Col>
        </Row>
      </div>
    </>
  );
};

export default index;
