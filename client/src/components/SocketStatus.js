import React, { useState, useEffect } from 'react';
import socketService from '../services/socket';
import './SocketStatus.css';

const SocketStatus = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = socketService.connect();

    const handleConnect = () => {
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    // Set initial state
    setIsConnected(socket.connected);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
    };
  }, []);

  return (
    <div className={`socket-status ${isConnected ? 'connected' : 'disconnected'}`}>
      <div className="status-indicator"></div>
      <span className="status-text">
        {isConnected ? 'Live Updates Active' : 'Connecting...'}
      </span>
    </div>
  );
};

export default SocketStatus;
