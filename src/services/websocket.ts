/**
 * Archivo que se encarga de la gestión del WebSocket para conectarse con Pokémon Showdown
 * Este archivo implementa diferentes funciones que serán usadas en el resto del programa.
 */

import {messageParser} from "@/messageParser";

const ws = new WebSocket('wss://sim3.psim.us/showdown/websocket');

/** Función que abre una conexión en el WebSocket */
export const onOpen = () => {
    ws.onopen = event => {
        console.log(event);
        console.log('Conectado al WebSocket');
    }
}

/** Función que se queda a la escucha de mensajes del servidor de Pokémon Showdown */
export const messageListener = () => {
    ws.onmessage = event => {
        console.log(event);
        messageParser(event.data);
    }
}

/** Función que cierra el WebSocket */
export const onClose = () => {
    ws.onclose = event => {
        console.log(event);
    }
}

/** Función del WebSocket para manejo de errores */
export const onError = () => {
    ws.onerror = event => {
        console.log(event);
    }
}

//Función para enviar información a través del WebSocket
export const send = (data: string) => {
    ws.send(data);
}






















