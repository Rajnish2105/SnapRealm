import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

export default async function ChatPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/signup");
  }

  return (
    <div className="flex-grow h-full flex justify-center items-center"></div>
  );
}
