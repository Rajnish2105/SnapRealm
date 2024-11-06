import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
//ui
import { PostDropDown } from "@/components/Post/PostDropDown";
//next stuff
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
//database prisma
import { db } from "@/lib/db";
//my add-ons
import PostImages from "@/components/PostImages";
import LikeButton from "@/components/LikeButton";
import NewCommentsForm from "@/components/Post/NewCommentForm";
import AllComments from "@/components/Post/AllComments";
import CommentButton from "@/components/CommentButton";
import PostShare from "@/components/Post/PostShare";
import SaveButton from "@/components/Post/SaveButton";
import FollowButton from "@/components/User/FollowButton";

export default async function PostDetailsPage({ postid }: { postid: string }) {
  const session = await getServerSession(authOptions);
  const userId = parseInt(session?.user?.id as string);

  if (!session?.user) {
    redirect("/signin");
  }
  if (!postid) {
    return <div>Something went wrong!!</div>; // Simplified error handling
  }

  const currentUser = await getFollowerList(userId);
  if (currentUser.error) {
    return <div>{currentUser.error}</div>;
  }

  const followingUserIds =
    currentUser.data?.map((follow) => follow.followingId) || [];
  // console.log("All the id", followingUserIds);

  const post = await getCurrentPost(postid, userId, followingUserIds);

  if (post.error) {
    return (
      <div className="flex text-center justify-center items-center h-screen pt-auto">
        Post not found.
      </div>
    );
  }

  if (post.data) {
    // const followerLikes = post.data.likedby.filter((like) =>
    //   followingUserIds!.includes(like.userId)
    // );

    const hasUserLikedIt = post.data.likedby.some(
      (user) => user.user.id === userId
    );
    const hasUserSavedIt = post.data.savers.length > 0;
    const isFollowing = post.data.author.following.length > 0;

    return (
      <div className="w-full overflow-auto h-screen mt-2 flex flex-col space-y-3">
        <div className="m-auto w-full flex flex-col min-w-[400px] max-w-[960px]">
          <main className="flex-grow w-[80%] m-auto">
            <div className="flex flex-col gap-4 p-4 relative">
              <div className="text-xs rounded-md w-full px-1 flex justify-between text-gray-400 items-center">
                <Link
                  className="flex justify-start items-center w-[250px]"
                  href={`/${post.data?.author.username}`}
                >
                  <div className="w-10 h-10 rounded-full mr-2 flex justify-center overflow-hidden">
                    <Image
                      src={
                        post.data.author.image !== null
                          ? post.data.author.image
                          : `https://api.multiavatar.com/${post.data.author
                              .name!}.svg` || "/defaultuser.svg"
                      }
                      alt="user image"
                      width={40}
                      height={20}
                    />
                  </div>
                  <p className="w-fit">{post.data.author.username}</p>
                  <div className="ml-2">
                    <FollowButton
                      isFollowing={isFollowing}
                      userId={post.data.authorId}
                    />
                  </div>
                </Link>
                <PostDropDown
                  authorName={post.data.author.username!}
                  postid={post.data.id}
                  authorid={post.data.author.id}
                />
              </div>
              <div className="w-full rounded-md overflow-hidden">
                <PostImages images={post.data?.media} />
              </div>
              <div className="flex items-center gap-2">
                <div>
                  <LikeButton
                    hasUserLikedIt={hasUserLikedIt}
                    numberOfLikes={post.data._count.likedby}
                    userId={session.user.id as string}
                    postId={post.data?.id}
                  />
                </div>
                <div>
                  <CommentButton
                    numComments={post.data._count.comments}
                    postid={post.data.id}
                  />
                </div>
                <button className="focus:outline-none">
                  <PostShare postid={post.data.id} />
                </button>
                <SaveButton
                  hasUserSavedIt={hasUserSavedIt}
                  userId={session.user.id as string}
                  postId={post.data.id}
                />
              </div>
              <p className="text-sm text-gray-500">
                Liked by{" "}
                {post.data.likedby.length > 0 && (
                  <strong className="font-medium text-gray-600">
                    {post.data.likedby[0].user.username} and many others
                  </strong>
                )}
              </p>
              <div className="flex flex-col items-center gap-2">
                <NewCommentsForm
                  postid={postid}
                  userid={session.user.id as string}
                />
                <AllComments postid={postid} />
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }
}

async function getFollowerList(userid: number) {
  if (!userid) {
    return { error: "Unauthorized" };
  }

  try {
    const currentUser = await db.follows.findMany({
      where: {
        followedById: userid,
      },
    });
    return { data: currentUser };
  } catch (err) {
    console.error(err);
    return { error: "Not able to get follower list at the moment" };
  }
}

async function getCurrentPost(
  postid: string,
  userId: number,
  followingUserIds: number[]
) {
  if (!postid) {
    return { error: "No such post exists" };
  }

  try {
    const post = await db.post.findFirst({
      where: {
        id: parseInt(postid),
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
                followedById: userId, // current user's ID
              },
              select: {
                followingId: true,
              },
            },
          },
        },
        comments: {
          include: {
            author: true,
          },
        },
        likedby: {
          include: {
            user: true, // Include user details for all likes
          },
        },
        savers: {
          where: {
            id: userId, // Check if the user has saved this post
          },
        },
        _count: {
          select: {
            likedby: true,
            comments: true,
          },
        },
      },
    });
    return { data: post };
  } catch (err) {
    console.error(err);
    return { error: "Not able to get current post at the moment!" };
  }
}
