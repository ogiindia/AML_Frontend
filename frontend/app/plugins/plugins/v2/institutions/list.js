import { TableLayout } from '@ais/components';
import { jsonToGraphQLQuery, VariableType } from '@ais/graphql';
import api from 'api';
import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import TableV2 from 'TableV2';
import usePageContext from 'usePageContext';
import useRoleBasedNavigate from 'useRoleBasedNavigate';

const dataStructure = {
  queryType: 'listInstitutionEntityByPaging',
  columns: [
    { key: 'id', type: 'UUID', show: false, label: 'Id' },
    {
      key: 'institutionId',
      type: 'string',
      show: true,
      label: 'Institution Id',
    },
    {
      key: 'institutionName',
      type: 'link',
      callback: (a, b) => console.log('hello world', b),
      show: true,
      label: 'Institution Name',
      sort: false,
    },
    { key: 'createdAt', type: 'date', show: true, label: 'Created At' },
    {
      key: 'id',
      label: 'Actions',
      sort: false,
      type: 'custom',
      component: ({ key, values }) => (
        <>
          <span>{key}</span>
        </>
      ),
    },
    {
      key: 'id',
      label: 'Actions block',
      sort: false,
      type: 'custom',
      component: 'ActionBlock',
    },
  ],
  paging: { pageNo: 1, size: 10 },
  sorting: { field: 'id', direction: 'DESC' },
  //    "filters": [{ field: "username", operator: "EQUAL", value: "admin" }]
};

const InstitionManagement = () => {
  const { setCurrentPage, setPageData } = usePageContext();
  const [selectedRows, setSelectedRows] = useState([]);
  const [tableData, setTableData] = React.useState([]);

  const storeSelectedRows = (e) => {
    setSelectedRows(e);
  };

  const { roleBasedNavigate, loading } = useRoleBasedNavigate();

  const triggernewRegistration = () => {
    console.log('into create institutions');
    roleBasedNavigate('1106');
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
        deleteInstitutionEntity: {
          __args: {
            id: new VariableType('id'),
          },
        },
      },
    };

    const gql = jsonToGraphQLQuery(query);
    console.log(gql);
    api.graphql(gql, { id: id }).then((res) => {
      console.log(res);
    });
  };

  const ActionBlock = ({ id, values }) => {
    return (
      <>
        <span>Action Block {id}</span>
      </>
    );
  };

  const componentMap = {
    ActionBlock,
  };

  return (
    <TableLayout>
      <Row>
        <Col>
          <TableV2
            title={'Institution List'}
            subTitle={'Institutions available in the system'}
            tableStructure={dataStructure}
            tableData={tableData}
            selectType={'switch'} //checkbox|radio|switch
            selectKey={'id'}
            selectedRowCallback={(e) => storeSelectedRows(e)}
            filterCallback={(e) => console.warn(e.target.value)}
            filterLabel={'insitution'}
            //            refreshCallback={() => ld()}
            newEntryCallback={() => triggernewRegistration()}
            deleteCallback={(e) => triggerDelete(e)}
            //  editCallback={(e) => triggerEditIns(e)}
            customHeaderComponents={<></>}
            componentMap={componentMap}
            inline={true}
            overflow={true}
          ></TableV2>
        </Col>
      </Row>
    </TableLayout>
  );
};
export default InstitionManagement;
