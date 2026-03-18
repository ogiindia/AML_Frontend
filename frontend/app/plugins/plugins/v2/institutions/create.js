import generateQueryFromFormJson from 'generateQueryFromFormJson';
import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import RenderForm from 'RenderForm';
import insCreation from '../../../json/institutionRegistration.json';
// import GraphQL from "GraphQL";
import api from "api";
import useRoleBasedNavigate from 'useRoleBasedNavigate';

function CreateUser({ id }) {
  const [formData, SetFormData] = useState([]);
  const [error, seterror] = useState(null);
  const [loading, setloading] = useState(false);
  const { roleBasedNavigate } = useRoleBasedNavigate();

  const args = {
    entity: {
      institutionId: true,
      institutionName: true,
    },
  };



  const callback = (values, actions) => {
    setloading(true);
    const gqlQuery = generateQueryFromFormJson(insCreation, args, true);
    console.log(gqlQuery);
    console.log(values);
    api.graphql(gqlQuery, values).then(res => {
      const { loading, data, error } = res;

      seterror(error);
      setloading(loading);


      if (data) roleBasedNavigate("1105", true
        , {
          state: {
            status: "success",
            message: "Record inserted or updated successfully"
          }
        });
      //have to check how to route success
    });
  };

  useEffect(() => {
    console.debug('id to load : ' + id);
    // loadData.get("/app/rest/v1.0/fetch/user/" + id, {}).then((res) => {
    //   SetFormData(res);
    // });
  }, [id]);

  return (
    <>
      <>
        <Row>
          <Col>
            <div>
              <RenderForm
                error={error}
                loading={loading}
                formFormat={insCreation}
                formData
                callback={callback}
              />
            </div>
          </Col>
        </Row>
      </>
    </>
  );
}

export default CreateUser;
