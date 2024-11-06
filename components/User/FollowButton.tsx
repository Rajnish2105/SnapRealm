"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function FollowButton({
  isFollowing,
  userId,
}: {
  isFollowing: boolean;
  userId: number;
}) {
  const [followStatus, setFollowStatus] = useState<boolean>(isFollowing);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function handleFollow() {
    setIsLoading(true);
    setFollowStatus((prev) => !prev); //show
    const res = await fetch(
      `/api/user/follow?targetId=${userId}&followStatus=${followStatus}`,
      {
        method: "POST",
      }
    );
    if (!res.ok) {
      toast.error("Couldn't follow this account!!", {
        closeButton: true,
      });
      console.log(res);
      setFollowStatus((prev) => !prev); //db actual status
      return;
    }
    setIsLoading(false);
  }

  if (isLoading) {
    return (
      <button
        className="bg-transparent rounded-full outline-none px-2"
        disabled
      >
        Loading....
      </button>
    );
  }

  return (
    <button
      onClick={handleFollow}
      className="bg-transparent rounded-full outline-none px-2 text-blue-500"
    >
      {followStatus ? "Unfollow" : "+Follow"}
    </button>
  );
}
