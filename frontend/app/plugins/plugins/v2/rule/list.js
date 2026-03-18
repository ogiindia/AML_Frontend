import {
  Col,
  Heading,
  IconButton,
  InlineStatusText,
  MutedBgLayout,
  Row
} from '@ais/components';
import { TableV2 } from '@ais/datatable';
import { jsonToGraphQLQuery, VariableType } from '@ais/graphql';
import api from 'api';
import moment from 'moment';
import React, { useEffect, useState } from 'react';

import usePageContext from 'usePageContext';
import useRoleBasedNavigate from 'useRoleBasedNavigate';

const dataStructure = {
  queryType: 'listRuleEntityByPaging',
  columns: [
    { key: 'id', type: 'UUID', show: false, label: 'Id' },
    {
      key: 'ruleName',
      type: 'string',
    },
    {
      key: "alertCategory",
      type: "String"
    },
    {
      key: 'priority',
      type: 'number',
    },
    {
      key: 'status',
      type: 'boolean',
    },
    {
      key: "offsetUnit",
      type: "String"
    },
    {
      key: "offsetValue",
      type: "String"
    },

    { key: 'createdAt', type: 'date', show: true, label: 'Created At' },
  ],
  paging: { pageNo: 1, size: 10 },
  sorting: { field: 'createdAt', direction: 'DESC' },
  "filters": [{ field: "ruleName", operator: "EQUAL", value: "" }]
};



const InstitionManagement = () => {

  const columns = {
    id: {
      show: false,
    },
    ruleName: {
      label: "RuleName",
      filter: true
    },
    offsetValue: {
      label: "Look Back Unit"
    },
    offsetUnit: {
      label: "Look Back Period"
    },
    priority: {
      sortable: true,
      render: (row) => <span className={`${row.priority === "1" ? 'text-info' : row.priority === '2' ? 'text-warning' : 'text-destructive'}`}>
        {row.priority == 1 ? 'LOW' : row.priority == 2 ? 'MEDIUM' : 'HIGH'}
      </span >
    },
    actions: {
      label: 'Actions',
      render: (row) => (
        <Row>
          <IconButton
            icon={'ChevronRight'}
            onClick={() => roleBasedNavigate('/rule/manager/create', true, {
              ...row
            })}
          ></IconButton>
        </Row>
      ),
    },
    status: {
      label: 'Status',
      render: (row) => (
        <InlineStatusText
          text={`${row.status ? 'Production' : 'Test'}`}
          variant={`${row.status ? 'primary' : 'destructive'}`}
        ></InlineStatusText>
      ),
    },
    createdAt: {
      label: "Created At",
      sortable: true,
      render: (row) => <span>{moment(row.createdAt).format("DD-MMM-YY hh:mm A")}</span>
    }
  };

  const { setCurrentPage, setPageData } = usePageContext();
  const [selectedRows, setSelectedRows] = useState([]);
  const [tableData, setTableData] = React.useState([]);

  const [folders, setfolders] = useState([]);

  useEffect(() => {
    const query = {
      query: {
        getFolderHierarchy: {
          id: true,
          folderName: true,
          children: {
            id: true,
            folderName: true,
          },
        },
      },
    };

    const gql = jsonToGraphQLQuery(query);
    console.log(gql);
    api.graphql(gql).then((res) => {
      const { data } = res;
      // setfolders(res);
      setfolders(data['getFolderHierarchy']);
    });
  }, []);

  const storeSelectedRows = (e) => {
    setSelectedRows(e);
  };

  const { roleBasedNavigate, loading } = useRoleBasedNavigate();

  const triggernewRegistration = () => {
    // console.log('into create institutions');
    roleBasedNavigate('/rule/manager/create');
  };


  const triggerDelete = async (id) => {
    if (Array.isArray(id) && id.length === 1) id = id[0];
    const query = {
      mutation: {
        __variables: {
          id: 'UUID!'
        },
        deleteRuleEntity: {
          __args: {
            id: new VariableType('id')
          }
        }
      }
    }
    const gql = jsonToGraphQLQuery(query);
    console.log(gql);
    await api.graphql(gql, { id: id }).then((res) => {
      console.log(res);
      // return id; // return to refresh
    });
    return id;
  }

  // const triggerEditIns = (id) => {
  //   setPageData({
  //     id,
  //   });

  //   setCurrentPage('v2-rule-create');
  // };

  // const triggerDelete = (id) => {
  //   if (Array.isArray(id) && id.length === 1) id = id[0];

  //   const query = {
  //     mutation: {
  //       __variables: {
  //         id: 'UUID!',
  //       },
  //       deleteInstitutionEntity: {
  //         __args: {
  //           id: new VariableType('id'),
  //         },
  //       },
  //     },
  //   };

  //   const gql = jsonToGraphQLQuery(query);
  //   console.log(gql);
  //   api.graphql(gql, { id: id }).then((res) => {
  //     console.log(res);
  //   });
  // };



  //   return (
  //     <TableLayout>
  //       <Row>
  //         <Col>
  //           <TableV2
  //             title={'Institution List'}
  //             subTitle={'Institutions available in the system'}
  //             tableStructure={dataStructure}
  //             tableData={tableData}
  //             selectType={'switch'} //checkbox|radio|switch
  //             selectKey={'id'}
  //             selectedRowCallback={(e) => storeSelectedRows(e)}
  //             filterCallback={(e) => console.warn(e.target.value)}
  //             filterLabel={'insitution'}
  //             //            refreshCallback={() => ld()}
  //             newEntryCallback={() => triggernewRegistration()}
  //             deleteCallback={(e) => triggerDelete(e)}
  //             //  editCallback={(e) => triggerEditIns(e)}
  //             customHeaderComponents={<></>}
  //             componentMap={componentMap}
  //             inline={true}
  //             overflow={true}
  //           ></TableV2>
  //         </Col>
  //       </Row>
  //     </TableLayout>
  //   );

  return (
    <MutedBgLayout>
      {/* <Row className="mb-3">
        <Col>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              paddingRight: '3vw',
            }}
          >
            <Button
              onClick={triggernewRegistration}
              style={{
                backgroundColor: '#007bff',
                color: '#fff',
                border: '1px solid #007bff',
                padding: '8px 16px',
                borderRadius: '4px',
                fontWeight: '500',
              }}
            >
              Create
            </Button>
          </div>
        </Col>
      </Row> */}

      {/* <RulesAdded /> */}

      <Heading
        title={`Rule List`}
        subHeading={`Active rules are executed against transactions`}
      ></Heading>

      {/* // has to be replaced by normal list  */}
      <Row>
        {/* <Col span={'auto'}>
          <Tree
            level={0}
            labelKey={'folderName'}
            childrenKey={`children`}
            item={folders}
          />
        </Col> */}
        <Col span={`flex`}>
          <TableV2
            title={'Rule List'}
            subTitle={'active rules are executed at run-time'}
            tableStructure={dataStructure}
            columns={columns}
            selectType={'radio'} //checkbox|radio|switch
            selectKey={'id'}
            selectedRowCallback={(e) => storeSelectedRows(e)}
            // filterCallback={(e) => console.warn(e.target.value)}
            // filterLabel={'insitution'}
            //            refreshCallback={() => ld()}
            newEntryCallback={() => triggernewRegistration()}
            deleteCallback={(e) => triggerDelete(e)}
            //  editCallback={(e) => triggerEditIns(e)}
            customHeaderComponents={<></>}
          ></TableV2>
        </Col>
      </Row>
    </MutedBgLayout>
  );
};
export default InstitionManagement;
