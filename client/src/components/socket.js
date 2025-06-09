// src/utils/socket.js
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  transports: ["websocket"],
  autoConnect: true,
  reconnectionAttempts: 5
});

export default socket;
