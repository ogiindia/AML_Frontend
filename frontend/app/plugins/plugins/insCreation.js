import React, { useEffect, useState } from 'react';
import RenderForm from 'RenderForm';
import loadComponent from 'loadComponent';
import Row from 'Row';
import Col from 'Col';
import Heading from 'Heading';
import Card from 'Card';

function InsCreation() {
  const [formData, SetFormData] = useState([]);

  useEffect(() => {



    loadComponent({
      method: 'get',
      url: '/InstitionCreation.json',
    }).then((res) => {
      if (res.status == 200) {
        SetFormData(res.data);
      }
    });
  }, []);

  const callback = (values, actions) => {
    alert(values);
  };

  return (
    <>
      <Row>
        <Col lg={8}>
          <Heading
            title="Institution Creation"
            subHeading={
              'Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.'
            }
          />

          <RenderForm formData={formData} callback={callback} />
        </Col>
      </Row>
    </>
  );
}

export default InsCreation;
