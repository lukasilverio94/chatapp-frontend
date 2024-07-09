// const WebSocketService = {
//   socket: null,
//   token: null,
//   reconnectAttempts: 0,
//   maxReconnectAttempts: 0,
//   reconnectInterval: 2000, // 2 seconds

//   connect(roomId, roomType, onMessageReceived, onRoomNameReceived) {
//     this.token = localStorage.getItem("access_token");
//     if (!this.token) {
//       console.error("JWT Token is missing");
//       return;
//     }

//     const socketUrl = `ws://localhost:8000/ws/chat/${roomType}/${roomId}/?token=${this.token}`;

//     try {
//       this.socket = new WebSocket(socketUrl);

//       this.socket.onopen = () => {
//         console.log("WebSocket connection opened");
//         this.reconnectAttempts = 0; // Reset reconnect attempts on successful connection
//       };

//       this.socket.onmessage = (event) => {
//         const message = JSON.parse(event.data);
//         console.log("event.data", event.data);
//         if (message.room_name) {
//           onRoomNameReceived(message.room_name);
//           console.log("message.room_name", message.room_name);
//         } else {
//           onMessageReceived(message);
//         }
//       };

//       this.socket.onclose = (event) => {
//         console.log("WebSocket connection closed", event);
//         if (
//           !event.wasClean &&
//           this.reconnectAttempts < this.maxReconnectAttempts
//         ) {
//           setTimeout(() => {
//             this.reconnectAttempts++;
//             console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`);
//             this.connect(
//               roomId,
//               roomType,
//               onMessageReceived,
//               onRoomNameReceived
//             );
//           }, this.reconnectInterval);
//         }
//       };

//       this.socket.onerror = (error) => {
//         console.error("WebSocket error:", error);
//         // Handle WebSocket errors
//       };
//     } catch (error) {
//       console.error("WebSocket connection error:", error);
//       // Handle WebSocket connection error
//     }
//   },

//   sendMessage(message) {
//     if (this.socket && this.socket.readyState === WebSocket.OPEN) {
//       this.socket.send(JSON.stringify(message));
//     } else {
//       console.error("WebSocket is not open. Unable to send message:", message);
//       // Optionally, queue the message for later sending
//     }
//   },

//   close() {
//     if (this.socket) {
//       this.socket.close();
//     }
//   },
// };

// export default WebSocketService;
