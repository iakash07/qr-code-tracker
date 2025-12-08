import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    if (!this.socket) {
      console.log('🔌 Connecting to socket server:', SOCKET_URL);
      
      this.socket = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 10,
        timeout: 20000
      });

      this.socket.on('connect', () => {
        console.log('✅ Socket connected successfully - ID:', this.socket.id);
      });

      this.socket.on('disconnect', (reason) => {
        console.log('❌ Socket disconnected:', reason);
      });

      this.socket.on('connect_error', (error) => {
        console.error('❌ Socket connection error:', error.message);
      });

      this.socket.on('reconnect', (attemptNumber) => {
        console.log('🔄 Socket reconnected after', attemptNumber, 'attempts');
      });

      this.socket.on('reconnect_attempt', (attemptNumber) => {
        console.log('🔄 Attempting to reconnect...', attemptNumber);
      });

      // Listen for scan updates
      this.socket.on('scan-update', (data) => {
        console.log('📡 Received scan-update:', data);
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      console.log('🔌 Disconnecting socket');
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    } else {
      console.warn('⚠️ Socket not connected. Call connect() first.');
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  emit(event, data) {
    if (this.socket && this.socket.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('⚠️ Socket not connected. Cannot emit event:', event);
    }
  }

  isConnected() {
    return this.socket && this.socket.connected;
  }
}

const socketService = new SocketService();

export default socketService;
