"use client";

import { useWebSocket } from "@/context/SocketContext";
import { IconSend } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function chatPage() {
  const [showInbox, setShowInbox] = useState(true);
  const [targetuser, setUser] = useState<any>();
  const { socket, user, sendMessage } = useWebSocket();
  const [isMessaging, setIsMessaging] = useState(false);
  const [msgState, setMsgState] = useState<string>("");

  const [chat, setChat] = useState<string[]>(["somethign"]);

  useEffect(() => {
    async function getUser() {
      const res = await fetch("api/oneuser");
      if (!res.ok) {
        console.log("Error");
      }
      const { user } = await res.json();
      setUser(user);
    }
    getUser();
  }, []);

  useEffect(() => {
    if (socket) {
      console.log("here");
      socket.onmessage = async (event) => {
        console.log(JSON.parse(event.data));

        const { type, data } = JSON.parse(event.data) || {};
        console.log(type, data);
        if (type === "inbox/something") {
          setChat((prev) => [...prev!, data.message]);
        }
      };
    }
  }, [socket]);

  function handleChat(value: string) {
    if (value === "inbox") {
      setShowInbox(true);
    } else {
      setShowInbox(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setMsgState(e.target.value);
  }

  function SendMsg() {
    sendMessage("send-msg-to", { inboxId: "something", message: msgState });
    setMsgState("");
  }

  function handleUserClick() {
    sendMessage("join-inbox", { userId: user!.id, inboxId: "something" });
    setIsMessaging(true);
  }

  if (targetuser) {
    return (
      <main className="w-full h-screen flex">
        <div className="w-[350px] h-full flex flex-col border border-r-slate-200">
          <div className="w-full flex justify-evenly my-6 border-b-2 boder-b-white text-white">
            <p
              className={`${
                showInbox && "text-blue-500 border-b-2 border-b-blue-500"
              } hover:border-b-2 hover:border-b-white cursor-pointer`}
              onClick={() => handleChat("inbox")}
            >
              Inbox
            </p>
            <p
              className={`${
                !showInbox && "text-blue-500 border-b-2 border-b-blue-500"
              } hover:border-b-2 hover:border-b-white cursor-pointer`}
              onClick={() => handleChat("request")}
            >
              Request
            </p>
          </div>
          <div className="w-full text-center">
            {showInbox ? (
              <div className="flex w-full justify-center space-y-3">
                <div
                  onClick={handleUserClick}
                  className="flex w-[80%] items-center cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-full mr-2 flex justify-center overflow-hidden">
                    <Image
                      src={
                        targetuser.image
                          ? targetuser.image
                          : `https://api.multiavatar.com/${targetuser.name}.svg` ||
                            "./defaultuser.svg"
                      }
                      alt="user image"
                      width={45}
                      height={20}
                    />
                  </div>
                  <div className="text-xs flex flex-col justify-center">
                    <p>{targetuser.username}</p>
                    <p className="text-[rgba(255,255,255,0.5)] pl-1">
                      {targetuser.name}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              "request box"
            )}
          </div>
        </div>

        <div className="flex-grow h-full flex justify-center items-center">
          {isMessaging && (
            <div className="w-full h-full relative">
              <div className="_allmessages">
                {/* //mapping over the Messages //if(user.id === sender) // div
                justify-self-right //else(user.id === reciver) // div
                justify-self-left */}
                {chat &&
                  chat.map((str) => {
                    return <p>{str}</p>;
                  })}
              </div>
              <div className="absolute bottom-3 w-full p-5">
                <div className="flex items-center">
                  <input
                    value={msgState}
                    onChange={handleChange}
                    type="text"
                    className="border border-[rbga(255,255,255,0.7)] rounded-full p-2 inline-block bg-transparent flex-grow"
                  />
                  <IconSend onClick={SendMsg} />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    );
  }
}
