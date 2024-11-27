"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import FollowButton from "./User/FollowButton";
import { FollowerPopUp, FollowingPopUp } from "./User/FollowList";

export default function UserProfile({
  id,
  sessionid,
  name,
  username,
  image,
  numPosts,
  followers,
  following,
  bio,
  isUserProfile,
  isFollowing,
}: {
  sessionid: number;
  id: number;
  isFollowing: boolean;
  isUserProfile: boolean;
  bio: string;
  following: {
    followedBy: {
      id: number;
      name: string | null;
      username: string | null;
      image: string | null;
    };
    followedById: number;
  }[];
  followers: {
    following: {
      image: string | null;
      name: string | null;
      id: number;
      username: string | null;
    };
    followingId: number;
  }[];
  numPosts: number;
  username: string;
  name: string;
  image: string;
}) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
        <div className="w-32 h-32 md:w-40 md:h-40 flex-shrink-0">
          <Image
            src={image || `https://api.multiavatar.com/${name}.svg`}
            width={160}
            height={160}
            className="rounded-full border border-gray-300"
            alt={`${name}'s profile picture`}
          />
        </div>
        <div className="flex-1">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-4">
            <h1 className="text-xl font-normal">{username}</h1>
            <div className="flex gap-2">
              {isUserProfile ? (
                <Button
                  variant="secondary"
                  className="h-8 text-sm font-semibold"
                >
                  Edit Profile
                </Button>
              ) : (
                <FollowButton userId={id} isFollowing={isFollowing} />
              )}

              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="flex justify-center md:justify-start gap-8 mb-4">
            <span className="font-semibold text-sm p-2">
              <strong>{numPosts}</strong> posts
            </span>
            <span>
              <FollowingPopUp following={followers} sessionid={sessionid} />
            </span>
            <span>
              <FollowerPopUp followers={following} sessionid={sessionid} />
            </span>
          </div>
          <div className="text-center md:text-left">
            <h2 className="font-semibold">{name}</h2>
            <p className="whitespace-pre-wrap">{bio}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
