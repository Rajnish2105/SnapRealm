"use client";

import { IconMessageCircle } from "@tabler/icons-react";
import { useEffect, useState, useRef } from "react";
import { useRecoilValue } from "recoil";
import { isCommentPosted } from "@/states/atom";
import Link from "next/link";
import { toast } from "sonner";

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
    <>
      <button className="focus:outline-none mb-1" disabled>
        <Link href={`/post/${postid}`}>
          <IconMessageCircle />
        </Link>
      </button>
      <p className="text-center">{isLoading ? "..." : numberOfComments}</p>
    </>
  );
}
