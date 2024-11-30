import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { PostDropDown } from "@/components/Post/PostDropDown";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import PostImages from "@/components/PostImages";
import LikeButton from "@/components/LikeButton";
import NewCommentsForm from "@/components/Post/NewCommentForm";
import AllComments from "@/components/Post/AllComments";
import CommentButton from "@/components/CommentButton";
import PostShare from "@/components/Post/PostShare";
import SaveButton from "@/components/Post/SaveButton";
import FollowButton from "@/components/User/FollowButton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

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

async function getCurrentPost(postid: string, userId: number) {
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
                followedById: userId,
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
            user: true,
          },
        },
        savers: {
          where: {
            id: userId,
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

export default async function PostDetailsPage({ postid }: { postid: string }) {
  const session = await getServerSession(authOptions);
  const userId = parseInt(session?.user?.id as string);

  if (!session?.user) {
    redirect("/signin");
  }

  if (!postid) {
    return <ErrorMessage message="Something went wrong!" />;
  }

  const currentUser = await getFollowerList(userId);
  if (currentUser.error) {
    return <ErrorMessage message={currentUser.error} />;
  }

  const post = await getCurrentPost(postid, userId);

  if (post.error) {
    return <ErrorMessage message="Post not found." />;
  }

  if (post.data) {
    const hasUserLikedIt = post.data.likedby.some(
      (user) => user.user.id === userId
    );
    const hasUserSavedIt = post.data.savers.length > 0;
    const isFollowing = post.data.author.following.length > 0;

    return (
      <div className="min-h-screen w-full">
        <div className="container mx-auto px-4 py-6">
          <Card className="max-w-[1200px] mx-auto bg-card border-0">
            <div className="grid grid-cols-1 md:grid-cols-[1fr,400px]">
              {/* Left Column - Post Content */}
              <div className="flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Link
                      className="flex items-center gap-2 hover:opacity-80"
                      href={`/${post.data?.author.username}`}
                    >
                      <div className="h-10 w-10 rounded-full overflow-hidden">
                        <Image
                          src={
                            post.data.author.image ||
                            `https://api.multiavatar.com/${post.data.author.username}.svg`
                          }
                          alt={`${post.data.author.username}'s avatar`}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div>
                      <span className="font-medium">
                        {post.data.author.username}
                      </span>
                    </Link>
                    <div className="flex items-center gap-2">
                      {post.data.authorId !== userId && (
                        <FollowButton
                          isFollowing={isFollowing}
                          userId={post.data.authorId}
                        />
                      )}
                      <PostDropDown
                        authorName={post.data.author.username!}
                        postid={post.data.id}
                        authorid={post.data.author.id}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 p-0">
                  <div className="overflow-hidden">
                    <PostImages images={post.data?.media} />
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <LikeButton
                          hasUserLikedIt={hasUserLikedIt}
                          numberOfLikes={post.data._count.likedby}
                          userId={session.user.id as string}
                          postId={post.data?.id}
                        />
                        <CommentButton
                          numComments={post.data._count.comments}
                          postid={post.data.id}
                        />
                        <PostShare postid={post.data.id} />
                      </div>
                      <SaveButton
                        hasUserSavedIt={hasUserSavedIt}
                        userId={session.user.id as string}
                        postId={post.data.id}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {post.data.likedby.length > 0 && (
                        <>
                          Liked by{" "}
                          <span className="font-medium">
                            {post.data.likedby[0].user.username}
                          </span>{" "}
                          {post.data.likedby.length > 1 &&
                            `and ${post.data.likedby.length - 1} others`}
                        </>
                      )}
                    </p>
                  </div>
                </CardContent>
              </div>

              {/* Right Column - Comments */}
              <div className="border-l border-border">
                <div className="p-4">
                  <NewCommentsForm
                    postid={postid}
                    userid={session.user.id as string}
                  />
                </div>
                {/* <Separator /> */}
                <ScrollArea className="h-[600px] p-4">
                  <AllComments postid={postid} />
                </ScrollArea>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center h-[50vh] w-full">
      <Card className="p-6">
        <p className="text-lg text-muted-foreground">{message}</p>
      </Card>
    </div>
  );
}
