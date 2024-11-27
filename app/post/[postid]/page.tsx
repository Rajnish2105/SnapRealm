import PostDetailsPage from "@/components/Post/PostDetailsPage";
import { PostLoader } from "@/components/Post/PostLoader";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function DetailsAboutThePost({
  params,
}: {
  params: { postid: string };
}) {
  const { postid } = params;

  if (!postid) {
    redirect("/signup");
  }

  return (
    <Suspense
      fallback={
        <div className="w-full h-screen p-2 flex items-center flex-col justify-center space-y-7">
          <PostLoader />
        </div>
      }
    >
      <PostDetailsPage postid={postid} />
    </Suspense>
  );
}
