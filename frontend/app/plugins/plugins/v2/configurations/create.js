/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { api } from '@ais/api';
import { Col, Heading, Row, SplitPageLayout, Tree } from '@ais/components';
import { jsonToGraphQLQuery, VariableType } from '@ais/graphql';
import { sortArray } from '@ais/utils';
import RenderForm from 'RenderForm';
import generateDeleteQuery from 'generateDeleteQuery';
import generateQueryFromFormJson from 'generateQueryFromFormJson';
import React from 'react';
import ConfigJson from '../../../json/createConfiguraion.json';
import { convertToMultiLevelJson } from '../../../utils';

function createConfigurations() {
  const [data, setdata] = React.useState(null);
  const [formData, setformData] = React.useState({});

  const rawgql = {
    query: {
      listConfiguration: {
        name: true,
        configKey: true,
        module: true,
        grp: true,
        ord: true,
        scope: true,
        id: true,
      },
    },
  };

  const loadData = () => {
    const gql = jsonToGraphQLQuery(rawgql);

    api.graphql(gql, {}).then((res) => {
      const { data } = res;
      if (data) {
        const dd = convertToMultiLevelJson(
          sortArray(data.listConfiguration, 'ord'),
        );
        console.log(dd);
        setdata(dd);
      }
    });
  };

  React.useEffect(() => {
    loadData();
  }, []);

  const callbackId = (id) => {
    if (id) {
      const fetchQuery = {
        query: {
          __variables: {
            id: 'UUID!',
          },
          findConfigurationbyId: {
            __args: {
              id: new VariableType('id'),
            },
            name: true,
            id: true,
            description: true,
            scope: true,
            defaultValue: true,
            grp: true,
            optionData: true,
            module: true,
            ord: true,
            configKey: true,
            fieldType: true,
          },
        },
      };

      console.log(fetchQuery);
      const gql = jsonToGraphQLQuery(fetchQuery);

      api.graphql(gql, { id: id }).then((res) => {
        const { data } = res;
        if (data && data.findConfigurationbyId) {
          setformData(data.findConfigurationbyId);
        }
      });
    }
  };

  //create  or update request
  const callback = (values, actions) => {
    console.log(values);
    if (values['id'] === '') values['id'] = null;

    const args = {
      entity: {
        name: true,
        id: true,
        description: true,
        scope: true,
        defaultValue: true,
        grp: true,
        optionData: true,
        module: true,
        ord: true,
        configKey: true,
        fieldType: true,
      },
    };

    const gqlQuery = generateQueryFromFormJson(ConfigJson, args, true);

    api.graphql(gqlQuery, values).then((res) => {
      if (res && res.data) {
        loadData();
        triggerClearData();
      }
    });
  };

  const triggerClearData = () => {
    setformData({});
  };

  const deleteAction = (props) => {
    if (props.values.id) {
      const gqlQuery = generateDeleteQuery('deleteConfiguration');
      api.graphql(gqlQuery, { id: props.values.id }).then((res) => {
        if (res && res.data) {
          loadData();
          setformData({});
        }
      });
    }
  };
  return (
    <>
      <Row>
        <Col sm={6} md={6} lg={6}>
          <Heading
            center={true}
            title={'Customize Configuration'}
            subTitle={
              'Modify the configuration properties used in the application'
            }
          />

          <div className="pt-4" />

          <SplitPageLayout
            left={
              <RenderForm
                formFormat={ConfigJson}
                callback={callback}
                formData={formData}
              >
                {(props) => {
                  return (
                    <>
                      <button
                        type="button"
                        onClick={() => deleteAction(props)}
                        className={`btn btn-warning align-left`}
                      >
                        Delete Entity
                      </button>
                      <button
                        type="button"
                        onClick={() => triggerClearData()}
                        className={`btn btn-primary align-right`}
                      >
                        {' '}
                        clear data{' '}
                      </button>
                    </>
                  );
                }}
              </RenderForm>
            }
            right={
              <>
                <div className="flex flex-col gap-4 p-6 md:p-10">
                  <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-sm">
                      {data && <Tree item={data} />}
                    </div>
                  </div>
                </div>
              </>
            }
          />
        </Col>
      </Row>
    </>
  );
}

export default createConfigurations;
