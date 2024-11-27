"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2, UserPlus, UserMinus } from "lucide-react";

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
    setFollowStatus((prev) => !prev); // Optimistic update

    try {
      const res = await fetch(
        `/api/user/follow?targetId=${userId}&followStatus=${followStatus}`,
        {
          method: "POST",
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update follow status");
      }
    } catch (error) {
      toast.error("Couldn't update follow status", {
        description: "Please try again later.",
      });
      setFollowStatus((prev) => !prev); // Revert optimistic update
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      onClick={handleFollow}
      disabled={isLoading}
      variant={followStatus ? "outline" : "default"}
      size="sm"
      className="w-24 h-8 text-xs font-semibold bg-transparent text-white hover:text-black"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : followStatus ? (
        <>
          <UserMinus className="mr-1 h-3 w-3" />
          Unfollow
        </>
      ) : (
        <>
          <UserPlus className="mr-1 h-3 w-3" />
          Follow
        </>
      )}
    </Button>
  );
}
