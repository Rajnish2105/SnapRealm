import PostDetailsPage from "@/components/Post/PostDetailsPage";
import { PostLoader } from "@/components/Post/PostLoader";
import { Suspense } from "react";

export default function DetailsAboutThePost({
  params,
}: {
  params: { postid: string };
}) {
  const { postid } = params;

  return (
    <Suspense
      fallback={
        <div className="w-full h-screen mt-2 p-2 flex items-center flex-col space-y-7">
          <PostLoader />
        </div>
      }
    >
      <PostDetailsPage postid={postid} />
    </Suspense>
  );
}
