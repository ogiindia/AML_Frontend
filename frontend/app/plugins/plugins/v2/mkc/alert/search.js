import { MutedBgLayout } from '@ais/components';
import RenderForm from 'RenderForm';
import React from 'react';
import useRoleBasedNavigate from 'useRoleBasedNavigate';

function AlertFinder() {
  const [loading, setloading] = React.useState();

  const { roleBasedNavigate } = useRoleBasedNavigate();

  const alertFinderJson = [
    {
      title: 'Alert Finder',
      subTitle: 'Search alerts by filter',
      collapsible: false,
      isCollapsed: false,
      layout: 1,
      query: 'saveUserProfileWithLogin',
      data: [
        {
          type: 'text',
          name: 'alertId',
          label: 'Alert Id',
          id: 'alertId',
          value: '',
          grid: '6',
          //   hidden: true,
          gqlType: 'UUID!',
          //   disabled: true,
          placeholder: 'Enter an alertId to search',
          tooltip: 'Please enter a userId',
          validationType: 'string',
          validations: [],
        },
        {
          type: 'text',
          name: 'cust_id',
          label: 'Customer Id',
          id: 'cust_id',
          grid: '6',
          value: '',
          placeholder: 'Enter your Customer Id',
          tooltip: 'Please enter a Customer Id',
          validationType: 'string',
          validations: [],
        },

        {
          type: 'text',
          name: 'pan',
          label: 'Customer Pan',
          id: 'pan',
          grid: 6,
          value: '',
          placeholder: 'Enter the Customer Pan',
          tooltip: 'Please enter a Customer pan',
          validationType: 'string',
          validations: [],
        },

        {
          type: 'text',
          name: 'txnID',
          label: 'Transaction Id',
          id: 'txnID',
          grid: 6,
          value: '',
          placeholder: 'Enter the Transaction Id',
          tooltip: 'Please enter a Transaction Id',
          validationType: 'string',
          validations: [],
        },
        {
          type: 'select',
          name: 'Channel',
          label: 'Transaction Channel',
          gqlType: 'String!',
          id: 'Channel',
          value: '',
          placeholder: 'Select a Transaction Channel',
          //   tooltip: 'Please enter a valid institution',
          //   url: 'listInstitutionEntity',
          grid: '6',
          //   dataMap: {
          //     institutionId: true,
          //     institutionName: true,
          //   },
          rData: null,
          data: [
            {
              name: 'UPI',
              value: 'Upi',
            },
            {
              name: 'ATM',
              value: 'Atm',
            },
            {
              name: 'BANK_DEPOSIT',
              value: 'Bank Deposit',
            },
          ],
          validationType: 'string',
          validations: [],
        },

        {
          type: 'select',
          name: 'alertCategory',
          label: 'Alert Category',
          gqlType: 'String!',
          id: 'alertCategory',
          value: '',
          placeholder: 'Select a alert Category',
          //   tooltip:
          //     'Role is responsible for deciding the user is maker or checker',
          grid: '6',
          data: [
            {
              name: 'STR',
              value: 'Suspicious Txn',
            },
            {
              name: 'CTR',
              value: 'Cash Txn',
            },
            {
              name: 'CFC',
              value: 'Counterfiet Txn',
            },
            {
              name: 'NTR',
              value: 'Non Profit Txn',
            },
          ],
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
      <MutedBgLayout>
        <RenderForm
          formFormat={alertFinderJson}
          buttonLabel="Search"
          cancel={false}
          callback={(e, v) => roleBasedNavigate('/mkc/alert/list')}
        />
      </MutedBgLayout>
    </>
  );
}

export default AlertFinder;
