import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import Image from "next/image";
import FollowButton from "./FollowButton";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AllUsers() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/signin");
  }
  const userId = parseInt(session?.user?.id!);

  const users = await db.user.findMany({
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      following: {
        where: {
          followedById: userId, // current user's ID
        },
        select: {
          followingId: true, // Get the IDs of the users that are being followed
        },
      },
    },
  });

  return (
    <div className="w-full mt-4">
      <div className="w-[300px] flex justify-between items-center my-3">
        <h1 className="w-fit">You might know..</h1>
        <Link className="text-sm w-fit text-end" href="/explore/people">
          See All
        </Link>
      </div>

      <ul className="flex w-[400px] flex-col space-y-1 flex-nowrap">
        {users.map((user) => {
          if (user.id === userId) return;
          const isFollowing = user.following.length > 0;
          return (
            <li
              className="px-3 py-2 text-white w-[80%] rounded-lg flex items-center justify-between"
              key={user.id}
            >
              <Link href={`/${user.username}`}>
                <div className="flex flex-grow items-center">
                  <div className="w-11 h-11 rounded-full mr-2 flex justify-center overflow-hidden">
                    <Image
                      src={
                        user.image
                          ? user.image
                          : `https://api.multiavatar.com/${user.name}.svg` ||
                            "./defaultuser.svg"
                      }
                      alt="user image"
                      width={45}
                      height={20}
                    />
                  </div>
                  <div className="text-xs flex flex-col justify-center">
                    <p>{user.username}</p>
                    <p className="text-[rgba(255,255,255,0.5)] pl-1">
                      {user.name}
                    </p>
                  </div>
                </div>
              </Link>

              <FollowButton isFollowing={isFollowing} userId={user.id} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
