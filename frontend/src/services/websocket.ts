/**
 * Archivo que se encarga de la gestión del WebSocket para conectarse con Pokémon Showdown.
 * Este archivo implementa diferentes funciones que serán usadas en el resto del programa.
 * @module
 */


import {messageParser} from "../messageParser";

const ws = new WebSocket('wss://sim3.psim.us/showdown/websocket');

/**
 * Función que abre una conexión en el WebSocket.
 */
export const onOpen = () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    ws.onopen = event => {}
}

/**
 * Función que se queda a la escucha de mensajes del servidor de Pokémon Showdown.
 */
export const messageListener = () => {
    ws.onmessage = event => {
        messageParser(event.data);
    }
}

/**
 * Función que cierra el WebSocket.
 */
export const onClose = () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    ws.onclose = event => {}
}

/**
 * Función para enviar información a través del WebSocket.
 */
export const send = (data: string) => {
    ws.send(data);
}






















