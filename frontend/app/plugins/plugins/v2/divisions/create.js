import { Col, PlainLayout, Row } from '@ais/components';
import api from 'api';
import generateQueryFromFormJson from 'generateQueryFromFormJson';
import React from 'react';
import RenderForm from 'RenderForm';
import DivReg from '../../../json/DivisionRegistration.json';
// import GraphQL from "GraphQL";
import { VariableType } from '@ais/graphql';

function DivisionCreate({ id }) {
  const args = {
    entity: {
      divisionId: true,
      divisionName: true,
      institution: {
        id: new VariableType('institution'),
      },
    },
  };

  const callback = (values, actions) => {
    const gqlQuery = generateQueryFromFormJson(DivReg, args, true);
    console.log(gqlQuery);
    console.log(values);
    api.graphql(gqlQuery, values).then((res) => {
      if (res.error) {
        throw new Error(res.error);
      }
      if (res.data) {
        console.log(res.data);
        // if (res.data)
        //   roleBasedNavigate('1110', true, {
        //     state: {
        //       status: 'success',
        //       message: 'Record inserted or updated successfully',
        //     },
        //   });
        //have to check how to route success
      }

      return true;
    });

    //create account first but api not available
    // var data = {
    //   email,
    //   instId,
    //   mobileNo: phoneNo,
    //   password,
    //   userName: email,
    //   userType: "admin",
    // };

    // GraphQL(gqlQuery, values).then(res => {
    //   const { loading, data, error } = res;

    //   seterror(error);
    //   setloading(loading);

    //   if (data) roleBasedNavigate("1105", true
    //     , {
    //       state: {
    //         status: "success",
    //         message: "Record inserted or updated successfully"
    //       }
    //     });
    //   //have to check how to route success
    // });

    // sendData.post("/app/rest/v1.0/save/user", values).then((d) => {
    //   console.log(d);
    // });
  };

  React.useEffect(() => {
    console.debug('id to load : ' + id);
    // loadData.get("/app/rest/v1.0/fetch/user/" + id, {}).then((res) => {
    //   SetFormData(res);
    // });
  }, [id]);

  return (
    <PlainLayout>
      <Row>
        <Col>
          <div>
            <RenderForm formFormat={DivReg} formData callback={callback} />
          </div>
        </Col>
      </Row>
    </PlainLayout>
  );
}

export default DivisionCreate;
