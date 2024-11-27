"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid, Bookmark } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function UserMemories({
  allposts,
  savedposts,
  userid,
  sessionid,
}: {
  userid: number;
  sessionid: number;
  allposts: { id: number; media: string[] }[];
  savedposts: { id: number; media: string[] }[];
}) {
  return (
    <Tabs defaultValue="posts" className="w-full">
      <TabsList className="w-full justify-center">
        <TabsTrigger value="posts" className="flex items-center gap-2">
          <Grid className="h-4 w-4" />
          POSTS
        </TabsTrigger>
        {sessionid === userid && (
          <TabsTrigger value="saved" className="flex items-center gap-2">
            <Bookmark className="h-4 w-4" />
            SAVED
          </TabsTrigger>
        )}
      </TabsList>
      <TabsContent value="posts">
        {allposts.length !== 0 ? (
          <PostGrid posts={allposts} />
        ) : (
          <Empty what="Make" />
        )}
      </TabsContent>
      {sessionid === userid && (
        <TabsContent value="saved">
          {savedposts.length !== 0 ? (
            <PostGrid posts={savedposts} />
          ) : (
            <Empty what="Save" />
          )}
        </TabsContent>
      )}
    </Tabs>
  );
}

function PostGrid({ posts }: { posts: { id: number; media: string[] }[] }) {
  return (
    <>
      <div className="grid grid-cols-3 gap-1">
        {posts.map((post) => (
          <Link key={post.id} href={`/post/${post.id}`}>
            <div className="aspect-square bg-gray-200 relative">
              <Image
                src={post.media[0]}
                alt={`Post ${post.id}`}
                layout="fill"
                objectFit="cover"
              />
            </div>
          </Link>
        ))}
      </div>
      <h1 className="w-full text-sm text-center my-3">End of the Memories</h1>
    </>
  );
}

function Empty({ what }: { what: string }) {
  return (
    <div className="w-full py-8 text-center text-gray-500">
      No Memories Yet..
      <Link className="text-blue-500 hover:underline" href="/post">
        {" "}
        {what} New Memories
      </Link>
    </div>
  );
}
