import React, { useEffect, useState } from 'react';
import Row from 'Row';
import Col from 'Col';
import Table from 'Table';
import loadData from 'loadData';
import usePageContext from 'usePageContext';
import ListLayout from 'ListLayout';
const headers = [
  {
    id: 'accNo',
    label: 'accNo',
    //    width: "200",
    type: 'text',
    hidden: false,
  },
  {
    id: 'caseID',
    label: 'caseID',
    //    width: "200",
    type: 'text',
  },
  {
    id: 'caseStatus',
    label: 'caseStatus',
    //    width: "200",
    type: 'text',
  },

  {
    id: 'bankName',
    label: 'bankName',
    //    width: "200",
    type: 'text',
  },
  {
    id: 'ifsc',
    label: 'ifsc',
    //    width: "200",
    type: 'text',
  },
  {
    id: 'bankCode',
    label: 'bankCode',
    //    width: "200",
    type: 'text',
  },

  {
    id: 'remarks',
    label: 'remarks',
    //    width: "200",
    type: 'text',
  },
];

const InstitionManagement = () => {
  const { setCurrentPage, setPageData } = usePageContext();
  const [selectedRows, setSelectedRows] = useState([]);
  const [tableData, setTableData] = useState({});

  const storeSelectedRows = (e) => {
    console.warn(e);
    setSelectedRows(e);
  };

  const loadDataFromAPI = (id) => {
    loadData.get('/app/rest/v1.0/service/nccrp/email/100/0', {}).then((res) => {
      setTableData(res);
    });
  };

  useEffect(() => {
    loadDataFromAPI();
  }, []);

  const triggernewRegistration = () => {
    setCurrentPage('v1-cybercrime-email-newtxnlist');
  };

  const triggerEditIns = (id) => {
    setPageData({
      id,
    });

    setCurrentPage('institution-v2-inscreation');
  };

  return (
    <>
      <ListLayout
        title={'Email Case List'}
        subTitle={
          'List of reported cases via email and its necessary details are recorded here'
        }
      >
        <Row>
          <Col>
            <Table
              title={'Reported Case List'}
              subTitle={'Reported Cases'}
              tableData={tableData}
              headers={[]}
              suffix={'Report'}
              selectType={'radio'}
              selectKey={'caseid'}
              //     name={"hello"}
              selectedRowCallback={(e) => storeSelectedRows(e)}
              filterCallback={(e) => console.warn(e.target.value)}
              filterLabel={'case ID'}
              refreshCallback={() => ld()}
              createlabel={'Register a Case'}
              newEntryCallback={() => triggernewRegistration()}
              //             deleteCallback={(e) => console.log(e)}
              //           editCallback={(e) => triggerEditIns(e)}
              customHeaderComponents={
                <>
                  <button
                    type="button"
                    className="btn btn-fis-outline fis-primary ml-10 mr-10"
                    onClick={() => setCurrentPage('v1-cybercrime-txnview')}
                    hidden={selectedRows.length === 1 ? false : true}
                  >
                    View Case
                  </button>
                </>
              }
            ></Table>
          </Col>
        </Row>
      </ListLayout>
    </>
  );
};
export default InstitionManagement;
