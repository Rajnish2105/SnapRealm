import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ message: "unauthorized" }, { status: 401 });
  }

  const userId = parseInt(session?.user?.id as string);

  try {
    const followers = await db.follows.findMany({
      where: {
        followedById: userId,
      },
      select: {
        following: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
      },
    });
    // console.log(followers);
    return NextResponse.json({ followers }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "no server" }, { status: 500 });
  }
}
