"use client";

import { useEffect, useState } from "react";
import { IconHeart } from "@tabler/icons-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";

export default function LikeButton({
  numberOfLikes,
  userId,
  postId,
  hasUserLikedIt,
}: {
  hasUserLikedIt: boolean;
  numberOfLikes: number;
  userId: string;
  postId: number;
}) {
  const [liked, setLiked] = useState(hasUserLikedIt);
  const [loading, setLoading] = useState(false);
  const [numLikes, setNumLikes] = useState<number>(numberOfLikes);

  useEffect(() => {
    setLiked(hasUserLikedIt);
    setNumLikes(numberOfLikes);
  }, [hasUserLikedIt, numberOfLikes]);

  const handleLike = async () => {
    setLoading(true);
    setLiked((prev) => !prev);

    try {
      const response = await fetch(
        `/api/posts/like?postId=${postId}&userId=${userId}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        toast.error("Can't like this post right now", { closeButton: true });
      }

      const data = await response.json();
      setLiked(data.liked);
      setNumLikes((prev) => (data.liked ? prev + 1 : prev - 1));
    } catch (error) {
      console.error("Error liking post:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button
        className={cn(
          "p-2 rounded-full transition-all duration-300 ease-in-out",
          "hover:bg-red-100 dark:hover:bg-red-900/30",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-opacity-50",
          loading && "animate-pulse"
        )}
        onClick={handleLike}
        disabled={loading}
        aria-label={liked ? "Unlike" : "Like"}
      >
        <Heart
          className={cn(
            "h-6 w-6 transition-all duration-300",
            liked ? "fill-red-500 text-red-500" : "text-gray-500",
            liked && "scale-110"
          )}
        />
        <span className="sr-only">{liked ? "Unlike" : "Like"}</span>
      </button>
      <p className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-300">
        {loading ? (
          <span className="inline-block w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        ) : (
          <span className="inline-flex items-center">
            {numLikes}
            <span className="sr-only"> likes</span>
          </span>
        )}
      </p>
    </div>
  );
}
