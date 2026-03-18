import React, { useEffect, useState } from 'react';
import RenderForm from 'RenderForm';
import Row from 'Row';
import Col from 'Col';
import Heading from 'Heading';
import userRegistration from '../json/groupCreate.json';
import Card from 'Card';

import InlineList from '../components/InlineList';

function UserRegistration() {
  const [formData, SetFormData] = useState([]);

  useEffect(() => {
    SetFormData(userRegistration);
  }, [userRegistration]);

  // useEffect(() => {
  //   api({
  //     method: "get",
  //     url: "/userRegistration.json",
  //   }).then((res) => {
  //     console.warn(res);
  //     if (res.status == 200) {
  //       SetFormData(res.data);
  //     }
  //   });
  // }, []);

  const callback = (values, actions) => {
    alert(values);
  };

  const roleItems = [
    'userList',
    'userCreate',
    'userEdit',
    'userDelete',
    'ruleCreate',
    'ruleList',
    'ruleEdit',
    'ruleDelete',
  ];

  return (
    <>
      <Row>
        <Col>
          <Heading
            title="Group Creation"
            subTitle="Create group through this form"
          />
        </Col>
      </Row>
      <Row>
        <Col lg={8} sm={8} md={8}>
          <RenderForm formData={formData} callback={callback} layout={1}>
            {(props) => (
              <>
                <Card title={'Role List'}>
                  <InlineList
                    items={roleItems}
                    callBack={(item) => alert(JSON.stringify(item))}
                  />
                </Card>
              </>
            )}
          </RenderForm>
        </Col>
      </Row>
    </>
  );
}

export default UserRegistration;
