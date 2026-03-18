let config = {
    AISUrl: '',
    baseURL: '',
    BehaviourURL: '',
    instId: '',
    WebSocket: false,
    MFASource: "AIS"
}


export function inializeConfig(newConfig) {
    config = { ...config, ...newConfig };
}


export function getConfig() {
    console.log(config);
    return config;
}


export function getConfigByName(configName) {
    if (configName in config) return config[configName];
    return null;
}