import React, { useEffect, useState } from 'react';
import Row from 'Row';
import Col from 'Col';
import Table from 'Table';
import loadData from 'loadData';
import usePageContext from 'usePageContext';
import ListLayout from 'ListLayout';
const headers = [
  {
    id: 'orgID',
    label: 'id',
    //    width: "200",
    type: 'text',
    hidden: true,
  },
  {
    id: 'orgName',
    label: 'name',
    //    width: "200",
    type: 'text',
  },
  {
    id: 'createdUserID',
    label: 'created by',
    width: '200',
    type: 'text',
  },
  {
    id: 'insertedDT',
    label: 'inserted at',
    //    width: "200",
    type: 'date',
  },
  {
    id: 'modifiedDT',
    label: 'modified at',
    //    width: "200",
    type: 'date',
  },
];

const InstitionManagement = () => {
  const { setCurrentPage, setPageData } = usePageContext();
  const [selectedRows, setSelectedRows] = useState([]);
  const [tableData, setTableData] = useState([]);

  const storeSelectedRows = (e) => {
    console.warn(e);
    setSelectedRows(e);
  };

  const ld = () => {
    loadData.get('/app/rest/v1.0/fetch/instlist/10/0', {}).then((res) => {
      if ('content' in res) setTableData(res);
    });
  };

  useEffect(() => {
    ld();
    console.log('into call');
  }, []);

  const triggernewRegistration = () => {
    setCurrentPage('institution-v2-inscreation');
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
        title={'Ins Managment'}
        subTitle={'to manage the institutions'}
      >
        <Row>
          <Col>
            <Table
              title={'Institution List'}
              subTitle={'Institution maintained in the application'}
              tableData={tableData}
              headers={headers}
              suffix={'institution'}
              selectType={'radio'}
              selectKey={'orgID'}
              //     name={"hello"}
              selectedRowCallback={(e) => storeSelectedRows(e)}
              filterCallback={(e) => console.warn(e.target.value)}
              filterLabel={'email'}
              refreshCallback={() => ld()}
              newEntryCallback={() => triggernewRegistration()}
              deleteCallback={(e) => console.log(e)}
              editCallback={(e) => triggerEditIns(e)}
              customHeaderComponents={
                <>
                  {/* <button
                    type="button"
                    className="btn fis-outline ml-10 mr-10"
                    onClick={() => console.warn(selectedRows)}
                    disabled={selectedRows.length === 1 ? false : true}
                  >
                    Edit User
                  </button> */}
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
