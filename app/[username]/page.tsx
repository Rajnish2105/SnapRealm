import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import CustomLoader from "@/components/CustomLoader";
import { Suspense } from "react";
import User from "@/components/User/User";

export default async function UserPage({
  params,
}: {
  params: { username: string };
}) {
  const session = await getServerSession(authOptions);
  const { username } = params;

  if (!session?.user) {
    redirect("/");
  }

  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex justify-center items-center">
          <CustomLoader />
        </div>
      }
    >
      <User username={username} />
    </Suspense>
  );
}
