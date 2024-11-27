"use client";

import { IconMessageCircle } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";
import { useRecoilValue } from "recoil";
import { isCommentPosted } from "@/states/atom";
import Link from "next/link";
import { toast } from "sonner";
import { MessageCircle } from "lucide-react";

export default function CommentButton({
  postid,
  numComments,
}: {
  numComments: number;
  postid: number;
}) {
  const AllCommentState = useRecoilValue(isCommentPosted);
  const [numberOfComments, setNumberOfComments] = useState(numComments);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Ref to track initial render
  const isInitialRender = useRef(true);

  useEffect(() => {
    // Skip the fetch on initial render
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    async function CommentCount() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/posts/comments/count?postId=${postid}`);
        if (!res.ok) {
          toast.error("error using api");
          return;
        }
        const { num } = await res.json();
        setNumberOfComments(num);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }
    CommentCount();
  }, [postid, AllCommentState]);

  return (
    <div className="flex flex-col items-center">
      <Link href={`/post/${postid}`} passHref>
        <button
          className={cn(
            "p-2 rounded-full transition-all duration-300 ease-in-out",
            "hover:bg-blue-100 dark:hover:bg-blue-900/30",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-opacity-50"
          )}
          aria-label="View comments"
        >
          <MessageCircle
            className={cn(
              "h-6 w-6 transition-all duration-300",
              "text-gray-500 hover:text-blue-500 dark:hover:text-blue-400"
            )}
          />
          <span className="sr-only">View comments</span>
        </button>
      </Link>
      <p className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-300">
        {isLoading ? (
          <span className="inline-block w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        ) : (
          <span className="inline-flex items-center">
            {numberOfComments}
            <span className="sr-only"> comments</span>
          </span>
        )}
      </p>
    </div>
  );
}
