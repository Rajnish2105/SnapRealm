import { db } from "@/lib/db";
import UserProfile from "@/components/UserProfile";
import UserMemories from "./UserMemories";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export default async function User({ username }: { username: string }) {
  const session = await getServerSession(authOptions);
  const user = await getUserInfo(username);

  // console.log("session user", session?.user);

  if (!user) {
    return <div className="text-center py-8">No such user exists</div>;
  }

  const sessionUserId = session?.user?.id ? parseInt(session.user.id) : -1;
  const isFollowing = user.following.some(
    (follower) => follower.followedById === sessionUserId
  );
  const isUserProfile = sessionUserId === user.id;

  return (
    <div className="w-full md:w-[70%] mx-auto px-4 flex flex-col items-center">
      <UserProfile
        isFollowing={isFollowing}
        isUserProfile={isUserProfile}
        id={user.id}
        image={user.image || null}
        name={user.name as string}
        username={user.username as string}
        numPosts={user.posts.length}
        followers={user.followedBy}
        following={user.following}
        bio={user.bio || "Tell something about yourself"}
      />
      <UserMemories
        userid={user.id}
        sessionid={sessionUserId}
        allposts={user.posts}
        savedposts={user.savedPosts}
      />
    </div>
  );
}

async function getUserInfo(username: string) {
  const user = await db.user.findUnique({
    where: {
      username: decodeURIComponent(username),
    },
    include: {
      posts: {
        select: {
          id: true,
          media: true,
        },
      },
      followedBy: {
        select: {
          followingId: true,
          following: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
            },
          },
        },
      },
      following: {
        select: {
          followedById: true,
          followedBy: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
            },
          },
        },
      },
      savedPosts: {
        select: {
          id: true,
          media: true,
        },
      },
    },
  });
  return user;
}
