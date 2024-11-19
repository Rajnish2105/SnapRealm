"use client";

import { useEffect, useState } from "react";
import { IconSettings, IconSend } from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useWebSocket } from "@/context/SocketContext";
import CustomLoader from "@/components/CustomLoader";
import { useRouter } from "next/navigation";

type inboxtype = {
  id: number;
  createdAt: Date;
  senderId: number;
  reciverId: number;
  receiver: {
    id: number;
    name: string | null;
    username: string;
    image: string | null;
  };
  sender: {
    id: number;
    name: string | null;
    username: string;
    image: string | null;
  };
};

type chattype = {
  senderId: number;
  content: string;
};

export default function ChatRoomPage({
  params,
}: {
  params: { inboxId: string };
}) {
  const router = useRouter();
  const { socket, user, sendMessage } = useWebSocket();
  const [msgState, setMsgState] = useState<string>("");
  const [inbox, setInbox] = useState<inboxtype>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { inboxId } = params;

  if (!inboxId || !user) {
    router.push("/signup");
  }

  const [chat, setChat] = useState<chattype[]>();

  useEffect(() => {
    setIsLoading(true);
    async function getInbox() {
      const res = await fetch(`/api/inbox/findInbox?inboxId=${inboxId}`);
      if (!res.ok) {
        toast.error("Couldn't find the inbox");
      }
      const { Inbox } = await res.json();

      // console.log("the found Inbox");
      setInbox(Inbox);
      setChat(Inbox.messages);
      setIsLoading(false);
    }
    getInbox();
  }, [inboxId, user?.id]);

  useEffect(() => {
    if (socket) {
      console.log("here");
      socket.onmessage = async (event) => {
        console.log(JSON.parse(event.data));

        const { type, data } = JSON.parse(event.data) || {};
        console.log(type, data);
        if (type === `inbox/${inboxId}`) {
          if (chat?.length === 0) {
            setChat([{ senderId: data.senderId, content: data.content }]);
          } else {
            setChat((prev) => [
              ...prev!,
              { senderId: data.senderId, content: data.message },
            ]);
          }
        }
      };
    }
  }, [socket, inboxId, chat?.length]);

  // console.log("the chat", chat);

  useEffect(() => {
    sendMessage("join-inbox", { userId: user?.id, inboxId: inboxId });
  }, [inboxId, sendMessage, user?.id]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setMsgState(e.target.value);
  }

  async function SendMsg(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const res = await fetch(`/api/inbox/sendmsg?inboxId=${inboxId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ msg: msgState }),
    });

    sendMessage("send-msg-to", {
      inboxId: inboxId,
      message: msgState,
      senderId: user?.id,
    });

    if (!res.ok) {
      const { message } = await res.json();
      toast.error(message, { closeButton: true });
      return;
    }

    setMsgState("");
  }

  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <CustomLoader />
      </div>
    );
  }

  if (inbox) {
    let me;
    if (inbox.receiver.id != user?.id) me = inbox.receiver;
    else me = inbox.sender;
    return (
      <div className="h-full flex justify-center items-center w-full">
        <div className="w-full h-full">
          <div className="w-full flex justify-between items-center p-4 border-b-2 border-b-[rgba(255,255,255,0.2)]">
            <Link href={`/${me.username}`}>
              <div className="flex items-center cursor-pointer">
                <div className="w-11 h-11 rounded-full mr-2 flex justify-center overflow-hidden">
                  <Image
                    src={
                      me.image
                        ? me.image
                        : `https://api.multiavatar.com/${me.name}.svg` ||
                          "./defaultuser.svg"
                    }
                    alt="user image"
                    width={45}
                    height={20}
                  />
                </div>
                <div className="text-xs flex flex-col justify-center">
                  <p>{me.username}</p>
                  <p className="text-[rgba(255,255,255,0.5)]">
                    {me.name || "Know more about this user..."}
                  </p>
                </div>
              </div>
            </Link>

            <div>
              <IconSettings />
            </div>
          </div>
          <div className="_allmessages flex h-[79%] h-min-full flex-col overflow-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
            {chat &&
              chat.map((msg, i) => {
                return (
                  <div
                    key={i}
                    className={`w-full h-fit flex ${
                      msg.senderId == user?.id ? "justify-end" : "justify-start"
                    }`}
                  >
                    <p
                      className={`border border-[rgba(255,255,255,0.5)] rounded-full m-2 p-2 px-4 w-fit h-fit text-sm`}
                      key={i}
                    >
                      {msg.content}
                    </p>
                  </div>
                );
              })}
          </div>
          <div className="w-full py-3 px-5">
            <form onSubmit={SendMsg} className="flex items-center">
              <input
                value={msgState}
                onChange={handleChange}
                type="text"
                autoFocus
                className="border border-[rbga(255,255,255,0.7)] rounded-full mx-2 p-2 pl-4 inline-block bg-transparent flex-grow"
              />
              <button
                type="submit"
                className="border-none outline-none bg-transparent"
              >
                <IconSend />
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
