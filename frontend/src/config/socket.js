
import socket from "socket.io-client";


let socketInstance = null;

export const initializeSocket = (projectId)=>{

    socketInstance = socket(import.meta.env.VITE_API_URL,{
        auth: {
            token: localStorage.getItem("token")
        },
        query: {
            projectId
        },
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
    });
    return socketInstance;
}

export const receiveMessage = (eventName , callback) =>{
    if(!socketInstance) return;

    socketInstance.on(eventName, callback);
}

export const sendMessage = (eventName, data) =>{
    if(!socketInstance) return;

    socketInstance.emit(eventName, data);
}
