import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import CustomLoader from "@/components/CustomLoader";
import PeoplePage from "@/components/PeoplePage";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function AllPeoplePage() {
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
      <PeoplePage />;
    </Suspense>
  );
}
