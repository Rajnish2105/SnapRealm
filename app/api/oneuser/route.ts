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
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        posts: {
          select: {
            id: true,
            media: true,
          },
        },
        followedBy: {
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
        },
        following: {
          select: {
            followedBy: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
              },
            },
          },
        },
      },
    });

    const friends = user?.followedBy;
    const fans = user?.following;

    const followingids = friends?.map((friend) => friend.following.id);
    const onlyfans = fans?.filter(
      (fan) => !followingids?.includes(fan.followedBy.id)
    );

    // console.log("My friends", friends);
    // console.log("my fans", onlyfans);

    return NextResponse.json({ friends, onlyfans }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "no server" }, { status: 500 });
  }
}
