import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { db } from "@/lib/db";
import { IconPlus } from "@tabler/icons-react";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";

export default async function AllStories() {
  const session = await getServerSession(authOptions);
  const { stories } = await getStories(session?.user?.id as string);

  return (
    <div className="w-full flex items-center justify-start space-x-5">
      <div className="rounded-full border-2 border-red-400 relative w-fit cursor-pointer">
        <Image
          src={
            session?.user?.image
              ? session.user.image
              : `https://api.multiavatar.com/${session?.user?.name}.svg`
          }
          alt="user"
          className="rounded-full"
          width={60}
          height={60}
        />
        <Link href={"/uploadstory"}>
          <IconPlus
            size={20}
            className="absolute -bottom-1 -right-1 z-10 bg-blue-400 rounded-full"
          />
        </Link>
      </div>
      {stories &&
        stories.map((store) => {
          const current = stories.indexOf(store);
          return (
            <Link
              key={store.userId}
              href={`/stories/${store.user.username}?currentStory=${current}`}
            >
              <div className="rounded-full border-2 border-red-400 relative w-fit cursor-pointer">
                <Image
                  src={
                    store.user.image
                      ? store.user.image
                      : `https://api.multiavatar.com/${store.user.name}.svg`
                  }
                  alt="user"
                  className="rounded-full"
                  width={60}
                  height={60}
                />
              </div>
            </Link>
          );
        })}
    </div>
  );
}

async function getStories(userid: string) {
  const userId = parseInt(userid);

  const stories = await db.story.findMany({
    where: {
      user: {
        followedBy: {
          some: {
            followingId: userId,
          },
        },
      },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
        },
      },
    },
  });
  return { stories };
}
