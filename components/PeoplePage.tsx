import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import FollowButton from "@/components/User/FollowButton";

export default async function PeoplePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/");
  }
  const allUsers = await db.user.findMany({
    include: {
      following: {
        include: {
          followedBy: true,
        },
      },
    },
  });

  const currentUserId = session?.user?.id as string;

  return (
    <div
      className="w-full overflow-auto p-12 [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
    >
      <div className="w-[70%] m-auto">
        <ul className="flex w-full flex-col space-y-1 flex-nowrap">
          <h1 className="w-[70%] m-auto my-3 font-bold text-lg">Suggested</h1>
          {allUsers.map((user) => {
            if (user.id === parseInt(currentUserId)) return;
            const isFollowing = user.following.some(
              (follow) => follow.followedById == parseInt(currentUserId)
            );
            return (
              <li
                className="px-3 py-2 text-white w-[70%] m-auto rounded-lg flex items-center justify-between"
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
    </div>
  );
}
