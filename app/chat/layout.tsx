"use client";

import CustomLoader from "@/components/CustomLoader";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type friendstype = {
  following: {
    id: number;
    name: string;
    username: string;
    image: string;
  };
}[];

export default function ChatPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const [showInbox, setShowInbox] = useState(true);
  const [friends, setFriends] = useState<friendstype>();
  const [isloading, setIsloading] = useState<boolean>(false);
  //   const { socket, user, sendMessage } = useWebSocket();
  // const session = useSession();

  useEffect(() => {
    setIsloading(true);
    async function getUser() {
      const res = await fetch("/api/oneuser");
      if (!res.ok) {
        console.log("Error");
      }
      const { followers } = await res.json();
      setFriends(followers);
      setIsloading(false);
    }
    getUser();
  }, []);

  function handleChat(value: string) {
    if (value === "inbox") {
      setShowInbox(true);
    } else {
      setShowInbox(false);
    }
  }

  async function handleUserClick(id: number) {
    const res = await fetch(`/api/inbox?targetId=${id}`);
    if (!res.ok) {
      toast.error("Couldn't make inbox");
    }
    const reInbox = await res.json();
    console.log("the inbox", reInbox.inbox);
    router.push(`/chat/${reInbox.inbox.id}`);
  }

  return (
    <main className="w-full h-screen flex">
      <div className="w-[60px] overflow-hidden hover:w-[300px] h-full flex flex-col border-r-2 border-r-[rgba(255,255,255,0.5)] group transition-all duration-500 ease-in-out rounded-md">
        <div className="w-full my-6 flex justify-evenly border-b-2 boder-b-white text-white">
          <p
            className={`${
              showInbox
                ? "text-blue-500 border-b-2 border-b-blue-500"
                : "hidden group-hover:block"
            } hover:border-b-2 hover:border-b-white cursor-pointer`}
            onClick={() => handleChat("inbox")}
          >
            Inbox
          </p>
          <p
            className={`${
              !showInbox
                ? "text-blue-500 border-b-2 border-b-blue-500"
                : "hidden group-hover:block"
            } hover:border-b-2 hover:border-b-white cursor-pointer`}
            onClick={() => handleChat("request")}
          >
            Request
          </p>
        </div>
        <div className="w-full text-center">
          {showInbox && friends ? (
            <div className="flex w-full justify-center flex-col space-y-3 ml-2">
              {friends.map((friend) => {
                return (
                  <div
                    key={friend.following.id}
                    onClick={() => handleUserClick(friend.following.id)}
                    className="flex w-[300px] items-center cursor-pointer"
                  >
                    <div className="w-11 h-11 rounded-full mr-2 flex justify-center overflow-hidden">
                      <Image
                        src={
                          friend.following.image
                            ? friend.following.image
                            : `https://api.multiavatar.com/${friend.following.name}.svg` ||
                              "./defaultuser.svg"
                        }
                        alt="user image"
                        width={45}
                        height={20}
                      />
                    </div>
                    <div className="text-xs flex flex-col justify-center">
                      <p>{friend.following.username}</p>
                      <p className="text-[rgba(255,255,255,0.5)]">
                        {friend.following.name}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : isloading ? (
            <div className="w-full h-full flex justify-center items-center">
              <CustomLoader />
            </div>
          ) : (
            "No request yet in the box"
          )}
        </div>
      </div>

      {children}
    </main>
  );
}
