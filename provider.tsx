"use client";
import { SessionProvider } from "next-auth/react";
import { RecoilRoot } from "recoil";
import { WebSocketProvider } from "./context/SocketContext";
export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <RecoilRoot>
      <SessionProvider>
        <WebSocketProvider>{children}</WebSocketProvider>
      </SessionProvider>
    </RecoilRoot>
  );
};
