"use strict";

class MySocket {
    constructor () {
    };

    connect(address, onMessageReceived, onError) {
        this.socket = new WebSocket(address);
        this.socket.onmessage = onMessageReceived;
        this.socket.onerror = onError;
    }

    send(msg) {
        this.socket.send(msg);
    }

    disconnect() {
        this.socket.close();
    }
}