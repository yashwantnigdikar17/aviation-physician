// // services/SocketManager.js
// import { io } from 'socket.io-client';

// export const SOCKET_URL = 'https://jitsiapi.databin.in'; // ← replace

// class SocketManager {
//   constructor() {
//     this.socket = null;
//   }

//   // ─────────────────────────────────────────────
//   // CONNECT  — call once after login/auth
//   // ─────────────────────────────────────────────
//   connect(userId) {
//     if (this.socket?.connected) return;

//     this.socket = io(SOCKET_URL, {
//       transports: ['websocket'],
//       query: { userId },           // backend maps socketId ↔ userId
//       reconnection: true,
//       reconnectionAttempts: 10,
//       reconnectionDelay: 2000,
//     });

//     this.socket.on('connect', () =>
//       console.log('✅ Socket connected:', this.socket.id)
//     );
//     this.socket.on('disconnect', (r) =>
//       console.log('❌ Socket disconnected:', r)
//     );
//     this.socket.on('connect_error', (e) =>
//       console.error('Socket error:', e.message)
//     );
//   }

//   disconnect() {
//     this.socket?.disconnect();
//     this.socket = null;
//   }

//   isConnected() {
//     return this.socket?.connected ?? false;
//   }

//   // ─────────────────────────────────────────────
//   // EMIT — caller (doctor) side
//   // ─────────────────────────────────────────────
//   callUser({ callerId, callerName, receiverId, roomId }) {
//     this.socket?.emit('call_user', {
//       callerId,
//       callerName,
//       receiverId,
//       roomId,
//     });
//   }

//   cancelCall({ callId, receiverId }) {
//     this.socket?.emit('cancel_call', { callId, receiverId });
//   }

//   // ─────────────────────────────────────────────
//   // EMIT — receiver (nurse/crew) side
//   // ─────────────────────────────────────────────
//   acceptCall({ callId, roomId, callerId }) {
//     this.socket?.emit('accept_call', { callId, roomId, callerId });
//   }

//   rejectCall({ callId, callerId }) {
//     this.socket?.emit('reject_call', { callId, callerId });
//   }

//   // ─────────────────────────────────────────────
//   // EMIT — either side
//   // ─────────────────────────────────────────────
//   endCall({ callId, roomId }) {
//     this.socket?.emit('end_call', { callId, roomId });
//   }

//   // ─────────────────────────────────────────────
//   // LISTENERS
//   // ─────────────────────────────────────────────
//   onIncomingCall(cb)    { this.socket?.on('incoming_call', cb); }
//   onCallAccepted(cb)    { this.socket?.on('call_accepted', cb); }
//   onCallRejected(cb)    { this.socket?.on('call_rejected', cb); }
//   onCallEnded(cb)       { this.socket?.on('call_ended', cb); }
//   onCallCancelled(cb)   { this.socket?.on('call_cancelled', cb); }

//   off(event) {
//     this.socket?.off(event);
//   }

//   offAll() {
//     ['incoming_call', 'call_accepted', 'call_rejected',
//      'call_ended', 'call_cancelled'].forEach((e) => this.socket?.off(e));
//   }
// }

// export default new SocketManager(); // singleton
// services/SocketManager.js
import { io } from 'socket.io-client';

export const SOCKET_URL = 'http://jitsiapi.databin.in';

class SocketManager {
  constructor() {
    this.socket = null;
    this.userId = null;
    this.fcmToken = null;
  }

  // ─────────────────────────────────────────────
  // CONNECT — call once after login/auth
  // ─────────────────────────────────────────────
  // connect(userId, fcmToken = null) {
  //   if (this.socket?.connected) return;

  //   this.userId = userId;
  //   this.fcmToken = fcmToken;

  //   this.socket = io(SOCKET_URL, {
  //     transports: ["polling", "websocket"],
  //     reconnection: true,
  //     reconnectionAttempts: 10,
  //     reconnectionDelay: 2000,
  //   });

  //   this.socket.on('connect', () => {
  //     console.log('✅ Socket connected:', this.socket.id);

  //     // 🔥 IMPORTANT: register user (required by your backend)
  //     this.socket.emit('register_user', {
  //       userId: String(this.userId),
  //       fcmToken: this.fcmToken,
  //     });
  //   });

  //   this.socket.on('disconnect', (reason) => {
  //     console.log('❌ Socket disconnected:', reason);
  //   });

  //   this.socket.on('connect_error', (error) => {
  //     console.error('Socket error:', error.message);
  //   });
  // }
  connect(userId, fcmToken = null) {
  if (this.socket?.connected) return;

  console.log("🔌 Connecting socket...");

  this.socket = io("https://jitsiapi.databin.in", {
    transports: ["polling", "websocket"],
    timeout: 20000,
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 2000,

    query: {
      userId: String(userId),
    },
  });

  this.socket.on("connect", () => {
    console.log("✅ CONNECTED");
    console.log("Socket ID:", this.socket.id);

    this.socket.emit("register_user", {
      userId: String(userId),
      fcmToken,
    });
  });

  this.socket.on("disconnect", (reason) => {
    console.log("❌ DISCONNECTED:", reason);
  });

  this.socket.on("connect_error", (err) => {
    console.log("❌ CONNECT ERROR");
    console.log(err.message);
    console.log(err.description);
    console.log(err.context);
  });

  this.socket.on("error", (err) => {
    console.log("❌ SOCKET ERROR:", err);
  });

  this.socket.io.on("reconnect_attempt", () => {
    console.log("🔄 reconnect_attempt");
  });

  this.socket.io.on("reconnect_error", (err) => {
    console.log("❌ reconnect_error", err);
  });
}

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }

  isConnected() {
    return this.socket?.connected ?? false;
  }

  // ─────────────────────────────────────────────
  // EMIT — caller (doctor) side
  // ─────────────────────────────────────────────
  callUser({ callerId, callerName, receiverId, roomId }) {
    if (!this.socket?.connected) {
      console.log('❌ Socket not connected (callUser)');
      return;
    }

    this.socket.emit('call_user', {
      // Keep both key styles for backend compatibility
      fromUserId: String(callerId),
      toUserId: String(receiverId),
      callerId: String(callerId),
      receiverId: String(receiverId),
      callerName,
      roomId,
    });
  }

  cancelCall({ callId, receiverId }) {
    if (!this.socket?.connected) return;

    this.socket.emit('cancel_call', {
      callId,
      toUserId: String(receiverId),
    });
  }

  // ─────────────────────────────────────────────
  // EMIT — receiver side
  // ─────────────────────────────────────────────
  acceptCall({ callId, roomId, callerId }) {
    if (!this.socket?.connected) return;

    this.socket.emit('accept_call', {
      // Keep both key styles for backend compatibility
      fromUserId: String(callerId),
      callerId: String(callerId),
      callId,
      roomId,
    });
  }

  rejectCall({ callId, callerId }) {
    if (!this.socket?.connected) return;

    this.socket.emit('reject_call', {
      // Keep both key styles for backend compatibility
      fromUserId: String(callerId),
      callerId: String(callerId),
      callId,
    });
  }

  // ─────────────────────────────────────────────
  // EMIT — either side
  // ─────────────────────────────────────────────
  endCall({ callId, roomId, toUserId }) {
    if (!this.socket?.connected) return;

    this.socket.emit('end_call', {
      toUserId: String(toUserId),
      roomId,
    });
  }

  // ─────────────────────────────────────────────
  // LISTENERS
  // ─────────────────────────────────────────────
  onIncomingCall(cb)    { this.socket?.on('incoming_call', cb); }
  onCallAccepted(cb)    { this.socket?.on('call_accepted', cb); }
  onCallRejected(cb)    { this.socket?.on('call_rejected', cb); }
  onCallEnded(cb)       { this.socket?.on('call_ended', cb); }
  onCallCancelled(cb)   { this.socket?.on('call_cancelled', cb); }

  off(event) {
    this.socket?.off(event);
  }

  offAll() {
    [
      'incoming_call',
      'call_accepted',
      'call_rejected',
      'call_ended',
      'call_cancelled',
    ].forEach((e) => this.socket?.off(e));
  }
}

export default new SocketManager();