import React, { useEffect, useState } from 'react';
import RenderForm from 'RenderForm';
import Row from 'Row';
import Col from 'Col';
import Heading from 'Heading';
import sendData from 'sendData';
import loadData from 'loadData';
import insCreation from '../../../json/institution/InstitutionRegistration.json';
import usePageContext from 'usePageContext';

export default function InstitionCreation({ id }) {
  const [formData, SetFormData] = useState([]);
  const { setCurrentPage, setPageData } = usePageContext();

  const callback = (values, actions) => {
    console.log(actions);
    console.log(values);

    sendData.post('/app/rest/v1.0/save/instid', values).then((d) => {
      setCurrentPage('institution-v2-management');
    });
  };

  useEffect(() => {
    console.debug('id to load : ' + id);
    loadData.get('/app/rest/v1.0/fetch/institution/' + id, {}).then((res) => {
      SetFormData(res);
    });
  }, [id]);

  return (
    <>
      <div className={`p-4`}>
        <Row>
          <Col lg={8}>
            <Heading
              title="Institution Creation"
              subHeading={
                'Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.'
              }
            />

            <RenderForm
              formFormat={insCreation}
              formData={formData}
              callback={callback}
            />
          </Col>
        </Row>
      </div>
    </>
  );
}
