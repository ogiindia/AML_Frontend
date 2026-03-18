import React, { useEffect, useState } from 'react';
import Row from 'Row';
import Col from 'Col';
import Table from 'Table';
import loadData from 'loadData';
import usePageContext from 'usePageContext';
import ListLayout from 'ListLayout';
const headers = [
  {
    id: 'groupI',
    label: 'id',
    //    width: "200",
    type: 'text',
    hidden: true,
  },
  {
    id: 'groupName',
    label: 'name',
    //    width: "200",
    type: 'text',
  },
  {
    id: 'makerId',
    label: 'created By',
    //    width: "200",
    type: 'text',
  },
  {
    id: 'checkerId',
    label: 'approved By',
    //    width: "200",
    type: 'text',
  },
  {
    id: 'insertedDate',
    label: 'created At',
    //    width: "200",
    type: 'date',
  },
  {
    id: 'modifiedDate',
    label: 'Updated At',
    //    width: "200",
    type: 'date',
  },
];

const GroupsList = () => {
  const { setCurrentPage, setPageData } = usePageContext();
  const [selectedRows, setSelectedRows] = useState([]);
  const [tableData, setTableData] = useState([]);

  const storeSelectedRows = (e) => {
    console.warn(e);
    setSelectedRows(e);
  };

  const ld = () => {
    loadData.get('/app/rest/v1.0/fetch/group/10/0', {}).then((res) => {
      if ('content' in res) setTableData(res);
    });
  };

  useEffect(() => {
    ld();
    console.log('into call');
  }, []);

  const triggernewRegistration = () => {
    setCurrentPage('v2-groups-create');
  };

  const triggerEditIns = (id) => {
    setPageData({
      id,
    });

    setCurrentPage('v2-groups-create');
  };

  return (
    <>
      <ListLayout
        title={'Group List'}
        subTitle={'to manage the list of groups in application'}
      >
        <Row>
          <Col>
            <Table
              title={'Group List'}
              subTitle={'Groups maintained in the application'}
              tableData={tableData}
              headers={headers}
              suffix={'Group'}
              selectType={'radio'}
              selectKey={'groupName'}
              selectedRowCallback={(e) => storeSelectedRows(e)}
              filterCallback={(e) => console.warn(e.target.value)}
              filterLabel={'groupName'}
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
export default GroupsList;
