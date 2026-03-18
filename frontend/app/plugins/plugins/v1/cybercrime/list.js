import React, { useEffect, useState } from 'react';
import Row from 'Row';
import Col from 'Col';
import Heading from 'Heading';
import usePageContext from 'usePageContext';
import RenderForm from 'RenderForm';
import TextBox from 'TextBox';
import Card from 'Card';
import Modal from 'Modal';
import loadData from 'loadData';

const index = () => {
  const { setCurrentPage, setPageData } = usePageContext();
  const [selectedRows, setSelectedRows] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [modalisOpen, setmodalisOpen] = useState(false);
  const [formData, setformData] = useState([]);

  const [ModalData, setModalData] = useState([]);

  const toggleModal = () => {
    setmodalisOpen(!modalisOpen);
  };

  const loadDataFromAPI = (id) => {
    loadData
      .get('/app/rest/v1.0/service/suspectedChain/' + id, {})
      .then((res) => {
        setModalData(res['chain']);
      });
  };

  const callback = (values, actions) => {
    console.debug(values);

    // sendData.post("/app/rest/v1.0/group/save", values).then((d) => {
    //   console.log(d);
    // });

    //       setCurrentPage("v1-cybercrime-accountview");

    loadDataFromAPI(values['txnId']);

    toggleModal();
  };

  const triggerAccountList = () => {
    setPageData({
      values: {
        mobileNo: '919030312213',
      },
    });

    setCurrentPage('v1-cybercrime-accountview');
  };

  const transactionData = [
    {
      remitter: '110055560',
      txnId: '23456456754',
      benificary: '110055789',
      demograhic: true,
      txnDate: '2024-10-10 10:10:10',
    },
    {
      remitter: '110055560',
      txnId: '23456457754',
      benificary: '114055789',
      demograhic: true,
      txnDate: '2024-10-10 10:10:10',
    },
    {
      remitter: '110075560',
      txnId: '23456456754',
      benificary: '110055560',
      demograhic: false,
      txnDate: '2024-10-10 10:10:10',
    },
    {
      remitter: '110055560',
      txnId: '23456456754',
      benificary: '110055789',
      demograhic: true,
      txnDate: '2024-10-10 10:10:10',
    },
    {
      remitter: '110055560',
      txnId: '23456456754',
      benificary: '110055789',
      demograhic: false,
      txnDate: '2024-10-10 10:10:10',
    },
    {
      remitter: '110055560',
      txnId: '23456456754',
      benificary: '110055789',
      demograhic: true,
      txnDate: '2024-10-10 10:10:10',
    },
  ];

  return (
    <>
      <div className="p-4">
        <Row>
          <Col>
            <Heading
              title="Suspected Chain"
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
                          <TextBox
                            key={'txnId'}
                            label={''}
                            name={'txnId'}
                            placeholder={'Search key'}
                            value={props.values['txnId']}
                            onChange={props.handleChange}
                            error={
                              props.errors.hasOwnProperty('txnId') &&
                              props.errors['txnId']
                            }
                            id={'txnId'}
                            tooltip={'Enter a valid details'}
                            type={'text'}
                          />
                        </div>
                      </Col>
                    </Row>

                    <Modal
                      isOpen={modalisOpen}
                      handleClose={toggleModal}
                      close={true}
                      title={'Transaction List'}
                      className="modal-width-auto"
                    >
                      <div className="">
                        <table className="table simple-table">
                          <tr className="table-row">
                            <th className="table-cell ps-4">Remitter</th>
                            <th className="table-cell">Beneficiary</th>
                          </tr>

                          {ModalData.map((d, i) => {
                            return (
                              <>
                                <tr className="table-row">
                                  <td className="table-cell ps-4">
                                    {d.demograhic ? (
                                      <a
                                        href="#"
                                        className="fis-primary cursor-pointer"
                                        onClick={() => triggerAccountList()}
                                      >
                                        {' '}
                                        {d.remitter}
                                      </a>
                                    ) : (
                                      <>
                                        <span>{d.remitter}</span>
                                      </>
                                    )}
                                  </td>
                                  <td className="table-cell ">
                                    {d.demograhic ? (
                                      <a
                                        href="#"
                                        className="fis-primary cursor-pointer"
                                        onClick={() => triggerAccountList()}
                                      >
                                        {' '}
                                        {d.benificary}
                                      </a>
                                    ) : (
                                      <>
                                        <span>{d.benificary}</span>
                                      </>
                                    )}
                                  </td>
                                </tr>
                              </>
                            );
                          })}
                        </table>
                      </div>
                    </Modal>
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

export default index;
