/* eslint-disable no-unused-vars */
import api from '@ais/api';
import {
  Col,
  CustomInput,
  Row,
  SubmitButton,
  TableLayout,
} from '@ais/components';
import { jsonToGraphQLQuery, VariableType } from '@ais/graphql';
import { flattenArray, groupby } from '@ais/utils';
import Card from 'Card';
import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import WithSession from 'WithSession';

function PolicyList({ appPrimaryColor }) {
  const [loading, setloading] = useState(false);
  const [error, seterror] = React.useState(false);
  const [initalValues, setinitalValues] = useState({
    activities: [],
  });

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
              challenges: jJson,
              id: dt.id,
            };
          });

          setinitalValues({
            activities: arr,
          });
        }
      }
    });

    setloading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = (values, actions) => {
    setloading(true);
    const cdata = values.activities;
    if (Array.isArray(cdata)) {
      const finalArray = [];
      cdata.map((data) => {
        if ('challenges' in data) {
          return Object.keys(data['challenges']).map((key) => {
            const challengeData = {
              event: {
                id: data['id'],
              },
              metaName: key,
              metaType: 'challenge',
              metaValue: JSON.stringify(data['challenges'][key]),
            };

            finalArray.push(challengeData);
            return challengeData;
          });
        }

        return null;
      });

      const rawQuery = {
        mutation: {
          __variables: {
            entity: '[EventsMetainput1]',
          },
          saveAllEntityMeta: {
            __args: {
              metaData: new VariableType('entity'),
            },
            id: true,
          },
        },
      };

      const gql = jsonToGraphQLQuery(rawQuery);

      api.graphql(gql, { entity: finalArray }).then((res) => {
        console.log(res);
        setloading(res.loading);
        seterror(res.error);
      });
    }
  };

  return (
    <TableLayout>
      {initalValues && initalValues.activities && (
        <Row>
          <Col>
            <Card title={'Policy Manager'}>
              <div className="p-3">
                <Formik
                  initialValues={initalValues}
                  onSubmit={handleSubmit}
                  enableReinitialize={true}
                >
                  {({ errors, touched, values, handleChange }) => (
                    <Form>
                      <div className={`table-responsive`}>
                        <table bordered hover className={`mb-4`}>
                          <tr>
                            <th colSpan={2}>Name</th>
                            <th colSpan={3} className={`text-align-center`}>
                              Captcha
                            </th>
                            <th colSpan={3} className={`text-align-center`}>
                              KBA
                            </th>
                            <th colSpan={3} className={`text-align-center`}>
                              TOTP
                            </th>
                            <th colSpan={3} className={`text-align-center`}>
                              OTP
                            </th>
                            <th colSpan={3} className={`text-align-center`}>
                              BIOMetric
                            </th>
                          </tr>

                          <tbody>
                            {initalValues.activities.map((activity, index) => (
                              <tr key={index}>
                                <td width={200}>{activity.name}</td>
                                <td>
                                  {/* <span>
                                                                    <EyeFill className={`cursor-pointer`} color={appPrimaryColor} size={15} />
                                                                </span> */}
                                </td>
                                {[
                                  'captcha',
                                  'kba',
                                  'totp',
                                  'otp',
                                  'biometric',
                                ].map((challenge, _index) => (
                                  <React.Fragment key={challenge}>
                                    <td>
                                      <div className={`p-2`}>
                                        <CustomInput
                                          name={`activities[${index}.challenges.${challenge}.min]`}
                                          type="number"
                                          onChange={handleChange}
                                          default={0}
                                          value={
                                            values.activities[index]
                                              ?.challenges?.[challenge]?.min ||
                                            0
                                          }
                                          className={`hide-arrow
                                                                                        ${values.activities[index]?.challenges?.[challenge]?.min > 0 ? 'background-aquawhite ' : ''}
                                                                                        
                                                                                        ${
                                                                                          errors.activities &&
                                                                                          errors
                                                                                            .activities[
                                                                                            index
                                                                                          ]
                                                                                            ?.challenges?.[
                                                                                            challenge
                                                                                          ]
                                                                                            ?.min &&
                                                                                          touched.activities &&
                                                                                          touched
                                                                                            .activities[
                                                                                            index
                                                                                          ]
                                                                                            ?.challenges?.[
                                                                                            challenge
                                                                                          ]
                                                                                            ?.min
                                                                                            ? 'is-invalid'
                                                                                            : ''
                                                                                        }`}
                                          maxLength={3}
                                          onInput={(e) => {
                                            if (e.target.value.length > 3)
                                              e.target.value =
                                                e.target.value.slice(0, 3);
                                          }}
                                        ></CustomInput>
                                      </div>
                                    </td>
                                    <td className={`text-center`}> - </td>
                                    <td>
                                      <div className={`p-2`}>
                                        <CustomInput
                                          name={`activities[${index}.challenges.${challenge}.max]`}
                                          type="number"
                                          onChange={handleChange}
                                          default={0}
                                          value={
                                            values.activities[index]
                                              ?.challenges?.[challenge]?.max ||
                                            0
                                          }
                                          className={`hide-arrow
                                                                                          ${values.activities[index]?.challenges?.[challenge]?.max > 0 ? 'background-aquawhite ' : ''}
                                                                                        ${
                                                                                          errors.activities &&
                                                                                          errors
                                                                                            .activities[
                                                                                            index
                                                                                          ]
                                                                                            ?.challenges?.[
                                                                                            challenge
                                                                                          ]
                                                                                            ?.max &&
                                                                                          touched.activities &&
                                                                                          touched
                                                                                            .activities[
                                                                                            index
                                                                                          ]
                                                                                            ?.challenges?.[
                                                                                            challenge
                                                                                          ]
                                                                                            ?.max
                                                                                            ? 'is-invalid'
                                                                                            : ''
                                                                                        }`}
                                          maxLength={3}
                                          onInput={(e) => {
                                            if (e.target.value.length > 3)
                                              e.target.value =
                                                e.target.value.slice(0, 3);
                                          }}
                                        ></CustomInput>
                                      </div>
                                    </td>
                                  </React.Fragment>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="flex-end">
                        <>
                          <SubmitButton loading={loading}>Save</SubmitButton>
                        </>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </Card>
          </Col>
        </Row>
      )}
    </TableLayout>
  );
}

export default WithSession(PolicyList);
