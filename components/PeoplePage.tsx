import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import FollowButton from "@/components/User/FollowButton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";

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
    <ScrollArea className="h-screen w-full">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-2xl font-bold mb-6">Suggested for You</h1>
        <Card>
          <CardContent className="p-0">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {allUsers.map((user) => {
                if (user.id === parseInt(currentUserId)) return null;
                const isFollowing = user.following.some(
                  (follow) => follow.followedById == parseInt(currentUserId)
                );
                return (
                  <li
                    className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150 ease-in-out"
                    key={user.id}
                  >
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/${user.username}`}
                        className="flex items-center space-x-3 flex-grow"
                      >
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                          <Image
                            src={
                              user.image ||
                              `https://api.multiavatar.com/${user.name}.svg` ||
                              "/defaultuser.svg"
                            }
                            alt={`${user.name}'s profile picture`}
                            width={48}
                            height={48}
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-grow">
                          <p className="font-semibold text-sm">
                            {user.username}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {user.name}
                          </p>
                        </div>
                      </Link>
                      <FollowButton
                        isFollowing={isFollowing}
                        userId={user.id}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}
