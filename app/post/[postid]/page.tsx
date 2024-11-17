import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import PostDetailsPage from "@/components/Post/PostDetailsPage";
import { PostLoader } from "@/components/Post/PostLoader";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function DetailsAboutThePost({
  params,
}: {
  params: { postid: string };
}) {
  const { postid } = params;

  const session = await getServerSession(authOptions);

  if (!session?.user || !postid) {
    redirect("/signup");
  }

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
