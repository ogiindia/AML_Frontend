import { getConfigByName } from '../config';
import {
  getCurrentDateTime,
  getDeviceFingerPrint,
  getDeviceInfo,
} from '../deviceInfo';
import { triggerMFA } from './showOverlay';

export function sdkResponseInterceptor(response) {
  console.log('into response interceptor');

  const isMFASource = getConfigByName('MFASource') === 'AIS';
  if (isMFASource) {
    const data = response?.data;

    if (data) {
      if ('action' in data) {
        if (data['action'] === '50') {
          sessionStorage.setItem('data', JSON.stringify(data));
          //     navigate('/verifyOtp');
          triggerMFA('OTP');
        }

        if (data['action'] === '70') {
          sessionStorage.setItem('data', JSON.stringify(data));
          //    navigate('/kba');
          triggerMFA('KBA');
        }

        if (data['action'] === '60') {
          sessionStorage.setItem('data', JSON.stringify(data));
          //      navigate('/verifyTotp');
          triggerMFA('TOTP');
        }

        if (data['action'] === '00') {
          sessionStorage.setItem('data', JSON.stringify(data));

          triggerMFA();
        }
      }
    }
  }

  // have to implement logic to read challengeCode and trigger respective authentication
  //  showOverlay('<h1>Lorem ipsum dolor sit amet consectetuer adipiscing  elit</h1> <p>Lorem ipsum dolor sit amet, consectetuer adipiscing  elit. Aenean commodo ligula eget dolor. Aenean massa  <strong>strong</strong>. Cum sociis natoque penatibus  et magnis dis parturient montes, nascetur ridiculus  mus. Donec quam felis, ultricies nec, pellentesque  eu, pretium quis, sem. Nulla consequat massa quis  enim. Donec pede justo, fringilla vel, aliquet nec,  vulputate eget, arcu. In enim justo, rhoncus ut,  imperdiet a, venenatis vitae, justo. Nullam dictum  felis eu pede <a class="external ext" href="#">link</a>  mollis pretium. Integer tincidunt. Cras dapibus.  Vivamus elementum semper nisi. Aenean vulputate  eleifend tellus. Aenean leo ligula, porttitor eu,  consequat vitae, eleifend ac, enim. Aliquam lorem ante,  dapibus in, viverra quis, feugiat a, tellus. Phasellus  viverra nulla ut metus varius laoreet. Quisque rutrum.  Aenean imperdiet. Etiam ultricies nisi vel augue.  Curabitur ullamcorper ultricies nisi.</p> <h1>Lorem ipsum dolor sit amet consectetuer adipiscing  elit</h1> <h2>Aenean commodo ligula eget dolor aenean massa</h2> <p>Lorem ipsum dolor sit amet, consectetuer adipiscing  elit. Aenean commodo ligula eget dolor. Aenean massa.  Cum sociis natoque penatibus et magnis dis parturient  montes, nascetur ridiculus mus. Donec quam felis,  ultricies nec, pellentesque eu, pretium quis, sem.</p> <h2>Aenean commodo ligula eget dolor aenean massa</h2> <p>Lorem ipsum dolor sit amet, consectetuer adipiscing  elit. Aenean commodo ligula eget dolor. Aenean massa.  Cum sociis natoque penatibus et magnis dis parturient  montes, nascetur ridiculus mus. Donec quam felis,  ultricies nec, pellentesque eu, pretium quis, sem.</p> <ul>   <li>Lorem ipsum dolor sit amet consectetuer.</li>   <li>Aenean commodo ligula eget dolor.</li>   <li>Aenean massa cum sociis natoque penatibus.</li> </ul> <p>Lorem ipsum dolor sit amet, consectetuer adipiscing  elit. Aenean commodo ligula eget dolor. Aenean massa.  Cum sociis natoque penatibus et magnis dis parturient  montes, nascetur ridiculus mus. Donec quam felis,  ultricies nec, pellentesque eu, pretium quis, sem.</p> <form action="#" method="post">   <fieldset>     <label for="name">Name:</label>     <input type="text" id="name" placeholder="Enter your  full name" />     <label for="email">Email:</label>     <input type="email" id="email" placeholder="Enter  your email address" />     <label for="message">Message:</label>     <textarea id="message" placeholder="Whats on your  mind?"></textarea>     <input type="submit" value="Send message" />   </fieldset> </form>');
  console.log(response);
  return response;
}

export async function sdkRequestInterceptor(config) {
  console.log('into request interceptor');

  var requesttype = 'object';

  var body = config?.data;

  if (body === undefined) body = {};

  if (typeof body === 'string') {
    body = JSON.parse(body);
    requesttype = 'string';
  }

  const deviceDt = await deviceData();

  const sdkData = await SDKdetails();

  let bodydata = { ...body, ...deviceDt, ...sdkData };

  if (typeof body === 'object' && requesttype === 'string')
    config.data = JSON.stringify(bodydata);
  console.log(config);
  return config;
}

const SDKdetails = async () => {
  return {
    sdkDetails: {
      version: getConfigByName('version'),
      package: getConfigByName('package'),
    },
  };
};

const deviceData = async () => {
  const deviceDetails = getDeviceInfo();
  const fingerPrint = await getDeviceFingerPrint();

  return {
    deviceDetails: {
      hardwareId: fingerPrint,
      deviceId: fingerPrint,
      screenSize: window.screen.width + 'x' + window.screen.height,
      language: navigator.language,
      deviceModel: deviceDetails.browser.name,
      //       deviceFingerPrint: deviceFingerPrint,
      channel: 'web',
      ip: localStorage.getItem('ipv4') || '134.238.19.218',
      region: 'india',
      mobileNumber: '8879873728',
      sdkVersion: getConfigByName('version') || '1.0',
      dt: getCurrentDateTime(),
    },
  };
};
