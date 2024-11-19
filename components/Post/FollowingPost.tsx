import { db } from "@/lib/db";
import Image from "next/image";
import Link from "next/link";
import CommentButton from "../CommentButton";
import LikeButton from "../LikeButton";
import PostImages from "../PostImages";
import FollowButton from "../User/FollowButton";
import { PostDropDown } from "./PostDropDown";
import PostShare from "./PostShare";
import SaveButton from "./SaveButton";

export default async function FollowingPost({ userId }: { userId: string }) {
  const follwersPost = await db.post.findMany({
    where: {
      author: {
        followedBy: {
          some: {
            followingId: parseInt(userId),
          },
        },
      },
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
          following: {
            where: {
              followedById: parseInt(userId), // current user's ID
            },
            select: {
              followingId: true, // Get the IDs of the users that are being followed
            },
          },
        },
      },
      likedby: true,
      savers: true,
      _count: {
        select: {
          likedby: true,
          comments: true,
        },
      },
    },
  });

  if (!follwersPost || FollowingPost.length === 0) {
    return;
  }

  return (
    <div className="w-full h-screen flex flex-col space-y-7">
      {follwersPost.map(async (post) => {
        const hasUserLikedIt = post.likedby.some(
          (like) => like.userId === parseInt(userId)
        );
        const hasUserSavedIt = post.savers.some(
          (saver) => saver.id === Number(userId)
        );
        const isFollowing = post.author.following.length > 0;
        return (
          <div
            key={post.id}
            className="w-full h-full flex justify-center flex-col min-w-[360px] max-w-[960px]"
          >
            <main className="flex-grow w-[80%] m-auto">
              <div className="flex flex-col space-y-1 p-4 relative">
                <div className="text-xs rounded-md w-full px-1 flex justify-between text-gray-400  items-center">
                  <Link
                    className="flex justify-start items-center w-[250px]"
                    href={`/${post.author.username}`}
                  >
                    <div className="w-10 h-10 rounded-full mr-2 flex justify-center overflow-hidden">
                      <Image
                        src={
                          post.author.image !== null
                            ? post.author.image
                            : `https://api.multiavatar.com/${post.author
                                .name!}.svg` || "/defaultuser.svg"
                        }
                        alt="user image"
                        width={40}
                        height={20}
                      />
                    </div>
                    <p className="w-fit">{post.author.username}</p>
                    <div className="ml-2">
                      <FollowButton
                        isFollowing={isFollowing}
                        userId={post.authorId}
                      />
                    </div>
                  </Link>
                  <PostDropDown
                    authorName={post.author.username!}
                    postid={post.id}
                    authorid={post.author.id}
                  />
                </div>
                <div className="w-full rounded-md overflow-hidden">
                  <PostImages images={post.media} />
                </div>
                <div className="flex items-center gap-2">
                  <div>
                    <LikeButton
                      hasUserLikedIt={hasUserLikedIt}
                      numberOfLikes={post._count.likedby}
                      userId={userId}
                      postId={post.id}
                    />
                  </div>
                  <div>
                    <CommentButton
                      numComments={post._count.comments}
                      postid={post.id}
                    />
                  </div>
                  <button className="focus:outline-none">
                    <PostShare postid={post.id} />
                  </button>
                  <SaveButton
                    hasUserSavedIt={hasUserSavedIt}
                    userId={userId}
                    postId={post.id}
                  />
                </div>
                <p className="text-sm text-gray-500">
                  <em>
                    Posted on{" "}
                    {new Date(post.createdAt).toLocaleDateString("en-GB")}
                  </em>
                </p>
                <div className="flex items-center gap-2">
                  <strong className="font-medium text-gray-600">
                    {post.author.username}
                  </strong>
                  <p className="text-sm text-white">{post.description}</p>
                </div>
              </div>
            </main>
          </div>
        );
      })}
    </div>
  );
}
