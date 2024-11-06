"use client";

import { IconSettings } from "@tabler/icons-react";
import Image from "next/image";
import React from "react";

export default function UserProfile({
  name,
  username,
  image,
  numPosts,
  followers,
  following,
  bio,
}: {
  bio: string;
  following: number;
  followers: number;
  numPosts: number;
  username: string;
  name: string;
  image: string;
}) {
  return (
    <div className="flex justify-evenly mt-3 w-[70%]">
      <div className="w-[30%] flex items-center mt-8">
        <Image
          src={
            image !== null
              ? image
              : `https://api.multiavatar.com/${name!}.svg` || "/defaultuser.svg"
          }
          height={160}
          width={160}
          className="object-cover rounded-xl group-hover/card:shadow-xl"
          alt="thumbnail"
        />
      </div>
      <div className="mt-8 flex flex-col space-y-5 justify-start width-[70%]">
        <div className="flex space-x-5 items-center">
          <p className="text-lg">{username}</p>
          <button className="px-4 py-2 h-fit rounded-md bg-gray-400 text-black text-sm">
            Edit Profile
          </button>
          <IconSettings />
        </div>
        <div className="flex space-x-6 justify-between">
          <p>
            <span className="font-bold">{numPosts}</span> Posts
          </p>
          <p>
            <span className="font-bold">{followers}</span> Followers
          </p>
          <p>
            <span className="font-bold">{following}</span> Following
          </p>
        </div>
        <div>
          <p className="font-bold tracking-wide">{name}</p>
          <p className="text-[rgba(255,255,255,0.7)] text-sm">Member</p>
        </div>
        <div>
          <p>{bio}</p>
        </div>
      </div>
    </div>
  );
}
