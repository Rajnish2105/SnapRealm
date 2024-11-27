import React, { createContext, useContext, useEffect, useState } from "react";

import { useSession } from "next-auth/react";
import { User } from "next-auth";

// Define the context type
type WebSocketContextType = {
  socket: WebSocket | null;
  user: Usertype | null;
  connectionError: boolean;
};

type Usertype = {
  id: string;
  name: string | null;
  username: string;
  email: string;
  provider: string;
};

// Create the WebSocket context
const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  user: null,
  connectionError: false,
});

// Create a provider component
export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [user, setUser] = useState<Usertype | null>(null);
  const [connectionError, setConnectionError] = useState(false);
  const [reconnectionAttempt, setReconnectionAttempt] = useState(0);
  const session = useSession();
  //   console.log(socket)
  // console.log(session.data?.user);
  useEffect(() => {
    console.log(
      "useEffect triggered with session user ID:",
      session.data?.user?.id
    );

    if (!socket && session.data?.user?.id) {
      console.log("Creating new WebSocket connection...");

      const ws = new WebSocket(process.env.NEXT_PUBLIC_WSS_URL as string);

      ws.onopen = () => {
        console.log("WebSocket connected.");
        setSocket(ws);
        setUser(session.data?.user as Usertype);
        setConnectionError(false);
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected, attempting to reconnect...");
        setSocket(null);

        // Increment the reconnection attempt counter to trigger re-render
        setTimeout(() => {
          if (!socket) {
            console.log("Reconnecting WebSocket...");
            setReconnectionAttempt((prev) => prev + 1);
          }
        }, 3000);
      };

      ws.onerror = () => {
        console.log("WebSocket encountered an error.");
        setSocket(null);
        setConnectionError(true);
      };

      return () => {
        console.log("Cleaning up WebSocket...");
        ws.close();
      };

      // Cleanup function to close the WebSocket connection
    }
  }, [session.data?.user?.id, reconnectionAttempt]);

  return (
    <WebSocketContext.Provider
      value={{
        socket,
        user,
        connectionError,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

// Create a custom hook to use the WebSocket context
export const useWebSocket = () => {
  const { socket, user, connectionError } = useContext(WebSocketContext);
  const sendMessage = (type: string, data: { [key: string]: any }) => {
    console.log("Sending message:", { type, data });
    socket?.send(
      JSON.stringify({
        type,
        data,
      })
    );
  };

  return { socket, sendMessage, user, connectionError };
};
