import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { Suspense } from "react";
import AllPost from "@/components/Post/AllPost";
import AllUsers from "@/components/User/AllUsers";
import { UserLoader } from "@/components/User/UserLoader";
import { PostLoader } from "@/components/Post/PostLoader";
import AllStories from "@/components/Stories/AllStories";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/signin");
  }

  return (
    <div
      className="text-white w-full bg-black overflow-y-auto flex flex-wrap space-y-7 [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
    >
      <div className="w-[90%] m-auto flex items-center mt-2">
        <AllStories />
      </div>
      <div className="text-white flex-grow dark flex justify-center items-center h-screen">
        <Suspense
          fallback={
            <div className="w-full h-screen p-2 flex items-center flex-col space-y-7">
              <PostLoader />
            </div>
          }
        >
          <AllPost />
        </Suspense>
      </div>
      <div className="w-[30%] hidden lg:flex lg:flex-col lg:space-y-5">
        <Suspense fallback={<UserLoader />}>
          <AllUsers />
        </Suspense>
      </div>
    </div>
  );
}
