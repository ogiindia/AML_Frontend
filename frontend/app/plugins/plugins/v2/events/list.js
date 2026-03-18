/* eslint-disable no-unused-vars */
import { PlainLayout } from '@ais/components';
import { jsonToGraphQLQuery, VariableType } from '@ais/graphql';
import api from 'api';
import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import usePageContext from 'usePageContext';
import useRoleBasedNavigate from 'useRoleBasedNavigate';
import RuleEngine from '../../pom-bkp';

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
      <PlainLayout>
        <Row>
          <Col>
            <RuleEngine />
          </Col>
        </Row>
      </PlainLayout>
    </>
  );
}

export default EventsList;
