import { Badge, Button, Col, IconButton, Row, TableLayout } from '@ais/components';
import { TableV2 } from '@ais/datatable';
import React from 'react';
import RenderForm from 'RenderForm';
import useModalHost from 'useModalHost';
import usePageContext from 'usePageContext';
import useRoleBasedNavigate from 'useRoleBasedNavigate';


const dataStructure = {
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
  //    "filters": [{ field: "username", operator: "EQUAL", value: "admin" }]
};




function AlertList() {
  const [loading, setloading] = React.useState();

  const { showPluginModal } = useModalHost();
  const { roleBasedNavigate } = useRoleBasedNavigate();
  const { setCurrentPage, setPageData } = usePageContext();



  const columns = {
    alertId: {
      label: "Alert Id",
      show: false
    },
    transactionId: {
      label: "Transaction Id",
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
              value: 'SUSPICOUS TXN',
            },
            {
              name: 'CTR',
              value: 'CASH TXN',
            },
            {
              name: 'NTR',
              value: 'NON PROFIT ORG TXN',
            },
            {
              name: 'CBWT',
              value: 'CROSS BORDER WITHDRAWAL TXN',
            }, {
              name: 'CFT',
              value: 'COUNTERFIET TXN',
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
        {
          type: 'daterangepicker',
          name: 'alertdaterange',
          label: 'Alert Duration',
          id: 'alertdaterange',
          value: '',
          grid: '6',
          hidden: false,
          gqlType: 'string!',
        }
      ],
    },
  ];



  return (
    <>
      <TableLayout>
        <Row>
          <Col span={`12`}>
            Clutched Alerts
          </Col>
          <Col span="12">
            <RenderForm
              cancel={false}
              formFormat={filterForm}
              callback={(e, i) => console.log(e, i)}
            />
          </Col>
          <Col span={`12`}>
            <TableV2
              tableStructure={dataStructure}
              columns={columns}
              // tableData={tableData}
              // suffix={'FINSEC'}
              selectType={'radio'}
              selectKey={'alertId'}
              selectedRowCallback={(e) => console.log(e)}
            ></TableV2>
          </Col>
        </Row>
      </TableLayout>
    </>
  );
}

export default AlertList;
