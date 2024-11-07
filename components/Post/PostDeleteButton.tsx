"use client";

import { IconTrash } from "@tabler/icons-react";
import { redirect } from "next/navigation";
import React from "react";
import { toast } from "sonner";

export default function PostDeleteButton({ postid }: { postid: number }) {
  return (
    <button
      onClick={() => {
        toast("Are you sure You want to delete this post?", {
          action: {
            label: "Yes",
            onClick: async () => {
              const res = await fetch(`/api/posts/delete?postId=${postid}`);
              if (!res.ok) {
                toast.error("Couldn't delete your post at the moment!");
              }
              redirect("/");
            },
          },
        });
      }}
    >
      <IconTrash size={15} className="inline-block" /> Delete
    </button>
  );
}
