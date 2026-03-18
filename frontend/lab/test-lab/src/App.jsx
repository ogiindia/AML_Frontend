import AIS from '@ais/sdk';
import { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const iframeRef = useRef(null);
  const [urlToLoad, SeturlToLoad] = useState(null);

  // const renderPage = () => {
  //   const data = {
  //     "eventDetails": {
  //       "data": "login",
  //       "desc": "Mobile APP Login",
  //       "type": "failed"
  //     },
  //     "deviceDetails": {
  //       "hardwareId": "22d808f7-5efd-4c3b-8144-1e2777f473ff",
  //       "deviceId": "1234567890987",
  //       "screenSize": "1080x2177",
  //       "language": "en",
  //       "deviceModel": "samsung",
  //       "deviceFingerPrint": "26461727-82d1-4cc4-9c64-caf893a31213",
  //       "channel": "mob",
  //       "ip": "10.192.48.19",
  //       "region": "india",
  //       "mobileNumber": "8879873728",
  //       "sdkVersion": "1.0",
  //       "dt": "20231128130500000"
  //     },
  //     "customerDetails": {
  //       "customerName": "Anand",
  //       "userType": "retail",
  //       "orgName": "inbretail",
  //       "userid": "e5614002",
  //       "sessionId": "8144-1e2777f473ff"
  //     },
  //     "transactionDetails": {
  //       "rrn": "2311786548"
  //     }
  //   }

  //   const requestOptions = {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(data)
  //   };

  //   fetch("/ngpdev/ais/rulewhiz/v1/takedecision", requestOptions).then(response => response.json())
  //     .then(data => {
  //       if (data.challengeURL) {
  //         SeturlToLoad("http://localhost:5000/login");
  //         //  window.location.href = data.challengeURL;
  //       }
  //     });
  // }

  // useEffect(() => {
  //   renderPage();
  // }, []);

  useEffect(() => {
    AIS.initialize({
      AISUrl:
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:5000/api/mock'
          : 'https://aisworld.space/api/mock',
      BehaviourUrl: 'wss://aisworld.space/behavior',
      baseURL:
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:3000'
          : 'https://aisworld.space',
      instId: '1010',
      WebSocket: true,
      MFASource: 'APP',
    });
  }, []);

  return <></>;
}

export default App;
