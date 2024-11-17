"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
// import useSWR from "swr";
import { toast } from "sonner";
import { useRecoilValue } from "recoil";
import { isCommentPosted } from "@/states/atom";

// const fetcher = (url: string) =>
//   fetch(url, { method: "GET" }).then((res) => res.json());

export default function AllComments({ postid }: { postid: string }) {
  const AllCommentsState = useRecoilValue(isCommentPosted);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    async function fetchallcomments() {
      const res = await fetch(`/api/posts/comments?postId=${postid}`, {
        method: "GET",
      });

      const { comments, message } = await res.json();
      if (!res.ok) {
        toast.error(`${message}`, {
          closeButton: true,
        });
      }
      setComments(comments);
    }
    fetchallcomments();
  }, [AllCommentsState, postid]);

  if (comments.length === 0) {
    return (
      <>
        <div className="h-0.5 bg-white w-full rounded-sm my-3" />
        <div className="text-[rgba(255,255,255,0.5)] flex justify-center items-center w-full">
          Waiting for Your Comment...
        </div>
      </>
    );
  }
  return (
    <div className="w-full overflow-hidden">
      <div className="h-0.5 bg-white w-full rounded-md my-3" />
      <ul className="flex flex-col space-y-4">
        {comments.map((comment: any) => {
          return (
            <li
              className="flex flex-wrap relative bg-[rgba(130,130,130,0.34)] p-2 rounded-sm"
              key={comment.id as string}
            >
              <div className="w-9 h-9 border-gray-100 border-2 rounded-full mr-2 flex justify-center overflow-hidden">
                <Image
                  src={
                    comment.author.image
                      ? comment.author.image
                      : `https://api.multiavatar.com/${comment.author.name}.svg` ||
                        "./defaultuser.svg"
                  }
                  alt="user image"
                  height={20}
                  width={35}
                />
              </div>
              <div className="w-[100%-2.25rem]">
                <Link
                  className="h-fit flex-grow text-sm rounded-sm"
                  href={`/${comment.author.username}`}
                >
                  {comment.author.username}
                </Link>
                <p>{comment.content}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
