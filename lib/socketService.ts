'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

// Define message event types
export interface MessageEvent {
  threadId: string;
  message: {
    _id: string;
    authorHandle: string;
    content: string;
    created: string;
    parentId?: string;
  };
}

// Make socket a local variable inside the hook so each component gets its own instance
export const useSocket = (threadId?: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only create a socket connection in the browser environment
    if (typeof window === 'undefined') {
      return;
    }

    // Initialize socket if it doesn't exist
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || window.location.origin;
    const socketInstance = io(socketUrl, {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      autoConnect: true,
      withCredentials: true,
    });

    setSocket(socketInstance);

    // Set up event listeners
    socketInstance.on('connect', () => {
      setIsConnected(true);
      setError(null);
      
      // Join thread room if a threadId is provided
      if (threadId) {
        socketInstance.emit('join-thread', threadId);
      }
    });

    socketInstance.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
      setError('Failed to connect to chat server');
      setIsConnected(false);
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });

    // Join thread room when threadId changes
    if (isConnected && threadId) {
      socketInstance.emit('join-thread', threadId);
    }

    // Clean up
    return () => {
      if (threadId) {
        socketInstance.emit('leave-thread', threadId);
      }
      
      socketInstance.off('connect');
      socketInstance.off('disconnect');
      socketInstance.off('connect_error');
      socketInstance.disconnect();
    };
  }, [threadId]);

  // Function to send a message
  const sendMessage = (data: {
    threadId: string;
    content: string;
    parentId?: string;
  }) => {
    if (!socket?.connected) {
      setError('Not connected to chat server');
      return false;
    }

    socket.emit('send-message', data);
    return true;
  };

  return {
    socket,
    isConnected,
    error,
    sendMessage,
  };
}; 