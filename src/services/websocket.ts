import {messageParser} from "@/messageParser";

const ws = new WebSocket('wss://sim3.psim.us/showdown/websocket');

export const onOpen = () => {
    ws.onopen = event => {
        console.log(event);
        console.log('Conectado al WebSocket');
    }
}

export const messageListener = () => {
    ws.onmessage = event => {
        console.log(event);
        messageParser(event.data);
    }
}

export const onClose = () => {
    ws.onclose = event => {
        console.log(event);
    }
}

export const onError = () => {
    ws.onerror = event => {
        console.log(event);
    }
}

export const send = (data: string) => {
    ws.send(data);
}






















