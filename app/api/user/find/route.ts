import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = parseInt(session?.user?.id as string);

  if (!session?.user) {
    return NextResponse.json({ message: "unAuthorized" }, { status: 400 });
  }

  try {
    const allUsers = await db.user.findMany({
      where: {
        id: {
          not: userId,
        },
      },
      select: {
        name: true,
        username: true,
        image: true,
        bio: true,
      },
    });

    return NextResponse.json({ allUsers }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Couldn't get users at the moment" },
      { status: 500 }
    );
  }
}
