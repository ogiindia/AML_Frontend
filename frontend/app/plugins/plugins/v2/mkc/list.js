import { Button, Col, Heading, Row, TableLayout } from '@ais/components';
import { TableV2 } from '@ais/datatable';

import * as React from 'react';
import RenderForm from 'RenderForm';
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
        validationType: 'string',
        validations: [],
      },
      {
        type: 'select',
        name: 'status',
        label: 'Status',
        id: 'status',
        value: '',
        grid: '6',
        hidden: false,
        gqlType: 'string!',
        placeholder: 'Select a status',
        data: [
          {
            name: 'PENDING',
            value: 'Pending',
          },
          {
            name: 'APPROVED',
            value: 'Approved',
          },
          {
            name: 'REJECTED',
            value: 'Rejected',
          },
        ],
        // tooltip: 'Please enter a userId',
        validationType: 'string',
        validations: [],
      },
    ],
  },
];

function MKCqueue() {
  const [loading, setloading] = React.useState();
  const { roleBasedNavigate } = useRoleBasedNavigate();
  return (
    <TableLayout>
      <Row align="center" justify="around">
        <Col span="12">
          <Row gap="0" align="center" justify="around">
            <Col padding={false} span="6">
              <Heading
                title={'MKC Queue'}
                subTitle={'Approval and Rejection are handled in this page'}
              ></Heading>
            </Col>
            <Col padding={false} span="6" className={`flex justify-end`}>
              <Button
                label={`View Txns`}
                icon={`Folder`}
                onClick={() => {
                  roleBasedNavigate('/txn/view', true, {
                    mkc: true,
                  });
                }}
              />
            </Col>
          </Row>
        </Col>
        <Col span="12">
          <RenderForm
            cancel={false}
            formFormat={filterForm}
            onSubmit={(e, i) => console.log(e, i)}
          />
        </Col>
        <Col span="12">
          <TableV2
            tableStructure={dataStructure}
            selectType={'checkbox'}
            selectKey={'id'}
            //   selectedRowCallback={(e) => storeSelectedRows(e)}
            // filterCallback={(e) => console.warn(e.target.value)}
            //            refreshCallback={() => ld()}
            // newEntryCallback={() => triggernewRegistration()}
            // deleteCallback={(e) => triggerDelete(e)}
            //    editCallback={(e) => triggerEditIns(e)}
            customHeaderComponents={<></>}
          ></TableV2>
        </Col>
      </Row>
    </TableLayout>
  );
}

export default MKCqueue;
