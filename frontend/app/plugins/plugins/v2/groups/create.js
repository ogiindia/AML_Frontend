/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import Card from 'Card';
import Col from 'Col';
import Heading from 'Heading';
import loadData from 'loadData';
import React, { useEffect, useState } from 'react';
import RenderForm from 'RenderForm';
import Row from 'Row';
import sendData from 'sendData';
import groupCreate from '../../../json/groupCreate.json';

function createGroups({ id }) {
  const [formData, SetFormData] = useState([]);

  const [menuData, setMenuData] = useState([]);

  const callback = (values, actions) => {
    console.debug(values);

    sendData.post('/app/rest/v1.0/group/save', values).then((d) => {
      console.log(d);
    });
  };

  useEffect(() => {
    loadData.get('/app/rest/v1.0/list/menu').then((d) => {
      setMenuData(d);
    });
  }, []);

  useEffect(() => {
    if (id !== undefined) {
      console.debug('id to load : ' + id);
      loadData.get('/app/rest/v1.0/fetch/group/' + id, {}).then((res) => {
        SetFormData(res);
      });
    }
  }, [id]);

  return (
    <>
      <>
        <div className={`p-4`}>
          <Row>
            <Col lg={8}>
              <Heading
                title="Group Creation"
                subHeading={
                  'Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.'
                }
              />

              <RenderForm formFormat={groupCreate} formData callback={callback}>
                {(props) => {
                  // console.log(props);

                  //  props.initialValues = { ...props.initialValues, "tId": {} }

                  const handleCheckBoxChange = (e) => {
                    const { value, checked } = e.target;
                    //   if (props.values['tId'] == undefined) props.values['tId'] = {};
                    let newArray = [];

                    if (props.values['tId'] !== undefined) {
                      newArray = checked
                        ? [...props.values['tId'], value]
                        : props.values['tId'].filter((v) => v !== value);
                    } else {
                      newArray.push(value);
                    }
                    console.log(newArray);
                    props.setFieldValue('tId', newArray);
                  };

                  return (
                    <>
                      <div role="group" aria-labelledby="checkbox-group">
                        <div className="p-4">
                          <Card title="Permissions List">
                            <Row>
                              <Col lg={12}>
                                <div className="p-3">
                                  <table className="width-100-percent">
                                    <tbody>
                                      {menuData.map((d, i) => {
                                        return (
                                          <>
                                            <tr key={i}>
                                              <td className="pd-10">
                                                {d.menuName}
                                              </td>
                                              <td>
                                                <input
                                                  type="checkbox"
                                                  name="tId"
                                                  value={d.menuID}
                                                  checked={
                                                    props.values['tId'] !==
                                                    undefined &&
                                                    props.values[
                                                      'tId'
                                                    ].includes(d.menuID)
                                                  }
                                                  onChange={
                                                    handleCheckBoxChange
                                                  }
                                                />
                                              </td>
                                            </tr>
                                          </>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                </div>
                              </Col>
                            </Row>
                          </Card>
                        </div>
                      </div>
                    </>
                  );
                }}
              </RenderForm>
            </Col>
          </Row>
        </div>
      </>
    </>
  );
}

export default createGroups;
