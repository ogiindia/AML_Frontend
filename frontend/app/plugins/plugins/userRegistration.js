import React, { useEffect, useState } from 'react';
import RenderForm from 'RenderForm';
import Row from 'Row';
import Col from 'Col';
import Heading from 'Heading';
import userRegistration from '../json/userRegistration.json';
import CurdLayout from 'CurdLayout';

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

  return (
    <>
      <CurdLayout
        title="User Creation"
        subTitle="Create user through this form"
      >
        <RenderForm formData={formData} callback={callback} layout={1} />
      </CurdLayout>
    </>
  );
}

export default UserRegistration;
