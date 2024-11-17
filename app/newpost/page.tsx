import NewPostForm from "@/components/customForm/NewPostForm";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

export default async function NewPostPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/signup");
  }

  return (
    <main className="flex justify-center items-center h-screen w-screen">
      <NewPostForm />
    </main>
  );
}
