"use client";
import { useState } from "react";
import { IconBookmark } from "@tabler/icons-react";
import { toast } from "sonner";

export default function SaveButton({
  userId,
  postId,
  hasUserSavedIt,
}: {
  hasUserSavedIt: boolean;
  userId: string;
  postId: number;
}) {
  const [isSaved, setIsSaved] = useState<boolean>(hasUserSavedIt);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true); // Set loading state when the button is clicked
    // Optimistically update the UI before the server response
    const newSavedState = !isSaved;
    setIsSaved(newSavedState);

    try {
      // Send request to save or unsave the post
      const res = await fetch(
        `/api/posts/savepost?userId=${userId}&postId=${postId}&isAlreadySaved=${isSaved}`,
        {
          method: "PUT",
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      }
    } catch (err) {
      console.log("Error", err);
      toast.error("Error updating save status.");
      // Rollback the optimistic update in case of error
      setIsSaved(isSaved);
    } finally {
      setLoading(false); // Reset loading state after request
    }
  }

  return (
    <button
      className="focus:outline-none ml-auto"
      onClick={handleClick}
      disabled={loading} // Disable button while loading
    >
      {loading ? "..." : <IconBookmark fill={isSaved ? "white" : "none"} />}
    </button>
  );
}
