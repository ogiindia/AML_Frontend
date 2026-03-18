import React, { useEffect, useState } from 'react';
import RenderForm from 'RenderForm';
import Row from 'Row';
import Col from 'Col';
import Heading from 'Heading';
import userRegistration from '../json/smsConfig.json';

function UserRegistration() {
  const [formData, SetFormData] = useState([]);

  useEffect(() => {
    SetFormData(userRegistration);
  }, [userRegistration]);

  const callback = (values, actions) => {
    alert(values);
  };

  return (
    <>
      <Row>
        <Col>
          <Heading title="SMS Config" />
        </Col>
      </Row>
      <Row>
        <Col lg={8} sm={8} md={8}>
          <RenderForm formData={formData} callback={callback} layout={1} />
        </Col>
      </Row>
    </>
  );
}

export default UserRegistration;
