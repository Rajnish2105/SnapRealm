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
  const userId = Number(session?.user?.id as string);

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
    <div className="w-full max-w-sm mx-auto rounded-xl shadow-md overflow-hidden md:max-w-sm">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">
            You might know...
          </h2>
          <Link
            href="/explore/people"
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200"
          >
            See All
          </Link>
        </div>

        <ul className="space-y-3">
          {users.map((user) => {
            if (user.id === userId) return null;
            const isFollowing = user.following.length > 0;

            return (
              <li
                key={user.id}
                className="rounded-lg overflow-hidden hover:bg-slate-700 transition-colors duration-200"
              >
                <div className="p-3 flex items-center justify-between">
                  <Link
                    href={`/${user.username}`}
                    className="flex items-center space-x-3 flex-grow"
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-500">
                      <Image
                        src={
                          user.image ||
                          `https://api.multiavatar.com/${user.name}.svg`
                        }
                        alt={`${user.name}'s avatar`}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {user.username}
                      </p>
                      <p className="text-xs text-gray-400">{user.name}</p>
                    </div>
                  </Link>

                  <FollowButton isFollowing={isFollowing} userId={user.id} />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
