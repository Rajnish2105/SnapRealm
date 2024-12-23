'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Heart } from 'lucide-react';

export default function Activities({
  comments,
  liked,
}: {
  comments: {
    content: string;
    postId: number;
  }[];
  liked: {
    postId: number;
    post: {
      title: string;
      media: string[];
      description: string | null;
    };
  }[];
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Activity Center</h2>
        <p className="text-muted-foreground">
          Your recent interactions and liked content
        </p>
      </div>
      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl flex items-center">
              <MessageCircle className="mr-2" />
              Your Comments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[250px] w-full pr-4">
              {comments && comments.length > 0 ? (
                comments.map((comment) => (
                  <Link
                    key={comment.postId}
                    href={`/post/${comment.postId}`}
                    className="block p-3 mb-2 rounded-lg hover:bg-accent transition-colors duration-200"
                  >
                    <p className="text-sm text-muted-foreground">
                      Post #{comment.postId}
                    </p>
                    <p className="mt-1">{comment.content}</p>
                  </Link>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  You haven&apos;t commented yet
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl flex items-center">
              <Heart className="mr-2" />
              Liked Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] w-full pr-4">
              {liked && liked.length > 0 ? (
                liked.map((post) => (
                  <Link
                    href={`/post/${post.postId}`}
                    className="flex p-3 mb-3 rounded-lg hover:bg-accent transition-colors duration-200"
                    key={post.postId}
                  >
                    <div className="rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={post.post.media[0]}
                        alt={post.post.title}
                        width={100}
                        height={100}
                        className="object-cover w-[100px] h-[100px]"
                      />
                    </div>
                    <div className="flex-grow ml-4">
                      <h3 className="text-lg font-semibold">
                        {post.post.title}
                      </h3>
                      {post.post.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {post.post.description}
                        </p>
                      )}
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  No liked posts yet
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
