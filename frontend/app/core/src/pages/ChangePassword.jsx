import { Heading, Row, SplitPageLayout } from '@ais/components';
import { useNavigate } from 'react-router';
import { CommonAPI } from '../api/backendAPI/CommonAPI';
import { CONTEXT_PATH } from '../config';
import registerForm from '../json/changePassword.json';
import RenderForm from '../utilites/FormElements/RenderForm';

function ChangePassword() {
  const navigate = useNavigate();

  const callback = async (values, actions) => {
    //yet to work globalcontext is returning empty.
    await CommonAPI.changePassword(
      'superadm',
      values.newPassword,
      values.oldPassword,
    ).then((res) => {
      var dt = res;

      console.warn(dt);
    });

    // navigate('/home');
  };

  // return (
  //   <>
  //     <SimpleModal isOpen={true}>
  //       <div className="flex-center">
  //         <BackButton callback={() => navigate(-1)} label="Back" />
  //         <Heading title="Change Password"></Heading>
  //       </div>

  //       <RenderForm
  //         formFormat={registerForm}
  //         callback={(values, actions) => callback(values, actions)}
  //       />
  //     </SimpleModal>
  //   </>
  // );

  const LeftSideBlock = () => {
    return (
      <img
        src={`${CONTEXT_PATH}/bg1.png`}
        alt="background"
        className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
      />
    );
  };

  const RightSideBlock = () => {
    return (
      <>
        <Row align="center" justify="center">
          <Heading
            center={true}
            title={'Change Password'}
            subTitle={'Please use the below form to update your password'}
          />
          <RenderForm
            formFormat={registerForm}
            cancel={false}
            buttonLabel={'Submit'}
            callback={callback}
            blockButton={true}
          />
        </Row>
      </>
    );
  };

  return (
    <>
      <SplitPageLayout
        orientation="right"
        left={<LeftSideBlock />}
        right={<RightSideBlock />}
      />

      {/* <SimpleModal isOpen={true}>
          <h4>Password Expired</h4>
          <h6>Please use the below form to update your password</h6>
          <RenderForm
            formFormat={registerForm}
            cancelCallback={() => alert('clicked')}
            cancel={false}
            buttonLabel={'Submit'}
            callback={(values, actions) => callback(values, actions)}
          />
        </SimpleModal> */}
    </>
  );
}

export default ChangePassword;
