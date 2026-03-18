import Col from 'Col';
import Heading from 'Heading';
import loadData from 'loadData';
import React, { useEffect, useState } from 'react';
import Row from 'Row';
import Table from 'Table';
import usePageContext from 'usePageContext';

const headers = [
  {
    id: 'userID',
    label: 'userID',
    //    width: "200",
    type: 'text',
    hidden: true,
  },
  {
    id: 'email',
    label: 'email',
    width: '200',
    type: 'text',
  },
  {
    id: 'groupName',
    label: 'groupName',
    width: '200',
    type: 'text',
  },
  {
    id: 'status',
    label: 'status',
    type: 'custom',
    component: (props => (<>{props.status}</>))
  },
];

export default userManagenment = () => {
  const { setCurrentPage } = usePageContext();
  const [selectedRows, setSelectedRows] = useState([]);
  const [tableData, setTableData] = useState([]);

  const storeSelectedRows = (e) => {
    console.warn(e);
    setSelectedRows(e);
  };

  const ld = () => {
    loadData.get('/app/rest/v1.0/fetch/user/10/0', {}).then((res) => {
      if ('content' in res) setTableData(res);
    });
  };

  useEffect(() => {
    ld();
  }, []);

  const triggernewRegistration = () => {
    setCurrentPage('userRegistration');
  };

  return (
    <div>
      <Row>
        <Col>
          <Heading
            title="User Management"
            subTitle="User creation , deletion , update & access permissions are handled here"
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Table
            title={'User List'}
            subTitle={'user list created in the application'}
            tableData={tableData}
            headers={headers}
            selectType={'radio'}
            selectKey={'userID'}
            //     name={"hello"}
            selectedRowCallback={(e) => storeSelectedRows(e)}
            filterCallback={(e) => console.warn(e.target.value)}
            filterLabel={'email'}
            refreshCallback={() => ld()}
            customHeaderComponents={
              <>
                <button
                  type="button"
                  className="btn fis-outline ml-10 mr-10"
                  onClick={() => console.warn(selectedRows)}
                  disabled={selectedRows.length === 1 ? false : true}
                >
                  Edit User
                </button>

                <button
                  type="button"
                  className="btn fis-outline ml-10 mr-10"
                  disabled={selectedRows.length > 0 ? false : true}
                >
                  Delete User
                </button>

                <button
                  type="button"
                  className="btn fis-secondary-outline ml-10 mr-10"
                  onClick={() => triggernewRegistration()}
                >
                  Create User
                </button>
              </>
            }
          ></Table>
        </Col>
      </Row>
    </div>
  );
};
