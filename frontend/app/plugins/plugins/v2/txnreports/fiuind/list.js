/* eslint-disable no-unused-vars */
import {
  Col,
  Icons,
  InlineStatusText,
  Row,
  SimpleModal,
  TableCard,
  TableLayout,
  UnderlinedTabs
} from '@ais/components';
import { SimpleTable, TableV2 } from '@ais/datatable';
import { jsonToGraphQLQuery, VariableType } from '@ais/graphql';
import api from 'api';
import React, { useState } from 'react';

import RenderForm from 'RenderForm';
import usePageContext from 'usePageContext';
import useRoleBasedNavigate from 'useRoleBasedNavigate';

const filterForm = [
  {
    data: [
      {
        type: 'date',
        name: 'fromDate',
        label: 'From Date',
        id: 'fromDate',
        value: '',
        grid: '6',
        hidden: false,
        gqlType: 'date!',
        // placeholder: 'Enter an id to search',
        validationType: 'string',
        validations: [],
      },

      {
        type: 'date',
        name: 'toDate',
        label: 'To Date',
        id: 'toDate',
        value: '',
        grid: '6',
        hidden: false,
        gqlType: 'date!',
        // placeholder: 'Enter an id to search',
        validationType: 'string',
        validations: [],
      },
    ],
  },
];

const columns = {
  status: {
    render: (row) => (
      <>
        <InlineStatusText
          text={row.status}
          variant={`${row.status === 'Completed' ? 'primary' : 'outline'}`}
        />
      </>
    ),
  },
  actions: {
    render: (row) => <>{row.actions && <Icons name="Download" size={20} />}</>,
  },
};

const tabs = [
  {
    name: 'Export Report',
    value: 'txn_details',
    content: <RenderForm formFormat={filterForm} />,
  },
  {
    name: 'Archive',
    value: 'flagged_details',
    content: (
      <TableCard title="">
        <SimpleTable
          columns={columns}
          data={[
            {
              startDate: '2024-10-10',
              endDate: '2024-11-10',
              status: 'Completed',
              actions: true,
            },
            {
              startDate: '2025-11-10',
              endDate: '2024-11-12',
              status: 'Yet to start',
              actions: false,
            },
          ]}
        ></SimpleTable>
      </TableCard>
    ),
  },
];

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

  const [showModal, setshowModal] = useState(false);

  const filterForm = [
    {
      title: 'Filter',
      data: [
        {
          type: 'text',
          name: 'txnId',
          label: 'Transaction Id',
          id: 'txnId',
          value: '',
          grid: '6',
          hidden: false,
          gqlType: 'string!',
          placeholder: 'Enter an id to search',
          tooltip: "Partial validation are allowed",
          validationType: 'string',
          validations: [],
        },
        {
          type: 'select',
          name: 'status',
          label: 'Alert Category',
          id: 'status',
          value: '',
          grid: '6',
          hidden: false,
          gqlType: 'string!',
          placeholder: 'Select a Category',
          data: [
            {
              name: 'STR',
              value: 'STR',
            },
            {
              name: 'CTR',
              value: 'CTR',
            },
            {
              name: 'NTR',
              value: 'NTR',
            },
            {
              name: 'CBWT',
              value: 'CBWT',
            }, {
              name: 'CFT',
              value: 'CFT',
            }, {
              name: 'I4C',
              value: 'I4C',
            },
            {
              name: 'LEA',
              value: 'LEA',
            },

          ],
          // tooltip: 'Please enter a userId',
          validationType: 'string',
          validations: [],
        },
      ],
    },
  ];

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
          <Col span="12">
            <RenderForm
              cancel={false}
              formFormat={filterForm}
              onSubmit={(e, i) => console.log(e, i)}
            />
          </Col>
          <Col span={`12`}>
            <TableV2
              title={'FIUIND Report'}
              subTitle={'Events available in the system'}
              tableStructure={dataStructure}
              tableData={tableData}
              suffix={'stx'}
              selectType={'radio'}
              selectKey={'id'}
              selectedRowCallback={(e) => storeSelectedRows(e)}
              filterCallback={(e) => console.warn(e.target.value)}
              filterLabel={'stx'}
              //            refreshCallback={() => ld()}
              // newEntryCallback={() => triggernewRegistration()}
              // deleteCallback={(e) => triggerDelete(e)}
              //    editCallback={(e) => triggerEditIns(e)}
              customHeaderComponents={
                <></>
              }
            ></TableV2>
          </Col>
        </Row>

        <SimpleModal
          isOpen={showModal}
          handleClose={() => setshowModal(false)}
          size={'lg'}
          title={`Reports`}
        >
          <UnderlinedTabs tabData={tabs} defaultValue={'txn_details'} />
        </SimpleModal>
      </TableLayout>
    </>
  );
}

export default EventsList;
