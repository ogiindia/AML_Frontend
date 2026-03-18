export default class WebSocketManager {

    constructor(url) {
        this.url = url;
        this.ws = null;
        this.queue = [];
    }

    connect() {
        if (this.ws && this.ws.readState <= 1) return;
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
            console.log(`[WS] Connected`);
            this.queue.forEach(msg => this.send(msg));
            this.queue = [];
        }

        this.ws.onmessage = e => {
            //when sent from backend....
            console.debug(`[WS] Message :`, e);
        }

        this.ws.onclose = () => console.log(`[WS] Disconnected`);
        this.ws.onerror = err => console.error(`[WS] Error`, err);
    }

    send(data) {
        const json = JSON.stringify(data);
        console.debug(json);
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(json);
        } else {
            this.queue.push(data);
        }
    }

    close() {
        if (this.ws) this.ws.close();
    }
}