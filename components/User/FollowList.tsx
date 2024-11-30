"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import Link from "next/link";

type Followertype = {
  followedBy: {
    id: number;
    name: string | null;
    username: string | null;
    image: string | null;
  };
  followedById: number;
}[];

type Followingtype = {
  following: {
    id: number;
    name: string | null;
    username: string | null;
    image: string | null;
  };
  followingId: number;
}[];

export function FollowerPopUp({ followers }: { followers: Followertype }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="link"
          className="font-semibold hover:[text-decoration:none] text-sm"
        >
          {followers.length} followers
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[90%] md:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">Followers</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[300px] pr-4">
          {followers.map((follower) => (
            <div
              key={follower.followedById}
              className="flex items-center justify-between py-3"
            >
              <Link
                href={`/${follower.followedBy.username}`}
                className="flex items-center gap-3"
              >
                <Avatar className="h-11 w-11">
                  <Image
                    src={
                      follower.followedBy.image ||
                      `https://api.multiavatar.com/${follower.followedBy.username}.svg`
                    }
                    width={160}
                    height={160}
                    className="rounded-full border border-gray-300"
                    alt={`${follower.followedBy.username}'s profile picture`}
                  />
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">
                    {follower.followedBy.username}
                  </span>
                  <span className="text-sm text-gray-500">
                    {follower.followedBy.name}
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export function FollowingPopUp({ following }: { following: Followingtype }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="link"
          className="font-semibold hover:[text-decoration:none] text-sm"
        >
          {following.length} following
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[90%] md:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">Following</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[300px] pr-4">
          {following.map((followedUser) => (
            <div
              key={followedUser.followingId}
              className="flex items-center justify-between py-3"
            >
              <Link
                href={`/${followedUser.following.username}`}
                className="flex items-center gap-3"
              >
                <Avatar className="h-11 w-11">
                  <Image
                    src={
                      followedUser.following.image ||
                      `https://api.multiavatar.com/${followedUser.following.username}.svg`
                    }
                    width={160}
                    height={160}
                    className="rounded-full border border-gray-300"
                    alt={`${followedUser.following.username}'s profile picture`}
                  />
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">
                    {followedUser.following.username}
                  </span>
                  <span className="text-sm text-gray-500">
                    {followedUser.following.name}
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
