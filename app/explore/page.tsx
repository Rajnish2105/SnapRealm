import ExplorePost from "@/components/Explore/ExplorePost";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import CustomLoader from "@/components/CustomLoader";

export default async function ExplorePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/signup");
  }

  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex justify-center items-center">
          <CustomLoader />
        </div>
      }
    >
      <ExplorePost />
    </Suspense>
  );
}
