import React, { useEffect, useState } from 'react';
import RenderForm from 'RenderForm';
import loadComponent from 'loadComponent';
import Row from 'Row';
import Col from 'Col';
import Heading from 'Heading';
import Card from 'Card';

import insCreation from '../../../json/emailtxncreate.json';
import usePageContext from 'usePageContext';

import sendData from 'sendData';

function InsCreation() {
  const [formData, SetFormData] = useState([]);

  const { setCurrentPage, setPageData } = usePageContext();

  const callback = (values, actions) => {
    console.log(values);

    values['caseid'] = new Date().getTime();
    values['id'] = new Date().getTime();

    sendData.post('/app/rest/v1.0/service/save/email', values).then((d) => {
      setCurrentPage('v1-cybercrime-email-txnlist');
    });
  };

  return (
    <>
      <div className="p-3">
        <Row>
          <Col lg={8}>
            <Heading
              title="Report a Case"
              subHeading={
                'Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.'
              }
            />

            <RenderForm formFormat={insCreation} callback={callback} />
          </Col>
        </Row>
      </div>
    </>
  );
}

export default InsCreation;
