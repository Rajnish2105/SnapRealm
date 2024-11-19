import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import CustomLoader from "@/components/CustomLoader";
import StoryComp from "@/components/Stories/StoryComp";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

interface Story {
  url: string;
  header?: {
    heading: string;
    subheading: string;
    profileImage: string;
  };
  seeMore?: () => void;
}

type storytype = {
  id: string;
  stories: string[];
  createdAt: Date;
  userId: number;
  user: {
    name: string | null;
    username: string | null;
    image: string | null;
  };
};

export default async function StoryPage({
  params,
  searchParams,
}: {
  searchParams: { currentStory: string };
  params: { username: string };
}) {
  const username = decodeURIComponent(params.username);
  const currentStory = parseInt(searchParams.currentStory);

  if (!username || currentStory === null) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <CustomLoader />
      </div>
    );
  }

  const session = await getServerSession(authOptions);
  const userId = Number(session?.user?.id as string);

  if (!session?.user) {
    redirect("/signup");
  }

  const allstories = await db.story.findMany({
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
          name: true,
          username: true,
          image: true,
        },
      },
    },
  });

  const currentStoryonShow = allstories[currentStory];

  if (currentStory < 0 || currentStory >= allstories.length) {
    redirect("/");
  }

  //defining one next story
  let nextStory: storytype | null = null;
  if (currentStory + 1 < allstories.length) {
    nextStory = allstories[currentStory + 1];
  }

  //defining one previous story
  let prevStory: storytype | null = null;
  if (currentStory - 1 >= 0) {
    prevStory = allstories[currentStory - 1];
  }

  if (!currentStoryonShow) {
    redirect("/");
  }

  const storyurls: string[] = currentStoryonShow?.stories;

  if (!storyurls) {
    return;
  }

  const stories: Story[] = storyurls.map((url) => ({
    url,
    header: {
      heading: username,
      subheading:
        currentStoryonShow?.user.name || "know more about this user..",
      profileImage:
        currentStoryonShow?.user.image ||
        `https://api.multiavatar.com/${currentStoryonShow?.user?.name}.svg`,
    },
  }));

  return (
    <div className="w-full h-full flex justify-center items-center mt-2">
      {prevStory && (
        <Link
          href={`/stories/${prevStory?.user.username}?currentStory=${
            currentStory - 1
          }`}
          prefetch
          className="w-36 h-64 mr-32 bg-cover bg-center rounded-md"
          style={{ backgroundImage: `url(${prevStory.stories[0]})` }}
        ></Link>
      )}

      <StoryComp
        currentStory={currentStory}
        nextStory={nextStory}
        stories={stories}
      />

      {nextStory && (
        <Link
          href={`/stories/${nextStory?.user.username}?currentStory=${
            currentStory + 1
          }`}
          prefetch
          className="w-36 h-64 ml-32 bg-cover bg-center rounded-md"
          style={{ backgroundImage: `url(${nextStory.stories[0]})` }}
        ></Link>
      )}
    </div>
  );
}
