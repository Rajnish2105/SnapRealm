"use client";

import { isCommentPosted } from "@/states/atom";
import { IconSend } from "@tabler/icons-react";
import { useState, useRef } from "react";
import { useSetRecoilState } from "recoil";
import { toast } from "sonner";
import CustomLoader from "../CustomLoader";

export default function NewCommentsForm({
  postid,
  userid,
}: {
  postid: string;
  userid: string;
}) {
  const setCommentPosted = useSetRecoilState(isCommentPosted);
  const [content, setContent] = useState<string>("");
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const textarea = textAreaRef.current;
    setContent(e.target.value);

    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!content || content.trim().length === 0) {
      return;
    }

    try {
      setIsPosting(true);
      const response = await fetch(
        `/api/posts/comments?userId=${userid}&postId=${postid}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(content),
        }
      );

      if (response.ok) {
        toast.success("Comment posted successfully");
        setCommentPosted((prev) => !prev);
        setContent("");
        if (textAreaRef.current) {
          textAreaRef.current.style.height = "auto";
        }
      } else {
        toast.error("Error creating the comment");
      }
    } catch (err) {
      console.log("Error", err);
      toast.error("Error creating the comment", {
        closeButton: true,
      });
    } finally {
      setIsPosting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full flex">
      <textarea
        className="dark bg-transparent text-white flex-grow w-[80%] p-3 border border-gray-300 rounded-lg focus:outline-none overflow-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        id="content"
        name="content"
        placeholder="Say few words about the post,,,"
        rows={1}
        value={content}
        onChange={handleChange}
        ref={textAreaRef} // Assign the ref to the textarea
      />
      <button
        disabled={!content.length || isPosting}
        type="submit"
        className="px-4 py-2 rounded-md border border-black text-white text-sm transition duration-200 h-10 ml-2 cursor-pointer"
      >
        {isPosting ? <CustomLoader /> : <IconSend />}
      </button>
    </form>
  );
}
