import api from '@ais/api';
import { IconButton, SimpleModal, TableLayout, toast } from '@ais/components';
import { TableV2 } from '@ais/datatable';
import { jsonToGraphQLQuery, VariableType } from '@ais/graphql';
import generateQueryFromFormJson from 'generateQueryFromFormJson';
import moment from 'moment';
import React, { useState } from 'react';
import RenderForm from 'RenderForm';

const args = {
  entity: {
    branchCode: true,
    branchName: true,
    branchType: true,
    IFSCcode: true,
    id: true,
  },
};

function BranchMaster() {
  const [loading, setloading] = React.useState();
  const [formData, setformData] = useState({});
  const [showModal, setshowModal] = useState(false);

  const dataStructure = {
    queryType: 'listBranchMasterByPaging',
    columns: [
      { key: 'id', type: 'Long', show: false, label: 'Id' },
      {
        key: 'branchCode',
        type: 'string',
      },
      {
        key: 'branchName',
        type: 'string',
      },
      {
        key: 'IFSCcode',
        type: 'string',
      },
      { key: 'createdAt', type: 'date', show: true, label: 'Created At' },
    ],
    paging: { pageNo: 1, size: 10 },
    sorting: { field: 'branchCode', direction: 'DESC' },
    filters: [{ field: 'branchCode', operator: 'EQUAL', value: '' }],
  };

  const columns = {
    id: {
      hidden: true,
    },
    branchCode: {
      label: 'Branch Code',
      sort: true,
    },
    branchName: {
      label: 'Branch Name',
      sort: true,
    },

    IFSCcode: {
      label: 'IFSC Code',
      sort: true,
      filter: true,
    },
    createdAt: {
      label: 'Created At',
      sort: true,
      render: (row) => (
        <span>{moment(row.createdAt).format('DD-MMM-YY hh:mm A')}</span>
      ),
    },
    actions: {
      label: 'Actions',
      render: (row) => (
        <>
          <IconButton
            icon={`Edit`}
            onClick={() => {
              const fetchQuery = {
                query: {
                  __variables: {
                    id: 'Long!',
                  },
                  findBranchMasterbyId: {
                    __args: {
                      id: new VariableType('id'),
                    },
                    id: true,
                    branchCode: true,
                    branchName: true,
                    branchType: true,
                    IFSCcode: true,
                  },
                },
              };

              console.log(fetchQuery);
              const gql = jsonToGraphQLQuery(fetchQuery);

              api.graphql(gql, { id: row.id }).then((res) => {
                const { data } = res;
                if (data && data.findBranchMasterbyId) {
                  console.log(data);
                  setformData(data.findBranchMasterbyId);
                  setshowModal(true);
                }
              });
            }}
          ></IconButton>
        </>
      ),
    },
  };

  const formFormat = [
    {
      query: 'saveBranchMaster',
      data: [
        {
          type: 'text',
          name: 'id',
          label: 'id',
          id: 'id',
          value: '',
          //   grid: '6',
          hidden: true,
          gqlType: 'Long',
          disabled: true,
          //   placeholder: 'eg  : 123',
          //   tooltip: 'Please enter a userId',
          validationType: 'string',
          validations: [],
        },
        {
          type: 'text',
          name: 'branchCode',
          label: 'Branch Code',
          id: 'branchCode',
          value: '',
          grid: '6',
          //   hidden: true,
          gqlType: 'String!',
          //   disabled: true,
          placeholder: 'eg  : 123',
          //   tooltip: 'Please enter a userId',
          validationType: 'string',
          validations: [
            {
              type: 'required',
              params: ['This field is required'],
            },
          ],
        },
        {
          type: 'text',
          name: 'branchName',
          label: 'Branch Name',
          id: 'branchName',
          value: '',
          grid: '6',
          //   hidden: true,
          gqlType: 'String!',
          //   disabled: true,
          placeholder: 'eg  : Beach station branch',
          //   tooltip: 'Please enter a userId',
          validationType: 'string',
          validations: [
            {
              type: 'required',
              params: ['This field is required'],
            },
          ],
        },
        {
          type: 'text',
          name: 'branchType',
          label: 'Branch Type',
          id: 'branchType',
          value: '',
          grid: '6',
          //   hidden: true,
          gqlType: 'String!',
          //   disabled: true,
          placeholder: 'eg  : 123',
          //   tooltip: 'Please enter a userId',
          validationType: 'string',
          validations: [
            {
              type: 'required',
              params: ['This field is required'],
            },
          ],
        },
        {
          type: 'text',
          name: 'IFSCcode',
          label: 'IFSC Code',
          id: 'IFSCcode',
          value: '',
          grid: '6',
          //   hidden: true,
          gqlType: 'String!',
          //   disabled: true,
          placeholder: 'eg  : IFSC1234',
          //   tooltip: 'Please enter a userId',
          validationType: 'string',
          validations: [
            {
              type: 'required',
              params: ['This field is required'],
            },
          ],
        },
      ],
    },
  ];

  return (
    <>
      <TableLayout>
        <TableV2
          title={'Branch Master'}
          subTitle={'Detailed list of branches'}
          tableStructure={dataStructure}
          columns={columns}
          selectType={'radio'} //checkbox|radio|switch
          //   selectKey={'id'}
          filterCallback={(e) => console.warn(e.target.value)}
          suffix={'branch'}
          newEntryCallback={() => setshowModal(true)}
          deleteCallback={(e) => console.log('delete button click', e)}
          customHeaderComponents={<></>}
        ></TableV2>

        <SimpleModal
          size="md"
          isOpen={showModal}
          handleClose={() => setshowModal(false)}
          title={`${Object.keys(formData).length === 0 ? 'Create' : 'Edit'} Branch`}
        >
          <RenderForm
            callback={(values) => {
              setloading(true);
              const gqlQuery = generateQueryFromFormJson(
                formFormat,
                args,
                true,
              );
              console.log(gqlQuery);
              console.log(values);
              api.graphql(gqlQuery, values).then((res) => {
                const { loading, data, error } = res;

                if (error) {
                  throw new Error(error);
                }

                if (data) {
                  toast({
                    title: `Branch ${values['branchName']} inserted Successfully`,
                    // description: "Branch record inserted successfully",
                    variant: "success"
                  });
                  setshowModal(false);
                }
              });
            }}
            formFormat={formFormat}
            cancelCallback={() => setshowModal(false)}
            formData={formData}
          ></RenderForm>
        </SimpleModal>
      </TableLayout>
    </>
  );
}

export default BranchMaster;
