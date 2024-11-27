"use client";

import CustomLoader from "@/components/CustomLoader";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type friendstype = {
  following: {
    id: number;
    name: string | null;
    username: string | null;
    image: string | null;
  };
}[];
type fanstype = {
  followedBy: {
    image: string;
    id: number;
    username: string;
    name: string;
  };
}[];

export default function ChatPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const [showInbox, setShowInbox] = useState<string>("inbox");
  const [friends, setFriends] = useState<friendstype | null>();
  const [myFans, setMyFans] = useState<fanstype | null>();
  const [isloading, setIsloading] = useState<boolean>(false);

  useEffect(() => {
    setIsloading(true);
    async function getUser() {
      const res = await fetch("/api/oneuser");
      if (!res.ok) {
        console.log("Error");
        return;
      }
      const { friends, onlyfans } = await res.json();
      setFriends(friends);
      setMyFans(onlyfans);
      setIsloading(false);
    }
    getUser();
  }, []);

  function handleChat(value: string) {
    if (value === "inbox") {
      setShowInbox("inbox");
    } else {
      setShowInbox("request");
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
      <div
        className={`${
          pathname === "/chat" ? "md:flex" : "hidden md:flex"
        } w-full md:w-[300px]  overflow-hidden h-full flex-col sm:border-r-2 md:border-r-[rgba(255,255,255,0.5)] rounded-md`}
      >
        <div className="w-full my-6 flex justify-evenly border-b-2 boder-b-white text-white">
          <p
            className={`${
              showInbox === "inbox" &&
              "text-blue-500 border-b-2 border-b-blue-500"
            } cursor-pointer`}
            onClick={() => handleChat("inbox")}
          >
            Inbox
          </p>
          <p
            className={`${
              showInbox === "request" &&
              "text-blue-500 border-b-2 border-b-blue-500"
            } cursor-pointer`}
            onClick={() => handleChat("request")}
          >
            Request
          </p>
        </div>
        <div className="w-full text-center">
          {showInbox === "inbox" ? (
            friends ? (
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
                            friend.following.image ||
                            `https://api.multiavatar.com/${friend.following.name}.svg` ||
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
            ) : (
              !isloading && "No friends"
            )
          ) : (
            isloading && (
              <div className="w-full h-full flex justify-center items-center">
                <CustomLoader />
              </div>
            )
          )}

          {showInbox == "request" ? (
            myFans ? (
              <div className="flex w-full justify-center flex-col space-y-3 ml-2">
                {myFans.map((fan) => {
                  return (
                    <div
                      key={fan.followedBy.id}
                      onClick={() => handleUserClick(fan.followedBy.id)}
                      className="flex w-[300px] items-center cursor-pointer"
                    >
                      <div className="w-11 h-11 rounded-full mr-2 flex justify-center overflow-hidden">
                        <Image
                          src={
                            fan.followedBy.image ||
                            `https://api.multiavatar.com/${fan.followedBy.name}.svg` ||
                            "./defaultuser.svg"
                          }
                          alt="user image"
                          width={45}
                          height={20}
                        />
                      </div>
                      <div className="text-xs flex flex-col justify-center">
                        <p>{fan.followedBy.username}</p>
                        <p className="text-[rgba(255,255,255,0.5)]">
                          {fan.followedBy.name}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              !isloading && "No fans"
            )
          ) : (
            isloading && (
              <div className="w-full h-full flex justify-center items-center">
                <CustomLoader />
              </div>
            )
          )}
        </div>
      </div>
      {children}
    </main>
  );
}
