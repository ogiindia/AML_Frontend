import { Col, Heading, IconButton, NewButton, Row, TableLayout } from '@ais/components';
import { TableV2 } from '@ais/datatable';
import moment from 'moment';
import * as React from 'react';
import useRoleBasedNavigate from 'useRoleBasedNavigate';

const dataStructure = {
  queryType: 'listWorkflowEntityByPaging',
  columns: [
    { key: 'id', type: 'Long' },
    {
      key: 'name',
      type: 'string',
    },
    {
      key: "entityType",
      type: "String"
    },
    {
      key: "approvers.id",
      type: "Long"
    },
    { key: 'createdAt', type: 'date', },
    { key: 'updatedAt', type: 'date', }
  ],
  paging: { pageNo: 1, size: 10 },
  sorting: { field: 'id', direction: 'DESC' },
  //    "filters": [{ field: "username", operator: "EQUAL", value: "admin" }]
};


function WorkflowList() {
  const [loading, setloading] = React.useState();

  const { roleBasedNavigate } = useRoleBasedNavigate();

  const columns = {
    id: {
      show: false
    },
    "approvers.id": {
      label: "Approval Levels",
      render: (row) => <span>{row.approvers.length}</span>
    },
    createdAt: {
      label: "Created AT",
      render: (row) => <span>{moment(row.createdAt).format('DD-MMM-YY hh:mm A')} </span>
    },
    updatedAt: {
      label: "Updated AT",
      render: (row) => <span>{moment(row.updatedAt).format('DD-MMM-YY hh:mm A')}</span>
    },
    actions: {
      label: "Actions",
      render: (row) => <IconButton icon={`Edit`} onClick={() => roleBasedNavigate('/mkc/workflow/create', false, { ...row })} />
    }
  }

  return (
    <>
      <TableLayout>
        <Row align="center" justify="around">
          <Col span="12">
            <Row gap="0" align="center" justify="around">
              <Col padding={false} span="6">
                <Heading
                  title={'Workflow Manager'}
                  subTitle={
                    'A page to configure and manage the list of approvals needed for each modules'
                  }
                ></Heading>
              </Col>
              <Col padding={false} span="6" className={`flex justify-end`}>
                <NewButton
                  label={`Create`}
                  onClick={() => roleBasedNavigate('/mkc/workflow/create')}
                />
              </Col>
            </Row>
          </Col>
          {/* <Col span="12">
            <RenderForm cancel={false} formFormat={filterForm} />
          </Col> */}
          <Col span="12">
            <TableV2
              tableStructure={dataStructure}
              columns={columns}
              selectType={'radio'}
              selectKey={'id'}

              customHeaderComponents={<></>}
            ></TableV2>
          </Col>
        </Row>
      </TableLayout>
    </>
  );
}

export default WorkflowList;
