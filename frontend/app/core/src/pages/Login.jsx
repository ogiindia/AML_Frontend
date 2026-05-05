/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import {
  arrayToJson,
  ChangeStyle,
  filterArray,
  findTextColor,
  flattenArray,
  groupJsonByKey,
  JsonArrayToArray,
  sortArray,
} from '@ais/utils';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import tinycolor from 'tinycolor2';
import { CommonAPI } from '../api/backendAPI/CommonAPI';
import logo from '../static/logo.png';

import { addAuth, reset } from '../redux/authSlice';

import {
  Col,
  CustomInput,
  FullWidthSubmitButton,
  InlineStatusText,
  PageCenterLayout,
  Row,
  SimpleCard,
  toast,
} from '@ais/components';

import { useGlobalContext } from '../utilites/Contexts/GlobalContext';
import { useModalHost } from '../utilites/Contexts/ModalHostContext';
import { usePage } from '../utilites/Contexts/PageContext';
import { useBrandingValue } from '../utilites/useBranding';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, seterror] = useState(null);
  const [isLoading, setisLoading] = useState(false);
  const { globalstate, updateGlobalState, resetGlobalState } =
    useGlobalContext();
  ``;
  const navigate = useNavigate();
  const { currentPage, setCurrentPage, updatePage, page } = usePage();

  const { showPluginModal } = useModalHost();

  const dispatch = useDispatch();

  const [show, setshow] = useState(false);
  const launcherEnabled = useBrandingValue('launcher', false);

  useEffect(() => {
    dispatch(reset());
  }, []);

  // useEffect(() => {
  //   showPluginModal('v2-customers-search', { userId: 42 });
  // }, []);




  const doLogin = (event) => {
    setisLoading(true);
    CommonAPI.Login(email, password)
      .then((res) => {
        var dt = res;
        if (process.env.NODE_ENV === 'development') {
          //      dt['menu'] = LoginResponse['menu'];
        }

        if (res.data !== undefined) dt = res.data;

        // dt['modules'] = [
        //   'Case Manager',
        //   'Back Office',
        //   'Rule Manager',
        //   'reports',
        // ];


        if (dt['status'] === '2' || dt['status'] === 2) {
          seterror('Error requesting login , contact administrator');
        } else if (dt['status'] === '1' || dt['status'] === 1) {
          seterror('Invalid username and password');
        } else {


          dt['apps'] = dt.activeApps;
          dt['menu'] = sortArray(flattenArray(dt.menu), 'menuOrder');
          console.log(dt['menu']);

          dt['modules'] = JsonArrayToArray(dt.activeApps, 'appId');
          // console.log(JsonArrayToArray(dt.activeApps, 'appId'));

          //   if ("userDetails" in dt) {

          var activeColor = '232454';
          var SecondaryColor = '4bcd3e';

          //update global settings
          updateGlobalState({
            firstTimeLogin: dt['status'] === 3,
            username: dt['userName'],
            groupId: dt['groupId'],
            auth: dt.accessToken,
            logo: logo,
            apps: dt['apps'],
            moduleKeyList: arrayToJson(dt.modules),
            appPrimaryColor: activeColor,
            appSecondaryColor: SecondaryColor,
            sideMenu: true,
            initApp: true,
            groupName: dt?.groupName

          });

          dispatch(addAuth(dt.accessToken));

          //update page related settings like menu , menu data , breadcrumbs , current page etc.,
          updatePage({
            rawMenu: dt.menu,
            convertedMenu: groupJsonByKey(
              filterArray(dt.menu, 'showInMenu'),
              launcherEnabled ? 'app.appId' : 'module',
            ),
          });

          if ((activeColor != null) & (SecondaryColor != null)) {
            ChangeStyle('--fis-primary', '#' + activeColor);
            ChangeStyle('--fis-secondary', '#' + SecondaryColor);
            // ChangeStyle('--fis-info', "#" + (dt.userDetails.appInfoColor || "00A4B6"));
            // ChangeStyle('--fis-warning', "#" + (dt.userDetails.appWarningColor || "F5AD2A"));
            // ChangeStyle('--fis-success', "#" + (dt.userDetails.appSuccessColor || "077e8b"));
            // ChangeStyle('--fis-danger', "#" + (dt.userDetails.appDangerColor || "FF7512"));

            //convert styles to match the header,fontcolor , hover and active classes

            var PrimaryTextColor = findTextColor('#' + activeColor);
            var secondaryTextColor = findTextColor('#' + SecondaryColor);
            var calculatedActiveColor = tinycolor('#' + activeColor)
              .lighten(40)
              .toHexString();

            ChangeStyle(
              '--fis-primary-dark',
              tinycolor('#' + activeColor)
                .darken(10)
                .toHexString(),
            );
            ChangeStyle(
              '--fis-secondary-dark',
              tinycolor('#' + SecondaryColor)
                .darken(10)
                .toHexString(),
            );

            ChangeStyle('--fis-active-color', calculatedActiveColor);
            ChangeStyle('--fis-header-secondary-text-color', secondaryTextColor);
            ChangeStyle('--fis-header-primary-text-color', PrimaryTextColor);
            //  ChangeStyle('--fis-header-secondary-text-color',secondaryTextColor);
          }

          setisLoading(false);

          if (dt['status'] === '3' || dt['status'] === 3) {
            navigate('/firstTimeLogin');
            // navigate('/home');
          } else if (dt['status'] === '2' || dt['status'] === 2) {
            seterror('Error requesting login , contact administrator');
          } else if (dt['status'] === '1' || dt['status'] === 1) {
            seterror('Invalid username and password');
          } else {
            toast({
              title: 'Welcome back!',
              description: `You're loggedin`,
              variant: 'success',
            });
            if (launcherEnabled) {
              navigate('/launcher');
            } else {
              navigate('/home');
            }
          }
        }
      })
      .catch(function (err) {
        console.error(err);
        seterror('Error Communicating with the Server');
      })
      .finally(() => {
        setisLoading(false);
      });
  };

  return (
    <>

      <div className="login-container">

        {/* TOP LEFT TITLE */}
        <div className="login-title">
          AML / CFT Compliance System
        </div>

        <PageCenterLayout
          className={`login-bg`}
          title={<img src={useBrandingValue('assets.logo', './logo.png')} width={'100px'}
          />}


        >
          <SimpleCard className={`login-set-trans dashboard-header`} align='center' justify='center'
            title={useBrandingValue('appTitle', 'Welcome Back')}
            desc={useBrandingValue('appTagline', 'Enter your details below to login into your account')}
          >
            <Row>
              {error && (
                <Col>
                  <InlineStatusText text={error} />
                </Col>
              )}
              <Col span={'12'}>
                <CustomInput
                  name="Username"
                  label={'Username'}
                  type={'text'}
                  isError={error ? true : false}
                  disabled={isLoading ? true : false}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Col>
              <Col span="12">
                <CustomInput
                  name="Password"
                  label={'Password'}
                  type={'password'}
                  isError={error ? true : false}
                  disabled={isLoading ? true : false}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Col>
            </Row>
            <Row>
              <Col className="py-4">
                <FullWidthSubmitButton
                  onClick={(e) => doLogin()}
                  loading={isLoading}
                  label={'Login'}
                />
              </Col>
            </Row>
          </SimpleCard>
        </PageCenterLayout >


      </div>

    </>
  );
}

export default Login;
