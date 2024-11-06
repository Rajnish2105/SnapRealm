"use client";

import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { IconPlus } from "@tabler/icons-react";
import AllStories from "./AllStories";
import { toast } from "sonner";
import AddStories from "./AddStories";
import UserStory from "./UserStory";

type Storiestype = {
  stories: string[];
  user: { username: string; image: string };
};

export default function Stories() {
  const session = useSession();
  const [stories, setStories] = useState<Storiestype[]>([]);
  const [showStory, setShowStory] = useState<boolean>(false);
  const [addingStory, setAddingStory] = useState<boolean>(false);
  const [showUserStory, setShowUserStory] = useState<boolean>(false);

  useEffect(() => {
    async function getStories() {
      const res = await fetch("api/user/stories");
      if (!res.ok) {
        toast.error("Couldn't get stories", { closeButton: true });
      }
      const { stories } = await res.json();
      setStories(stories);
    }
  }, []);

  const handleStoryClick = () => {
    if (stories.length === 0) return;
    setShowStory((prev) => !prev);
  };

  function AddingStories() {
    setAddingStory((prev) => !prev);
  }

  function showingUserStory() {
    setShowUserStory((prev) => !prev);
  }

  if (stories.length === 0) {
    return (
      <div className="flex items-center mt-4 justify-start w-[80%] m-auto">
        <div className="h-16 w-16 border-2 border-red-500 rounded-full cursor-pointer relative">
          <Image
            src={
              session.data?.user?.image
                ? session.data?.user.image
                : `https://api.multiavatar.com/${session.data?.user?.name}.svg` ||
                  "./defaultuser.svg"
            }
            alt="user image"
            height={15}
            width={15}
            className="h-full w-full object-cover object-center rounded-full"
            onClick={showingUserStory}
          />
          <IconPlus
            size={15}
            onClick={AddingStories}
            className="absolute bottom-0 right-0 bg-blue-400 rounded-full"
          />
        </div>
        {/* <UserStory
          showUserStory={showUserStory}
          setShowUserStory={showingUserStory}
        /> */}
        <AddStories postStory={addingStory} setPostStory={AddingStories} />
      </div>
    );
  } else {
    return (
      <div className="flex items-center mt-4 justify-start w-[80%] m-auto">
        <AllStories
          stories={stories}
          isOpen={showStory}
          CloseStory={handleStoryClick}
        />
        <div
          id="content"
          className="flex space-x-4 h-20 overflow-x-auto whitespace-nowrap pt-2"
        >
          <div className="h-16 w-16 border-2 border-red-500 rounded-full cursor-pointer relative">
            <Image
              src={
                session.data?.user?.image
                  ? session.data?.user.image
                  : `https://api.multiavatar.com/${session.data?.user?.name}.svg` ||
                    "./defaultuser.svg"
              }
              alt="user image"
              height={15}
              width={15}
              className="h-full w-full object-cover object-center rounded-full"
              onClick={showingUserStory}
            />
            <IconPlus
              size={15}
              onClick={AddingStories}
              className="absolute bottom-0 right-0 bg-blue-400 rounded-full"
            />
          </div>
          <AddStories postStory={addingStory} setPostStory={AddingStories} />
          {stories.map((item, index) => (
            <div
              key={index}
              className="h-16 w-16 border-2 border-red-500 rounded-full overflow-hidden cursor-pointer"
              onClick={handleStoryClick}
            >
              <img
                src={item.user.image}
                alt={`story-${index}`}
                className="h-full w-full object-cover object-center rounded-full"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
}

// import { db } from "@/lib/db";
// import { toast } from "sonner";

// export default async function newNiggaPage() {
//   const allstories = await getStories();

//   const date = new Date(
//     allstories?.[0].createdAt.getTime()! + 24 * 60 * 60 * 1000
//   );

//   if (date > new Date()) {
//     console.log("Shown");
//   } else {
//     console.log("Hidden");
//   }
//   return <div>newnigga</div>;
// }

// async function getStories() {
//   try {
//     const allstories = await db.story.findMany({
//       where: {
//         userId: 9,
//       },
//     });
//     return allstories;
//   } catch (err) {
//     toast.error("alskhdf", { closeButton: true });
//   }
// }
