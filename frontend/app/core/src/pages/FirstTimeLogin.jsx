import { Heading, Row, SplitPageLayout } from '@ais/components';
import { useNavigate } from 'react-router';
import { CommonAPI } from '../api/backendAPI/CommonAPI';
import { CONTEXT_PATH } from '../config';
import registerForm from '../json/firstTimeLogin.json';
import RenderForm from '../utilites/FormElements/RenderForm';

function FirstTimeLogin() {
  const navigate = useNavigate();

  const callback = async (values, actions) => {
    await CommonAPI.updatePassword(
      values.oldPassword,
      values.confirmPassword,
    ).then((res) => {
      console.log(res);

      if (res.status === '2' || res.status === 2) {
        throw new Error('Old password and new password cannot be same.');
      } else if (res.status === '1' || res.status === 1) {
        throw new Error('Password Mismatch please try again');
      } else {
        navigate('/login');
      }
    });

    // setisLoading(true);
    // // CommonAPI.changePassword("Super Admin", values.confirmPassword, values.oldPassword).then((res) => {
    // //     navigate("/home");
    // // });
    // //yet to work on it
    console.log(values);
    // // setisLoading(false);
    // setTimeout(() => {
    //   navigate('/home');
    // }, 2000);

    return true;

    // throw new Error('Invalid data workspace passed');
  };

  const RightSideBlock = () => {
    return (
      <img
        src={`${CONTEXT_PATH}/bg1.png`}
        alt="background"
        className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
      />
    );
  };

  const LeftsideBlock = () => {
    return (
      <>
        <Row align="center" justify="center">
          <Heading
            center={true}
            title={'Password Expired'}
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
      <SplitPageLayout left={<LeftsideBlock />} right={<RightSideBlock />} />

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

export default FirstTimeLogin;
