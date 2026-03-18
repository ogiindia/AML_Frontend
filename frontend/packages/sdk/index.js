import { UAParser } from "ua-parser-js";
import { addInterceptor, apiCall, initApi } from "./api";
import { getConfigByName, inializeConfig } from "./config";
import { getDeviceFingerPrint } from "./deviceInfo";
import EventTracker from "./EventTracker";
import { sdkRequestInterceptor, sdkResponseInterceptor } from "./views/Interceptor";
import WebSocketManager from "./WebSocketManager";

class SDK {

    constructor() {
        if (SDK.instance) return SDK.instance;
        this.apiUrl = "";
        this.deviceFingerPrint = "";
        this.deviceInfo = {};
        this.appConfig = {};
        this.isInitialized = false;
        this._initializing = false;
        this.sdkDetails = {
            version: '1.0.0',
            package: "com.fis.ngp.ais"
        }
        this.eventTracker = null;
        this.ws = null;
        this.inteceptors = {
            request: [],
            response: [],
        };
        console.log("sdk constructor called");
    }


    async pageInit(screenId, screenType = "GENERAL", riskLevel = "LOW") {
        console.log("page info sent...")
        if (this.eventTracker) {
            this.eventTracker.updatePageInfo(screenId, screenType, riskLevel);
        }
    }



    async initialize(config) {

        if (this.isInitialized || this._initializing) {
            console.log(`sdk already initialized `);
            return;
        }

        this._initializing = true;


        console.log("SDK Intialized");







        inializeConfig(config);
        inializeConfig(this.sdkDetails);

        const WebSocketAllowed = await getConfigByName("WebSocket");

        this.apiUrl = config.AISUrl;
        if (WebSocketAllowed) {
            this.ws = new WebSocketManager(config.BehaviourUrl);
            this.ws.connect();
        }

        this.eventTracker = new EventTracker(config.BehaviourUrl, this.ws);

        this.getDeviceFingerPrint = await this.getDeviceFingerPrint();
        this.deviceInfo = this.getDeviceInfo();

        const sessionId = this.eventTracker.generateSessionId();

        sessionStorage.setItem("sessionId", sessionId);
        localStorage.setItem("deviceId", this.getDeviceFingerPrint);

        this.regDeviceId(this.deviceFingerPrint);

        this.isInitialized = true;
        initApi();
        this.eventTracker.initTracking();

        console.log(this.eventTracker, this.getDeviceFingerPrint, this.deviceInfo);
    }


    async getDeviceFingerPrint() {
        return await getDeviceFingerPrint();
    }

    getDeviceInfo() {
        return UAParser();
    }


    regDeviceId(regDeviceId) {
        this.eventTracker.registerDeviceID(regDeviceId);
    }

    apiCall(endpoint, method = "POST", data = {}, headers = {}) {
        return apiCall(endpoint, method, data, headers);
    }

    addInterceptor(type, fn) {
        return addInterceptor(type, fn);
    }

    getSdkRequestInterceptor() {
        return sdkRequestInterceptor;
    }

    getSdkResponseInterceptor() {
        return sdkResponseInterceptor;
    }


    getSDKDetails() {
        return this.sdkDetails;
    }


    send = (msg) => {
        if (this.ws) {
            this.ws.send(msg);
        }
    }
}

const AIS = new SDK();

export default AIS