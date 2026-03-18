import React, { useEffect, useState } from 'react';
import Row from 'Row';
import Col from 'Col';
import Table from 'Table';
import loadData from 'loadData';
import Heading from 'Heading';
import usePageContext from 'usePageContext';
import { Eye } from 'react-bootstrap-icons';

const RuleList = () => {
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

  const viewEventclick = (id) => {
    console.warn(id);
  };

  const headers = [
    {
      id: 'activationFlag',
      label: 'Rule Status',
      //    width: "200",
      type: 'switch',
      hidden: false,
    },
    {
      id: 'ruleDesc',
      label: 'Rule Info',
      width: '200',
      type: 'text',
    },
    {
      id: 'action',
      label: 'Rule Action',
      width: '200',
      type: 'actionType',
    },
    {
      id: 'eventType',
      label: 'Event Type',
      type: 'text',
    },
    {
      id: 'eventData',
      label: 'Event data',
      type: 'text',
    },
    {
      id: 'eventData',
      label: 'Event data',
      type: 'icon',
      callback: viewEventclick,
      icon: <Eye />,
    },
  ];

  return (
    <>
      <Row>
        <Col>
          <Heading
            title="Rule Management"
            subTitle="List of rules used by the application are displayed here."
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Table
            title={'Rule List'}
            subTitle={
              'Rules that are running and configured can be handled here.'
            }
            tableData={tableData}
            headers={headers}
            // selectType={"radio"}
            // selectKey={"userID"}
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
    </>
  );
};

export default RuleList;
