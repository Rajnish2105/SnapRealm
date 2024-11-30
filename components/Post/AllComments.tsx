"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useRecoilValue } from "recoil";
import { isCommentPosted } from "@/states/atom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import CustomLoader from "../CustomLoader";

type CommentType = {
  id: number;
  content: string;
  postid: number;
  author: {
    id: number;
    name: string;
    username: string;
    image: string;
  };
};

export default function AllComments({ postid }: { postid: string }) {
  const AllCommentsState = useRecoilValue(isCommentPosted);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    async function fetchAllComments() {
      const res = await fetch(`/api/posts/comments?postId=${postid}`, {
        method: "GET",
      });

      const { comments, message } = await res.json();
      if (!res.ok) {
        toast.error(message, {
          closeButton: true,
        });
      }
      setComments(comments);
      setIsLoading(false);
    }
    fetchAllComments();
  }, [AllCommentsState, postid]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <CustomLoader />
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="flex justify-center items-center w-full h-32 text-muted-foreground">
        Waiting for Your Comment...
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-200px)] w-full pr-4">
      <div className="space-y-4">
        {comments.map((comment: CommentType) => (
          <Card key={comment.id} className="bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-start space-x-4">
                <Avatar className="w-10 h-10">
                  <Image
                    src={
                      comment.author.image ||
                      `https://api.multiavatar.com/${comment.author.username}.svg`
                    }
                    alt={`${comment.author.username}'s avatar`}
                    fill
                  />
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/${comment.author.username}`}
                      className="font-medium text-sm hover:underline"
                    >
                      {comment.author.username}
                    </Link>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {comment.content}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
