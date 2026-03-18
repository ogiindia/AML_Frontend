import { Col, PlainLayout, Row } from '@ais/components';
import api from 'api';
import generateQueryFromFormJson from 'generateQueryFromFormJson';
import React, { useEffect, useState } from 'react';
import RenderForm from 'RenderForm';
import useRoleBasedNavigate from 'useRoleBasedNavigate';
import DivReg from '../../../json/EventRegistration.json';

function EventCreate({ id }) {
  const [formData, SetFormData] = useState([]);
  const [error, seterror] = useState(null);
  const [loading, setloading] = React.useState(false);

  const { roleBasedNavigate } = useRoleBasedNavigate();

  const args = {
    entity: {
      eventName: true,
      isEnabled: true,
      id: true,
    },
  };

  const callback = (values, actions) => {
    setloading(true);
    const gqlQuery = generateQueryFromFormJson(DivReg, args, true);
    console.log(gqlQuery);
    console.log(values);

    if (values['id'] === '') values['id'] = null;
    api.graphql(gqlQuery, values).then((res) => {
      if (res.error) seterror(res.error);
      if (res.loading) setloading(res.loading);
      if (res.data) {
        console.log(res.data);
        if (res.data)
          roleBasedNavigate('1120', true, {
            state: {
              status: 'success',
              message: 'Record inserted or updated successfully',
            },
          });
        //have to check how to route success
      }

      setloading(false);
    });
  };

  useEffect(() => {
    console.debug('id to load : ' + id);
  }, [id]);

  return (
    <>
      <>
        <PlainLayout>
          <Row>
            <Col>
              <div>
                <RenderForm
                  error={error}
                  loading={loading}
                  formFormat={DivReg}
                  formData
                  callback={callback}
                />
              </div>
            </Col>
          </Row>
        </PlainLayout>
      </>
    </>
  );
}

export default EventCreate;
