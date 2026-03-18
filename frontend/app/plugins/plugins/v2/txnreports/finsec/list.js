/* eslint-disable no-unused-vars */
import { Badge, Button, Col, IconButton, Row, TableLayout } from '@ais/components';
import { TableV2 } from '@ais/datatable';
import { jsonToGraphQLQuery, VariableType } from '@ais/graphql';
import { updateFilters } from '@ais/utils';
import api from 'api';
import React, { useState } from 'react';
import RenderForm from 'RenderForm';
import useModalHost from 'useModalHost';
import usePageContext from 'usePageContext';
import useRoleBasedNavigate from 'useRoleBasedNavigate';




function EventsList() {
  const { setCurrentPage, setPageData } = usePageContext();
  const [selectedRows, setSelectedRows] = React.useState([]);
  const [tableStructure, settableStructure] = useState({
    queryType: 'findAlertsByPaging',
    columns: [
      { key: 'alertId', type: 'String', show: false, label: 'Id' },
      {
        key: 'transactionId',
        type: 'string',
        show: true,
        label: 'Txn Id',
      },
      {
        key: 'custId',
        type: 'string'
      },
      {
        key: 'accNo',
        type: "string"
      },
      { key: "alertParentId", type: 'string' },
      { key: "alertStatus", type: 'string' },
      {
        key: "riskCategory", type: "string"
      }

    ],
    paging: { pageNo: 1, size: 10 },
    sorting: { field: 'alertParentId', direction: 'DESC' },
    "filters": [{ field: "alertStatus", operator: "EQUAL", value: "OPEN" }, {
      field: "transactionId", operator: "EQUAL", value: ""
    }]
  });
  const [formData, setformData] = useState({
    alertdaterange: "",
    alertStatus: "",
    riskCategory: ""
  });

  const { showPluginModal } = useModalHost();


  const triggerTxnView = (row) => {
    roleBasedNavigate("/txn/view", true, { mkc: false, ...row });
  }



  const columns = {
    alertId: {
      label: "Alert Id",
      show: false
    },
    transactionId: {
      label: "Transaction Id",
      filter: true,
    }, alertParentId: {
      label: "Parent Alert Id",
    }, custId: {
      label: "Customer Id",
      render: (row) => <Button label={row.custId} variant={`link`} onClick={() => showPluginModal("v2-customers-view", { size: "pg", ...row })} />
    }, accNo: {
      label: "Acc No"
    },
    alertStatus: {
      label: "Alert Status",
      render: (row) => <span>
        <Badge>
          {row.alertStatus}
        </Badge>
      </span>
    }
    , riskCategory: {
      label: "Risk Category",
      render: (row) => <span className={`${row.riskCategory === "LOW" ? 'text-info' : row.riskCategory === 'MEDIUM' ? 'text-warning' : 'text-destructive'}`}>
        {row.riskCategory}
      </span >
    }
    , actions: {
      label: "Actions",
      render: (row) => <IconButton icon={`Eye`} onClick={() => triggerTxnView(row)} />
    }

  }


  const filterForm = [
    {
      title: 'Filter',
      data: [
        {
          type: 'select',
          name: 'riskCategory',
          label: 'Alert Category',
          id: 'riskCategory',
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
              name: 'CBWTR',
              value: 'CBWTR',
            }, {
              name: 'CFTR',
              value: 'CFTR',
            },

          ],
          validationType: 'string',
          validations: [],
        },
        {
          type: 'select',
          name: 'alertStatus',
          label: 'Alert Status',
          id: 'alertStatus',
          value: '',
          grid: '6',
          hidden: false,
          gqlType: 'string!',
          placeholder: 'Select a Category',
          data: [
            { name: "REVIEW", value: "REVIEW" },
            { name: "APPROVED", value: "SUSPICIOUS" },
            { name: "REJECTED", value: "NOT SUSPICIOUS" },
            { name: "PENDING", value: "PENDING" }
          ],
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
              formData={formData}
              callback={(e, i) => {
                // const updated = updateFilters(tableStructure.filters, e)
                // console.log(updated);
                const obj = {
                  alertStatus: e.alertStatus
                }
                settableStructure(prev => ({
                  ...prev,
                  filters: updateFilters(prev.filters, e)
                }))
              }}
            />
          </Col>
          <Col span={`12`}>
            <TableV2
              title={'FINSEC Report'}
              subTitle={'Events available in the system'}
              tableStructure={tableStructure}
              columns={columns}
              // tableData={tableData}
              selectType={'radio'}
              selectKey={'alertId'}
            // selectedRowCallback={(e) => storeSelectedRows(e)}
            ></TableV2>
          </Col>
        </Row>
      </TableLayout>
    </>
  );
}

export default EventsList;
