import { TableLayout } from '@ais/components';
import { TableV2 } from '@ais/datatable';
import { VariableType, jsonToGraphQLQuery } from '@ais/graphql';
import api from 'api';
import dateFormats from 'dateFormats';
import moment from 'moment';
import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import usePageContext from 'usePageContext';
import useRoleBasedNavigate from 'useRoleBasedNavigate';

const dataStructure = {
  queryType: 'listUserProfileByPaging',
  columns: [
    { key: 'id', type: 'uuid', show: false, label: 'id' },
    { key: 'username', type: 'string', show: false, label: 'username' },
    { key: 'firstName', type: 'string', show: true, label: 'first name' },
    { key: 'lastName', type: 'string', show: true, label: 'last name' },
    { key: 'createdAt', type: 'date', show: true, label: 'Created AT' },
  ],
  paging: { pageNo: 1, size: 10 },
  sorting: { field: 'username', direction: 'DESC' },
  // filters: [{ field: 'username', operator: 'EQUAL', value: '' }],
};

const columns = {
  id: {
    show: false,
  },
  username: {
    sortable: true,
  },
  createdAt: {
    label: 'Created AT',
    render: (row) => (
      <span>{moment(row.createdAt).format(dateFormats.shortDate)}</span>
    ),
  },
};

const InstitionManagement = () => {
  const { setCurrentPage, setPageData } = usePageContext();
  const [selectedRows, setSelectedRows] = useState([]);
  const [tableData, setTableData] = React.useState([]);

  const storeSelectedRows = (e) => {
    console.warn(e);
    setSelectedRows(e);
  };

  const { roleBasedNavigate, loading } = useRoleBasedNavigate();

  const triggernewRegistration = () => {
    console.log('into create user');
    roleBasedNavigate('/entity/users/create');
  };

  const triggerDeleteRegistration = (id) => {
    if (id.length === 1) {
      var rawJson = {
        mutation: {
          __variables: {
            id: 'Long!',
          },
          deleteUserProfile: {
            __args: {
              id: new VariableType('id'),
            },
          },
        },
      };

      const gql = jsonToGraphQLQuery(rawJson);
      api.graphql(gql, { id: id[0] }).then((res) => {
        const { loading, data, error } = res;

        if (error) {
          throw new Error(
            'action not successfull please try again later. code : ' + error,
          );
        }

        return true;

        // if (data || error)
        //   roleBasedNavigate('1101', true, {
        //     state: {
        //       status: data ? 'success' : 'error',
        //       message: data
        //         ? 'Record inserted or updated successfully'
        //         : 'Record action not successful please try again later. code : ' +
        //           error,
        //     },
        //   });
      });
    }
  };

  const triggerEditIns = (id) => {
    console.log('into edit user with id : ' + id);
    roleBasedNavigate('/entity/users/create', true, {
      userId: id,
    });
  };

  return (
    <TableLayout>
      <Row>
        <Col>
          <TableV2
            title={'User List'}
            subTitle={'Users maintained in the application'}
            tableStructure={dataStructure}
            tableData={tableData}
            columns={columns}
            //   headers={headers}
            //  suffix={'User'}
            selectType={'radio'}
            selectKey={'id'}
            selectedRowCallback={(e) => storeSelectedRows(e)}
            filterCallback={(e) => console.warn(e.target.value)}
            filterLabel={'email'}
            //            refreshCallback={() => ld()}
            newEntryCallback={() => triggernewRegistration()}
            deleteCallback={(e) => triggerDeleteRegistration(e)}
            editCallback={(e) => triggerEditIns(e)}
            customHeaderComponents={
              <>
                {/* <button
                    type="button"
                    className="btn fis-outline ml-10 mr-10"
                    onClick={() => console.warn(selectedRows)}
                    disabled={selectedRows.length === 1 ? false : true}
                  >
                    Edit User
                  </button> */}
              </>
            }
          ></TableV2>
        </Col>
      </Row>
    </TableLayout>
  );
};
export default InstitionManagement;
