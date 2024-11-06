"use client";

import { useEffect, useState } from "react";
import { IconHeart } from "@tabler/icons-react";

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
      const response = await fetch(`/api/posts/like?postId=${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId }),
      });

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
    <>
      <button
        className="focus:outline-none"
        onClick={handleLike}
        disabled={loading}
      >
        <IconHeart
          className={`h-6 w-6`}
          stroke="red"
          fill={liked ? "red" : "none"}
        />
      </button>
      <p className="text-center">{loading ? "..." : numLikes}</p>
    </>
  );
}
