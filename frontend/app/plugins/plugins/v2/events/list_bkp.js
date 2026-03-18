/* eslint-disable no-unused-vars */
import { TableLayout } from '@ais/components';
import { jsonToGraphQLQuery, VariableType } from '@ais/graphql';
import api from 'api';
import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import TableV2 from 'TableV2';
import usePageContext from 'usePageContext';
import useRoleBasedNavigate from 'useRoleBasedNavigate';

const dataStructure = {
  queryType: 'listEventsEntityByPaging',
  columns: [
    { key: 'id', type: 'UUID', show: false, label: 'Id' },
    {
      key: 'eventName',
      type: 'string',
      show: true,
      label: 'Event Name',
    },
    { key: 'createdAt', type: 'date', show: true, label: 'Created At' },
  ],
  paging: { pageNo: 1, size: 10 },
  sorting: { field: 'id', direction: 'DESC' },
  //    "filters": [{ field: "username", operator: "EQUAL", value: "admin" }]
};

function EventsList() {
  const { setCurrentPage, setPageData } = usePageContext();
  const [selectedRows, setSelectedRows] = useState([]);
  const [tableData, setTableData] = React.useState([]);

  const storeSelectedRows = (e) => {
    setSelectedRows(e);
  };

  const { roleBasedNavigate, loading } = useRoleBasedNavigate();

  const triggernewRegistration = () => {
    roleBasedNavigate('1121');
  };

  const triggerEditIns = (id) => {
    setPageData({
      id,
    });

    setCurrentPage('v2-users-create');
  };

  const triggerDelete = (id) => {
    if (Array.isArray(id) && id.length === 1) id = id[0];
    const query = {
      mutation: {
        __variables: {
          id: 'UUID!',
        },
        deleteEventsEntity: {
          __args: {
            id: new VariableType('id'),
          },
        },
      },
    };
    const gql = jsonToGraphQLQuery(query);

    api.graphql(gql, { id: id }).then((res) => {
      console.log(res);
    });
  };

  return (
    <>
      <TableLayout>
        <Row>
          <Col>
            <TableV2
              title={'Events List'}
              subTitle={'Events available in the system'}
              tableStructure={dataStructure}
              tableData={tableData}
              suffix={'Events'}
              selectType={'radio'}
              selectKey={'id'}
              selectedRowCallback={(e) => storeSelectedRows(e)}
              filterCallback={(e) => console.warn(e.target.value)}
              filterLabel={'event'}
              //            refreshCallback={() => ld()}
              newEntryCallback={() => triggernewRegistration()}
              deleteCallback={(e) => triggerDelete(e)}
              //    editCallback={(e) => triggerEditIns(e)}
              customHeaderComponents={<></>}
            ></TableV2>
          </Col>
        </Row>
      </TableLayout>
    </>
  );
}

export default EventsList;
