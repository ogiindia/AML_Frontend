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
    id: 'channel',
    label: 'channel',
    //    width: "200",
    type: 'text',
  },

  {
    id: 'txnDT',
    label: 'Transaction Date',
    //    width: "200",
    type: 'text',
  },
  {
    id: 'txnType',
    label: 'Transaction Type',
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
    id: 'ifsc',
    label: 'ifsc',
    //    width: "200",
    type: 'text',
  },
  {
    id: 'rrn',
    label: 'rrn',
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
    loadData.get('/app/rest/v1.0/service/nccrp/100/0', {}).then((res) => {
      setTableData(res);
    });
  };

  useEffect(() => {
    loadDataFromAPI();
  }, []);

  const triggernewRegistration = () => {
    setCurrentPage('v1-cybercrime-newtxnlist');
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
        title={'NCCRP Case List'}
        subTitle={
          'List of reported cases and its necessary details are recorded here'
        }
      >
        <Row>
          <Col>
            <Table
              title={'Reported Case List'}
              subTitle={'Reported Cases'}
              tableData={tableData}
              headers={headers}
              suffix={'Report'}
              selectType={'radio'}
              selectKey={'caseID'}
              //     name={"hello"}
              selectedRowCallback={(e) => storeSelectedRows(e)}
              filterCallback={(e) => console.warn(e.target.value)}
              filterLabel={'acknowledgement no'}
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
