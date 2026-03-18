import { Col, PageCenterLayout, Row, toast } from '@ais/components';
import RenderForm from 'RenderForm';
import api from 'api';
import generateQueryFromFormJson from 'generateQueryFromFormJson';
import React, { useState } from 'react';
import useRoleBasedNavigate from 'useRoleBasedNavigate';
import userCreation from '../../../json/userRegistration.json';
import { useLocation } from 'react-router';
import { jsonToGraphQLQuery, VariableType } from '@ais/graphql';

function CreateUser() {
  const [formData, SetFormData] = useState([]);
  const [error, seterror] = useState(null);
  const [loading, setloading] = useState(false);
  const { roleBasedNavigate } = useRoleBasedNavigate();

  const { state } = useLocation();


  const args = {
    id: true,
    username: true,
    firstName: true,
    lastName: true,
    email: true,
    bankName: true,
    insId: true,
    role: true,
    password: true,
    group: {
      id: new VariableType('group'),
    }
  };

  const callback = (values, actions) => {
    setloading(true);

    var gson = {
      mutation: {
        __variables: {
          userProfile: 'UserProfileinput',
          password: 'String!',
        },

        saveUserProfileWithLogin: {
          __args: {
            userProfile: new VariableType('userProfile'),
            password: new VariableType('password'),
          },
          id: true,

        }
      }
    };


    const gqlQuery = jsonToGraphQLQuery(gson);
    console.log(gqlQuery);
    console.log(values);

    var userprofile = {
      id: values.id || 0,
      username: values.username,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      bankName: values.bankName,
      insId: values.insId,
      role: values.role,
      groups: [
        { id: values.groups?.id }
      ],
    }


    api.graphql(gqlQuery, { userProfile: userprofile, password: values.password }).then((res) => {
      const { loading, data, error } = res;

      seterror(error);
      setloading(loading);

      if (error) {
        toast({
              title: 'Error',
              description: `An error occurred, ${error.errors[0].message}`,
              variant: 'error',
            });
      }

      if (data)
        roleBasedNavigate('/entity/users/list', true, {
          state: {
            status: 'success',
            message: 'Record inserted or updated successfully',
          },
        });
      //have to check how to route success
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
    // sendData.post("/app/rest/v1.0/save/user", values).then((d) => {
    //   console.log(d);
    // });
  };

  React.useEffect(() => {
    console.debug(state?.userId);

    if (state?.userId) {
      var rawJson = {
        query: {
          __variables: {
            id: 'Long!',
          },
          findUserProfilebyId: {
            __args: {
              id: new VariableType('id'),
            },
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            insId: true,
            bankName: true,
            role: true,
            deptName: true,
            groups: {
              id: true
            }
          },
        },
      };

      // loadData.get("/app/rest/v1.0/fetch/user/" + id, {}).then((res) => {
      //   SetFormData(res);
      // });

      const gql = jsonToGraphQLQuery(rawJson);
      api.graphql(gql, { id: state.userId.length == 1 ? state.userId[0] : null }).then((res) => {
        const { loading, data, error } = res;

        seterror(error);
        setloading(loading);
        if (data) {
          SetFormData(data['findUserProfilebyId']);
        }
      });
    }
  }, [state]);

  return (
    <>
      <>
        <PageCenterLayout size={`na`}>
          <Row>
            <Col>
              <RenderForm
                formFormat={userCreation}
                error={error}
                loading={loading}
                formData={formData}
                callback={callback}
              />
            </Col>
          </Row>
        </PageCenterLayout>
      </>
    </>
  );
}

export default CreateUser;
