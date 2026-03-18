import React, { useEffect, useState } from 'react';
import Row from 'Row';
import Col from 'Col';
import Table from 'Table';
import loadComponent from 'loadComponent';
import Heading from 'Heading';
import headers from '../json/userListheaders.json';
import usePageContext from 'usePageContext';

const index = () => {
  const { setCurrentPage } = usePageContext();
  const [selectedRows, setSelectedRows] = useState([]);
  const [tableData, setTableData] = useState([]);

  const storeSelectedRows = (e) => {
    setSelectedRows(e);
  };

  useEffect(() => {
    loadComponent({
      method: 'get',
      url: '/datatable.json',
    }).then((res) => {
      if (res.status == 200) {
        setTableData(res.data);
      }
    });
  }, []);

  const triggernewRegistration = () => {
    setCurrentPage('groupCreation');
  };

  return (
    <>
      <Row>
        <Col>
          <Heading
            title="Group List"
            subTitle="Group creation , deletion , update & access permissions are handled here"
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Table
            title={'Group List'}
            subTitle={'Group list created in the application'}
            tableData={tableData}
            headers={headers}
            selectType={'radio'}
            selectKey={'id'}
            //     name={"hello"}
            selectedRowCallback={(e) => storeSelectedRows(e)}
            filterCallback={(e) => console.warn(e.target.value)}
            filterLabel={'name'}
            refreshCallback={() => alert('trigger refresh')}
            customHeaderComponents={
              <>
                <button
                  type="button"
                  className="btn fis-outline ml-10 mr-10"
                  disabled={selectedRows.length === 1 ? false : true}
                >
                  Edit group permission
                </button>

                <button
                  type="button"
                  className="btn fis-outline ml-10 mr-10"
                  disabled={selectedRows.length > 0 ? false : true}
                >
                  Delete group permission
                </button>

                <button
                  type="button"
                  className="btn fis-secondary-outline ml-10 mr-10"
                  onClick={() => triggernewRegistration()}
                >
                  Create group permission
                </button>
              </>
            }
          ></Table>
        </Col>
      </Row>
    </>
  );
};

export default index;
