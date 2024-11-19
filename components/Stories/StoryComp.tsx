"use client";
import { useRouter } from "next/navigation";
import Stories from "react-insta-stories";

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

export default function StoryComp({
  stories,
  nextStory,
  currentStory,
}: {
  currentStory: number;
  stories: Story[];
  nextStory: storytype | null;
}) {
  const router = useRouter();

  function NextMove() {
    if (nextStory) {
      router.push(
        `/stories/${nextStory.user.username}?currentStory=${currentStory + 1}`
      );
    } else {
      router.push("/");
    }
  }

  return (
    <Stories
      stories={stories}
      defaultInterval={5000}
      width={410}
      height={700}
      onAllStoriesEnd={NextMove}
    />
  );
}
