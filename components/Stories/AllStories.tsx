import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { db } from '@/lib/db';
import { IconPlus } from '@tabler/icons-react';
import { getServerSession } from 'next-auth';
import Image from 'next/image';
import Link from 'next/link';

export default async function AllStories() {
  const session = await getServerSession(authOptions);
  const { stories } = await getStories(session?.user?.id as string);

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex items-start space-x-4 p-4">
        <div className="flex flex-col items-center">
          <div className="relative mb-1">
            <div className="w-16 h-16 rounded-full border-2 border-gray-200 flex items-center justify-center overflow-hidden">
              <Image
                src={
                  session?.user?.image ||
                  `https://api.multiavatar.com/${session?.user?.username}.svg`
                }
                alt="Your story"
                className="rounded-full"
                width={60}
                height={56}
              />
            </div>
            <Link
              href="/uploadstory"
              className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1"
            >
              <IconPlus size={16} className="text-white" />
            </Link>
          </div>
          <span className="text-xs mt-1 text-gray-600">Your story</span>
        </div>
        {stories &&
          stories.map((story, index) => (
            <Link
              key={story.userId}
              href={`/stories/${story.user.username}?currentStory=${index}`}
              className="flex flex-col items-center"
            >
              <div className="relative mb-1">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 to-fuchsia-600 p-[2px]">
                  <div className="w-full h-full rounded-full border-2 border-white overflow-hidden">
                    <Image
                      src={
                        story.user.image ||
                        `https://api.multiavatar.com/${story.user.username}.svg`
                      }
                      alt={story.user.name as string}
                      className="rounded-full"
                      width={56}
                      height={56}
                    />
                  </div>
                </div>
              </div>
              <span className="text-xs mt-1 text-gray-600 truncate w-16 text-center">
                {story.user.username}
              </span>
            </Link>
          ))}
      </div>
    </div>
  );
}

async function getStories(userid: string) {
  const userId = parseInt(userid);

  const stories = await db.story.findMany({
    where: {
      user: {
        following: {
          some: {
            followedById: userId,
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
