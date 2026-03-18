import { flattenJson, getBrowser } from '@ais/utils';

export default class EventTracker {
  constructor(apiUrl = null, wsManager = null) {
    if (EventTracker.instance) return EventTracker.instance;

    this.apiUrl = apiUrl;
    this.sessionId = this.generateSessionId();
    this.initTracking();
    this.screenId = 'DEFAULT';
    this.screenType = 'DEFAULT';
    this.riskLevel = 'LOW';
    this.ws = wsManager;

    this.deviceId = localStorage.getItem('deviceId');

    this.buffer = [];
    this.lastKeyTime = Date.now();
    this.lastActivity = Date.now();
    this.tabSwitches = []; // store timestamps

    this.isBot = false;
    this.cordinates = {
      lat: null,
      lon: null,
      accuracy: null,
      timestamp: null,
    };

    this.recordLocation();

    // Event listeners
    const onKeyPress = () => {
      const now = Date.now();
      const delay = now - this.lastKeyTime;
      this.lastKeyTime = now;

      this.sendToBackend('typing', { x: null, y: null, delay, hidden: null });
      this.detectAnomalies('typing', { x: null, y: null, delay, hidden: null });
    };

    const onMouseMove = (e) => {
      this.sendToBackend('mouse', {
        x: e.clientX,
        y: e.clientY,
        delay: null,
        hidden: null,
      });
      this.detectAnomalies('mouse', {
        x: e.clientX,
        y: e.clientY,
        delay: null,
        hidden: null,
      });
    };

    const onClick = (e) => {
      this.sendToBackend('click', {
        x: e.clientX,
        y: e.clientY,
        delay: null,
        hidden: null,
      });
    };

    const onScroll = () => {
      this.sendToBackend('scroll', {
        y: window.scrollY,
        x: null,
        delay: null,
        hidden: null,
      });
    };

    const onTabSwitch = () => {
      this.sendToBackend('tab-switch', {
        hidden: document.hidden,
        x: null,
        y: null,
        delay: null,
      });
      this.detectAnomalies('tab-switch', {
        hidden: document.hidden,
        x: null,
        y: null,
        delay: null,
      });
    };

    // Inactivity timer
    const idleChecker = setInterval(() => {
      const now = Date.now();
      if (now - this.lastActivity > 2 * 60 * 1000) {
        this.sendToBackend('anomaly', { reason: 'User idle for 2+ minutes' });
        this.lastActivity = now; // reset
      }
    }, 10000); // check every 10 seconds

    // Bind events
    window.addEventListener('keypress', onKeyPress);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onClick);
    window.addEventListener('scroll', onScroll);
    document.addEventListener('visibilitychange', onTabSwitch);
  }

  updatePageInfo(screenId, screenType, riskLevel) {
    console.log('into pageInfo');
    this.screenId = screenId;
    this.screenType = screenType;
    this.riskLevel = riskLevel;
  }

  generateSessionId() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  registerDeviceID(devicId) {
    this.deviceId = devicId;
  }

  detectAnomalies = (eventType, data) => {
    const now = Date.now();

    if (eventType === 'typing') {
      const delay = data.delay;
      if (delay >= 2 && delay < 50) {
        console.log(delay);
        // alert("Keyboard Typing anomaly detected");
        this.isBot = true;
        this.sendToBackend('anomaly', {
          reason: 'Fast typing',
          delay,
          dx: null,
          dy: null,
        });
      }
    }

    if (eventType === 'tab-switch') {
      this.tabSwitches.push(now);
      this.tabSwitches = this.tabSwitches.filter((t) => now - t < 60000); // keep 1 min only
      if (this.tabSwitches.length > 5) {
        // alert("Tab frequent switching anomaly detected");
        this.isBot = true;
        this.sendToBackend('anomaly', {
          reason: 'Frequent tab switching',
          dx: null,
          dy: null,
          delay: null,
        });
      }
    }

    if (eventType === 'mouse') {
      const prev = this.buffer.findLast((e) => e.type === 'mouse');
      if (prev) {
        const dx = Math.abs(data.x - prev.data.x);
        const dy = Math.abs(data.y - prev.data.y);
        if (dx > 300 || dy > 300) {
          // alert("mouse movement anomaly detected");
          this.isBot = true;
          sendToBackend('anomaly', {
            reason: 'Mouse teleport',
            dx,
            dy,
            delay: null,
          });
        }
      }
    }

    // idle check reset
    this.lastActivity = now;
  };

  initTracking() {}

  // sample Data

  // {
  //     "x": 860.2931228804069,
  //     "y": 309.8711554111769,
  //     "pressure": 0.3780088469418178,
  //     "size": 0.15878497663758662,
  //     "action": 2,
  //     "pointerCount": 1,
  //     "orientation": 1.2703132316590513,
  //     "viewInfo": null,
  //     "metadata": {
  //       "toolType": "FINGER",
  //       "touchMajor": 0.4595024539822429,
  //       "touchMinor": 0.31865906895347285
  //     },
  //     "timestamp": 1744365600000,
  //     "context": {
  //       "screenId": "Login",
  //       "screenType": "GENERAL",
  //       "riskLevel": "HIGH"
  //     },
  //     "sessionId": "317b043c-9e76-43ed-9f78-0634ce490764",
  //     "eventType": "TOUCH_EVENT"
  //   }

  handleEvent(eventType, event) {
    const data = {
      eventType,
      element: event.target.tagName,
      x: event.pageX,
      y: event.pageY,
      pageX: event.pageX,
      pageY: event.pageY,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      context: {
        screenId: this.screenId,
        screenType: this.screenType,
        riskLevel: this.riskLevel,
      },
    };
    this.sendData(data);
  }

  handleMouseMovement(event) {
    this.handleEvent('moseMove', event);
  }

  async sendData(data) {
    if (this.apiUrl) {
      // try {
      //     const response = await fetch(this.apiUrl, {
      //         method: "POST",
      //         headers: {
      //             "Content-Type": "application/json"
      //         },
      //         body: JSON.stringify(data),
      //     });
      //     const result = await response.json();
      //     this.handleResponse(result);
      // } catch (error) {
      //     console.error("Error Sending Data : ", error);
      // }
    }
  }

  handleResponse(response) {
    console.log(response); // hook to do something with event data
  }

  isSuspicious = () => {
    this.isBot = navigator.webdriver;
    return this.isBot;
  };

  visitorId() {
    const existingId = localStorage.getItem('visitorId');
    if (existingId) return existingId;
    const newId = crypto.randomUUID();
    localStorage.setItem('visitorId', newId);
    return newId;
  }

  geolocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error(`Geolocation is not supported`));
      } else {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      }
    });
  };

  async recordLocation() {
    try {
      const position = await this.geolocation();
      const locationData = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: new Date(position.timestamp).toISOString(),
      };

      this.cordinates = locationData;
    } catch (err) {
      console.error(`location fetch failed`);
    }
  }

  // setInterval(recordLocation, 60 * 1000);

  sendToBackend = async (type, data) => {
    // console.log(this.cordinates);

    const payload = {
      type,
      sessionId: sessionStorage.getItem('sessionId'),
      deviceId: this.deviceId || localStorage.getItem('deviceId'),
      data,
      pageDetails: {
        pageName: this.screenId,
        location: window.location.href,
        host: window.location.host,
        screenType: this.screenType,
        riskLevel: this.riskLevel,
      },
      deviceDetails: {
        userAgent: navigator.userAgent,
        os: navigator.oscpu,
        version: navigator.buildID,
        platform: navigator.platform,
        language: navigator.language,
        touchSupport: 'onTouchstart' in window,
        geolocation: this.cordinates,
        channel: 'web',
        screen: {
          width: window.screen.width,
          height: window.screen.height,
          colorDepth: window.screen.colorDepth,
        },
        deviceMemory: navigator.deviceMemory || null,
        hardwareConcurrency: navigator.hardwareConcurrency,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        browser: getBrowser(),
        headless: navigator.webdriver,
      },
      networkDetails: {},
      userInfo: {
        visitorId: this.visitorId(),
        isSuspicious: this.isBot || this.isSuspicious(),
        firstVisit: localStorage.getItem('visitorId') ? true : false,
      },
      timestamp: new Date().toISOString(),
    };

    console.debug('[Analytics]', JSON.stringify(payload));
    this.buffer.push(payload);

    if (this.ws) {
      console.debug('sending via websocket');
      this.ws.send(flattenJson(payload));
    } else {
      console.debug('sending via api');
      try {
        await fetch('/ngpdev/ngp/ars/api/v1/save/bi', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(flattenJson(payload)),
        });
      } catch (err) {
        console.error(`Failed to send analytics :`, err);
      }
    }

    //   localStorage.setItem('analytics_demo', JSON.stringify(buffer.current));
  };
}
