"use client";

import { IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function PostDeleteButton({ postid }: { postid: number }) {
  const router = useRouter();

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
              router.push("/");
            },
          },
        });
      }}
    >
      <IconTrash size={15} className="inline-block" /> Delete
    </button>
  );
}
