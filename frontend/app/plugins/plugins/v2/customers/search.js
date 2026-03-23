/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import api from '@ais/api';
import { Col, MutedBgLayout, Row } from '@ais/components';
import { VariableType, jsonToGraphQLQuery } from '@ais/graphql';
import { flattenArray, groupby } from '@ais/utils';
import Card from 'Card';
import RenderForm from 'RenderForm';
import React, { useEffect, useState } from 'react';
import usePageContext from 'usePageContext';
import useRoleBasedNavigate from 'useRoleBasedNavigate';

function ViewCustomers() {
  const [data, setdata] = React.useState(true);

  const [loading, setloading] = useState(false);
  const [error, seterror] = useState(false);
  const [initalValues, setinitalValues] = useState([]);

  const { setCurrentPage, setPageData } = usePageContext();
  const { roleBasedNavigate } = useRoleBasedNavigate();

  // const [formValues, setformValues] = useState(initalValues);

  const loadData = () => {
    setloading(true);
    let graph = {
      query: {
        __variables: {
          type: 'String!',
        },
        listEventsEntity: {
          eventName: true,
          id: true,
        },
        findEventMetaByMetaType: {
          __args: {
            metaType: new VariableType('type'),
          },
          metaName: true,
          metaValue: true,
          id: true,
          event: {
            id: true,
          },
        },
      },
    };

    const gql = jsonToGraphQLQuery(graph);
    console.log(gql);
    api.graphql(gql, { type: 'challenge' }).then((res) => {
      const { loading, data, error } = res;

      setloading(loading);
      seterror(error);
      console.log(res);
      if (data) {
        let dta = data.listEventsEntity;
        const flatternedArray = flattenArray(data.findEventMetaByMetaType);
        let values = groupby(flatternedArray, 'event.id');

        if (Array.isArray(dta) && dta.length > 0) {
          const arr = dta.map((dt, index) => {
            const jJson = {};
            console.log(dt.id);
            if (dt.id in values) {
              const sortedArray = values[dt.id];
              if (Array.isArray(sortedArray)) {
                const d = sortedArray.map((ddata) => {
                  return (jJson[ddata['metaName']] = JSON.parse(
                    ddata['metaValue'],
                  ));
                });
              }
            }

            return {
              name: dt.eventName,
              value: dt.eventName,
              id: dt.id,
            };
          });

          setinitalValues(arr);
        }
      }
    });

    setloading(false);
  };

  useEffect(() => {
    loadData();
  }, []);


  const callback = (values, actions) => {
    console.debug(values);

    roleBasedNavigate('/entity/customers/view', true, values);
  };

  return (
    <MutedBgLayout>
      <Row>
        <Col sm={6} md={6} lg={6}>
          <div className="pt-2">
            <Card title={'Search Customer'}>
              <div className={'p-2'}>
                <RenderForm
                  error={error}
                  loading={loading}
                  cancel={false}
                  formFormat={[
                    {
                      data: [
                        {
                          type: 'text',
                          name: 'customerId',
                          label: 'Customer ID',
                          id: 'customerId',
                          value: '',
                          validationType: 'string',
                          validations: [],
                        },
                      ],
                    },
                  ]}
                  // formData={}
                  callback={callback}
                />
              </div>
            </Card>
          </div>
        </Col>
      </Row>
    </MutedBgLayout>
  );
}

export default ViewCustomers;
