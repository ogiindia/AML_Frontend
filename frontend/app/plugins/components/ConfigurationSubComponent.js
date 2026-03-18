import api from '@ais/api';
import { jsonToGraphQLQuery, VariableType } from '@ais/graphql';
import React, { useEffect, useState } from 'react';
import RenderForm from 'RenderForm';
import WithSession from 'WithSession';

function ConfigurationSubComponent({ data, institutionId, divisionId }) {
  const [formFormat, setformFormat] = useState([]);

  const [formData, setformData] = React.useState({});

  const converttoformFormat = (data) => {
    let formArray = [];
    console.log(data);
    Object.keys(data).map((k, i) => {
      let formObject = {
        title: k,
        //     "subTitle": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
        collapsible: true,
        isCollapsed: i === 0 ? false : true,
        direction: 'column',
        layout: 1,
      };

      let fieldsArray = [];
      if (typeof data[k] === 'object' && Array.isArray(data[k])) {
        console.log(data[k]);
        // eslint-disable-next-line array-callback-return
        data[k].map((field) => {
          const query = {
            query: {
              __variables: {
                field: 'String!',
              },
              getConfigByKey: {
                __args: {
                  field: new VariableType('field'),
                },
                id: true,
                value: true,
              },
            },
          };

          const gql = jsonToGraphQLQuery(query);
          api
            .graphql(gql, {
              field: field.configKey,
            })
            .then((res) => {
              console.log('data values : ' + res.data);

              const tempArry = {
                [field.configKey]: res?.data?.getConfigByKey?.value,
              };

              setformData((prevState) => {
                return {
                  ...prevState,
                  ...tempArry,
                };
              });
            });

          let fields = {
            type: field.fieldType,
            name: field.configKey,
            label: field.name,
            id: field.configKey,
            value: field.defaultValue, //incase old values present need to update
            tooltip: field.description,
            validationType: 'string',
            validations: [
              {
                type: 'required',
                params: ['This field is required'],
              },
            ],
          };

          fieldsArray.push(fields);
        });
      }
      console.log('...');
      formObject['data'] = fieldsArray;
      formArray.push(formObject);
    });

    setformFormat(formArray);
  };

  useEffect(() => {
    if (data) converttoformFormat(data);
  }, [data]);

  const callback = (values, actions) => {
    console.log(values);

    var data = [];
    Object.keys(values).map((item, index) => {
      const tempArray = {
        field: item,
        value: values[item],
        insId: null,
        divId: null,
      };
      data.push(tempArray);
    });

    const query = {
      mutation: {
        __variables: {
          config: '[ConfigCriteriainput]',
        },
        SaveOrUpdateConfigurationValue: {
          __args: {
            config: new VariableType('config'),
          },
          id: true,
        },
      },
    };
    const gqlQuery = jsonToGraphQLQuery(query);
    console.log(gqlQuery);

    api.graphql(gqlQuery, { config: data }).then((res) => console.log(res));
  };

  useEffect(() => {
    console.log(formFormat);
  }, [formFormat]);

  return (
    <>
      {formFormat && formFormat.length > 0 && (
        <RenderForm
          formFormat={formFormat}
          callback={callback}
          formData={formData}
        />
      )}
    </>
  );
}

export default WithSession(ConfigurationSubComponent);
